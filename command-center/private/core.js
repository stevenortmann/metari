
/* Metari Command Center. Dependency-free, deterministic demo domain model.
 * This models WORKFLOW only. No robot control, ML training, or real buyers. */
(function (root) {
  'use strict';
  const VERSION = 1;
  const ENV_DATA = [
    ['guest','Guest Room','Hospitality','bed','room.webp','room','GR',6,['Strip and remake bed','Sort used linen','Restock amenities','Inspect finished room'],['Fitted-sheet corner released','Duvet rotated 90 degrees','Two towels on floor','Partially drawn curtains']],
    ['bathroom','Bathroom','Hospitality','bath','bathroom.webp',null,'BA',3,['Wipe shower glass','Sort bathroom towels','Restock toiletries','Inspect surface finish'],['Dry glass with reflections','Towel beneath vanity','Partially obscured bottle','Different towel textures']],
    ['kitchen','Commercial Kitchen','Food & beverage','chef','kitchen-poster.webp','kitchen','KT',3,['Stage cold ingredients','Plate a prepared dish','Pass a tray to a colleague','Clear workstation'],['Plate shifted 15 cm','Alternate tray weight','Left-handed handoff','Utensil partly occluded']],
    ['cafe','Restaurant & Café','Food & beverage','coffee','cafe.webp',null,'CA',3,['Set a café table','Deliver a cold beverage','Clear tableware','Stage a service tray'],['Cup handle turned away','Two place settings','Chair moved into aisle','Tray partially occupied']],
    ['banquet','Banquet & Events','Food & beverage','table','cafe.webp',null,'BQ',2,['Reset place settings','Fold a napkin','Align banquet chairs','Stage linen delivery'],['Round versus rectangular table','Six-place layout','Alternate napkin fabric','Chair gap variation']],
    ['laundry','Laundry','Operations','layers','room.webp','towel','LA',3,['Fold a bath towel','Sort linen by type','Load an empty cart','Stage a shelf stack'],['Mixed towel sizes','Inside-out pillowcase','Low shelf placement','Stack rotated 45 degrees']],
    ['corridor','Corridors','Operations','route','backofhouse.webp','cart','CO',3,['Navigate service cart','Yield to a colleague','Pass a doorway','Park cart in bay'],['Narrow turn','Stationary obstacle','Different cart loads','Doorway partly obstructed']],
    ['stairs','Stairs','Operations','stairs','stairs.webp',null,'ST',2,['Observe stair approach','Stage landing delivery','Evaluate step clearance','Record supervised traversal'],['Landing approach angle','Lighting gradient','Empty versus occupied landing','Handrail-side approach']],
    ['elevator','Elevators','Operations','elevator','backofhouse.webp',null,'EL',2,['Approach lift threshold','Queue in safe zone','Enter an open lift','Exit and reorient'],['Threshold variation','Cart turning angle','Door-state signal','Empty lift versus staged props']],
    ['pool','Pool & Terrace','Outdoor','waves','pool.webp',null,'PL',2,['Stage poolside towels','Collect surface debris','Reset a lounger','Restock a dry service cart'],['Lounger angle','Sunlight glare','Leaf distribution','Dry-deck obstacle placement']],
    ['garden','Gardens & Grounds','Outdoor','leaf','gardens.webp',null,'GD',3,['Water a potted plant','Sort gardening supplies','Collect staged debris','Move a planter on a trolley'],['Different pot sizes','Uneven paver patterns','Foliage occlusion','Shade versus sunlight']],
    ['boh','Back of House','Operations','cart','backofhouse.webp','cart','BH',3,['Deliver supplies','Sort recyclable props','Stage housekeeping cart','Return empty containers'],['Full cart layout','Mixed bin colors','Narrow service entry','Different shelf heights']],
    ['loading','Loading Dock','Operations','truck','entrance.webp',null,'LD',2,['Stage empty delivery boxes','Verify package locations','Push a hand trolley','Sort labeled containers'],['Box orientation','Load placement','Delivery-bay lighting','Different trolley handles']],
    ['warehouse','Warehouse','Operations','box','backofhouse.webp',null,'WH',2,['Pick lightweight parcels','Place a bin on a shelf','Reconcile staged inventory','Navigate a marked aisle'],['Shelf level','Bin size','Partially occluded label','Aisle spacing variation']],
    ['senior','Senior Living','Residential','heart','suite.webp',null,'SL',2,['Deliver a towel to a table','Stage nonclinical supplies','Navigate an accessible room','Retrieve a light object'],['Accessible furniture layout','Walking-aid prop placement','Object height variation','Low-light room setup']],
    ['residential','Residential Apartment','Residential','home','suite.webp',null,'AP',3,['Set a dining table','Sort household linen','Tidy a sofa area','Put away light household items'],['Cluttered sofa','Varied cushion textures','Table location','Different cabinet handles']],
    ['retail','Retail','Commercial','shop','cafe.webp',null,'RT',2,['Restock a display','Fold a garment','Sort shopping bags','Inspect shelf arrangement'],['Shelf density','Packaging variation','Garment materials','Aisle obstacle prop']],
    ['maintenance','Maintenance','Operations','tool','gardens.webp',null,'MT',2,['Identify a tool on a board','Deliver a closed tool kit','Inspect a fixture visually','Organize maintenance supplies'],['Tool orientation','Lighting variation','Kit location','Shelf clutter']],
    ['office','Office','Commercial','monitor','control.webp',null,'OF',2,['Reset a meeting table','Deliver office supplies','Organize desk items','Move a chair safely'],['Desk clutter','Different chair positions','Monitor reflections','Cable-avoidance zone']],
    ['lobby','Lobby & Luggage','Hospitality','luggage','entrance.webp',null,'LB',3,['Stage a luggage cart','Move a light suitcase','Handoff an information pack','Navigate a lobby route'],['Suitcase handle height','Cart orientation','Pedestrian staging','Entrance light variation']]
  ];
  const clone = x => JSON.parse(JSON.stringify(x));
  const timestamp = () => new Date().toISOString();
  function createState() {
    const environments = ENV_DATA.map((d,i)=>({id:d[0],name:d[1],category:d[2],icon:d[3],image:d[4],clip:d[5],prefix:d[6],spaces:d[7],tasks:d[8],variants:d[9],sensors:6+(i%4)*2,coverage:44+(i*7)%49,config:{lux:320,clutter:'Moderate',layout:'Standard',surface:'Default'},captureSpace:d[6]+'-101',holdoutSpace:d[6]+'-201'}));
    return {schemaVersion:VERSION,createdAt:timestamp(),seq:1100,environments,
      operators:[{id:'op1',name:'Alex M.',role:'Hospitality specialist',initials:'AM'},{id:'op2',name:'Jordan R.',role:'Capture technician',initials:'JR'},{id:'op3',name:'Sam K.',role:'Food service specialist',initials:'SK'},{id:'op4',name:'Taylor B.',role:'Quality reviewer',initials:'TB'},{id:'op5',name:'Casey L.',role:'Facilities specialist',initials:'CL'}],
      orders:[
        {id:'DO-1042',buyer:'Lab Buyer A',title:'Room-turn edge cases',envId:'guest',quantity:40,priority:'High',status:'Requested',due:'2026-10-09',notes:'Paired human demonstrations of fitted-sheet failures, low light and varied room layouts. Separate held-out evaluation rooms.',source:'Buyer brief',createdAt:timestamp()},
        {id:'DO-1041',buyer:'Lab Buyer B',title:'Kitchen handoff variations',envId:'kitchen',quantity:60,priority:'High',status:'Collecting',due:'2026-10-12',notes:'Cold props only. Left- and right-sided tray handoffs with trained adults.',source:'Buyer brief',createdAt:timestamp()},
        {id:'DO-1040',buyer:'Lab Buyer C',title:'Cart navigation in service corridors',envId:'corridor',quantity:80,priority:'Medium',status:'Quality review',due:'2026-10-14',notes:'Vary cart load, turning angle and marked obstacle positions.',source:'Buyer brief',createdAt:timestamp()},
        {id:'DO-1039',buyer:'Lab Buyer D',title:'Towel folding and shelf placement',envId:'laundry',quantity:48,priority:'Medium',status:'Delivered',due:'2026-10-06',notes:'Three towel sizes and two shelf heights. Demo dataset manifest only.',source:'Buyer brief',createdAt:timestamp()},
        {id:'DO-1038',buyer:'Lab Buyer E',title:'Outdoor setup and object handling',envId:'garden',quantity:36,priority:'Low',status:'Planned',due:'2026-10-18',notes:'Shade and sunlight variations; lightweight props.',source:'Buyer brief',createdAt:timestamp()}],
      assignments:[
        {id:'AS-2101',orderId:'DO-1041',envId:'kitchen',operatorId:'op3',title:'Cold tray handoff • left approach',quantity:30,status:'Capturing',variant:'Tray shifted 15 cm; colleague approaches from the left.',space:'KT-101',scheduled:'2026-09-23T10:00',consent:true,safety:true,createdAt:timestamp()},
        {id:'AS-2102',orderId:'DO-1041',envId:'kitchen',operatorId:'op2',title:'Cold tray handoff • right approach',quantity:30,status:'Assigned',variant:'Alternate tray weights using inert props; right-hand handoff.',space:'KT-102',scheduled:'2026-09-23T11:00',consent:true,safety:true,createdAt:timestamp()},
        {id:'AS-2103',orderId:'DO-1040',envId:'corridor',operatorId:'op1',title:'Cart turn and doorway clearance',quantity:80,status:'Quality review',variant:'Obstructed doorway and two cart loads in a closed test corridor.',space:'CO-101',scheduled:'2026-09-23T09:00',consent:true,safety:true,datasetId:'DS-3001',createdAt:timestamp()},
        {id:'AS-2104',orderId:'DO-1039',envId:'laundry',operatorId:'op1',title:'Towel fold and shelf placement',quantity:48,status:'Completed',variant:'Three towel sizes; low and middle shelf.',space:'LA-101',scheduled:'2026-09-23T08:00',consent:true,safety:true,datasetId:'DS-3002',createdAt:timestamp()},
        {id:'AS-2105',orderId:'DO-1038',envId:'garden',operatorId:'op5',title:'Plant watering under partial shade',quantity:36,status:'Assigned',variant:'Vary pot placement and foliage occlusion. No powered cutting tools.',space:'GD-101',scheduled:'2026-09-23T13:00',consent:true,safety:false,createdAt:timestamp()}],
      datasets:[
        {id:'DS-3001',assignmentId:'AS-2103',orderId:'DO-1040',envId:'corridor',name:'Service corridor • batch 01',total:80,accepted:0,rejected:0,flagged:5,status:'Needs review',split:'Training',source:'Synthetic demo metadata',createdAt:timestamp()},
        {id:'DS-3002',assignmentId:'AS-2104',orderId:'DO-1039',envId:'laundry',name:'Towel placement • batch 01',total:48,accepted:46,rejected:2,flagged:2,status:'Released',split:'Training',source:'Synthetic demo metadata',reviewer:'Taylor B. (demo)',qaNote:'Two samples excluded for occlusion.',createdAt:timestamp()}],
      evaluations:[
        {id:'EV-4001',envId:'guest',name:'Room-turn baseline',model:'Embodied-01 v0.3',suite:'GR-HOLDOUT-01',trials:100,successes:76,interventions:14,safetyStops:0,avgSeconds:162,passed:false,createdAt:timestamp(),source:'Simulated benchmark'},
        {id:'EV-4002',envId:'laundry',name:'Towel placement',model:'Embodied-02 v0.5',suite:'LA-HOLDOUT-01',trials:100,successes:95,interventions:3,safetyStops:0,avgSeconds:42,passed:true,createdAt:timestamp(),source:'Simulated benchmark'},
        {id:'EV-4003',envId:'corridor',name:'Cart navigation',model:'Mobile-01 v0.2',suite:'CO-HOLDOUT-01',trials:100,successes:87,interventions:8,safetyStops:1,avgSeconds:58,passed:false,createdAt:timestamp(),source:'Simulated benchmark'}],
      recommendations:[
        {id:'RC-501',envId:'guest',title:'Fitted-sheet corner recovery',reason:'Room-turn baseline completed 76 of 100 trials. Corner recovery is underrepresented.',coverage:42,impact:5,demand:4,priority:'High',quantity:24,status:'Suggested',evalId:'EV-4001'},
        {id:'RC-502',envId:'bathroom',title:'Reflective glass and partial occlusion',reason:'Only 38% of the illustrative reflection-variation target is covered.',coverage:38,impact:4,demand:3,priority:'High',quantity:20,status:'Suggested'},
        {id:'RC-503',envId:'corridor',title:'Narrow doorway with a loaded cart',reason:'A simulated safety stop and eight interventions were recorded in the held-out suite.',coverage:55,impact:5,demand:3,priority:'High',quantity:24,status:'Suggested',evalId:'EV-4003'},
        {id:'RC-504',envId:'pool',title:'Sun glare and lounger placement',reason:'Daylight variation coverage is below the illustrative collection target.',coverage:61,impact:3,demand:2,priority:'Medium',quantity:16,status:'Suggested'},
        {id:'RC-505',envId:'senior',title:'Accessible-room object placement',reason:'Low shelves and walking-aid props are sparsely represented; nonclinical tasks only.',coverage:47,impact:3,demand:1,priority:'Medium',quantity:18,status:'Suggested'}],
      handoffs:[],pilots:[{id:'DP-601',envId:'laundry',evaluationId:'EV-4002',site:'Operator Sandbox A',capability:'Towel placement',status:'Ready for review',approved:false,createdAt:timestamp()}],
      sites:[{id:'SITE-01',name:'West Campus',region:'California, US',type:'Demo campus',status:'Simulated',x:19,y:50},{id:'SITE-02',name:'Northeast evaluation site',region:'Northeast, US',type:'Evaluation site',status:'Concept',x:38,y:40},{id:'SITE-03',name:'Gulf campus concept',region:'UAE',type:'Campus',status:'Concept',x:63,y:54},{id:'SITE-04',name:'Europe test network',region:'Europe',type:'Distributed network',status:'Concept',x:52,y:34},{id:'SITE-05',name:'Asia deployment center',region:'Asia-Pacific',type:'Deployment center',status:'Concept',x:83,y:51}],
      events:[{id:'LOG-1',type:'Quality',title:'Cart-navigation batch awaiting review',detail:'80 illustrative episodes • DS-3001',target:'datasets',recordId:'DS-3001',time:timestamp()},{id:'LOG-2',type:'Capture',title:'Kitchen handoff session in progress',detail:'Jordan and Sam • concept playback only',target:'humans',recordId:'AS-2101',time:timestamp()},{id:'LOG-3',type:'Evaluation',title:'Room-turn gap identified',detail:'76 / 100 synthetic trials • collection recommended',target:'evaluations',recordId:'EV-4001',time:timestamp()}],
      loop:{orderId:'DO-1042',phase:0,baselineId:'EV-4001',history:[],recoveryOrderId:null,retestId:null},
      settings:{motion:true,autoPlay:true,showSensorOverlay:true},lastScan:null};
  }
  function ensure(value,message){if(!value)throw new Error(message);}
  function id(s,prefix){let candidate;do{s.seq++;candidate=prefix+'-'+s.seq;}while(Object.values(s).some(v=>Array.isArray(v)&&v.some(x=>x&&x.id===candidate)));return candidate;}
  function event(s,type,title,detail,target,recordId){s.events.unshift({id:id(s,'LOG'),type,title,detail,target,recordId,time:timestamp()});s.events=s.events.slice(0,120);}
  function env(s,key){const e=s.environments.find(x=>x.id===key);ensure(e,'Select a valid environment.');return e;}
  function lookup(s,key,keyId){const x=s[key].find(x=>x.id===keyId);ensure(x,'This record is no longer available.');return x;}
  function count(n,max=50000){n=Number(n);ensure(Number.isInteger(n)&&n>0&&n<=max,`Quantity must be a whole number from 1 to ${max.toLocaleString()}.`);return n;}
  function text(x,min=1,max=240){x=String(x||'').trim();ensure(x.length>=min&&x.length<=max,`Enter ${min}–${max} characters.`);return x;}
  function orderStatus(s,orderId){
    const o=lookup(s,'orders',orderId),a=s.assignments.filter(x=>x.orderId===o.id),d=s.datasets.filter(x=>x.orderId===o.id);
    if(o.status==='Delivered')return;
    if(a.length&&a.every(x=>x.status==='Completed'))o.status=d.reduce((n,x)=>n+x.total,0)>=o.quantity?'Ready to deliver':'Planned';
    else if(d.some(x=>x.status==='Needs review'))o.status='Quality review';
    else if(a.some(x=>x.status==='Capturing'))o.status='Collecting';
    else if(a.length)o.status='Planned';
  }
  function newOrder(s,p){
    env(s,p.envId);ensure(['Low','Medium','High'].includes(p.priority),'Choose a valid priority.');
    const o={id:id(s,'DO'),title:text(p.title,3,100),buyer:text(p.buyer,2,80),envId:p.envId,quantity:count(p.quantity),priority:p.priority,notes:text(p.notes||'No additional requirements.',1,2000),due:p.due||'2026-10-16',source:p.source||'Buyer brief',status:'Requested',createdAt:timestamp()};
    ensure(/^\d{4}-\d{2}-\d{2}$/.test(o.due),'Select a valid due date.');s.orders.unshift(o);event(s,'Order','Demo data order created',o.title,'orders',o.id);return o;
  }
  function newAssignment(s,p){
    const e=env(s,p.envId);lookup(s,'operators',p.operatorId);const o=lookup(s,'orders',p.orderId);ensure(o.envId===e.id,'The assignment environment must match the order.');
    const space=text(p.space||e.captureSpace,2,40);ensure(space!==e.holdoutSpace,'Held-out evaluation rooms cannot be used for training collection.');
    const a={id:id(s,'AS'),orderId:o.id,envId:e.id,operatorId:p.operatorId,title:text(p.title,3,100),quantity:count(p.quantity,10000),variant:text(p.variant,3,1500),space,scheduled:p.scheduled||'2026-09-24T09:00',status:'Assigned',consent:!!p.consent,safety:!!p.safety,createdAt:timestamp()};s.assignments.unshift(a);orderStatus(s,o.id);event(s,'Assignment','Human assignment scheduled',`${a.title} • ${a.quantity} demo episodes`,'humans',a.id);return a;
  }
  function plan(s,orderId,space,brief){
    const o=lookup(s,'orders',orderId),e=env(s,o.envId);ensure(!s.assignments.some(x=>x.orderId===o.id),'This order already has assignments. Add or edit individual assignments instead.');
    if(space){ensure(space!==e.holdoutSpace,'Held-out evaluation rooms cannot be used for training collection.');ensure(Array.from({length:e.spaces},(_,i)=>e.prefix+'-'+(101+i)).includes(space),'Choose an available training room in this environment.');}
    const n=o.quantity===1?1:2;for(let i=0;i<n;i++)newAssignment(s,{orderId:o.id,envId:e.id,operatorId:s.operators[i].id,title:e.tasks[0]+(n>1?` • variant ${i+1}`:''),quantity:i===0?Math.ceil(o.quantity/n):Math.floor(o.quantity/n),variant:(brief?text(brief,3,1400)+' / ':'')+e.variants[i]+`. Configure lighting at ${e.config.lux} lux; ${e.config.clutter.toLowerCase()} clutter. Stage props before capture. Keep ${e.holdoutSpace} reserved for evaluation.`,space:space||e.prefix+'-10'+(i+1),consent:true,safety:true});
    return o;
  }
  function start(s,assignmentId){const a=lookup(s,'assignments',assignmentId);ensure(a.status==='Assigned','Only an assigned session can start.');ensure(a.consent&&a.safety,'Confirm participant consent and the safety review before capture.');a.status='Capturing';a.startedAt=timestamp();orderStatus(s,a.orderId);event(s,'Capture','Demo capture started',a.title,'humans',a.id);return a;}
  function capture(s,assignmentId){const a=lookup(s,'assignments',assignmentId);ensure(a.status==='Capturing','Start this capture session first.');const d={id:id(s,'DS'),assignmentId:a.id,orderId:a.orderId,envId:a.envId,name:a.title+' • batch',total:a.quantity,accepted:0,rejected:0,flagged:Math.max(1,Math.floor(a.quantity*.06)),status:'Needs review',split:'Training',source:'Synthetic demo metadata',space:a.space,captureDesign:a.captureDesign?clone(a.captureDesign):null,createdAt:timestamp()};s.datasets.unshift(d);a.datasetId=d.id;a.status='Quality review';orderStatus(s,a.orderId);event(s,'Quality','Capture batch ready for review',`${d.total} synthetic episode records • ${d.id}`,'datasets',d.id);return d;}
  function qa(s,p){const d=lookup(s,'datasets',p.id);ensure(d.status==='Needs review','This batch has already been reviewed.');const accepted=Number(p.accepted);ensure(Number.isInteger(accepted)&&accepted>=0&&accepted<=d.total,'Accepted episodes must be between zero and the batch total.');ensure(p.reviewed,'Confirm that the demo review is complete.');const note=text(p.note,3,1000);d.accepted=accepted;d.rejected=d.total-accepted;d.status=accepted>0?'Released':'Rejected';d.reviewer='Demo operator';d.qaNote=note;d.reviewedAt=timestamp();lookup(s,'assignments',d.assignmentId).status='Completed';orderStatus(s,d.orderId);event(s,'Quality','Demo QA decision recorded',`${accepted} accepted / ${d.rejected} rejected • ${d.id}`,'datasets',d.id);return d;}
  function handoff(s,orderId){
    const o=lookup(s,'orders',orderId),datasets=s.datasets.filter(x=>x.orderId===o.id&&x.status==='Released');ensure(datasets.length,'Release at least one batch before a lab training handoff.');
    ensure(!s.handoffs.some(x=>x.orderId===o.id),'A training handoff is already recorded for this order.');
    const h={id:id(s,'TR'),orderId:o.id,envId:o.envId,version:o.source==='Evaluation feedback'?'Embodied-01 v0.4':'Embodied-01 v0.3',datasetIds:datasets.map(x=>x.id),episodes:datasets.reduce((n,x)=>n+x.accepted,0),status:'Lab return simulated',createdAt:timestamp(),note:'Workflow simulation only. No model was trained or model weights created.'};s.handoffs.unshift(h);event(s,'Training','Lab training handoff simulated',`${h.episodes} accepted demo episodes • ${h.id}`,'training',o.id);return h;
  }
  function evaluate(s,p){
    const e=env(s,p.envId);ensure(['baseline','improved','stress'].includes(p.scenario),'Choose a simulation scenario.');
    const profile={baseline:[76,14,0,162],improved:[94,4,0,132],stress:[82,9,1,174]}[p.scenario];
    const r={id:id(s,'EV'),envId:e.id,name:text(p.name||e.name+' evaluation',3,100),model:text(p.model||'Embodied-01 v0.4',3,80),suite:e.prefix+'-HOLDOUT-01',trials:100,successes:profile[0],interventions:profile[1],safetyStops:profile[2],avgSeconds:profile[3],passed:profile[0]>=90&&profile[1]<=5&&profile[2]===0,source:'Simulated benchmark',createdAt:timestamp()};s.evaluations.unshift(r);event(s,'Evaluation',r.passed?'Illustrative evaluation passed':'Illustrative evaluation needs work',`${r.successes}/${r.trials} trials • ${r.id}`,'evaluations',r.id);return r;
  }
  function recFromEval(s,evalId){const r=lookup(s,'evaluations',evalId);ensure(!r.passed,'This benchmark passed. Use deployment feedback to request further collection.');const existing=s.recommendations.find(x=>x.evalId===r.id);if(existing)return existing;const e=env(s,r.envId);const c={id:id(s,'RC'),envId:e.id,title:e.variants[0],reason:`${r.model}: ${r.successes} of ${r.trials} trials succeeded; ${r.interventions} interventions. Collect matched recovery variations, not held-out episodes.`,coverage:r.successes,impact:5,demand:4,priority:'High',quantity:24,status:'Suggested',evalId:r.id};s.recommendations.unshift(c);event(s,'Feedback','Evaluation gap converted to collection request',c.title,'proactive',c.id);return c;}
  function approveRec(s,recId){const r=lookup(s,'recommendations',recId);ensure(r.status==='Suggested','This recommendation has already been actioned.');const o=newOrder(s,{title:r.title,buyer:'Metari research (demo)',envId:r.envId,quantity:r.quantity,priority:r.priority,notes:r.reason,source:'Evaluation feedback'});plan(s,o.id);r.status='Scheduled';r.orderId=o.id;event(s,'Feedback','Proactive campaign approved',`${r.title} • assignments created`,'humans',s.assignments.find(x=>x.orderId===o.id).id);return o;}
  function pilot(s,p){const r=lookup(s,'evaluations',p.evaluationId);ensure(r.passed,'A passing held-out evaluation is required before a pilot can be proposed.');ensure(!s.pilots.some(x=>x.evaluationId===r.id),'This evaluation already has a pilot proposal.');const x={id:id(s,'DP'),envId:r.envId,evaluationId:r.id,site:text(p.site||'Operator Sandbox B',3,80),capability:r.name,status:'Ready for review',approved:false,createdAt:timestamp()};s.pilots.unshift(x);event(s,'Deployment','Demo pilot proposal created',x.capability,'deployments',x.id);return x;}
  const LOOP_STEPS=[
    ['Configure & assign','Create two room-reset assignments from the buyer brief.'],
    ['Capture variations','Simulate consented human demonstrations in training rooms.'],
    ['Review & release','Apply a demo quality review and release a training manifest.'],
    ['Lab training handoff','Simulate sending accepted metadata to the buyer’s training pipeline.'],
    ['Evaluate holdout','Run the baseline demo against reserved evaluation rooms.'],
    ['Diagnose & request','Convert the failed evaluation into a targeted collection campaign.'],
    ['Collect & return','Simulate recovery demonstrations, QA and a second lab handoff.'],
    ['Re-evaluate','Run the improved illustrative model on the same held-out suite.']
  ];
  function advance(s){
    const l=s.loop;ensure(l.phase<8,'The linked scenario is complete. Reset demo data to run it from the beginning.');let result;
    switch(l.phase){
      case 0: if(!s.assignments.some(x=>x.orderId===l.orderId))plan(s,l.orderId);break;
      case 1: s.assignments.filter(x=>x.orderId===l.orderId).forEach(a=>{if(a.status==='Assigned'){a.consent=true;a.safety=true;start(s,a.id);}if(a.status==='Capturing')capture(s,a.id);});break;
      case 2: s.datasets.filter(x=>x.orderId===l.orderId&&x.status==='Needs review').forEach(d=>qa(s,{id:d.id,accepted:Math.max(0,d.total-1),reviewed:true,note:'Demonstration-only review: exclude one staged occlusion case per batch.'}));break;
      case 3: if(!s.handoffs.some(x=>x.orderId===l.orderId))handoff(s,l.orderId);break;
      case 4: result=evaluate(s,{envId:'guest',scenario:'baseline',model:'Embodied-01 v0.3',name:'Room-turn • baseline holdout'});l.baselineId=result.id;break;
      case 5: result=recFromEval(s,l.baselineId);l.recoveryOrderId=approveRec(s,result.id).id;break;
      case 6: s.assignments.filter(x=>x.orderId===l.recoveryOrderId).forEach(a=>{if(a.status==='Assigned'){a.consent=true;a.safety=true;start(s,a.id);}if(a.status==='Capturing')capture(s,a.id);if(a.datasetId){const d=lookup(s,'datasets',a.datasetId);if(d.status==='Needs review')qa(s,{id:d.id,accepted:d.total-1,reviewed:true,note:'Demonstration-only QA of targeted recovery variations. Held-out rooms excluded.'});}});if(!s.handoffs.some(x=>x.orderId===l.recoveryOrderId))handoff(s,l.recoveryOrderId);break;
      case 7: result=evaluate(s,{envId:'guest',scenario:'improved',model:'Embodied-01 v0.4',name:'Room-turn • recovery holdout'});l.retestId=result.id;break;
    }
    l.history.push({phase:l.phase,title:LOOP_STEPS[l.phase][0],at:timestamp()});l.phase++;return l;
  }
  function reduce(state,type,p={}){
    const s=clone(state);let result;
    switch(type){
      case 'saveCameraDesign':{ensure(root.MetariInstrumentation,'Capture design engine unavailable.');result=root.MetariInstrumentation.updateInState(s,p);event(s,'Environment','Camera design revision saved',`${result.room} • R${result.revision} • ${result.note}`,'instrumentation',result.envId+'|'+result.room);break;}
      case 'resetCameraDesign':{ensure(root.MetariInstrumentation,'Capture design engine unavailable.');result=root.MetariInstrumentation.resetInState(s,p);event(s,'Environment','Capture design defaults restored',`${result.room} • R${result.revision}; prior revisions preserved`,'instrumentation',result.envId+'|'+result.room);break;}
      case 'createInstrumentedCampaign':{
        ensure(root.MetariInstrumentation,'Capture design engine unavailable.');
        const spec=root.MetariInstrumentation.campaignSpec(s,p);
        const o=newOrder(s,{...p,envId:spec.envId,buyer:'Metari Research · fictional',source:'Capture design',due:p.due||'2026-10-15'});
        plan(s,o.id,spec.room,p.notes);o.captureDesign=clone(spec);
        s.assignments.filter(a=>a.orderId===o.id).forEach(a=>{a.captureDesign=clone(spec);a.consent=false;a.safety=false;});
        event(s,'Assignment','Capture design linked to collection',`${spec.room} • R${spec.revision} • ${spec.focusZoneName}; consent and safety review still required`,'orders',o.id);result=o;break;
      }
      case 'createOrder':result=newOrder(s,p);break;
      case 'planOrder':result=plan(s,p.id,p.space,p.brief);break;
      case 'createAssignment':result=newAssignment(s,p);break;
      case 'editAssignment':{const a=lookup(s,'assignments',p.id);ensure(a.status==='Assigned','Only queued assignments can be edited.');lookup(s,'operators',p.operatorId);a.operatorId=p.operatorId;a.variant=text(p.variant,3,1500);a.scheduled=p.scheduled;a.consent=!!p.consent;a.safety=!!p.safety;result=a;event(s,'Assignment','Assignment updated',a.title,'humans',a.id);break;}
      case 'startAssignment':result=start(s,p.id);break;
      case 'completeCapture':result=capture(s,p.id);break;
      case 'reviewDataset':result=qa(s,p);break;
      case 'deliverOrder':{const o=lookup(s,'orders',p.id);ensure(o.status==='Ready to deliver','Complete collection and QA before delivery.');ensure(s.datasets.some(x=>x.orderId===o.id&&x.accepted>0),'No accepted episodes to deliver.');o.status='Delivered';result=o;event(s,'Delivery','Demo manifest marked delivered',o.title,'orders',o.id);break;}
      case 'handoff':result=handoff(s,p.id);break;
      case 'evaluate':result=evaluate(s,p);break;
      case 'recommendFromEval':result=recFromEval(s,p.id);break;
      case 'approveRecommendation':result=approveRec(s,p.id);break;
      case 'dismissRecommendation':{const r=lookup(s,'recommendations',p.id);ensure(r.status==='Suggested','Only suggested campaigns can be dismissed.');r.status='Dismissed';result=r;event(s,'Feedback','Collection recommendation dismissed',r.title,'proactive',r.id);break;}
      case 'scan':s.lastScan=timestamp();s.recommendations.forEach(r=>{r.score=Math.round((100-r.coverage)*r.impact*r.demand/20);});s.recommendations.sort((a,b)=>(b.score||0)-(a.score||0));event(s,'Analysis','Coverage scan completed','Deterministic demo ranking: gap × impact × buyer demand.','proactive','');break;
      case 'configureEnvironment':{const e=env(s,p.id);const lux=Number(p.lux);ensure(Number.isInteger(lux)&&lux>=50&&lux<=1200,'Lighting must be 50–1,200 lux.');ensure(['Low','Moderate','High'].includes(p.clutter),'Choose a clutter preset.');ensure(['Standard','Alternate','Accessible'].includes(p.layout),'Choose a layout preset.');e.config={lux,clutter:p.clutter,layout:p.layout,surface:text(p.surface||'Default',1,80)};result=e;event(s,'Environment','Environment configuration updated',`${e.name}: ${lux} lux, ${p.layout.toLowerCase()} layout`,'environments',e.id);break;}
      case 'createPilot':result=pilot(s,p);break;
      case 'approvePilot':{const x=lookup(s,'pilots',p.id);ensure(p.checked,'Acknowledge safety and operator review before starting a simulated pilot.');ensure(lookup(s,'evaluations',x.evaluationId).passed,'A passing evaluation is required.');ensure(x.status==='Ready for review','This pilot has already been started.');x.status='Simulated pilot';x.approved=true;result=x;event(s,'Deployment','Pilot simulation started',x.site,'deployments',x.id);break;}
      case 'pausePilot':{const x=lookup(s,'pilots',p.id);ensure(x.status==='Simulated pilot'||x.status==='Paused','Start the pilot before pausing it.');x.status=x.status==='Paused'?'Simulated pilot':'Paused';result=x;event(s,'Deployment','Pilot simulation '+x.status.toLowerCase(),x.site,'deployments',x.id);break;}
      case 'pilotFeedback':{const x=lookup(s,'pilots',p.id);ensure(x.approved,'Start the simulated pilot before recording field feedback.');const r={id:id(s,'RC'),envId:x.envId,title:text(p.title,3,100),reason:text(p.reason,3,1000),coverage:55,impact:4,demand:3,priority:'High',quantity:20,status:'Suggested',pilotId:x.id};s.recommendations.unshift(r);result=r;event(s,'Feedback','Field feedback opened a collection gap',r.title,'proactive',r.id);break;}
      case 'createSite':{const x={id:id(s,'SITE'),name:text(p.name,3,80),region:text(p.region,2,80),type:p.type||'Campus',status:'Concept',x:50,y:50};s.sites.push(x);result=x;event(s,'Network','Concept site added',x.name,'network',x.id);break;}
      case 'settings':s.settings={...s.settings,...p};break;
      case 'advanceLoop':result=advance(s);break;
      default:throw new Error('Unknown action: '+type);
    }
    return {state:s,result};
  }
  function metrics(s){const accepted=s.datasets.reduce((n,x)=>n+x.accepted,0),reviewed=s.datasets.reduce((n,x)=>n+x.accepted+x.rejected,0);return {environments:s.environments.length,orders:s.orders.filter(x=>x.status!=='Delivered').length,active:s.assignments.filter(x=>x.status==='Capturing').length,queued:s.assignments.filter(x=>x.status==='Assigned').length,accepted,reviewed,quality:reviewed?Math.round(accepted/reviewed*1000)/10:0,evals:s.evaluations.length,passed:s.evaluations.filter(x=>x.passed).length};}
  function exportManifest(s,datasetId){
    const d=lookup(s,'datasets',datasetId),e=env(s,d.envId),a=s.assignments.find(x=>x.id===d.assignmentId);
    return {schema:'metari.demo.dataset-manifest.v3',disclaimer:'ILLUSTRATIVE PROTOTYPE. Synthetic episode metadata only; not a real robot training dataset. Concept video previews are not captured episodes.',...clone(d),environment:e.name,training_space:d.space||a?.space||e.captureSpace,held_out_space:e.holdoutSpace,modalities:['RGB (concept preview)','Depth (not connected)','Pose (not connected)'],lineage:{orderId:d.orderId,assignmentId:d.assignmentId,captureDesignId:d.captureDesign?.designId||null,captureDesignRevision:d.captureDesign?.revision||null},consent:'Simulated review flag; not an actual consent record',modelWeights:null,actualEpisodeFiles:[],exportedAt:timestamp()};
  }

  const api={VERSION,createState,reduce,metrics,exportManifest,LOOP_STEPS};
  root.MetariCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

