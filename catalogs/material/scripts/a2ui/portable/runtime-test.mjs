import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
const output = path.resolve(process.argv[2] ?? '.');
const browserDirectory = path.join(output, 'dist/renderer/browser');
const fixtures = JSON.parse(fs.readFileSync(path.join(output, 'fixtures.json')));
const catalog = JSON.parse(fs.readFileSync(path.join(output, 'catalog.json')));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(predicate, label) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await wait(50);
  }
  throw new Error('Timed out: ' + label);
}
async function environment(iframe) {
  const messages = [];
  const errors = [];
  const dom = new JSDOM('<!doctype html><html><body><app-root></app-root></body></html>', {
    url: 'http://localhost:3456/' + (iframe ? '?origin=http%3A%2F%2Flocalhost%3A4200' : ''),
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const w = dom.window;
  w.structuredClone = structuredClone;
  w.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.console.error = (...args) => errors.push(args.map(String).join(' '));
  w.console.warn = () => {};
  w.console.log = () => {};
  const parent = { postMessage: (data, origin) => messages.push({ data, origin }) };
  if (iframe) Object.defineProperty(w, 'parent', { value: parent });
  else
    w.postMessage = (data) =>
      setTimeout(
        () =>
          w.dispatchEvent(
            new w.MessageEvent('message', { data, origin: w.location.origin, source: w }),
          ),
        0,
      );
  const send = (data, origin = iframe ? 'http://localhost:4200' : w.location.origin) =>
    w.dispatchEvent(new w.MessageEvent('message', { data, origin, source: iframe ? parent : w }));
  // Execute the real production ES module graph, including shared/lazy chunks.
  // Run through npm's test:runtime script, which enables Node VM modules.
  if (!vm.SourceTextModule) throw new Error('Run npm run test:runtime to enable VM modules.');
  const context = dom.getInternalVMContext();
  const modules = new Map();
  function getModule(filename) {
    if (!filename.startsWith(browserDirectory + path.sep))
      throw new Error('Module outside production output: ' + filename);
    if (!modules.has(filename)) {
      modules.set(filename, new vm.SourceTextModule(fs.readFileSync(filename, 'utf8'), {
        context,
        identifier: filename,
        importModuleDynamically: async (specifier, referringModule) => {
          const dependency = resolveModule(specifier, referringModule);
          if (dependency.status === 'unlinked') await dependency.link(resolveModule);
          if (dependency.status === 'linked') await dependency.evaluate();
          return dependency;
        },
      }));
    }
    return modules.get(filename);
  }
  function resolveModule(specifier, referringModule) {
    if (!specifier.startsWith('./')) throw new Error('Unsupported browser import: ' + specifier);
    return getModule(path.resolve(path.dirname(referringModule.identifier), specifier));
  }
  const entry = getModule(path.join(browserDirectory, 'main.js'));
  await entry.link(resolveModule);
  await entry.evaluate();
  return { dom, w, messages, errors, send };
}
// This is a DOM/runtime test, not a substitute for the real Composer browser check.
{
  const { dom, w, errors } = await environment(false);
  try {
    await until(() => w.document.body.textContent.includes('1,340,000'), 'literal metric');
    w.document.querySelectorAll('nav button')[1].click();
    await wait(300);
    assert.match(w.document.body.textContent, /1,340,000/);
    w.document.querySelectorAll('nav button')[2].click();
    await until(() => w.document.body.textContent.includes('1,750,000'), 'bound update');
    if (fixtures.button) {
      w.document.querySelectorAll('nav button')[3].click();
      await until(
        () => w.document.querySelector('export-material-button button'),
        'enabled button',
      );
      const button = w.document.querySelector('export-material-button button');
      assert.equal(button.disabled, false);
      button.click();
      await until(
        () => w.document.querySelector('#actions').textContent.includes('save'),
        'standalone action log',
      );
      const before = w.document.querySelector('#actions').textContent;
      w.document.querySelectorAll('nav button')[4].click();
      await wait(300);
      const disabled = w.document.querySelector('export-material-button button');
      assert.equal(disabled.disabled, true);
      disabled.click();
      await wait(100);
      assert.equal(w.document.querySelector('#actions').textContent, before);
    }
    assert.deepEqual(errors, []);
    console.log(
      'PASS standalone AOT DOM: literal/bound Metric Card, data update, Button event, disabled behavior.',
    );
  } finally {
    dom.window.close();
  }
}
{
  const { dom, w, messages, errors, send } = await environment(true);
  const data = (type) => messages.filter((m) => m.data.type === type).map((m) => m.data);
  try {
    await until(() => data('RENDERER_READY').length, 'iframe handshake');
    send({ type: 'GET_CATALOG' });
    await until(() => data('A2UI_CATALOG').length, 'catalog handshake');
    assert.equal(data('A2UI_CATALOG')[0].payload.catalogId, catalog.catalogId);
    send({ type: 'GET_COMPONENT_USAGES' });
    await until(() => data('COMPONENT_USAGES').length, 'usage handshake');
    assert.deepEqual(
      Object.keys(data('COMPONENT_USAGES')[0].payload).sort(),
      Object.keys(catalog.components).sort(),
    );
    send({ type: 'RENDER_A2UI', payload: fixtures.metricBound });
    await until(() => w.document.body.textContent.includes('1,340,000'), 'iframe metric');
    send({
      type: 'DATA_MODEL_CHANGE',
      payload: { updateDataModel: { surfaceId: 'demo', path: '/revenue', value: 1750000 } },
    });
    await until(() => w.document.body.textContent.includes('1,750,000'), 'iframe data change');
    send(
      {
        type: 'DATA_MODEL_CHANGE',
        payload: { updateDataModel: { surfaceId: 'demo', path: '/revenue', value: 42 } },
      },
      'http://untrusted.invalid',
    );
    await wait(100);
    assert.match(w.document.body.textContent, /1,750,000/);
    if (fixtures.button) {
      send({ type: 'RENDER_A2UI', payload: fixtures.button });
      await until(() => w.document.querySelector('export-material-button button'), 'iframe button');
      w.document.querySelector('export-material-button button').click();
      await until(() => data('SEND_TO_SERVER').length, 'bridge action');
      const action = data('SEND_TO_SERVER').at(-1).payload;
      assert.equal(action.version, 'v0.9');
      assert.equal(action.action.name, 'save');
      assert.equal(action.action.sourceComponentId, 'root');
      assert.equal(action.action.surfaceId, 'demo');
      send({ type: 'RENDER_A2UI', payload: fixtures.buttonDisabled });
      await wait(300);
      const disabled = w.document.querySelector('export-material-button button');
      assert.equal(disabled.disabled, true);
      disabled.click();
      await wait(100);
      assert.equal(data('SEND_TO_SERVER').length, 1);
    }
    assert.ok(data('RENDER_SUCCESS').length);
    assert.ok(messages.every((m) => m.origin === 'http://localhost:4200'));
    assert.deepEqual(errors, []);
    send({ type: 'RENDER_A2UI', payload: fixtures.metricBound });
    await until(
      () => w.document.body.textContent.includes('1,340,000'),
      'binding validation metric',
    );
    send({
      type: 'DATA_MODEL_CHANGE',
      payload: { updateDataModel: { surfaceId: 'demo', path: '/revenue', value: true } },
    });
    await until(() => w.document.querySelector('[role=alert]'), 'bad binding error');
    assert.match(w.document.querySelector('[role=alert]').textContent, /resolved bindings/);
    assert.match(w.document.body.textContent, /1,340,000/);
    const invalid = structuredClone(fixtures.metricLiteral);
    invalid.at(-1).updateComponents.components[0].unsupported = 1;
    send({ type: 'RENDER_A2UI', payload: invalid });
    await until(() => w.document.querySelector('[role=alert]')?.textContent.includes('unsupported'), 'invalid field error');
    assert.match(w.document.querySelector('[role=alert]').textContent, /unsupported/);
    console.log(
      'PASS parent-frame protocol: ready/catalog, rendering, bound data, action envelope, disabled behavior, origin rejection, unsupported-field error.',
    );
  } finally {
    dom.window.close();
  }
}
