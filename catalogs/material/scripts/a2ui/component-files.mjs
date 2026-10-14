import fs from 'node:fs';
import path from 'node:path';
import { catalogId } from './metadata.mjs';

export function zSchema(schema) {
  if (schema.enum)
    return schema.enum.every((v) => typeof v === 'string')
      ? `z.enum(${JSON.stringify(schema.enum)})`
      : `z.union([${schema.enum.map((v) => `z.literal(${JSON.stringify(v)})`).join(',')}])`;
  if ('const' in schema) return `z.literal(${JSON.stringify(schema.const)})`;
  if (Array.isArray(schema.type))
    return `z.union([${schema.type.map((type) => zSchema({ type })).join(',')}])`;
  if (schema.anyOf) return `z.union([${schema.anyOf.map(zSchema).join(',')}])`;
  if (!['string', 'number', 'boolean'].includes(schema.type))
    throw Error('Unsupported runtime schema ' + JSON.stringify(schema));
  return `z.${schema.type}()`;
}
export function contracts(metadata) {
  let text = `// Generated contracts: live source metadata is authoritative.\nimport {z} from 'zod';\nconst binding=z.object({path:z.string().min(1)}).strict();\nexport const eventActionSchema=z.object({event:z.object({name:z.string().min(1),context:z.record(z.union([z.string(),z.number(),z.boolean()])).optional()}).strict()}).strict();\n`;
  const resolved = [];
  for (const c of metadata) {
    const literal = c.fields.map(
      (f) => `${f.name}:${zSchema(f.schema)}${f.required ? '' : '.optional()'}`,
    );
    const bound = c.fields.map(
      (f) =>
        `${f.name}:${f.binding ? `z.union([${zSchema(f.schema)},binding])` : zSchema(f.schema)}${f.required ? '' : '.optional()'}`,
    );
    const actions = [...new Set(Object.values(c.events ?? {}))].map(
      (name) => `${name}:eventActionSchema`,
    );
    text += `export const ${c.adapter}Api={name:${JSON.stringify(c.name)},schema:z.object({${[...bound, ...actions].join(',')}}).strict()};\n`;
    resolved.push(
      `${JSON.stringify(c.name)}:z.object({${[...literal, ...actions].join(',')}}).strict()`,
    );
  }
  return (
    text + `export const resolvedSchemas:Record<string,z.ZodTypeAny>={${resolved.join(',')}};\n`
  );
}
export function registrationSource(metadata) {
  return (
    `// Generated registration; component behavior lives in adapter files.\nimport {Injectable} from '@angular/core';\nimport {AngularCatalog} from '@a2ui/angular/v0_9';\nimport {${metadata.map((c) => c.adapter + 'Api').join(',')}} from './contracts';\nexport {resolvedSchemas} from './contracts';\n` +
    metadata
      .map(
        (c) =>
          `import {${c.adapter}} from ${JSON.stringify('./' + c.adapterOutput.replace(/^src\//, '').replace(/\.ts$/, ''))};\nexport {${c.adapter}};\n`,
      )
      .join('') +
    `@Injectable()\nexport class ExportCatalog extends AngularCatalog{constructor(){super(${JSON.stringify(catalogId)},[${metadata.map((c) => `{...${c.adapter}Api,component:${c.adapter}}`).join(',')}],[]);}}\n`
  );
}
function literalMatches(value, schema) {
  if (schema.anyOf) return schema.anyOf.some((s) => literalMatches(value, s));
  if (schema.enum && !schema.enum.includes(value)) return false;
  if ('const' in schema && value !== schema.const) return false;
  return (
    (Array.isArray(schema.type) ? schema.type : [schema.type]).includes(typeof value) &&
    !(typeof value === 'number' && !Number.isFinite(value))
  );
}
export function componentFixtures(root, metadata) {
  const fixtures = {};
  const menu = [];
  const usages = {};
  for (const c of metadata) {
    const config = JSON.parse(fs.readFileSync(path.join(root, c.fixturesFile)));
    for (const f of config.fixtures) {
      if (!/^[\w-]+$/.test(f.name) || f.name in fixtures)
        throw Error('Invalid/colliding fixture identity ' + f.name);
      if (f.messages) {
        fixtures[f.name] = f.messages;
      } else {
        const example = c.examples.find((e) => e.name === f.example);
        if (!example) throw Error(c.name + ': missing source story example ' + f.example);
        const props = { ...example.props, ...f.props };
        const actions = [...new Set(Object.values(c.events ?? {}))];
        for (const key of Object.keys(props))
          if (!c.fields.some((p) => p.name === key) && !actions.includes(key))
            throw Error(c.name + ': unsupported fixture property ' + key);
        for (const field of c.fields) {
          const value = props[field.name];
          const binding =
            value &&
            typeof value === 'object' &&
            Object.keys(value).length === 1 &&
            typeof value.path === 'string' &&
            value.path.length > 0;
          if (value === undefined && !field.required) continue;
          if (!(field.binding && binding) && !literalMatches(value, field.schema))
            throw Error(c.name + '.' + field.name + ': fixture type/enum mismatch in ' + f.name);
        }
        for (const key of actions) {
          const action = props[key];
          if (
            !action ||
            Object.keys(action).length !== 1 ||
            !action.event ||
            !action.event.name ||
            typeof action.event.name !== 'string' ||
            Object.keys(action.event).some((k) => !['name', 'context'].includes(k)) ||
            Object.values(action.event.context ?? {}).some(
              (v) => !['string', 'number', 'boolean'].includes(typeof v),
            )
          )
            throw Error(c.name + '.' + key + ': fixture needs a scalar-context event action');
        }
        fixtures[f.name] = [
          { version: 'v0.9', createSurface: { surfaceId: 'demo', catalogId } },
          ...(f.data
            ? [
                {
                  version: 'v0.9',
                  updateDataModel: { surfaceId: 'demo', path: '/', value: f.data },
                },
              ]
            : []),
          {
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'demo',
              components: [{ id: 'root', component: c.name, ...props }],
            },
          },
        ];
      }
      menu.push({ name: f.name, label: f.label ?? f.name });
    }
    const usage = fixtures[config.usage];
    if (!usage) throw Error(c.name + ': missing usage fixture ' + config.usage);
    usages[c.name] = {
      usage: usage.flatMap((m) => m.updateComponents?.components ?? []),
      ...(usage.find((m) => m.updateDataModel)
        ? { data: usage.find((m) => m.updateDataModel).updateDataModel.value }
        : {}),
    };
  }
  return { fixtures, menu, usages };
}
