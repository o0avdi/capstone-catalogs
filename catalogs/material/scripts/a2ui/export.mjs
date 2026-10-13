import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract, makeCatalog, catalogId } from './metadata.mjs';
import { archive } from './zip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const options = process.argv.slice(2);
const get = (name) => (options.includes(name) ? options[options.indexOf(name) + 1] : undefined);
const out = path.resolve(get('--out') ?? path.join(root, 'a2ui-output'));
if (out === root || root.startsWith(out + path.sep))
  throw new Error('Output must not be the project or a parent directory.');
const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json')));
const selected = options.includes('--metric-only') ? registrations.slice(0, 1) : registrations;
const index = JSON.parse(fs.readFileSync(path.join(root, 'storybook-static/index.json')));
const metadata = extract(root, selected, index);
const catalog = makeCatalog(metadata);
if (fs.existsSync(out) && !fs.existsSync(path.join(out, 'export-manifest.json')))
  throw new Error(
    'Refusing to overwrite a directory without an export-manifest.json. Choose a new --out directory.',
  );
fs.mkdirSync(out, { recursive: true });
const written = [];
function write(name, content) {
  fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
  fs.writeFileSync(path.join(out, name), content);
  written.push(name);
}
function json(name, value) {
  write(name, JSON.stringify(value, null, 2) + '\n');
}
function copyTree(src, dest) {
  for (const entry of fs
    .readdirSync(src, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'package-lock.json') continue;
    const target = path.posix.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(path.join(src, entry.name), target);
    else write(target, fs.readFileSync(path.join(src, entry.name)));
  }
}
copyTree(path.join(root, 'a2ui/renderer'), '');
copyTree(path.join(root, 'a2ui/vendor'), 'vendor');
const lock = path.join(root, 'a2ui/renderer/package-lock.json');
if (fs.existsSync(lock)) write('package-lock.json', fs.readFileSync(lock));
for (const c of metadata) {
  for (const file of c.files) write(file, fs.readFileSync(path.join(root, file)));
  write('provenance/' + c.story, fs.readFileSync(path.join(root, c.story)));
}
json('catalog.json', catalog);
json('public/catalog.json', catalog);
json('metadata.json', metadata);
json('diagnostics.json', {
  warnings: metadata.flatMap((c) => c.warnings),
  discovery: {
    source: 'Storybook v5 index.json',
    components: metadata.map((c) => ({ name: c.name, storyIds: c.storyIds })),
    excluded: 'docs entries, remote refId entries, and all unregistered stories',
  },
  typeAuthority: 'TypeScript source; story args are examples, not API defaults',
  unsupported: [
    'function calls',
    'common weight/accessibility/checks',
    'arbitrary template extraction',
    'React catalogs',
  ],
});
function fixture(component, data) {
  return [
    { version: 'v0.9', createSurface: { surfaceId: 'demo', catalogId } },
    ...(data
      ? [{ version: 'v0.9', updateDataModel: { surfaceId: 'demo', path: '/', value: data } }]
      : []),
    {
      version: 'v0.9',
      updateComponents: { surfaceId: 'demo', components: [{ id: 'root', ...component }] },
    },
  ];
}
const metric = metadata.find((c) => c.name === 'FinanceMetricCard');
const metricProps = metric.examples[0].props;
const fixtures = {
  metricLiteral: fixture({ component: metric.name, ...metricProps }),
  metricBound: fixture(
    { component: metric.name, ...metricProps, value: { path: '/revenue' } },
    { revenue: 1340000 },
  ),
};
if (metadata.some((c) => c.name === 'MaterialButton')) {
  const button = metadata.find((c) => c.name === 'MaterialButton');
  fixtures.button = fixture({
    component: button.name,
    ...button.examples[0].props,
    action: { event: { name: 'save', context: { source: 'portable-export' } } },
  });
  fixtures.buttonDisabled = fixture({
    component: button.name,
    ...button.examples[0].props,
    disabled: true,
    action: { event: { name: 'save' } },
  });
}
json('fixtures.json', fixtures);
json('public/fixtures.json', fixtures);
for(const [name,messages] of Object.entries(fixtures)){json('fixtures/'+name+'.json',messages);json('public/fixtures/'+name+'.json',messages);}
json('public/fixtures/revenueUpdate.json',[{version:'v0.9',updateDataModel:{surfaceId:'demo',path:'/revenue',value:1750000}}]);
const usages = Object.fromEntries(
  metadata.map((c) => [
    c.name,
    {
      usage: [
        {
          id: 'root',
          component: c.name,
          ...c.examples[0].props,
          ...(c.events ? { action: { event: { name: 'save' } } } : {}),
        },
      ],
    },
  ]),
);
json('public/usages.json', usages);
function zSchema(s) {
  if (s.enum) return `z.enum(${JSON.stringify(s.enum)})`;
  if ('const' in s) return `z.literal(${JSON.stringify(s.const)})`;
  if (Array.isArray(s.type))
    return `z.union([${s.type.map((t) => zSchema({ type: t })).join(',')}])`;
  if (s.anyOf) return `z.union([${s.anyOf.map(zSchema).join(',')}])`;
  if (!['string', 'number', 'boolean'].includes(s.type))
    throw new Error('Unsupported runtime schema ' + JSON.stringify(s));
  return `z.${s.type}()`;
}
let adapters = `// Generated from source types and explicit registrations.\nimport {Component,Injectable,inject} from '@angular/core';\nimport {CatalogComponent,AngularCatalog,A2uiRendererService} from '@a2ui/angular/v0_9';\nimport {DataContext} from '@a2ui/web_core/v0_9';\nimport {z} from 'zod';\nimport {MetricCardComponent} from './app/finance/components/metric-card.component';\n`;
if (fixtures.button) adapters += `import {MatButtonModule} from '@angular/material/button';\n`;
adapters += `const binding=z.object({path:z.string().min(1)}).strict();\n`;
for (const c of metadata) {
  const fields = c.fields
    .map(
      (f) => `${f.name}:z.union([${zSchema(f.schema)},binding])${f.required ? '' : '.optional()'}`,
    )
    .join(',\n');
  adapters += `export const ${c.adapter}Api={name:${JSON.stringify(c.name)},schema:z.object({${fields}${c.events ? `,action:z.object({event:z.object({name:z.string().min(1),context:z.record(z.union([z.string(),z.number(),z.boolean()])).optional()}).strict()}).strict()` : ''}}).strict()};\n`;
  if (c.name === 'FinanceMetricCard') {
    const bindings = c.fields
      .map((f) => {
        const fallback = 'default' in f.schema ? JSON.stringify(f.schema.default) : 'undefined';
        const expression =
          'props().' +
          f.name +
          (f.required ? '.' : '?.') +
          'value()' +
          (f.required ? '' : ' ?? ' + fallback);
        return '[' + f.name + ']=\"' + expression.replaceAll('\"', '&quot;') + '\"';
      })
      .join('\n');
    adapters += `@Component({selector:'export-metric-card',standalone:true,imports:[MetricCardComponent],template:\`<finance-metric-card ${bindings} />\`})\nexport class MetricCardAdapter extends CatalogComponent<typeof MetricCardAdapterApi> {}\n`;
  } else {
    adapters += `@Component({selector:'export-material-button',standalone:true,imports:[MatButtonModule],template:\`<button type="button" [matButton]="props().appearance.value()" [disabled]="props().disabled.value()" (click)="click()">{{props().label.value()}}</button>\`})\nexport class ButtonAdapter extends CatalogComponent<typeof ButtonAdapterApi> {\n private renderer=inject(A2uiRendererService);\n click() {if(this.props().disabled.value()) return; const surface=this.renderer.surfaceGroup.getSurface(this.surfaceId()); if(!surface) throw new Error('Button surface is missing'); const action=new DataContext(surface,this.dataContextPath()).resolveAction(this.props().action.value()); surface.dispatchAction(action,this.componentId());}\n}\n`;
  }
}
adapters +=
  'export const resolvedSchemas:Record<string,z.ZodTypeAny>={' +
  metadata
    .map(
      (c) =>
        JSON.stringify(c.name) +
        ':z.object({' +
        c.fields
          .map((f) => f.name + ':' + zSchema(f.schema) + (f.required ? '' : '.optional()'))
          .join(',') +
        (c.events ? ',action:ButtonAdapterApi.schema.shape.action' : '') +
        '}).strict()',
    )
    .join(',') +
  '};\n';
