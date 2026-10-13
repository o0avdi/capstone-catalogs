import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const composer=path.resolve(process.argv[2]??'../../../composer');
const source=path.join(composer,'shell/src/app/gallery/schema/catalog-schema-resolver.ts');
const result=await build({entryPoints:[source],bundle:true,platform:'node',format:'esm',write:false});
const {CatalogSchemaResolver}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const catalog=JSON.parse(fs.readFileSync('a2ui-output/catalog.json'));
const errors=[];
const resolver=new CatalogSchemaResolver(catalog,{withTag:()=>({warn:(...args)=>errors.push(args),error:(...args)=>errors.push(args)})});
for(const [name,required] of [['FinanceMetricCard',['id','component','label','value']],['MaterialButton',['id','component','label','disabled','appearance','action']]]){
  const properties=resolver.resolveComponentProperties(name);
  const requiredNames=properties.filter(p=>p.required).map(p=>p.name);
  for(const field of required)assert.ok(requiredNames.includes(field),name+' required '+field);
  assert.ok(properties.some(p=>p.name==='label'&&p.type.includes('string')));
  const schemas=resolver.resolveComponentPropertiesSchema(name);
  assert.ok(schemas.label);assert.ok(schemas.id);
}
assert.deepEqual(errors,[]);
console.log('PASS pinned Composer CatalogSchemaResolver parses both generated components, internal refs and required fields without warnings.');
