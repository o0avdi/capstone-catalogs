#!/usr/bin/env node
import readline from 'node:readline';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { discoverProject, resolveProjectRoot, selectCandidates } from './discovery.mjs';
import { exportSelection } from './bundle.mjs';

const HELP = `Universal Storybook to A2UI exporter

Usage:
  a2ui-export [project]                    Interactive discovery and export
  a2ui-export discover [project] [--json]  List discovered components
  a2ui-export export [project] [options]    Non-interactive export

Options:
  --project <path>       Project directory (defaults to the current directory)
  --angular-index <file> Official local Angular v5 index (relative to project)
  --react-index <file>   Separate local React v5 index (relative to project)
  --static-discovery    Explicit reduced-confidence static fallback (no indexes)
  --components <names>  Comma-separated discovery ids or component names
  --protocol <version>  0.9 (compatibility default) or 1.0 (validated JSON only)
  --outputs <values>    json, zip, or json,zip
  --out <path>          Output directory (default: ./a2ui-export)
  --all-ready           Select renderer-ready components (v1.0: registered source contracts)
  --json                Print discovery as JSON
  --help                Show this help

Examples:
  npm run a2ui -- discover
  npm run a2ui
  npm run a2ui -- export --components ShadcnButton,MaterialButton --outputs json,zip
`;

export function parseArguments(argv) {
  const options = { command: undefined, project: undefined, components: undefined, outputs: undefined };
  const args = [...argv];
  if (['discover', 'export'].includes(args[0])) options.command = args.shift();
  while (args.length) {
    const value = args.shift();
    if (value === '--help' || value === '-h') options.help = true;
    else if (value === '--json') options.json = true;
    else if (value === '--all-ready') options.allReady = true;
    else if (value === '--static-discovery') options.staticDiscovery = true;
    else if (value === '--angular-index' || value === '--react-index') {
      options.indexes ??= [];
      options.indexes.push({ framework: value === '--angular-index' ? 'angular' : 'react', file: requiredValue(value, args.shift()) });
    }
    else if (value === '--project') options.project = requiredValue(value, args.shift());
    else if (value === '--protocol') {
      options.protocol = requiredValue(value, args.shift());
      if (!['0.9', '1.0'].includes(options.protocol)) throw new Error('Protocol must be 0.9 or 1.0.');
    }
    else if (value === '--components')
      options.components = requiredValue(value, args.shift()).split(',').map((item) => item.trim()).filter(Boolean);
    else if (value === '--outputs')
      options.outputs = requiredValue(value, args.shift()).split(',').map((item) => item.trim()).filter(Boolean);
    else if (value === '--out') options.out = requiredValue(value, args.shift());
    else if (value.startsWith('-')) throw new Error(`Unknown option ${value}.`);
    else if (!options.project) options.project = value;
    else throw new Error(`Unexpected argument ${value}.`);
  }
  return options;
}

function requiredValue(flag, value) {
  if (!value || value.startsWith('-')) throw new Error(`${flag} requires a value.`);
  return value;
}

function statusLabel(candidate) {
  const suffix = !candidate.outputSupport.json ? 'source mapping required' : candidate.outputSupport.rendererZip ? 'JSON + ZIP' : 'JSON only';
  return `${candidate.status}; ${suffix}`;
}

function printDiscovery(discovery) {
  console.log(`Discovery: ${discovery.generatedFrom}`);
  for (const diagnostic of discovery.diagnostics) console.error(`[${diagnostic.code}] ${diagnostic.message ?? diagnostic.id}`);
  console.log(`Discovered ${discovery.summary.total} component story files:`);
  for (const library of [...new Set(discovery.candidates.map((candidate) => candidate.library))]) {
    console.log(`\n${library}`);
    for (const candidate of discovery.candidates.filter((item) => item.library === library))
      console.log(
        `  ${candidate.componentName.padEnd(34)} ${statusLabel(candidate).padEnd(31)} ${candidate.storyPath}`,
      );
  }
  console.log(
    `\nAngular: ${discovery.summary.angular}  React/TSX: ${discovery.summary.react}  ` +
      `Portable: ${discovery.summary.portable}  Custom: ${discovery.summary.custom}  ` +
      `Needs configuration: ${discovery.summary.needsConfiguration}` +
      (discovery.summary.sourceContracts === undefined ? '' : `  Source contracts: ${discovery.summary.sourceContracts}`),
  );
}