adapters += `@Injectable()\nexport class ExportCatalog extends AngularCatalog {constructor(){super(${JSON.stringify(catalogId)},[${metadata.map((c) => `{...${c.adapter}Api,component:${c.adapter}}`).join(',')}],[]);}}\n`;
write('src/adapters.ts', adapters);
write(
  'src/public-api.ts',
  `export * from './adapters';\nexport * from './app/finance/components/metric-card.component';\n`,
);
copyTree(path.join(root, 'scripts/a2ui/portable'), 'scripts');
write('README.md', fs.readFileSync(path.join(root, 'a2ui/README-export.md')));
json('provenance.json', {
  source: 'capstone-catalogs Angular Storybook',
  catalogId,
  bridge: {
    upstream: 'https://github.com/a2ui-project/composer',
    commit: '8155592d3522fff213188e8382153e473e2c3315',
    license: 'Apache-2.0',
    changes:
      'Package metadata narrowed to Angular-only exports; compatible Angular 21 peer. Built JS and source unchanged.',
  },
  compatibility:
    'Portable renderer uses Angular 21.2.17 and Material 21.2.14 to satisfy A2UI 0.10.4 Angular 21 peers. Source Storybook Angular 22 and its lockfile are unchanged.',
  files: metadata.flatMap((c) => c.files),
});
json('export-manifest.json', {
  formatVersion: 1,
  catalogId,
  files: [...written, 'export-manifest.json'].sort(),
});
archive(out, [...written], out + '.zip');
console.log(`Exported ${metadata.map((c) => c.name).join(', ')} to ${out} and ${out}.zip`);
for (const warning of metadata.flatMap((c) => c.warnings)) console.log('NOTICE: ' + warning);
