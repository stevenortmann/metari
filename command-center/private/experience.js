
/* Metari v4: inspectable progress, not invented performance.
 * All records are local synthetic fixtures. Checklist completion is NOT
 * deployment confidence, a safety probability, or a production release gate.
 */
(function(root){
 'use strict';
 const pct=(n,d)=>d>0?Math.round(Math.max(0,Math.min(1,n/d))*1000)/10:null;
 const sum=(a,k)=>a.reduce((n,x)=>n+(Number(x[k])||0),0);
 const latest=(s,id)=>s.evaluations.find(x=>x.envId===id)||null;
 function evaluationGate(r){
  if(!r||!Number.isInteger(r.trials)||r.trials<=0||['successes','interventions','safetyStops'].some(k=>!Number.isInteger(r[k])||r[k]<0||r[k]>r.trials))return {known:false,passed:false,success:null,intervention:null};
  const success=pct(r.successes,r.trials),intervention=pct(r.interventions,r.trials);
  return {known:true,passed:r.passed===true&&success>=90&&intervention<=5&&r.safetyStops===0,success,intervention};
 }
 function evidence(s,id){
  const e=s.environments.find(x=>x.id===id);if(!e)throw new Error('Unknown environment');
  const orders=s.orders.filter(x=>x.envId===id),as=s.assignments.filter(x=>x.envId===id),ds=s.datasets.filter(x=>x.envId===id);
  const handoffs=s.handoffs.filter(h=>orders.some(o=>o.id===h.orderId));
  const r=latest(s,id),gate=evaluationGate(r),pilots=s.pilots.filter(x=>x.envId===id);
  const eligiblePilots=r?pilots.filter(p=>p.evaluationId===r.id&&p.approved===true):[];
  const accepted=sum(ds,'accepted'),rejected=sum(ds,'rejected'),total=sum(ds,'total'),reviewed=accepted+rejected;
  const designed=orders.some(o=>o.captureDesign)||as.some(a=>a.captureDesign);
  const checkpoints=[
   {key:'design',label:'Version-linked plan',done:designed,page:'instrumentation',detail:'A collection order or assignment carries a saved capture-design snapshot.'},
   {key:'assign',label:'Human work assigned',done:as.length>0,page:'humans',detail:'At least one human assignment exists for this environment.'},
   {key:'capture',label:'Capture batch created',done:total>0,page:'datasets',detail:'At least one synthetic capture batch exists.'},
   {key:'qa',label:'Quality review complete',done:total>0&&reviewed===total&&accepted>0,page:'datasets',detail:'All current episodes are reviewed and at least one is accepted.'},
   {key:'handoff',label:'Lab handoff recorded',done:handoffs.length>0,page:'training',detail:'A simulated training handoff exists for an environment order.'},
   {key:'evaluation',label:'Latest held-out pass',done:gate.passed,page:'evaluations',detail:'The latest fixture meets success ≥90%, interventions ≤5%, zero stops, and its recorded pass gate.'},
   {key:'operator',label:'Pilot review recorded',done:gate.passed&&eligiblePilots.length>0,page:'deployments',detail:'An operator-approved demo pilot references that latest passing evaluation.'}
  ];
  const complete=checkpoints.filter(c=>c.done).length;
  const stateLabel=!gate.known?'Awaiting evaluation':!gate.passed?'Needs recovery':eligiblePilots.some(p=>p.status==='Simulated pilot')?'Pilot simulation':eligiblePilots.some(p=>p.status==='Paused')?'Pilot paused':'Operator review';
  const next=checkpoints.find(c=>!c.done)||null;
  return {id,name:e.name,orders:orders.length,assignments:as.length,active:as.filter(a=>a.status==='Capturing').length,queued:as.filter(a=>a.status==='Assigned').length,total,accepted,rejected,reviewed,quality:pct(accepted,reviewed),reviewProgress:pct(reviewed,total),captureProgress:pct(total,sum(orders,'quantity')),requested:sum(orders,'quantity'),resetBriefs:new Set(as.map(a=>String(a.variant||'').trim().toLowerCase()).filter(Boolean)).size,scenarioFixture:e.coverage,latest:r,gate,handoffs:handoffs.length,pilots:pilots.length,checkpoints,complete,checkpointCount:checkpoints.length,progress:pct(complete,checkpoints.length),stateLabel,next};
 }
 function pipeline(s){return [
  {id:'orders',label:'Requests',count:s.orders.length,detail:'fictional buyer briefs',icon:'clipboard'},
  {id:'humans',label:'Human work',count:s.assignments.length,detail:'linked assignments',icon:'users'},
  {id:'datasets',label:'Capture & QA',count:s.datasets.length,detail:'synthetic batches',icon:'database'},
  {id:'training',label:'Lab handoff',count:s.handoffs.length,detail:'simulated returns',icon:'brain'},
  {id:'evaluations',label:'Held-out eval',count:s.evaluations.length,detail:'fixture scorecards',icon:'chart'},
  {id:'deployments',label:'Pilot review',count:s.pilots.length,detail:'demo pilot records',icon:'deploy'}
 ];}
 function journeyEvidence(s,orderId){
  const o=s.orders.find(o=>o.id===orderId);if(!o)return null;
  const assignments=s.assignments.filter(a=>a.orderId===o.id),datasets=s.datasets.filter(d=>d.orderId===o.id),handoffs=s.handoffs.filter(h=>h.orderId===o.id);
  const total=sum(datasets,'total'),accepted=sum(datasets,'accepted'),reviewed=accepted+sum(datasets,'rejected');
  return {order:o,assignments,datasets,handoffs,total,accepted,reviewed,qaDone:total>0&&reviewed===total&&accepted>0};
 }
 function mode(settings,reduced=false,hidden=false){
  if(reduced)return 'reduced';if(hidden)return 'hidden';if(settings.motion===false||settings.motionStyle==='paused')return 'paused';return settings.motionStyle==='calm'?'calm':'cinematic';
 }
 const METHOD='Checklist v4.1: seven independent record-existence/review checkpoints. It is not a probability of safe deployment. QA acceptance is accepted / reviewed; unreviewed episodes are excluded. Reset-brief count measures distinct written instructions, not observed behavioral diversity. Historical records can reference different models; this checklist does not certify a single training lineage.';
 root.MetariExperience={evidence,evaluationGate,latest,pipeline,journeyEvidence,mode,pct,METHOD};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.MetariExperience;
})(typeof window!=='undefined'?window:globalThis);

