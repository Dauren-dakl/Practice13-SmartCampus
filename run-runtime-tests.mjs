import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { evaluateRequest, BOOKINGS, COMMON_CASES } from './code/src/lib/duration-contract.ts';
const root=new URL('.',import.meta.url),cases=JSON.parse(fs.readFileSync(new URL('shared/cases.json',root),'utf8'));
const base='http://127.0.0.1:1880',rows=[],start=performance.now();
const get=async path=>{const r=await fetch(base+path);if(!r.ok)throw new Error(path+' HTTP'+r.status);return r.json()};
const lowBefore=JSON.stringify(await get('/practice13/bookings')),codeBefore=JSON.stringify(BOOKINGS);
for(const [i,c]of cases.entries()){
 if(JSON.stringify(c.input)!==JSON.stringify(COMMON_CASES[i].input))throw new Error('Frozen inputs differ '+c.id);
 const code=evaluateRequest(c.input),t=performance.now();
 const response=await fetch(base+'/practice13/check',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(c.input)});
 const low=await response.json(),keys=['availability','valid','reasonCode'];
 const codePass=keys.every(k=>code[k]===c.expected[k]),lowPass=keys.every(k=>low[k]===c.expected[k]);
 rows.push({id:c.id,test:c.label,input:c.input,expected:c.expected,code,lowcode:low,codePass,lowcodePass:lowPass,exactAgreement:JSON.stringify(code)===JSON.stringify(low),lowcodeRoundtripMs:Math.round((performance.now()-t)*100)/100});
}
const lowAfter=JSON.stringify(await get('/practice13/bookings'));
rows.push({id:'T8',test:'Booking data unchanged after checks',expected:'UNCHANGED',codePass:JSON.stringify(BOOKINGS)===codeBefore,lowcodePass:lowBefore===lowAfter,codeBefore,codeAfter:JSON.stringify(BOOKINGS),lowcodeBefore:lowBefore,lowcodeAfter:lowAfter,exactAgreement:JSON.stringify(BOOKINGS)===lowAfter});
const internalSuite=await get('/practice13/tests');
const probes=[{name:'empty',input:{start:'',duration:60,blocked:false}},{name:'decimal',input:{start:'700.5',duration:60,blocked:false}},{name:'XSS-like literal',input:{start:'<img src=x onerror=alert(1)>',duration:60,blocked:false}},{name:'SQL-like literal',input:{start:'700 OR 1=1',duration:60,blocked:false}},{name:'long literal',input:{start:'0'.repeat(5000),duration:60,blocked:false}},{name:'status type',input:{start:700,duration:60,blocked:'false'}},{name:'120 boundary/end1440',input:{start:1320,duration:120,blocked:false}},{name:'day end exceeded',input:{start:1430,duration:30,blocked:false}}];
const security=[];
for(const p of probes){const code=evaluateRequest(p.input),r=await fetch(base+'/practice13/check',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p.input)}),low=await r.json();security.push({case:p.name,code,lowcode:low,agreement:JSON.stringify(code)===JSON.stringify(low),inputEchoed:typeof p.input.start==='string'&&p.input.start.length>0&&low.message.includes(p.input.start)});}
const result={method:'Code-based actual TS module and real Node-RED HTTP/Link-Call workflow;no simulation',rows,internalLowcodeSuite:internalSuite,security,seconds:Math.round(performance.now()-start)/1000};
fs.writeFileSync(new URL('evidence/common-runtime-results.json',root),JSON.stringify(result,null,2));
console.log(JSON.stringify({codePassed:rows.filter(r=>r.codePass).length,lowcodePassed:rows.filter(r=>r.lowcodePass).length,agreement:rows.every(r=>r.exactAgreement),lowcodeInternalPassed:internalSuite.filter(r=>r.result==='PASS').length,seconds:result.seconds,securityAgreement:security.every(r=>r.agreement)},null,2));
if(!rows.every(r=>r.codePass&&r.lowcodePass&&r.exactAgreement)||!security.every(r=>r.agreement))process.exitCode=1;
