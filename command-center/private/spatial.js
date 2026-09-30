
/* Spatial analytics are illustrative projections of the local synthetic workspace.
 * No sensor connectivity, physical thermography or geographic registration. */
(function(root){
 'use strict';
 const zones=[
  ['guest',21,22,'A'],['bathroom',30,25,'A'],['laundry',20,42,'A'],['stairs',28,51,'A'],
  ['kitchen',48,22,'B'],['cafe',45,34,'B'],['banquet',57,29,'B'],
  ['senior',75,21,'C'],['residential',84,31,'C'],
  ['corridor',65,41,'D'],['elevator',65,51,'D'],['warehouse',80,45,'D'],['loading',87,56,'D'],['boh',74,57,'D'],
  ['pool',46,57,'E'],['garden',23,73,'E'],
  ['lobby',46,78,'F'],['maintenance',71,76,'F'],['office',78,68,'F'],['retail',85,78,'F']
 ].map(([id,x,y,building])=>({id,x,y,building}));
 const modes={
  activity:{name:'Activity density',short:'Activity',unit:' / 100',low:'Quiet',high:'Busy',description:'Illustrative activity index combining a seeded time-of-day profile with open assignments. Not occupancy or tracking data.'},
  gaps:{name:'Collection gaps',short:'Data gaps',unit:' pts',low:'More coverage',high:'Larger gap',description:'100 minus demo scenario coverage, with a small capped contribution from accepted synthetic episodes. This is a demo heuristic, not measured model improvement.'},
  risk:{name:'Evaluation gaps',short:'Eval gaps',unit:' / 100',low:'Lower failure index',high:'Higher failure index',description:'Failure/intervention index from this workspace’s latest synthetic evaluation. Grey means no evaluation, not a passing result.'},
  thermal:{name:'Thermal visualization',short:'Thermal · simulated',unit:'°C',low:'18°C',high:'36°C',description:'Entirely synthetic illustrative temperature field. Not infrared footage, calibrated thermography, measured temperature or evidence of installed thermal sensors.'}
 };
 Object.assign(modes,{
  coverage:{name:'Camera-plan coverage',short:'Coverage',unit:'%',low:'Fewer sightlines',high:'More sightlines',description:'2D visibility estimate for the default training room of each environment. Computed from saved camera geometry, not real sensor coverage.'},
  frequency:{name:'Planned task volume',short:'Task demand',unit:' eps',low:'No planned episodes',high:'100+ planned',description:'Requested episodes in the current human assignments. A task-demand view, not observed frequency or human movement.'},
  blind:{name:'Unseen camera-plan cells',short:'Blind spots',unit:'%',low:'Fewer blind cells',high:'More blind cells',description:'Fraction of unseen in-scope 2D cells in each default-room design. Not a measured privacy, collision or optical-risk score.'},
  readiness:{name:'Evidence checkpoints',short:'Evidence progress',unit:'%',low:'Missing records',high:'More checkpoints',description:'Seven independent record/review checkpoints. A progress visualization, not a confidence probability or authorization to deploy.'}
 });
 const geoCache=new WeakMap();
 function geometry(state,id){let cache=geoCache.get(state);if(!cache){cache=new Map();geoCache.set(state,cache);}if(cache.has(id))return cache.get(id);const N=root.MetariInstrumentation||(typeof require==='function'?require('./instrumentation.js'):null);if(!N)return null;const e=state.environments.find(e=>e.id===id);if(!e)return null;const p=N.get(state,id,e.captureSpace),v=N.sample(p,state);cache.set(id,v);return v;}
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function coverage(state,id){const e=state.environments.find(e=>e.id===id);if(!e)return 0;const accepted=state.datasets.filter(d=>d.envId===id).reduce((n,d)=>n+d.accepted,0);return clamp(Math.round(e.coverage+Math.min(8,accepted/25)),0,100);}
 function metric(state,id,mode='activity',slot=10){
  const i=zones.findIndex(z=>z.id===id);if(i<0)return null;
  const e=state.environments.find(e=>e.id===id);if(!e)return null;
  const t=6+slot/2;
  if(mode==='coverage'||mode==='blind'){const g=geometry(state,id);return g?g[mode==='coverage'?'coverage':'blind']:null;}
  if(mode==='frequency')return state.assignments.filter(a=>a.envId===id).reduce((n,a)=>n+a.quantity,0);
  if(mode==='readiness'){const X=root.MetariExperience||(typeof require==='function'?require('./experience.js'):null);return X?X.evidence(state,id).progress:null;}
  if(mode==='gaps')return 100-coverage(state,id);
  if(mode==='risk'){
   const r=state.evaluations.find(e=>e.envId===id);if(!r||!r.trials)return null;
   return clamp(Math.round(((r.trials-r.successes)+.5*r.interventions+10*r.safetyStops)/r.trials*100),0,100);
  }
  if(mode==='thermal'){
   const outdoor=['garden','pool','loading'].includes(id),base=id==='kitchen'?27:outdoor?24:21;
   return Math.round(clamp(base+4*Math.sin((t-7)*Math.PI/14)+(i%4)*.7,18,36)*10)/10;
  }
  const jobs=state.assignments.filter(a=>a.envId===id&&a.status!=='Completed').length;
  return clamp(Math.round(18+(i*17)%38+25*Math.sin((t-5)*Math.PI/12+i*.61)+jobs*8),4,100);
 }
 function normalized(value,mode){return value==null?null:clamp(mode==='thermal'?(value-18)/18:value/100,0,1);}
 const palette=[[0,34,99,204],[.24,26,185,222],[.48,37,204,140],[.7,242,211,65],[.86,244,125,40],[1,238,57,68]];
 function color(v){v=clamp(v,0,1);let a=palette[0],b=palette[1];for(let i=1;i<palette.length;i++){b=palette[i];a=palette[i-1];if(v<=b[0])break;}const t=(v-a[0])/(b[0]-a[0]);return a.slice(1).map((c,i)=>Math.round(c+(b[i+1]-c)*t));}
 function displayColor(v,mode){if(['coverage','readiness'].includes(mode)){v=clamp(v,0,1);return [Math.round(93-9*v),Math.round(123+99*v),Math.round(148+23*v)];}return color(v);}
 function rows(state,mode,slot){return zones.map(z=>({...z,value:metric(state,z.id,mode,slot),coverage:coverage(state,z.id)}));}
 root.MetariSpatial={zones,modes,coverage,metric,normalized,color,displayColor,rows};
 if(typeof module!=='undefined')module.exports=root.MetariSpatial;
})(typeof window!=='undefined'?window:globalThis);

