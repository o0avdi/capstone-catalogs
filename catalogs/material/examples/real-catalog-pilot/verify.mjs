import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateV1Export } from '../../scripts/a2ui/integration-v1.mjs';
import { createComponentInstanceValidator } from '../../scripts/a2ui/validate-catalog-v1.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const file = path.resolve(process.argv[2] ?? path.join(here, 'verified-checkbox/catalog.json'));
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
const validation = validateV1Export(catalog);
const validate = createComponentInstanceValidator(catalog);
const positive = [
  { component: 'MaterialCheckbox', label: 'Include archived', checked: false },
  { component: 'MaterialCheckbox', label: 'Include archived', checked: { '@path': '/includeArchived' } },
];
const negative = [
  { component: 'MaterialCheckbox', checked: false },
  { component: 'MaterialCheckbox', label: 'Include archived' },
  { component: 'MaterialCheckbox', label: 'Include archived', checked: 'false' },
  { component: 'MaterialCheckbox', label: 'Include archived', checked: false, state: 'Basic' },
];
for (const value of positive) assert.equal(validate(value).valid, true, JSON.stringify(value));
for (const value of negative) assert.equal(validate(value).valid, false, JSON.stringify(value));
console.log(JSON.stringify({ file, components: Object.keys(catalog.components), ...validation,
  acceptedInstances: positive.length, rejectedInstances: negative.length }, null, 2));
