
/* Metari's visual presentation engine. Decorative state only: never writes
 * business records, advances a model, or generates telemetry. One RAF loop.
 */
(function(root){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 let getModel=null,raf=0,frame=0,maps=[],plans=[],counters=[],last=0,mounted=false;
 const seen=new Map(),query=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const debug={running:false,frames:0,canvases:0,plans:0,mode:'paused',lastFrameMs:0};
 const el=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const visibility=n=>{if(!n.isConnected)return false;const r=n.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
 function settings(){return getModel?root.MetariExperience.mode(getModel().state.settings,query(),document.hidden):'paused';}
 function active(){return ['cinematic','calm'].includes(settings());}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;debug.running=false;}
 function modeBody(){const m=settings();debug.mode=m;document.body.dataset.motion=m;document.body.classList.toggle('v4-motion-off',!active());document.querySelectorAll('[data-v4-motion-label]').forEach(n=>n.textContent=m==='reduced'?'Reduced':m==='paused'?'Paused':m==='calm'?'Calm':'Studio');}
 function finishCounters(){for(const c of counters)c.el.textContent=c.final;counters=[];}
 function staticFrame(){maps.forEach(x=>x.ctx.clearRect(0,0,1000,560));plans.forEach(p=>p.runners.forEach(r=>r.style.display='none'));finishCounters();}
 function pathPoint(points,t){let lengths=[],sum=0;for(let i=1;i<points.length;i++){let l=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(l);sum+=l;}let d=((t%1)+1)%1*sum;for(let i=0;i<lengths.length;i++){if(d<=lengths[i]||i===lengths.length-1){const k=lengths[i]?d/lengths[i]:0;return [points[i][0]+(points[i+1][0]-points[i][0])*k,points[i][1]+(points[i+1][1]-points[i][1])*k];}d-=lengths[i];}return points[0]||[0,0];}
 function mapFrame(m,t,calm){
  const ctx=m.ctx;ctx.clearRect(0,0,1000,560);if(!visibility(m.canvas))return;
  const snapshot=getModel(),S=root.MetariSpatial,mode=snapshot.heatMode||'activity';
  const rows=S.rows(snapshot.state,mode,snapshot.heatSlot||0);
  ctx.save();ctx.globalAlpha=calm?.45:1;
  for(let i=0;i<rows.length;i++){
   const z=rows[i],n=S.normalized(z.value,mode);if(n==null)continue;
   const rgb=S.displayColor(n,mode),x=z.x*10,y=z.y*5.6,s=.5+.5*Math.sin(t*(mode==='thermal'?.6:1.45)+i*.67),radius=23+n*20+s*(calm?4:10);
   const g=ctx.createRadialGradient(x,y,2,x,y,radius);g.addColorStop(0,`rgba(${rgb},${(.11+s*.11)*(snapshot.heatOpacity/100)})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
   const collecting=snapshot.state.assignments.some(a=>a.envId===z.id&&a.status==='Capturing');
   if(collecting||snapshot.env===z.id){const p=((t*.32+i*.2)%1),r=12+p*26;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=`rgba(${collecting?'92,237,188':rgb},${(1-p)*.55})`;ctx.lineWidth=1.4;ctx.stroke();}
  }
  if(snapshot.flowVisible!==false){
   const hub={x:617,y:429};
   rows.filter(z=>snapshot.state.assignments.some(a=>a.envId===z.id&&a.status==='Capturing')).forEach((z,i)=>{
    const x=z.x*10,y=z.y*5.6,cx=(x+hub.x)/2+60,cy=Math.min(y,hub.y)-35;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(cx,cy,hub.x,hub.y);ctx.strokeStyle='rgba(95,225,186,.16)';ctx.setLineDash([4,8]);ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
    for(let j=0;j<(calm?1:3);j++){const p=(t*.085+j/3+i*.2)%1,px=(1-p)**2*x+2*(1-p)*p*cx+p*p*hub.x,py=(1-p)**2*y+2*(1-p)*p*cy+p*p*hub.y;ctx.beginPath();ctx.arc(px,py,2.2,0,Math.PI*2);ctx.fillStyle='rgba(118,240,202,.85)';ctx.fill();}
   });
  }
  ctx.restore();
 }
 function tick(now){
  raf=0;if(!active()){modeBody();staticFrame();return;}
  const dt=now-last;if(dt<33){raf=requestAnimationFrame(tick);return;}last=now;debug.running=true;debug.frames++;debug.lastFrameMs=dt;const calm=settings()==='calm',t=now/1000;
  maps.forEach(m=>mapFrame(m,t,calm));
  plans.forEach(p=>{if(!visibility(p.svg))return;p.runners.forEach((r,i)=>{const at=pathPoint(p.points,t/(calm?32:18)+i*.38);r.style.display='';r.setAttribute('cx',at[0]);r.setAttribute('cy',at[1]);});});
  counters=counters.filter(c=>{if(!c.el.isConnected)return false;const k=Math.min(1,(now-c.start)/650),n=c.target*(1-(1-k)**3);c.el.textContent=k===1?c.final:n.toLocaleString('en-US',{maximumFractionDigits:c.decimals,minimumFractionDigits:c.decimals})+c.suffix;return k<1;});
  if(maps.some(m=>visibility(m.canvas))||plans.some(p=>visibility(p.svg))||counters.length)raf=requestAnimationFrame(tick);else debug.running=false;
 }
 function mount(provider){
  getModel=provider||getModel;if(!getModel)return;stop();finishCounters();maps=[];plans=[];modeBody();
  document.querySelectorAll('[data-heat-stage] .property-layer').forEach(layer=>{if(layer.closest('dialog')&&!layer.closest('dialog').open)return;
   let canvas=layer.querySelector('.v4-flow-canvas');if(!canvas){canvas=document.createElement('canvas');canvas.className='v4-flow-canvas';canvas.width=1000;canvas.height=560;canvas.setAttribute('aria-hidden','true');layer.appendChild(canvas);}const ctx=canvas.getContext('2d');if(ctx)maps.push({canvas,ctx});
  });
  document.querySelectorAll('.capture-plan-svg').forEach(svg=>{if(svg.closest('dialog')&&!svg.closest('dialog').open)return;
   svg.querySelectorAll('.plan-camera:not(.disabled)').forEach(g=>{if(g.querySelector('.v4-signal-ring'))return;const radius=Number(g.querySelector('circle').getAttribute('r'));const ring=el('circle',{r:radius*1.3,fill:'none',stroke:'#68e2b7','stroke-width':radius*.07,class:'v4-signal-ring','aria-hidden':'true'});g.insertBefore(ring,g.firstChild);});
   const path=svg.querySelector('.capture-task-path');if(!path)return;const points=path.getAttribute('points').trim().split(/\s+/).map(x=>x.split(',').map(Number));if(points.length<2||points.some(a=>a.some(x=>!Number.isFinite(x))))return;
   let group=svg.querySelector('.v4-path-runners');if(!group){group=el('g',{class:'v4-path-runners','pointer-events':'none','aria-hidden':'true'});const width=svg.viewBox.baseVal.width;[0,1].forEach((_,i)=>group.appendChild(el('circle',{r:width*.005,fill:i?'#88b7e3':'#67e6b8',stroke:'#0d1e25','stroke-width':width*.002})));path.parentNode.appendChild(group);}plans.push({svg,points,runners:Array.from(group.children)});
  });
  document.querySelectorAll('.kpi-value[data-count-value], [data-v4-count]').forEach(n=>{
   const raw=n.dataset.countValue||n.dataset.v4Count,target=Number(raw);if(!Number.isFinite(target))return;const suffix=n.dataset.countSuffix||'',decimals=raw.includes('.')?1:0,final=target.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+suffix;
   const key=n.dataset.countKey||n.closest('[data-action]')?.dataset.id||n.dataset.v4CountKey||raw;n.textContent=final;
   if(active()&&seen.get(key)!==target){counters.push({el:n,target,final,suffix,decimals,start:performance.now()});}seen.set(key,target);
  });
  debug.canvases=maps.length;debug.plans=plans.length;
  if(active()&&(maps.length||plans.length||counters.length))raf=requestAnimationFrame(tick);else staticFrame();
  if(!mounted){mounted=true;document.addEventListener('visibilitychange',refresh);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',refresh);window.addEventListener('pagehide',stop);document.addEventListener('scroll',()=>{if(!raf&&active()&&(maps.some(m=>visibility(m.canvas))||plans.some(p=>visibility(p.svg))))refresh();},{passive:true,capture:true});}
 }
 function refresh(){stop();modeBody();if(active()&&(maps.length||plans.length||counters.length))raf=requestAnimationFrame(tick);else staticFrame();}
 root.MetariMotion={mount,refresh,stop,debug,pathPoint};
})(window);