function renderChecklist(title, items, selected, cursor, action, pageSize = 16) {
  const rows = [...items, action];
  const start = Math.max(0, Math.min(cursor - Math.floor(pageSize / 2), Math.max(0, rows.length - pageSize)));
  const visible = rows.slice(start, start + pageSize);
  process.stdout.write('\x1b[2J\x1b[H');
  process.stdout.write(`${title}\n\n`);
  if (start > 0) process.stdout.write(`  … ${start} more above\n`);
  for (let offset = 0; offset < visible.length; offset++) {
    const index = start + offset;
    const pointer = index === cursor ? '›' : ' ';
    if (index === items.length) process.stdout.write(`${pointer}   ${action.label}\n`);
    else {
      const item = items[index];
      const checked = selected.has(item.value) ? '✓' : ' ';
      process.stdout.write(`${pointer} [${checked}] ${item.label}\n`);
    }
  }
  if (start + visible.length < rows.length)
    process.stdout.write(`  … ${rows.length - start - visible.length} more below\n`);
  process.stdout.write('\n↑↓ move  Enter/Space toggle  A select/clear all  Q cancel\n');
}

async function checklist(title, items, { initial = [], actionLabel = 'Continue' } = {}) {
  if (!process.stdin.isTTY || !process.stdout.isTTY)
    throw new Error('Interactive mode requires a terminal. Use --components and --outputs instead.');
  readline.emitKeypressEvents(process.stdin);
  const wasRaw = process.stdin.isRaw;
  process.stdin.setRawMode(true);
  process.stdin.resume();
  let cursor = 0;
  const selected = new Set(initial);
  const action = { label: actionLabel };
  renderChecklist(title, items, selected, cursor, action);
  return await new Promise((resolve, reject) => {
    const cleanup = () => {
      process.stdin.off('keypress', handler);
      process.stdin.setRawMode(Boolean(wasRaw));
      process.stdout.write('\x1b[2J\x1b[H');
    };
    const handler = (_input, key) => {
      if (key.ctrl && key.name === 'c') {
        cleanup();
        reject(new Error('Export cancelled.'));
        return;
      }
      if (key.name === 'q' || key.name === 'escape') {
        cleanup();
        reject(new Error('Export cancelled.'));
        return;
      }
      if (key.name === 'up') cursor = (cursor - 1 + items.length + 1) % (items.length + 1);
      else if (key.name === 'down') cursor = (cursor + 1) % (items.length + 1);
      else if (key.name === 'a') {
        if (selected.size === items.length) selected.clear();
        else for (const item of items) selected.add(item.value);
      } else if (key.name === 'space' || key.name === 'return') {
        if (cursor === items.length) {
          if (!selected.size) return;
          cleanup();
          resolve([...selected]);
          return;
        }
        const value = items[cursor].value;
        if (selected.has(value)) selected.delete(value);
        else selected.add(value);
      }
      renderChecklist(title, items, selected, cursor, action);
    };
    process.stdin.on('keypress', handler);
  });
}

async function confirm(summary) {
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await terminal.question(`${summary}\n\nExport now? [Y/n] `);
    return !answer.trim() || /^y(es)?$/i.test(answer.trim());
  } finally {
    terminal.close();
  }
}

