
/* Metari v8: dependency-free spatial renderer and showroom domain model.
 * 3D coordinates, orthographic orbit, depth-sorted faces and screen-space picking.
 * Concept architecture, invented robot forms and simulated overlays ONLY.
 * Not a scan, sensor readout, manufacturer spec or deployment authorization.
 */
(function(root){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ROOMS=[
 {id:'kitchen',floor:0,x:-16.5,z:-8,w:8,d:6.5,label:'Kitchen lab'},
 {id:'boh',floor:0,x:-7.5,z:-8,w:5,d:6.5,label:'Back of house'},
 {id:'maintenance',floor:0,x:-1.5,z:-8,w:5,d:6.5,label:'Maintenance'},
 {id:'warehouse',floor:0,x:4.5,z:-8,w:5.3,d:6.5,label:'Warehouse'},
 {id:'loading',floor:0,x:10.7,z:-8,w:5.8,d:6.5,label:'Loading dock'},
 {id:'lobby',floor:0,x:-16.5,z:1.5,w:8,d:6.5,label:'Arrival lobby'},
 {id:'cafe',floor:0,x:-7.5,z:1.5,w:7.5,d:6.5,label:'Restaurant & café'},
 {id:'retail',floor:0,x:1,z:1.5,w:6.7,d:6.5,label:'Retail test set'},
 {id:'showroom',floor:0,x:8.7,z:1.5,w:7.8,d:6.5,label:'Humanoid gallery'},
 {id:'banquet',floor:1,x:-16.5,z:-8,w:14.5,d:6.5,label:'Banquet & events'},
 {id:'office',floor:1,x:-1,z:-8,w:17.5,d:6.5,label:'Office lab'},
 {id:'laundry',floor:1,x:-16.5,z:1.5,w:10.5,d:6.5,label:'Laundry'},
 {id:'corridor',floor:1,x:-5,z:1.5,w:9,d:6.5,label:'Corridor test set'},
 {id:'stairs',floor:1,x:5,z:1.5,w:5,d:6.5,label:'Stairs & landings'},
 {id:'elevator',floor:1,x:11,z:1.5,w:5.5,d:6.5,label:'Elevators'},
 {id:'guest',floor:2,x:-16.5,z:-8,w:15.5,d:6.5,label:'Guest rooms'},
 {id:'bathroom',floor:2,x:0,z:-8,w:16.5,d:6.5,label:'Bathroom test set'},
 {id:'senior',floor:2,x:-16.5,z:1.5,w:15.5,d:6.5,label:'Accessible living'},
 {id:'residential',floor:2,x:0,z:1.5,w:16.5,d:6.5,label:'Residential'},
 {id:'pool',floor:-1,x:19.3,z:-6,w:7.4,d:12,label:'Pool & terrace'},
 {id:'garden',floor:-1,x:-26.8,z:-6,w:7.4,d:12,label:'Gardens & grounds'}
];
const FLOORS=[{id:0,label:'01',name:'Experience & operations',copy:'Buyer gallery, service labs and dispatch'}, {id:1,label:'02',name:'Task laboratories',copy:'Reset, mobility and shared environments'}, {id:2,label:'03',name:'Living environments',copy:'Guest, bathroom and residential test sets'}];
const ROBOTS=[
 {id:'service',code:'S—01',name:'Service',color:'#d8e1df',accent:'#30dfb8',env:'guest',focus:'Room reset & service handoff',task:'Supervised guest-room reset',form:'Balanced, full-height concept',height:1.72,build:'balanced',route:'Guest Room → Human ops → QA',material:'Pearl / graphite',brief:'Explore linen handling, amenity handoff and guest-room choreography.',limits:'Requires task-specific tests. No cleaning autonomy or payload claim.',checks:['Linen and amenity placement','Human approach and handoff','Recovery after an obstructed reach']},
 {id:'dexterity',code:'D—02',name:'Dexterity',color:'#bacad8',accent:'#7cbef2',env:'laundry',focus:'Small objects & textiles',task:'Linen fold and placement',form:'Compact manipulation concept',height:1.55,build:'compact',route:'Laundry → Capture & QA → Evaluation',material:'Mist / graphite',brief:'Explore precise object placement and variations in soft-material handling.',limits:'A visual archetype, not an existing dexterous robot specification.',checks:['Fold consistency across variants','Placement within target regions','Dropped-item recovery and human intervention']},
 {id:'mobility',code:'M—03',name:'Mobility',color:'#303f4a',accent:'#68dccb',env:'corridor',focus:'Routes, thresholds & carts',task:'Service-cart route',form:'Tall articulated concept',height:1.84,build:'tall',route:'Corridor → Camera layout → Held-out test',material:'Graphite / mint',brief:'Explore navigation in narrow corridors and supervised cart-handling tasks.',limits:'Stair traversal, autonomous navigation and safety are unverified.',checks:['Threshold approach and stop behavior','Passing and yielding to staff','Intervention-free route completion']},
 {id:'handling',code:'H—04',name:'Handling',color:'#d9cbb2',accent:'#d5b27d',env:'warehouse',focus:'Inventory, totes & staging',task:'Shelf-to-tote transfer',form:'Broad-frame handling concept',height:1.77,build:'broad',route:'Warehouse → Buyer evaluation → Pilot scope',material:'Champagne / graphite',brief:'Explore lightweight stock transfer, staging and orderly task completion.',limits:'No payload, endurance or throughput has been validated.',checks:['Object identification and placement','Reach and aisle clearance','Mis-pick detection and operator recovery']}
];
function project(point,view,w,h){
 const yaw=view.yaw??-.58,pitch=view.pitch??.78,scale=view.scale??10;
 const [x,y,z]=point,xx=x*Math.cos(yaw)-z*Math.sin(yaw),zz=x*Math.sin(yaw)+z*Math.cos(yaw);
 return [w/2+(xx+(view.panX||0))*scale,h*(view.centerY??.57)+(zz*Math.sin(pitch)-(y-(view.anchorY||0))*Math.cos(pitch)+(view.panY||0))*scale,zz*Math.cos(pitch)+y*Math.sin(pitch)];
}
function insidePoly(x,y,ps){let b=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const [xi,yi]=ps[i],[xj,yj]=ps[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))b=!b;}return b;}
function parseHex(s){s=s.replace('#','');return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];}
function tint(s,v){return 'rgb('+parseHex(s).map(x=>clamp(Math.round(x*v),0,255)).join(',')+')';}
function validatePlan(input,envs){
 if(!input||!Array.isArray(input.models)||input.models.length<1||input.models.length>3)throw Error('Select one to three concept models.');
 const models=[...new Set(input.models)];if(models.length!==input.models.length||models.some(id=>!ROBOTS.some(r=>r.id===id)))throw Error('Select valid, distinct concept models.');
 const e=envs.find(e=>e.id===input.envId);if(!e)throw Error('Select a valid environment.');
 const room=String(input.room||'');const valid=Array.from({length:e.spaces},(_,i)=>e.prefix+'-'+(101+i));
 if(!valid.includes(room))throw Error('Use a training/demo room. Held-out rooms are not showroom demonstration sets.');
 const repeats=Number(input.repeats);if(!Number.isInteger(repeats)||repeats<1||repeats>200)throw Error('Enter 1–200 planned trials.');
 const goal=String(input.goal||'').trim();if(goal.length<12||goal.length>1200)throw Error('Describe the task and acceptance criteria in 12–1,200 characters.');
 if(input.ack!==true)throw Error('Acknowledge that this is a planning brief, not a passed evaluation or live deployment.');
 return {models,envId:e.id,room,repeats,goal,stage:'Evaluation required',operatorApproval:false,independentEvaluation:false,manufacturerConfirmation:false,physicalDeployment:false};
}
function addPlan(state,input){const draft=validatePlan(input,state.environments),plans=state.showroomPlans||[],id='SR-'+String(plans.length+1).padStart(4,'0');return {...draft,id,createdAt:new Date().toISOString(),source:'Fictional showroom archetypes',disclaimer:'Planning simulation only. No hardware is reserved, ordered or deployed. No manufacturer or safety approval.'};}
function model(id){const x=ROBOTS.find(r=>r.id===id);if(!x)throw Error('Unknown concept model.');return x;}
function toggleCompare(ids,id){model(id);if(ids.includes(id))return ids.filter(x=>x!==id);if(ids.length>=3)throw Error('Compare up to three concepts. Remove one to add another.');return ids.concat([id]);}

