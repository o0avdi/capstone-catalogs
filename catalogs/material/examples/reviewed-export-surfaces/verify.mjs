import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateV1Export } from '../../scripts/a2ui/integration-v1.mjs';
import { createComponentInstanceValidator } from '../../scripts/a2ui/validate-catalog-v1.mjs';

const file = path.resolve(process.argv[2] ?? fileURLToPath(new URL('verified-separator/catalog.json', import.meta.url)));
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
const validation = validateV1Export(catalog);
const validate = createComponentInstanceValidator(catalog);
const positive = [{ component: 'Separator' }, ...['horizontal', 'vertical'].map((orientation) => ({ component: 'Separator', orientation }))];
const negative = [
  { orientation: 'diagonal' }, { orientation: 1 }, { orientation: null }, { orientation: { '@path': '/orientation' } },
  { state: 'Horizontal' }, { render: 'custom' }, { slot: 'menu' }, { style: {} }, { className: 'override' },
  { onClick: { name: 'save' } },
].map((props) => ({ component: 'Separator', ...props }));
for (const instance of positive) assert.equal(validate(instance).valid, true, JSON.stringify(instance));
for (const instance of negative) assert.equal(validate(instance).valid, false, JSON.stringify(instance));
console.log(JSON.stringify({ file, components: Object.keys(catalog.components), ...validation,
  acceptedInstances: positive.length, rejectedInstances: negative.length }, null, 2));
