
/* Metari capture-layout engine. Deterministic 2D DESIGN SIMULATION ONLY.
 * Camera footprints are planar approximations clipped by walls/full-height
 * obstacles. They are not calibrated optics, thermal data or safety evidence.
 * CommonJS exports allow the same geometry and validation to be tested in Node. */
(function(root){
 'use strict';
 const P=root.MetariPlans||(typeof require==='function'?require('./instrumentation-plans.js'):{});
 const copy=x=>JSON.parse(JSON.stringify(x));
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const rad=x=>x*Math.PI/180;
 const inside=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;
 const assert=(v,m)=>{if(!v)throw new Error(m);};
 const LAYERS={
  layout:{name:'Camera layout',short:'Layout',legend:['Selected camera','Proposed field of view']},
  coverage:{name:'Sensor coverage',short:'Coverage',legend:['No sightline','One RGB view','Two or more']},
  activity:{name:'Activity heatmap',short:'Activity',legend:['Quiet','Higher index · simulated']},
  frequency:{name:'Task frequency',short:'Task frequency',legend:['Fewer repetitions','More repetitions · simulated']},
  quality:{name:'QA / failure',short:'QA / failure',legend:['Lower failure index','Higher index · simulated']},
  blind:{name:'Blind spots & gaps',short:'Blind spots',legend:['Unseen in 2D','Single view','Multiple views']},
  thermal:{name:'Simulated thermal',short:'Thermal',legend:['18°C · simulated','36°C · simulated']}
 };
 function environment(s,id){const e=s.environments.find(e=>e.id===id);assert(e&&P[id],'Unknown capture environment.');return e;}
 function validateRoom(s,id,room){const e=environment(s,id),rooms=Array.from({length:e.spaces},(_,i)=>e.prefix+'-'+(101+i));assert(rooms.includes(room)||room===e.holdoutSpace,'Select a valid room for this environment.');return e;}
 function get(s,id,room){const e=validateRoom(s,id,room||environment(s,id).captureSpace);room=room||e.captureSpace;const p=copy(P[id]);const history=s.captureDesigns&&s.captureDesigns[room];const latest=history&&history.revisions&&history.revisions[history.revisions.length-1];p.room=room;p.heldout=room===e.holdoutSpace;p.revision=latest?latest.revision:1;p.updatedAt=latest?latest.at:null;p.cameras=latest?copy(latest.cameras):p.cameras;p.name=e.name;return p;}
 function walls(p){const seg=[[0,0,p.width,0],[p.width,0,p.width,p.depth],[p.width,p.depth,0,p.depth],[0,p.depth,0,0],...p.walls];for(const r of [...p.fixtures.filter(x=>x.solid),...p.exclusions])seg.push([r.x,r.y,r.x+r.w,r.y],[r.x+r.w,r.y,r.x+r.w,r.y+r.h],[r.x+r.w,r.y+r.h,r.x,r.y+r.h],[r.x,r.y+r.h,r.x,r.y]);return seg;}
 function ray(cam,angle,p,segments=walls(p)){
  const vx=Math.cos(rad(angle)),vy=Math.sin(rad(angle));let d=cam.range;
  for(const [x1,y1,x2,y2] of segments){const sx=x2-x1,sy=y2-y1,den=vx*sy-vy*sx;if(Math.abs(den)<1e-9)continue;const qx=x1-cam.x,qy=y1-cam.y,t=(qx*sy-qy*sx)/den,u=(qx*vy-qy*vx)/den;if(t>=.001&&u>=-1e-8&&u<=1+1e-8)d=Math.min(d,t);}
  return [cam.x+vx*d,cam.y+vy*d];
 }
 function inScope(p,x,y){return x>=0&&x<=p.width&&y>=0&&y<=p.depth&&!p.exclusions.some(r=>inside(x,y,r))&&!p.fixtures.some(r=>r.solid&&inside(x,y,r));}
 function sees(p,c,x,y,segments=walls(p)){
  if(!c.enabled||!inScope(p,x,y))return false;
  const dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy);if(d>c.range)return false;if(d<.001)return true;
  const angle=Math.atan2(dy,dx)*180/Math.PI,diff=((angle-c.bearing+540)%360)-180;
  if(c.mode!=='overhead'&&Math.abs(diff)>c.fov/2)return false;
  const hit=ray(c,angle,p,segments);return Math.hypot(hit[0]-c.x,hit[1]-c.y)+.02>=d;
 }
 function footprint(p,c){if(!c.enabled)return [];const full=c.mode==='overhead',start=full?0:c.bearing-c.fov/2,end=full?360:c.bearing+c.fov/2,segments=walls(p),out=full?[]:[[c.x,c.y]],n=full?100:64;for(let i=0;i<=n;i++)out.push(ray(c,start+(end-start)*i/n,p,segments));return out;}
 function distanceToPath(x,y,path){let best=999;for(let i=1;i<path.length;i++){const [a,b]=[path[i-1],path[i]],dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1),0,1);best=Math.min(best,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));}return best;}
 function sample(p,s,layer='coverage',slot=10){assert(LAYERS[layer],'Unknown map layer.');const seg=walls(p),columns=38,rows=Math.max(20,Math.round(columns*p.depth/p.width)),dx=p.width/columns,dy=p.depth/rows,cells=[],evaluation=s.evaluations.find(x=>x.envId===p.id),accepted=s.datasets.filter(d=>d.envId===p.id).reduce((n,d)=>n+d.accepted,0);let visible=0,multi=0,total=0;
  for(let yi=0;yi<rows;yi++)for(let xi=0;xi<columns;xi++){
   const x=(xi+.5)*dx,y=(yi+.5)*dy;if(!inScope(p,x,y))continue;
   const views=p.cameras.reduce((n,c)=>n+(sees(p,c,x,y,seg)?1:0),0);total++;if(views)visible++;if(views>1)multi++;
   let value=views;const d=distanceToPath(x,y,p.path),z=p.zones.find(z=>inside(x,y,z));
   if(layer==='activity')value=clamp(Math.round(8+68*Math.exp(-d*d/1.5)*(.45+.5*Math.sin(slot*.18+x*.4)**2)+(z?z.seed*.18:0)),0,100);
   if(layer==='frequency')value=clamp(Math.round((z?z.seed:8)+Math.min(8,accepted/40)-d*4),0,100);
   if(layer==='quality')value=evaluation?clamp(Math.round(100*(evaluation.trials-evaluation.successes+.5*evaluation.interventions)/evaluation.trials+(views===0?18:views===1?8:0)+(z?.hazard?6:0)),0,100):null;
   if(layer==='thermal'){const hot=p.zones.filter(z=>z.hazard).reduce((v,z)=>Math.max(v,Math.exp(-((x-z.x-z.w/2)**2+(y-z.y-z.h/2)**2)/3)),0);value=Math.round(clamp(21+hot*11+3*Math.sin(slot*.12+x*.2)+1.5*Math.cos(y),18,36)*10)/10;}
   cells.push({x:x-dx/2,y:y-dy/2,w:dx,h:dy,views,value});
  }
  const zones=p.zones.map(z=>{const set=cells.filter(c=>inside(c.x+c.w/2,c.y+c.h/2,z)),seen=set.filter(c=>c.views>0).length;return {...z,coverage:set.length?Math.round(100*seen/set.length):0,redundancy:set.length?Math.round(100*set.filter(c=>c.views>1).length/set.length):0,samples:set.length};});
  return {cells,zones,coverage:total?Math.round(100*visible/total):0,redundancy:total?Math.round(100*multi/total):0,blind:total?Math.round(100*(total-visible)/total):0,total,hasEvaluation:!!evaluation};
 }
 function validateCamera(p,c){
  assert(typeof c.enabled==='boolean','Choose the camera enabled state.');
  for(const [name,min,max] of [['x',.1,p.width-.1],['y',.1,p.depth-.1],['bearing',0,359],['fov',25,140],['range',.5,25],['height',1.5,5]])assert(Number.isFinite(c[name])&&c[name]>=min&&c[name]<=max,`${name} must be between ${min} and ${max}.`);
  assert(!p.exclusions.some(z=>inside(c.x,c.y,z)),'Camera cannot be placed inside an excluded/privacy area.');
  assert(!p.fixtures.some(z=>z.solid&&inside(c.x,c.y,z)),'Camera cannot be placed inside a full-height obstacle.');
  return c;
 }
 function updateInState(s,args){const p=get(s,args.envId,args.room);assert(Number(args.expectedRevision)===p.revision,'The capture plan changed. Reopen it before saving.');const c=p.cameras.find(c=>c.id===args.cameraId);assert(c,'Select a camera in this room.');for(const key of ['x','y','bearing','fov','range','height'])if(args[key]!==undefined)c[key]=Number(args[key]);if(args.enabled!==undefined)c.enabled=args.enabled;validateCamera(p,c);const note=String(args.note||'Camera design adjusted').trim();assert(note.length>=3&&note.length<=300,'Add a design note from 3 to 300 characters.');const rec={revision:p.revision+1,at:new Date().toISOString(),note,cameras:copy(p.cameras)};s.captureDesigns=s.captureDesigns||{};s.captureDesigns[p.room]=s.captureDesigns[p.room]||{envId:p.id,room:p.room,revisions:[{revision:1,at:s.createdAt,note:'Initial illustrative design',cameras:copy(P[p.id].cameras)}]};s.captureDesigns[p.room].revisions.push(rec);return {...rec,room:p.room,envId:p.id};}
 function resetInState(s,args){const p=get(s,args.envId,args.room);assert(Number(args.expectedRevision)===p.revision,'The capture plan changed. Reopen it before resetting.');assert(args.confirmed===true,'Confirm the design reset.');const rec={revision:p.revision+1,at:new Date().toISOString(),note:'Restored the original design; earlier revisions retained',cameras:copy(P[p.id].cameras)};s.captureDesigns=s.captureDesigns||{};s.captureDesigns[p.room]=s.captureDesigns[p.room]||{envId:p.id,room:p.room,revisions:[{revision:1,at:s.createdAt,note:'Initial illustrative design',cameras:copy(P[p.id].cameras)}]};s.captureDesigns[p.room].revisions.push(rec);return {...rec,room:p.room,envId:p.id};}
 function snapshot(s,id,room){const p=get(s,id,room);return {schema:'metari.capture-design.v3',designId:room+'-DESIGN-R'+p.revision,envId:id,room,revision:p.revision,mode:p.heldout?'Held-out evaluation':'Training',blueprintVersion:'metari.concept-layout.3.0',dimensionsMetres:{width:p.width,depth:p.depth,source:'Assumed, not measured'},geometry:{walls:copy(p.walls),fixtures:copy(p.fixtures),doors:copy(p.doors),taskZones:copy(p.zones),taskPath:copy(p.path)},cameras:copy(p.cameras),sensors:copy(p.sensors),privacyMasks:copy(p.exclusions),privacy:p.privacy,proposedCaptureSpec:{rgb:'1920 × 1080, 30 fps — design target only',depth:'Optional; no depth stream connected',audio:'Off',sync:'Buyer-defined tolerance; not measured',timestamp:'Monotonic capture timestamps proposed; not connected',calibration:'Intrinsics, extrinsics and clocks require verification',dataRights:'Consent and buyer-specific licensing required'},limitations:'Conceptual 2D field-of-view approximation. Not surveyed, physically calibrated or safety-certified. No cameras connected.',capturedAt:new Date().toISOString()};}
 function campaignSpec(s,args){const p=get(s,args.envId,args.room);assert(!p.heldout,'Held-out evaluation rooms cannot be used for training collection.');assert(args.approved===true,'Approve the simulated plan first.');assert(Number(args.planRevision)===p.revision,'The capture design changed. Review the latest revision before creating this brief.');assert(p.cameras.some(c=>c.enabled),'Enable a camera design before planning collection.');const camera=p.cameras.find(c=>c.id===args.cameraId);assert(camera,'Select a valid camera design.');assert(camera.enabled,'The focused camera is disabled. Enable it or select another camera.');const zone=p.zones.find(z=>z.id===args.zoneId);assert(zone,'Select a task zone.');return {...snapshot(s,p.id,p.room),focusCamera:camera.id,focusZone:zone.id,focusZoneName:zone.name,taskReset:zone.reset};}
 root.MetariInstrumentation={plans:P,LAYERS,get,validateRoom,walls,ray,sees,footprint,inScope,sample,validateCamera,updateInState,resetInState,snapshot,campaignSpec};
 if(typeof module!=='undefined')module.exports=root.MetariInstrumentation;
})(typeof globalThis!=='undefined'?globalThis:this);