async function interactive(discovery, output, protocol) {
  const componentItems = discovery.candidates.map((candidate) => ({
    value: candidate.id,
    label: `${candidate.componentName} — ${candidate.library} — ${statusLabel(candidate)}`,
  }));
  const ids = await checklist('Select components', componentItems, { actionLabel: 'Choose outputs' });
  const candidates = selectCandidates(discovery, ids);
  const outputItems = protocol === '1.0' ? [{ value: 'json', label: 'Validated A2UI v1.0 catalog JSON' }] : [
    { value: 'json', label: 'Loose A2UI JSON files' },
    { value: 'zip', label: 'Self-contained renderer ZIP' },
  ];
  const outputs = await checklist('Select outputs', outputItems, {
    initial: protocol === '1.0' ? ['json'] : ['json', 'zip'],
    actionLabel: 'Review export',
  });
  const unsupported = candidates.filter(
    (candidate) => outputs.includes('zip') && !candidate.outputSupport.rendererZip,
  );
  if (unsupported.length)
    throw new Error(
      `ZIP export is not ready for ${unsupported.map((candidate) => candidate.componentName).join(', ')}. ` +
        'Rerun with JSON only or add a renderer adapter.',
    );
  const accepted = await confirm(
    `Components: ${candidates.map((candidate) => candidate.componentName).join(', ')}\n` +
      `Outputs: ${outputs.join(' + ')}\nDestination: ${output}`,
  );
  if (!accepted) throw new Error('Export cancelled.');
  return { candidates, outputs };
}

export async function run(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.help) {
    console.log(HELP);
    return;
  }
  const projectRoot = resolveProjectRoot(options.project ?? process.cwd());
  if (options.protocol === '1.0' && (!options.indexes?.length || options.staticDiscovery))
    throw new Error('Protocol 1.0 requires an official Storybook index. Supply --angular-index and/or --react-index.');
  const discovery = discoverProject(projectRoot, options);
  if (options.protocol === '1.0') {
    // Legacy renderer readiness does not imply v1.0 runtime compatibility.
    for (const candidate of discovery.candidates) {
      candidate.outputSupport = { json: Boolean(candidate.registrationName) && candidate.framework === 'angular', rendererZip: false };
      candidate.status = candidate.outputSupport.json ? 'source-contract' : 'needs-configuration';
      candidate.reasons = [candidate.outputSupport.json
        ? 'Registered source contract available for v1.0 JSON; v1.0 renderer compatibility is not implemented.'
        : 'Add a reviewed source registration and v1.0 field mapping before catalog export.'];
    }
    discovery.summary.portable = 0;
    discovery.summary.custom = 0;
    discovery.summary.needsConfiguration = discovery.candidates.filter((candidate) => !candidate.outputSupport.json).length;
    discovery.summary.sourceContracts = discovery.candidates.filter((candidate) => candidate.outputSupport.json).length;
  }
  if (options.command === 'discover') {
    if (options.json) console.log(JSON.stringify(discovery, null, 2));
    else printDiscovery(discovery);
    return;
  }
  for (const diagnostic of discovery.diagnostics) console.error(`[${diagnostic.code}] ${diagnostic.message ?? diagnostic.id}`);
  const output = path.resolve(options.out ?? path.join(projectRoot, 'a2ui-export'));
  let candidates;
  let outputs;
  if (options.components || options.allReady || options.outputs || options.command === 'export') {
    candidates = options.allReady
      ? discovery.candidates.filter((candidate) => options.protocol === '1.0' ? candidate.outputSupport.json : candidate.outputSupport.rendererZip)
      : selectCandidates(discovery, options.components ?? []);
    if (!candidates.length)
      throw new Error('Non-interactive export requires --components or --all-ready.');
    outputs = options.outputs ?? (options.protocol === '1.0' ? ['json'] : ['json', 'zip']);
  } else ({ candidates, outputs } = await interactive(discovery, output, options.protocol));
  const result = exportSelection({ projectRoot, candidates, outputs, output, protocol: options.protocol, discovery });
  console.log(`Exported${options.protocol === '1.0' ? ' validated A2UI v1.0 catalog for' : ''} ${result.components.join(', ')} to ${result.output}`);
  for (const file of result.files) console.log(`  ${file}`);
}

const invoked =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (invoked)
  run().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
