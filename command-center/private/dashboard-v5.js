
/* Pure presentation model for Metari's coded Command Center.
   No imagery is used for UI, heatmaps, typography, controls or diagrams.
   All statistics refer to synthetic local records, not physical telemetry. */
(function(root){
'use strict';
const ROOMS=[
 {id:'guest',x:68,y:55,w:217,h:143,label:'Guest rooms',group:'Hospitality'},
 {id:'bathroom',x:299,y:55,w:104,h:143,label:'Bathrooms',group:'Hospitality'},
 {id:'stairs',x:68,y:212,w:90,h:82,label:'Stairs',group:'Operations'},
 {id:'elevator',x:171,y:212,w:93,h:82,label:'Elevators',group:'Operations'},
 {id:'corridor',x:277,y:212,w:126,h:82,label:'Corridors',group:'Operations'},
 {id:'kitchen',x:419,y:55,w:184,h:143,label:'Kitchen lab',group:'Hospitality'},
 {id:'cafe',x:419,y:212,w:184,h:82,label:'Restaurant & café',group:'Hospitality'},
 {id:'banquet',x:619,y:55,w:174,h:143,label:'Banquet & events',group:'Hospitality'},
 {id:'office',x:809,y:55,w:118,h:94,label:'Offices',group:'Operations'},
 {id:'retail',x:809,y:163,w:118,h:131,label:'Retail',group:'Hospitality'},
 {id:'lobby',x:619,y:212,w:174,h:82,label:'Lobby & luggage',group:'Hospitality'},
 {id:'senior',x:68,y:338,w:151,h:141,label:'Senior living',group:'Residential'},
 {id:'residential',x:233,y:338,w:170,h:141,label:'Residential',group:'Residential'},
 {id:'laundry',x:419,y:338,w:120,h:86,label:'Laundry',group:'Operations'},
 {id:'boh',x:553,y:338,w:109,h:86,label:'Back of house',group:'Operations'},
 {id:'warehouse',x:678,y:338,w:133,h:86,label:'Warehouse',group:'Operations'},
 {id:'loading',x:827,y:338,w:100,h:141,label:'Loading dock',group:'Operations'},
 {id:'maintenance',x:553,y:438,w:109,h:86,label:'Maintenance',group:'Operations'},
 {id:'pool',x:678,y:438,w:133,h:86,label:'Pool & terrace',group:'Outdoor'},
 {id:'garden',x:68,y:493,w:471,h:47,label:'Gardens & grounds',group:'Outdoor'}
];
const PORTRAITS={
 op1:'https://d8j0ntlcm91z4.cloudfront.net/user_34AGiB26kOoMTy3uXuKS0z4rWLj/hf_20260923_205818_c52ba9a9-e5ba-4789-b71e-8bb030971b75.png',
 op2:'https://d8j0ntlcm91z4.cloudfront.net/user_34AGiB26kOoMTy3uXuKS0z4rWLj/hf_20260923_205820_3712c325-d501-455e-889c-7e36b745cbc2.png',
 op3:'https://d8j0ntlcm91z4.cloudfront.net/user_34AGiB26kOoMTy3uXuKS0z4rWLj/hf_20260923_205819_ca70cab6-7c2b-4ca0-b267-ca3c35ffb0ef.png',
 op4:'https://d8j0ntlcm91z4.cloudfront.net/user_34AGiB26kOoMTy3uXuKS0z4rWLj/hf_20260923_205818_70c8621b-7056-40a8-a981-1ae2a15cf96d.png',
 op5:'https://d8j0ntlcm91z4.cloudfront.net/user_34AGiB26kOoMTy3uXuKS0z4rWLj/hf_20260923_205819_c886d89a-507f-4518-9f8e-4706f3a35d2b.png'
};
const sum=(a,k)=>a.reduce((v,r)=>v+(Number(r[k])||0),0);
function stats(s){
 const total=sum(s.datasets,'total'),accepted=sum(s.datasets,'accepted'),rejected=sum(s.datasets,'rejected'),reviewed=accepted+rejected;
 return {total,accepted,rejected,reviewed,qa:reviewed?Math.round(1000*accepted/reviewed)/10:null,reviewProgress:total?Math.round(100*reviewed/total):null,active:s.assignments.filter(a=>a.status==='Capturing').length,queued:s.assignments.filter(a=>a.status==='Assigned').length,cameras:Object.values(root.MetariPlans||{}).reduce((n,p)=>n+p.cameras.length,0),orders:s.orders.filter(o=>o.status!=='Delivered').length,environments:s.environments.length};
}
function person(s,id){
 const p=s.operators.find(o=>o.id===id);if(!p)throw new Error('Unknown operator');
 const assignments=s.assignments.filter(a=>a.operatorId===id),active=assignments.filter(a=>a.status==='Capturing'),queued=assignments.filter(a=>a.status==='Assigned'),inReview=assignments.filter(a=>a.status==='Quality review'),done=assignments.filter(a=>a.status==='Completed');
 const batches=s.datasets.filter(d=>assignments.some(a=>a.id===d.assignmentId));
 const recorded=sum(batches,'total');
 return {...p,assignments,active,queued,inReview,done,batches,recorded,status:active.length?'Collecting':inReview.length?'QA handoff':queued.length?'Assigned':'No queued work',tone:active.length?'teal':inReview.length?'amber':queued.length?'blue':'muted',room:active[0]?.space||queued[0]?.space||inReview[0]?.space||null};
}
function trace(s){
 const v=stats(s),phase=Number(s.loop?.phase)||0;
 const pending=s.datasets.filter(d=>d.accepted+d.rejected<d.total).length;
 const evals=s.evaluations.length,passed=s.evaluations.filter(e=>root.MetariExperience?root.MetariExperience.evaluationGate(e).passed:e.passed).length;
 const pilots=s.pilots.filter(p=>p.approved).length;
 const focus=phase<=2?0:phase===3?1:phase===4?2:phase<=7?3:4;
 return [
 {id:'collect',label:'Collect',icon:'camera',page:'humans',sub:'Configure rooms. Brief the human.',status:v.active?'Capturing · demo':v.queued?'Work queued':'Plan collection',count:v.active+' active · '+v.queued+' queued',active:focus===0},
 {id:'qa',label:'QA + Label',icon:'database',page:'datasets',sub:'Review episodes and preserve lineage.',status:pending?'Review queue':'Review complete',count:pending+' batches pending review',active:focus===1},
 {id:'train',label:'Train',icon:'brain',page:'training',sub:'Lab-led learning from approved data.',status:s.handoffs.length?'Handoff recorded':'Awaiting handoff',count:s.handoffs.length+' simulated lab handoffs',active:focus===2},
 {id:'evaluate',label:'Evaluate',icon:'chart',page:'evaluations',sub:'Test in independent held-out rooms.',status:evals?'Fixture results':'Awaiting evaluation',count:passed+' passed / '+evals+' fixture runs',active:focus===3},
 {id:'deploy',label:'Deploy',icon:'deploy',page:'deployments',sub:'Operator review before pilot release.',status:pilots?'Pilot simulation':'Approval required',count:s.pilots.length+' pilot proposals · '+pilots+' approved',active:focus===4}
 ];
}
function intensity(s,id,mode,slot){
 const e=s.environments.find(e=>e.id===id);if(!e)return null;
 const i=ROOMS.findIndex(r=>r.id===id),jobs=s.assignments.filter(a=>a.envId===id&&a.status==='Capturing').length;
 if(mode==='coverage')return Math.max(0,Math.min(1,Number(e.coverage||0)/100));
 if(mode==='gaps')return 1-Math.max(0,Math.min(1,Number(e.coverage||0)/100));
 if(mode==='thermal')return .3+.36*(.5+.5*Math.sin(i*1.62+slot*.13))+(id==='kitchen'?.25:0);
 return Math.min(.98,.12+jobs*.32+.6*(.5+.5*Math.sin(i*1.8+slot*.2)));
}
function roomIds(e){
 const prefix=e.captureSpace.split('-')[0];
 return Array.from({length:Math.max(1,e.spaces)},(_,i)=>prefix+'-'+(101+i)).concat([e.holdoutSpace]);
}
const api={ROOMS,PORTRAITS,stats,person,trace,intensity,roomIds};root.MetariDashboard=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

