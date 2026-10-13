import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
const c = JSON.parse(fs.readFileSync('catalog.json'));
const ajv = new Ajv2020({ strict: false, allErrors: true });
ajv.addSchema(c);
const validate = ajv.compile({ $ref: c.$id + '#/$defs/anyComponent' });
const fixtures = JSON.parse(fs.readFileSync('fixtures.json'));
for (const [name, messages] of Object.entries(fixtures)) {
  for (const message of messages)
    for (const instance of message.updateComponents?.components ?? []) {
      if (!validate(instance)) throw new Error(name + ': ' + ajv.errorsText(validate.errors));
    }
}
console.log('Draft 2020-12: all fixture instances passed.');

const metric={id:'root',component:'FinanceMetricCard',label:'Revenue',value:42};
for(const instance of [{...metric,value:'Legacy formatted value'},{...metric,value:{path:'/revenue'}}])if(!validate(instance))throw new Error('Valid union/binding failed');
for(const instance of [{...metric,id:''},{...metric,value:true},{...metric,state:'unknown'},{...metric,unknown:true},{id:'root',component:'FinanceMetricCard',label:'Missing value'}])if(validate(instance))throw new Error('Invalid component unexpectedly passed: '+JSON.stringify(instance));
console.log('Draft 2020-12: missing required, empty id, wrong type/enum and unknown properties rejected.');