function makeRenderer(host,config){
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false}),labels=host.querySelector('.v8-scene-labels');
 if(!ctx){host.classList.add('v8-render-unavailable');return {destroy(){},refresh(){},getView:()=>({})};}
 const type=config.type||'campus',shared=config.view,view=Object.assign({yaw:type==='campus'?-.58:-.08,pitch:type==='campus'?.73:.16,centerY:type==='campus'?.5:.57,zoom:1,panX:0,panY:0,floor:'all',spread:.8,labels:true,rotate:false,selected:null,focusModel:null},shared||{});
 let w=800,h=560,scale=10,raf=0,disposed=false,lastFrame=0,dirty=true,polys=[],hits=[],rings=[],nodes=[],labelTargets=[],hover=null,hoverXY=null,gesture=null,lastTime=0,drawFloor=-3,drawLayer=0;const pointers=new Map();
 const debug={frames:0,faces:0,running:false,kind:type,view};host.__metariScene=debug;
 const provider=()=>config.data?config.data():{};
 function sync(){if(shared)Object.assign(shared,view);debug.view={...view};}
 function P(p){return project(p,{...view,scale},w,h);}
 function poly(vs,color,id=null,alpha=1,edge=null){const ps=vs.map(P);polys.push({ps,color,id,alpha,edge,depth:ps.reduce((n,p)=>n+p[2],0)/ps.length,kind:'poly',floor:drawFloor,layer:drawLayer});}
 function box(x,y,z,bw,bh,bd,c,id=null,a=1){
  const vs=[[x,y,z],[x+bw,y,z],[x+bw,y,z+bd],[x,y,z+bd],[x,y+bh,z],[x+bw,y+bh,z],[x+bw,y+bh,z+bd],[x,y+bh,z+bd]];
  [[0,1,5,4,.63],[1,2,6,5,.77],[2,3,7,6,.66],[3,0,4,7,.78],[4,5,6,7,1.06]].forEach(f=>poly(f.slice(0,4).map(i=>vs[i]),tint(c,f[4]),id,a,'#142d3330'));
 }
 function sphere(x,y,z,r,c,id=null){const p=P([x,y,z]);polys.push({kind:'sphere',p,r:r*scale,color:c,id,depth:p[2]+r*.3,alpha:1,floor:drawFloor,layer:drawLayer});}
 function cylinder(x,y,z,r,height,c,id=null){
  const n=10,b=[],t=[];for(let i=0;i<n;i++){let a=i/n*Math.PI*2;b.push([x+Math.cos(a)*r,y,z+Math.sin(a)*r]);t.push([x+Math.cos(a)*r,y+height,z+Math.sin(a)*r]);}
  for(let i=0;i<n;i++){let j=(i+1)%n;poly([b[i],b[j],t[j],t[i]],tint(c,.58+.24*(.5+.5*Math.sin(i/n*6.28))),id);}
  poly(t,tint(c,1.04),id);
 }
 function segment(a,b,r,c){const mid=a.map((x,i)=>(x+b[i])/2);sphere(...a,r,c);sphere(...b,r,c);const aa=P(a),bb=P(b);polys.push({kind:'line',ps:[aa,bb],width:r*2*scale,color:c,depth:(aa[2]+bb[2])/2,floor:drawFloor,layer:drawLayer});}
 function tapered(x,y,z,bw,tw,height,depth,c,id){
  const shape=w=>[[-w/2+.045,-depth/2],[w/2-.045,-depth/2],[w/2,-depth/2+.045],[w/2,depth/2-.045],[w/2-.045,depth/2],[-w/2+.045,depth/2],[-w/2,depth/2-.045],[-w/2,-depth/2+.045]];
  const bottom=shape(bw).map(q=>[x+q[0],y,z+q[1]]),top=shape(tw).map(q=>[x+q[0],y+height,z+q[1]]);
  for(let i=0;i<8;i++){const j=(i+1)%8;poly([bottom[i],bottom[j],top[j],top[i]],tint(c,.61+.29*(.5+.5*Math.sin(i*.79))),id);}
  poly(top,tint(c,1.08),id);
 }
 function robot(x,y,z,r,small=false){
  const f=r.height/1.72,broad=r.build==='broad'?1.16:1,mat=r.color,j='#202e35',cy=t=>y+t*f,cx=t=>x+t*f*broad,cz=t=>z+t*f;
  // Purpose-built neutral robot forms, not a representation of any OEM product.
  box(cx(-.21),cy(.86),cz(-.12),.42*f*broad,.16*f,.26*f,mat,r.id);
  tapered(x,cy(1.02),z,.34*f*broad,.5*f*broad,.46*f,.29*f,mat,r.id);
  box(cx(-.13),cy(1.49),cz(-.08),.26*f,.075*f,.16*f,j,r.id);
  sphere(x,cy(1.7),z,.17*f,mat,r.id);box(cx(-.135),cy(1.64),cz(.128),.27*f,.095*f,.027*f,j,r.id);
  box(cx(-.065),cy(1.665),cz(.16),.13*f,.012*f,.018*f,r.accent,r.id);
  box(cx(-.035),cy(1.22),cz(.156),.07*f,.035*f,.018*f,r.accent,r.id);
  for(const side of [-1,1]){
   const xx=cx(side*.13);segment([xx,cy(.86),z],[xx,cy(.49),z+.02],.073*f,j);box(xx-.075*f,cy(.55),z-.055,.15*f,.27*f,.16*f,mat,r.id);
   sphere(xx,cy(.47),z+.03,.085*f,j,r.id);segment([xx,cy(.4),z+.02],[xx,cy(.12),z+.04],.066*f,mat);box(xx-.1*f,cy(.035),z-.1,.2*f,.09*f,.32*f,j,r.id);
   const ax=cx(side*.3),az=z+(r.id==='dexterity'?.07:0);
   sphere(ax,cy(1.36),az,.1*f,j,r.id);segment([ax,cy(1.32),az],[cx(side*.36),cy(1.03),az+.025],.066*f,mat);
   sphere(cx(side*.36),cy(1.01),az+.04,.067*f,j,r.id);segment([cx(side*.36),cy(.98),az+.04],[cx(side*.33),cy(.77),az+.1],.06*f,mat);
   box(cx(side*.33)-.049*f,cy(.65),az+.075,.098*f,.115*f,.07*f,j,r.id);
  }
 }
 function floorY(i){return view.floor==='all'?i*(3.3+view.spread*5):0;}
 function fixture(f,r,by,p){
  const sx=(r.w-.8)/p.width,sz=(r.d-.8)/p.depth,x=r.x+.4+f.x*sx,z=r.z+.4+f.y*sz,bw=Math.max(.18,f.w*sx),bd=Math.max(.18,f.h*sz),kind=f.kind;
  if(kind==='bed'){
   box(x,by,z,bw,.24,bd,'#5e726e');box(x,by+.24,z,bw,.24,bd,'#d7dcd4');box(x,by+.48,z+bd*.45,bw,.05,bd*.53,'#8aaba4');box(x,by+.2,z,bw,1,.13,'#8b9185');
   box(x+bw*.08,by+.49,z+.19,bw*.37,.12,Math.min(.55,bd*.21),'#e6e6da');box(x+bw*.54,by+.49,z+.19,bw*.37,.12,Math.min(.55,bd*.21),'#e6e6da');
  }else if(kind==='plant'||kind==='tree'){
   cylinder(x+bw*.5,by,z+bd*.5,.22,.25,'#727968');sphere(x+bw*.5,by+.45,z+bd*.5,Math.min(.5,bw*.35),'#55836a');
  }else if(kind==='table'||kind==='desk'||kind==='counter'||kind==='vanity'){
   const c=kind==='counter'||kind==='vanity'?'#bcc7c5':'#acb3a5';box(x,by,z,bw,.61,bd,c);box(x-.04,by+.61,z-.03,bw+.08,.06,bd+.06,'#d6dbcf');
   if(kind==='vanity'){cylinder(x+bw*.28,by+.68,z+bd*.5,Math.min(.22,bd*.28),.02,'#536f74');cylinder(x+bw*.72,by+.68,z+bd*.5,Math.min(.22,bd*.28),.02,'#536f74');}
  }else if(kind==='shower'){
   box(x,by,z,bw,.035,bd,'#b2cac7');box(x,by,z,bw,1.12,.06,'#81b4b1',null,.3);box(x,by,z,.055,1.12,bd,'#99cccd',null,.28);
  }else if(kind==='stairs'){
   for(let k=0;k<7;k++)box(x,by,z+bd*k/7,bw,.12+k*.1,bd/7,'#aebbb5');
  }else if(kind==='wc'){
   box(x,by,z,bw,.42,bd,'#cedbd6');cylinder(x+bw*.5,by+.42,z+bd*.62,Math.min(bw*.4,bd*.3),.08,'#93adaa');
  }else if(kind==='sofa'||kind==='chair'){
   box(x,by,z,bw,.39,bd,'#8aa7a1');box(x,by+.39,z,bw,.31,.14,'#648d85');
  }else if(kind==='rack'||kind==='shelf'){
   box(x,by,z,bw,.07,bd,'#758e8d');box(x,by+.5,z,bw,.055,bd,'#94a7a2');box(x,by+1,z,bw,.055,bd,'#94a7a2');box(x,by,z,.055,1.1,bd,'#728b8c');
   box(x+.12,by+.57,z+.08,Math.max(.2,bw*.4),.25,Math.max(.16,bd*.7),'#aaa990');
  }else {box(x,by,z,bw,kind==='washer'||kind==='dryer'?1:.55,bd,kind==='washer'||kind==='dryer'?'#9baeb0':'#809c9a');}
 }
 function buildCampus(t,data){
  drawFloor=-3;drawLayer=0;const isAll=view.floor==='all',isOutdoor=view.floor==='outdoor',single=!isAll&&!isOutdoor;
  view.anchorY=isAll?5.9:0;scale=Math.min(w/((isAll||isOutdoor)?66:43),h/(isAll?43:29))*view.zoom;
  // A garden plinth and a three-story cutaway, not a stack of UI cards.
  if(isAll||isOutdoor){box(-29,-.8,-12,58,.55,25,'#344c4c');box(-28.4,-.25,-11.4,56.8,.05,23.8,'#536963');
   for(let i=0;i<8;i++){
    const x=i%2?-27:27,z=-10+Math.floor(i/2)*6.3;cylinder(x,-.2,z,.13,1.5,'#79715a');
    for(let k=0;k<5;k++){const a=k*1.256+.25;poly([[x,1.25,z],[x+Math.cos(a+.35)*1.1,1.13,z+Math.sin(a+.35)*1.1],[x+Math.cos(a)*1.7,.87,z+Math.sin(a)*1.7]],'#537e63');}
   }
   box(-5,-.19,9,10,.035,2.3,'#90a193');
  }
  for(let level=0;level<3;level++){
   if(isOutdoor||single&&Number(view.floor)!==level)continue;const by=floorY(level);drawFloor=level;drawLayer=0;
   box(-18,by-.45,-9.5,36,.4,19,'#536f70');box(-17.7,by-.05,-9.2,35.4,.06,18.4,'#a4b4a7');
   box(-18,by-.05,-9.5,36,.75,.15,'#acc1b6');box(-18,by-.05,9.35,36,.18,.15,'#83a39d');
   for(const x of [-17.8,0,17.55]){box(x,by-.05,-9.3,.23,1.1,.23,'#b1c1b2');box(x,by-.05,9,.23,1.1,.23,'#a8bfb3');}
   // Thin teal rails communicate the separated floor plate.
   poly([[-18,by-.22,9.52],[18,by-.22,9.52],[18,by-.18,9.52],[-18,by-.18,9.52]],'#51ccb2');
  }
  const selectedRooms=ROOMS.filter(r=>r.floor<0?(isAll||isOutdoor):(isAll||Number(view.floor)===r.floor));
  for(const [i,r] of selectedRooms.entries()){
   drawFloor=r.floor;drawLayer=1;const by=r.floor<0?-.16:floorY(r.floor)+.035,e=data.state?.environments.find(e=>e.id===r.id),p=root.MetariPlans?.[r.id];
   if(r.floor<0){
    if(r.id==='pool'){box(r.x,by,r.z,r.w,.03,r.d,'#b0bcb0',r.id);box(r.x+1,by+.045,r.z+1,r.w-2,.02,r.d-2,'#236e7a',r.id);for(let k=0;k<3;k++)box(r.x+.14,by+.09,r.z+1+k*3,.58,.12,1.6,'#d0d7c8',r.id);}
    else{box(r.x,by,r.z,r.w,.04,r.d,'#557d67',r.id);for(let k=0;k<5;k++){box(r.x+.6,by+.05,r.z+.8+k*2,3,.24,1,'#78836d',r.id);sphere(r.x+2,by+.44,r.z+1.3+k*2,.46,'#7a9d76');}}
   }else{
    box(r.x,by,r.z,r.w,.055,r.d,r.id==='showroom'?'#b5ccba':'#b0bcb0',r.id);
    drawLayer=2;box(r.x,by+.055,r.z,.1,.58,r.d,'#a7bdb4',r.id);box(r.x,by+.055,r.z,r.w,.58,.1,'#becdbf',r.id);
    if(r.id==='showroom'){
     for(let k=0;k<3;k++){cylinder(r.x+1.5+k*2.2,by+.08,r.z+2,.72,.12,'#cfdfd2',r.id);const rr=ROBOTS[k];robot(r.x+1.5+k*2.2,by+.2,r.z+2,{...rr,height:1.35});}
     box(r.x+1,by+.08,r.z+4.7,r.w-2,.48,.75,'#718d86',r.id);
    }else if(p){
     p.fixtures.slice(0,9).forEach(f=>fixture(f,r,by+.09,p));
     p.walls.slice(0,3).forEach(a=>{const sx=(r.w-.8)/p.width,sz=(r.d-.8)/p.depth;box(r.x+.4+Math.min(a[0],a[2])*sx,by+.06,r.z+.4+Math.min(a[1],a[3])*sz,Math.max(.1,Math.abs(a[2]-a[0])*sx),.65,Math.max(.1,Math.abs(a[3]-a[1])*sz),'#93aaa1');});
    }
   }
   const top=[[r.x,by+.071,r.z],[r.x+r.w,by+.071,r.z],[r.x+r.w,by+.071,r.z+r.d],[r.x,by+.071,r.z+r.d]];
   // Record pick polygons independent of decorative meshes so a table does not steal clicks.
   const ps=top.map(P);hits.push({id:r.id,ps,floor:r.floor??0,depth:ps.reduce((n,p)=>n+p[2],0)/4});
   const n=r.id==='showroom'?.66:(data.intensity?data.intensity(r.id):.45);
   const center=[r.x+r.w*.56,by+.8,r.z+r.d*.52],c=P(center);nodes.push({id:r.id,label:r.label,p:c,floor:r.floor,w:r.w});
   if(data.heat!==false)rings.push({p:c,r:Math.max(20,Math.min(r.w,r.d)*scale*.65),n,mode:data.mode||'thermal',i});
   if(data.cameras&&p){const cam=p.cameras[0],point=P([r.x+.4+cam.x/p.width*(r.w-.8),by+1.05,r.z+.4+cam.y/p.depth*(r.d-.8)]);nodes.push({id:r.id,kind:'camera',label:cam.id,p:point});}
  }
 }
 function buildShowroom(t,data){
  drawFloor=0;drawLayer=0;view.anchorY=.74;
  const focus=view.focusModel||(w<600?data.selected:null),rs=focus?[model(focus)]:ROBOTS;
  scale=(focus?Math.min(w/3.8,h/3.4):Math.min(w/14.5,h/4.4))*view.zoom;
  box(-7,-.24,-2.9,14,.24,5.8,'#718c84');box(-7,0,-2.9,14,2.65,.13,'#203a40');
  box(-7,2.55,-2.7,14,.035,.05,'#a4c6ae');
  for(let j=0;j<9;j++)box(-6.85+j*1.7,0,-2.74,.025,2.6,.03,'#59756b');
  box(-6.8,.05,-2.65,13.6,.045,.08,'#79c9ad');
  for(let i=0;i<rs.length;i++){
   const r=rs[i],x=focus?0:-4.8+i*3.2,z=0,sel=data.selected===r.id;
   drawLayer=1;cylinder(x,0,z,focus?1.35:1.1,.18,sel?'#b7d6c4':'#b1c5b6',r.id);
   cylinder(x,.18,z,focus?1.33:1.08,.026,sel?r.accent:'#d1dfd0',r.id);drawLayer=2;robot(x,.206,z,r);
   const point=P([x,.2,1.06]);nodes.push({id:r.id,label:r.code+' / '+r.name,p:point});
   const ps=[[x-1.2,0,-1.1],[x+1.2,0,-1.1],[x+1.2,0,1.1],[x-1.2,0,1.1]].map(P);hits.push({id:r.id,ps,floor:r.floor??0,depth:ps.reduce((n,p)=>n+p[2],0)/4});
   // Upright body hit region, so the figure and the podium both select the concept.
   const head=P([x,2.1,0]),foot=P([x,0,0]),bw=scale*.65;hits.push({id:r.id,ps:[[head[0]-bw,head[1]-scale*.2],[head[0]+bw,head[1]-scale*.2],[foot[0]+bw,foot[1]],[foot[0]-bw,foot[1]]],depth:foot[2]+1});
  }
 }
 function drawFaces(){
  polys.sort((a,b)=>(a.floor-b.floor)||(a.layer-b.layer)||(a.depth-b.depth));
  for(const f of polys){ctx.globalAlpha=f.alpha??1;
   if(f.kind==='sphere'){
    const [x,y]=f.p,grad=ctx.createRadialGradient(x-f.r*.3,y-f.r*.4,0,x,y,f.r);grad.addColorStop(0,tint(f.color,1.22));grad.addColorStop(.6,f.color);grad.addColorStop(1,tint(f.color,.55));ctx.beginPath();ctx.arc(x,y,f.r,0,6.283);ctx.fillStyle=grad;ctx.fill();
   }else if(f.kind==='line'){ctx.beginPath();ctx.moveTo(f.ps[0][0],f.ps[0][1]);ctx.lineTo(f.ps[1][0],f.ps[1][1]);ctx.strokeStyle=f.color;ctx.lineWidth=f.width;ctx.lineCap='round';ctx.stroke();
   }else{ctx.beginPath();f.ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();if(f.edge){ctx.lineWidth=.55;ctx.strokeStyle=f.edge;ctx.stroke();}}
  }ctx.globalAlpha=1;debug.faces=polys.length;
 }
 function drawOverlay(t,data){
  const moving=!data.paused,pulse=moving?.91+.09*Math.sin(t/920):.93;
  if(type==='campus'){
   for(const n of rings){
    let r=n.r*pulse,x=n.p[0],y=n.p[1],g=ctx.createRadialGradient(x,y,0,x,y,r);
    if(n.mode==='coverage'){g.addColorStop(0,'#5cf5ba66');g.addColorStop(.5,'#24d2c331');}
    else if(n.mode==='gaps'){g.addColorStop(0,n.n>.4?'#ffad6266':'#24bba222');g.addColorStop(.45,'#d69b3930');}
    else{g.addColorStop(0,n.n>.58?'#ff754088':'#4be8ce77');g.addColorStop(.2,n.n>.58?'#f5da6570':'#3cd8c450');g.addColorStop(.49,'#1cdaa644');g.addColorStop(.76,'#12b6b01a');}
    g.addColorStop(1,'#0db4b000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    if(moving&&n.n>.6){ctx.beginPath();ctx.ellipse(x,y,r*(.4+.2*Math.sin(t/1250+n.i)),r*.22,0,0,Math.PI*2);ctx.strokeStyle='#6cffe043';ctx.lineWidth=1;ctx.stroke();}
   }
   if(data.paths){
    for(const floor of [0,1,2]){if(view.floor!=='all'&&Number(view.floor)!==floor)continue;const yy=floorY(floor)+.82,points=[[-16,yy,0],[-8,yy,0],[0,yy,0],[8,yy,0],[16,yy,0]].map(P);
     ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='#1ff2c177';ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.lineDashOffset=moving?-t/90:0;ctx.stroke();ctx.setLineDash([]);
     const frac=moving?(t/10000+floor*.24)%1:.46,p=P([-16+32*frac,yy,0]);ctx.fillStyle='#b0ffeb';ctx.beginPath();ctx.arc(p[0],p[1],2.3,0,6.283);ctx.fill();
    }
   }
   if(data.cameras)for(const n of nodes.filter(n=>n.kind==='camera')){ctx.beginPath();ctx.arc(n.p[0],n.p[1],4,0,6.283);ctx.fillStyle='#0c3035';ctx.fill();ctx.strokeStyle='#b1e5d6';ctx.lineWidth=1;ctx.stroke();}
  }
  const pick=hits.find(h=>h.id===(hover||view.selected));
  if(pick){ctx.beginPath();pick.ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.strokeStyle='#9cfde1';ctx.lineWidth=1.7;ctx.stroke();ctx.fillStyle='#5cfac211';ctx.fill();}
  if(type==='campus'&&view.floor==='all'){
   for(const [i,f] of [...FLOORS].reverse().entries()){drawLabel(f.label+'  /  '+({0:'Experience',1:'Task labs',2:'Living'}[f.id]),80,88+i*28,9,'#afdbca',true);}
  }
  if(view.labels){
   const showAll=type==='showroom'||view.floor!=='all';
   nodes.filter(n=>!n.kind&&(showAll||['guest','kitchen','showroom','pool','laundry'].includes(n.id))).forEach(n=>{const size=type==='showroom'?11:10,x=n.p[0],y=n.p[1]+(type==='showroom'?24:0);drawLabel(n.label,x,y,size,'#e2f2ec',true);const tw=ctx.measureText(n.label).width;labelTargets.push({id:n.id,x:x-tw/2-9,y:y-size-5,w:tw+18,h:size+13});});
  }
  if(hover){const n=nodes.find(n=>n.id===hover&&!n.kind);if(n){const title=n.label;drawLabel(title+'  ↗',clamp(hoverXY?.[0]||n.p[0],95,w-100),Math.max(25,(hoverXY?.[1]||n.p[1])-22),12,'#b4ffe6',true);}}
 }
 function drawLabel(txt,x,y,size,color,bg){
  ctx.font=`500 ${size}px system-ui, sans-serif`;const len=ctx.measureText(txt).width;if(x<-150||x>w+150||y<0||y>h)return;
  if(bg){ctx.fillStyle='#061c26e8';ctx.beginPath();ctx.roundRect(x-len/2-9,y-size-5,len+18,size+13,5);ctx.fill();ctx.strokeStyle='#54918b60';ctx.lineWidth=.6;ctx.stroke();}
  ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(txt,x,y);ctx.textAlign='left';
 }
 function frame(t){
  if(disposed)return;const data=provider();if(view.rotate&&!data.paused&&!gesture){view.yaw+=(t-lastTime||0)*.000065;sync();}lastTime=t;
  ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,type==='campus'?'#0b2530':'#112b33');bg.addColorStop(1,'#06141c');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  if(type==='campus'){ctx.strokeStyle='#34757b13';ctx.lineWidth=1;for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}}
  polys=[];hits=[];rings=[];nodes=[];labelTargets=[];type==='campus'?buildCampus(t,data):buildShowroom(t,data);drawFaces();drawOverlay(t,data);debug.frames++;debug.targets=hits.map(x=>({id:x.id,floor:x.floor,ps:x.ps.map(p=>p.slice(0,2))}));dirty=false;
 }
 function visible(){const b=host.getBoundingClientRect();return host.isConnected&&!document.hidden&&b.bottom>0&&b.top<innerHeight&&b.width>0;}
 function tick(t){raf=0;if(disposed)return;const d=provider(),moving=(!d.paused&&(type==='campus'||view.rotate));if(visible()&&(dirty||moving)&&t-lastFrame>=(gesture?28:55)){frame(t);lastFrame=t;}if((moving||dirty)&&visible()){raf=requestAnimationFrame(tick);debug.running=true;}else debug.running=false;}
 function request(){dirty=true;if(!raf&&!disposed)raf=requestAnimationFrame(tick);}
 function measure(){const b=host.getBoundingClientRect();w=Math.max(1,b.width);h=Math.max(1,b.height);const dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);frame(performance.now());request();}
 function pickAt(x,y){const label=labelTargets.slice().reverse().find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);if(label)return label.id;return hits.slice().sort((a,b)=>((b.floor||0)-(a.floor||0))||(b.depth-a.depth)).find(p=>insidePoly(x,y,p.ps))?.id||null;}
 function pos(e){const b=canvas.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];}
 function down(e){if(e.button===2||e.button===0||e.pointerType==='touch'){
  const [x,y]=pos(e);pointers.set(e.pointerId,{x,y});canvas.setPointerCapture(e.pointerId);
  if(pointers.size===2){const q=[...pointers.values()];gesture={pinch:true,dist:Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y),zoom:view.zoom,cx:(q[0].x+q[1].x)/2,cy:(q[0].y+q[1].y)/2,px:view.panX,py:view.panY,moved:true};}
  else gesture={x,y,lastX:x,lastY:y,yaw:view.yaw,pitch:view.pitch,px:view.panX,py:view.panY,pan:e.shiftKey||e.button===2||config.panMode?.(),moved:false};
 }}
 function move(e){const [x,y]=pos(e);if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x,y});
  if(gesture){
   if(gesture.pinch&&pointers.size===2){const q=[...pointers.values()],dist=Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y);view.zoom=clamp(gesture.zoom*dist/Math.max(gesture.dist,1),.55,2.6);view.panX=gesture.px+((q[0].x+q[1].x)/2-gesture.cx)/scale;view.panY=gesture.py+((q[0].y+q[1].y)/2-gesture.cy)/scale;}
   else if(!gesture.pinch){const dx=x-gesture.x,dy=y-gesture.y;if(Math.hypot(dx,dy)>5)gesture.moved=true;if(gesture.pan){view.panX=clamp(gesture.px+dx/scale,-45,45);view.panY=clamp(gesture.py+dy/scale,-28,28);}else{view.yaw=gesture.yaw+dx*.007;view.pitch=clamp(gesture.pitch+dy*.005,type==='campus'?.18:.07,1.54);}}
   sync();canvas.style.cursor='grabbing';request();return;
  }const id=pickAt(x,y);if(hover!==id){hover=id;hoverXY=[x,y];canvas.style.cursor=id?'pointer':'grab';request();}
 }
 function up(e){const g=gesture;const [x,y]=pos(e);pointers.delete(e.pointerId);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);gesture=null;canvas.style.cursor='grab';if(g&&!g.moved&&!g.pinch){const id=pickAt(x,y);if(id){view.selected=id;sync();config.onPick?.(id);}}request();}
 function wheel(e){e.preventDefault();view.zoom=clamp(view.zoom*Math.exp(-e.deltaY*.0012),.55,2.6);sync();request();}
 function key(e){let handled=true;switch(e.key){case 'ArrowLeft':view.yaw-=.13;break;case 'ArrowRight':view.yaw+=.13;break;case 'ArrowUp':view.pitch=clamp(view.pitch+.09,.18,1.54);break;case 'ArrowDown':view.pitch=clamp(view.pitch-.09,.18,1.54);break;case '+':case '=':view.zoom=clamp(view.zoom+.15,.55,2.6);break;case '-':view.zoom=clamp(view.zoom-.15,.55,2.6);break;case '0':reset();break;default:handled=false;}if(handled){e.preventDefault();sync();request();}}
 function reset(){Object.assign(view,{yaw:type==='campus'?-.58:-.08,pitch:type==='campus'?.73:.16,centerY:type==='campus'?.5:.57,zoom:1,panX:0,panY:0,spread:.8,floor:'all',rotate:false,focusModel:null});sync();request();}
 function update(values){Object.assign(view,values);sync();request();}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',e=>{pointers.delete(e.pointerId);gesture=null;request();}],['pointerleave',()=>{if(!gesture){hover=null;request();}}],['wheel',wheel,{passive:false}],['keydown',key],['contextmenu',e=>e.preventDefault()]];
 listeners.forEach(([n,f,o])=>canvas.addEventListener(n,f,o));const ro=new ResizeObserver(measure);ro.observe(host);
 const io=new IntersectionObserver(()=>request());io.observe(host);document.addEventListener('visibilitychange',request);
 function destroy(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();listeners.forEach(([n,f,o])=>canvas.removeEventListener(n,f,o));document.removeEventListener('visibilitychange',request);debug.running=false;}
 measure();sync();return {destroy,refresh:request,update,reset,getView:()=>({...view}),pickAt,getHits:()=>hits.map(h=>({...h}))};
}
const API={ROOMS,FLOORS,ROBOTS,project,insidePoly,model,validatePlan,addPlan,toggleCompare,makeRenderer};root.MetariCampus=API;
if(typeof module!=='undefined'&&module.exports)module.exports=API;
})(typeof window!=='undefined'?window:globalThis);

