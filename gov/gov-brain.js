(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const eo=x=>{x=clamp(x,0,1);return 1-Math.pow(1-x,3)};
const eio=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}


/* Metari Brain, government edition. Concept visualization: scripted, synthetic events only. */
const REG=[
 {name:'Requirements',col:[176,146,255]},{name:'Task standards',col:[246,208,148]},{name:'Environment library',col:[132,202,255]},
 {name:'Expert demos',col:[124,228,204]},{name:'Guardrails',col:[255,138,118]},{name:'Capture',col:[214,224,255]},
 {name:'Perception',col:[255,128,196]},{name:'Memory',col:[198,236,120]},{name:'Judgment',col:[255,241,214]},{name:'Evaluation',col:[255,178,92]}];
const ENTS=[
 ['ph_restock',2],['ph_pov',2],['ph_tool',2],['ph_hatch',2],['ph_supply',2],['ph_bench',2],['ph_inspect',2],['ph_floor',2],
 ['o_req',0],['o_cfg',0],['s_restock',1],['s_tool',1],['s_inspect',1],['x_operator',3],['x_tech',3],['x_partner',3],['g_zone',4],['g_heldout',4],['g_stop',4],
 ['c_ceiling',5],['c_wall',5],['p_tote',6],['p_people',6],['p_tool',6],['p_marker',6],['m_trials',7],['m_demos',7],['j_flag',8],['j_route',8],['e_check',9],['e_review',9]];
const PHOTO={};ENTS.forEach(([id])=>{if(id.startsWith('ph_')){const im=new Image();im.src='/assets/gov/brain/'+id+'.jpg';PHOTO[id]=im}});
const SCENES=[
 {photo:'ph_restock',cam:'Concept · ceiling camera',where:'GOV-DEMO-001 · Held-out config',title:'Tote released short of the bay. Why?',inset:'ph_pov',insetAt:4,insetCap:'Operator head-cam (demo)',
  out:['Linked to the requirement. Not scored here.','#ffb36b'],
  steps:[['ph_restock','Detected','Trial in view'],['p_tote','Detected','Tote released short of the bay line'],['s_restock','Retrieved','Success condition: fully inside the bay'],['g_heldout','Held','Held-out config, never used in training','h'],['ph_pov','Retrieved','Operator demos covered the middle shelf only'],['j_flag','Decided','Likely gap: top-shelf placement not demonstrated'],['e_review','Created','Flagged for a reviewer']]},
 {photo:'ph_tool',cam:'Concept · wall camera',where:'GOV-DEMO-002 · Training config',title:'Technician at the bench. Held.',
  out:['Intervention logged, not removed','#ffb36b'],
  steps:[['ph_tool','Detected','Trial in view'],['p_people','Detected','Technician inside the bench zone'],['g_zone','Held','Arm waits outside the human zone','h'],['s_tool','Retrieved','Tool-handling standard, layout A'],['x_tech','Retrieved','Technician demo for this config'],['p_tool','Detected','Technician steps clear'],['j_route','Decided','Resume from the marked start'],['m_trials','Action','Pause logged as an intervention']]},
 {photo:'ph_hatch',cam:'Concept · wall camera',where:'GOV-DEMO-003 · Partner-led concept',title:'Were all three markers captured?',inset:'ph_inspect',insetAt:3,insetCap:'Hall camera',
  out:['Recorded as incomplete','#2efea9'],
  steps:[['c_wall','Detected','Wall and hall cameras recording'],['p_marker','Detected','Markers 1 and 2 captured'],['s_inspect','Retrieved','Requirement: three markers'],['ph_inspect','Retrieved','Narrow corridor configuration'],['g_stop','Held','Marker 3 not captured','h'],['j_flag','Decided','Incomplete against the requirement'],['e_check','Created','Entered in the evidence index as incomplete']]}
];

// ---------- brain point cloud (from the BrainFrame engine) ----------
const R=rng(11);
function gauss(){let u=R()||1e-9,v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function regionOf(x,y,z,part){if(part==='cb')return 4;if(part==='st')return 5;if(part==='hc')return 7;if(z>0.8)return 8;if(z>0.36)return 0;if(y>0.42&&z>-0.2)return 9;if(z<-0.84)return 6;if(z<-0.5)return 2;if(y>0.2)return 1;return 3}
function cere(shell){let u=R()*2-1,th=R()*Math.PI*2,s=Math.sqrt(1-u*u);let dx=s*Math.cos(th),dy=u,dz=s*Math.sin(th);const side=dx>=0?1:-1;
 let r=shell?1:0.8+0.2*Math.sqrt(R());const fold=1+0.055*Math.sin(dz*15+dy*9)*Math.sin(dy*12-dz*6+dx*3);
 let x=dx*0.9*r*fold,y=(dy>0?dy*0.82:dy*0.6)*r*fold,z=dz*1.22*r*fold;
 if(z<-0.6)y*=0.85+0.15*(1+z/1.22)/0.5;if(dy<0&&Math.abs(dz)<0.5)y*=1.25;
 x+=side*0.06;if(y<-0.3&&z>-0.15)y=-0.3+(y+0.3)*0.35;if(y<-0.42)y=-0.42+(y+0.42)*0.4;return [x,y,z]}
const small=innerWidth<700;const N=[];
function add(x,y,z,part,cl){N.push({x,y,z,r:regionOf(x,y,z,part),cl,ph:R()*6.28,sz:0.8+R()*0.8})}
for(let i=0;i<(small?600:950);i++){const p=cere(false);add(p[0],p[1],p[2],'c',0)}
for(let k=0;k<(small?50:85);k++){const p=cere(true);const n=6+Math.floor(R()*10);const sg=0.025+R()*0.022;for(let i=0;i<n;i++)add(p[0]+gauss()*sg,p[1]+gauss()*sg,p[2]+gauss()*sg,'c',1)}
for(let i=0;i<220;i++){let u=R()*2-1,th=R()*6.28,s=Math.sqrt(1-u*u),r=0.85+0.15*R();let y=u*0.24*r;y=Math.round(y/0.05)*0.05+gauss()*0.008;add(s*Math.cos(th)*0.52*r,-0.52+y,-0.8+s*Math.sin(th)*0.3*r,'cb',0)}
for(const sd of [-1,1])for(let i=0;i<95;i++){const u=R();add(sd*(0.3+0.05*Math.sin(u*3))+gauss()*0.025,-0.1-0.13*Math.sin(u*Math.PI)+gauss()*0.025,0.18-u*0.68+gauss()*0.02,'hc',R()<0.35?1:0)}
for(let i=0;i<80;i++){const t=R(),a=R()*6.28,rr=0.08*Math.sqrt(R());add(Math.cos(a)*rr,-0.42-t*0.55,-0.32-t*0.12+Math.sin(a)*rr,'st',0)}
const E=[];{const seen=new Set();for(let i=0;i<N.length;i++){const d=[];const a=N[i];for(let j=0;j<N.length;j++){if(i===j)continue;const b=N[j];const q=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2;if(q<0.04)d.push([q,j])}
 d.sort((p,q)=>p[0]-q[0]);for(const [,j] of d.slice(0,3)){const k=i<j?i*1e5+j:j*1e5+i;if(!seen.has(k)){seen.add(k);E.push([i,j])}}}}
const NODE={};
REG.forEach((rg,r)=>{const ents=ENTS.filter(e=>e[1]===r).map(e=>e[0]);let cand=N.map((n,i)=>i).filter(i=>N[i].r===r&&N[i].cl===1);
 if(cand.length<ents.length*4)cand=N.map((n,i)=>i).filter(i=>N[i].r===r);
 let cx=0,cy=0,cz=0;cand.forEach(i=>{cx+=N[i].x;cy+=N[i].y;cz+=N[i].z});cx/=cand.length;cy/=cand.length;cz/=cand.length;rg.c=[cx,cy,cz];if(!ents.length)return;
 const picked=[cand.reduce((b,i)=>{const q=(N[i].x-cx)**2+(N[i].y-cy)**2+(N[i].z-cz)**2;return q<b[0]?[q,i]:b},[1e9,-1])[1]];
 while(picked.length<ents.length){let best=-1,bd=-1;for(const i of cand){let m=1e9;for(const p of picked){const q=(N[i].x-N[p].x)**2+(N[i].y-N[p].y)**2+(N[i].z-N[p].z)**2;if(q<m)m=q}if(m>bd){bd=m;best=i}}picked.push(best)}
 ents.forEach((id,k)=>{NODE[id]=picked[k];N[picked[k]].ent=id})});

// ---------- canvas ----------
const cv=document.getElementById('mbcv'),g=cv.getContext('2d');let W=0,H=0,DPR=1;
function resize(){const r=cv.getBoundingClientRect();DPR=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR)}
addEventListener('resize',resize);resize();
function sprite(col,hard){const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');const gr=x.createRadialGradient(32,32,0,32,32,32);const [r,gg,b]=col;
 if(hard){gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,`rgba(${r},${gg},${b},.9)`);gr.addColorStop(.5,`rgba(${r},${gg},${b},.16)`);gr.addColorStop(1,`rgba(${r},${gg},${b},0)`)}
 else{gr.addColorStop(0,`rgba(${r},${gg},${b},.5)`);gr.addColorStop(.4,`rgba(${r},${gg},${b},.12)`);gr.addColorStop(1,`rgba(${r},${gg},${b},0)`)}x.fillStyle=gr;x.fillRect(0,0,64,64);return s}
const SPH=REG.map(r=>sprite(r.col,true)),SPG=REG.map(r=>sprite(r.col,false));const HEAD=sprite([205,240,228],true),HEADG=sprite([150,225,200],false);
const cam={ry:1.45,rx:-0.18,scale:1,ox:0,oy:0};
function proj(x,y,z){const S=Math.min(W/2.75,H/1.95)*cam.scale;const cy=Math.cos(cam.ry),sy=Math.sin(cam.ry);const X=x*cy+z*sy,Z=-x*sy+z*cy;const cx=Math.cos(cam.rx),sx=Math.sin(cam.rx);const Y2=y*cx-Z*sx,Z2=y*sx+Z*cx;const p=3.4/(3.4+Z2);return {x:W/2+cam.ox+X*S*p,y:H/2+cam.oy+12-Y2*S*p,z:Z2,p}}
const P=new Array(N.length);
function arcPts(a,b){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y;let nx=-dy,ny=dx;const ox=mx-(W/2+cam.ox),oy=my-(H/2+cam.oy);if(nx*ox+ny*oy<0){nx=-nx;ny=-ny}return {cx:mx+nx*0.2,cy:my+ny*0.2}}
function bez(a,b,c,u){return {x:(1-u)*(1-u)*a.x+2*(1-u)*u*c.cx+u*u*b.x,y:(1-u)*(1-u)*a.y+2*(1-u)*u*c.cy+u*u*b.y}}
function drawArc(a,b,prog,col,alpha,width){const c=arcPts(a,b);const end=clamp(prog,0,1);if(end<=0)return;g.globalCompositeOperation='lighter';g.lineWidth=width;g.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${alpha})`;g.beginPath();g.moveTo(a.x,a.y);
 const n=28;let pe=a;for(let k=1;k<=n;k++){const u=k/n*end;pe=bez(a,b,c,u);g.lineTo(pe.x,pe.y)}g.stroke();
 if(prog>0&&prog<1){g.globalAlpha=1;g.drawImage(HEAD,pe.x-12,pe.y-12,24,24);g.globalAlpha=.8;g.drawImage(HEADG,pe.x-36,pe.y-36,72,72);g.globalAlpha=1}}
function bloom(q,r,amt,ring,hold){if(amt<=0)return;g.globalCompositeOperation='lighter';g.globalAlpha=clamp(amt,0,1);const s=56;g.drawImage(SPG[r],q.x-s,q.y-s,s*2,s*2);g.drawImage(SPH[r],q.x-11,q.y-11,22,22);
 g.globalCompositeOperation='source-over';const c=hold?[255,179,107]:REG[r].col;g.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},${0.8*amt})`;g.lineWidth=1.4;g.beginPath();g.arc(q.x,q.y,hold?13:9,0,6.283);g.stroke();
 if(hold){g.setLineDash([3,4]);g.beginPath();g.arc(q.x,q.y,19,0,6.283);g.stroke();g.setLineDash([])}g.globalAlpha=1}
function label(q,top,name,col){g.font='600 10px "JetBrains Mono", ui-monospace, monospace';const w1=g.measureText(top).width+top.length*1.2;g.font='500 13px Inter, system-ui, sans-serif';const w2=g.measureText(name).width;
 const w=Math.max(w1,w2)+18,h=40;const C=[[16,-h-8],[-w-16,-h-8],[16,12],[-w-16,12],[-w/2,-h-22],[-w/2,22]];let x=q.x+16,y=q.y-h-8;const hit=(r)=>AVOID.some(a=>r.x<a.x+a.w&&r.x+r.w>a.x&&r.y<a.y+a.h&&r.y+r.h>a.y);for(const [dx,dy] of C){const r={x:q.x+dx,y:q.y+dy,w,h};if(r.x<8||r.y<64||r.x+w>W-8||r.y+h>H-8)continue;if(!hit(r)){x=r.x;y=r.y;break}}x=clamp(x,8,W-w-8);y=clamp(y,64,H-h-8);
 g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='rgba(5,10,12,.86)';g.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},.4)`;g.lineWidth=1;g.beginPath();g.roundRect(x,y,w,h,7);g.fill();g.stroke();
 g.font='600 10px "JetBrains Mono", ui-monospace, monospace';g.fillStyle=`rgb(${col})`;if('letterSpacing' in g)g.letterSpacing='1.1px';g.fillText(top,x+9,y+16);if('letterSpacing' in g)g.letterSpacing='0px';
 g.font='500 13px Inter, system-ui, sans-serif';g.fillStyle='#eef0f3';g.fillText(name,x+9,y+32)}
function thumb(id,q,alpha,big){const im=PHOTO[id];if(!im||!im.complete)return;const w=(big?54:30)*Math.max(.7,q.p),h=w*0.5625;g.globalCompositeOperation='source-over';g.globalAlpha=clamp(alpha,0,1);
 g.save();g.beginPath();g.roundRect(q.x-w/2,q.y-h/2,w,h,3);g.clip();g.drawImage(im,q.x-w/2,q.y-h/2,w,h);g.restore();g.strokeStyle='rgba(132,202,255,.7)';g.lineWidth=1;g.beginPath();g.roundRect(q.x-w/2,q.y-h/2,w,h,3);g.stroke();g.globalAlpha=1}

// ---------- DOM for scenes ----------
const layer=document.getElementById('mblayer');
const S2=SCENES.map((sc,k)=>{
 const card=document.createElement('div');card.className='card';card.innerHTML=`<img src="/assets/gov/brain/${sc.photo}.jpg" alt=""><div class="hud"><i></i>${sc.cam}</div><div class="tagx">Synthetic</div>`+(sc.inset?`<div class="inset"><img src="/assets/gov/brain/${sc.inset}.jpg" alt=""><span>${sc.insetCap}</span></div>`:'');
 const tr=document.createElement('div');tr.className='mb-trace';
 tr.innerHTML=`<div class="mb-k">${sc.where}<span class="syn">Synthetic events</span></div><h4>${sc.title}</h4><ol>${sc.steps.map(s=>{const r=REG[ENTS.find(e=>e[0]===s[0])[1]];const c=s[3]?'#ffb36b':`rgb(${r.col})`;return `<li style="--c:${c}"><i></i><div><b>${s[1]} · ${r.name}</b><span>${s[2]}</span></div></li>`}).join('')}</ol><div class="out" style="--o:${sc.out[1]}">${sc.out[0]}</div>`;
 layer.appendChild(card);layer.appendChild(tr);return {card,tr,lis:[...tr.querySelectorAll('li')],out:tr.querySelector('.out'),inset:card.querySelector('.inset')}});

// ---------- scroll timeline ----------
const sec=document.getElementById('brain'),title=document.getElementById('mbtitle'),closing=document.getElementById('mbclosing'),dots=[...document.querySelectorAll('#mbprog i')];
// stops: 0 intro .00-.12 · expand .12-.24 · scene0 .24-.46 · scene1 .46-.66 · scene2 .66-.86 · close .86-1
const SC=[[.24,.46],[.46,.66],[.66,.86]];
const HH=0;
function heroP(){return 1}
function progress(){const r=sec.getBoundingClientRect();const tot=r.height-HH-innerHeight;return clamp((-r.top-HH)/tot,0,1)}
let t0=performance.now();let D0=null;let AVOID=[];
function layoutTargets(){const mob=W<820;
 if(mob){const cw=W-32,ch=cw*0.5625;const th=D0?D0.tr.offsetHeight:170;const top=72,bot=H-th-84;return {card:{x:16,y:top,w:cw,h:ch},trace:{x:16,y:bot},brain:{scale:.7,ox:0,oy:((top+ch)+bot)/2-H/2}}}
 const cw=Math.min(W*0.3,540),ch=cw*0.5625;return {card:{x:W*0.04,y:H/2-ch/2-30,w:cw,h:ch},trace:{x:W-24-Math.min(360,W*0.26),y:Math.max(96,H*0.14)},brain:{scale:.84,ox:W*0.02,oy:0}}}

function frame(now){
 const t=(now-t0)/1000;const p=progress();const hp=eio(heroP());const mobH=W<820;D0=S2[Math.max(0,SC.findIndex(([a,b])=>p>=a-.02&&p<b+.02))];
 const L=layoutTargets();
 // camera: grows in the expand stop, shifts aside during scenes, returns at close
 const grow=eio(seg(p,.08,.24));const scn=eio(seg(p,.22,.27))*(1-eio(seg(p,.84,.9)));
 const cl=eio(seg(p,.86,.94));const mobK=W<820?1.3:1;const baseScale=(.55+.33*grow-.16*cl)*mobK;cam.scale=baseScale+(L.brain.scale*mobK-baseScale)*scn;
 cam.ox=L.brain.ox*scn+(mobH?0:W*0.2)*(1-hp);cam.oy=L.brain.oy*scn-H*.07*cl+(mobH?-H*0.24:H*0.02)*(1-hp);cam.scale*=1+(mobH?.05:.16)*(1-hp);
 cam.ry=1.45+p*Math.PI*1.3+(RM?0:t*0.04);
 for(let i=0;i<N.length;i++){const n=N[i];P[i]=proj(n.x,n.y,n.z)}
 g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,W,H);
 const dim=Math.min(1,(.62+.38*grow)*(1+.75*(1-hp)));const active=SC.findIndex(([a,b])=>p>=a&&p<b);const focus=active>=0?.5:1;
 // region reveal during expand
 const regA=REG.map((_,r)=>Math.max(.55+.45*clamp((grow*REG.length*1.1)-r*0.9,0,1),.95*(1-hp)));
 g.globalCompositeOperation='lighter';g.lineWidth=1;
 for(let r=0;r<REG.length;r++){const c=REG[r].col;g.strokeStyle=`rgba(${(c[0]+190)>>1},${(c[1]+228)>>1},${(c[2]+210)>>1},${0.1*dim*focus*regA[r]})`;g.beginPath();
  for(const [i,j] of E){if(N[i].r!==r)continue;const a=P[i],b=P[j];if(a.z+b.z>1.6)continue;g.moveTo(a.x,a.y);g.lineTo(b.x,b.y)}g.stroke()}
 for(let i=0;i<N.length;i++){const n=N[i],q=P[i];if(n.ent&&n.ent.startsWith('ph_'))continue;const d=clamp((1.5-q.z)/2.3,0.2,1);const tw=RM?1:0.86+0.14*Math.sin(t*1.3+n.ph);
  const a=d*tw*dim*focus*regA[n.r];const s=(n.sz+(n.cl?0.5:0))*q.p*cam.scale;const hs=s*7;g.globalAlpha=clamp(a*0.9,0,1);g.drawImage(SPH[n.r],q.x-hs/2,q.y-hs/2,hs,hs);
  if(n.cl&&a>0.3){const gs=s*18;g.globalAlpha=a*0.25;g.drawImage(SPG[n.r],q.x-gs/2,q.y-gs/2,gs,gs)}}
 g.globalAlpha=1;
 // photo nodes
 ENTS.forEach(([id])=>{if(!id.startsWith('ph_'))return;const q=P[NODE[id]];const d=clamp((1.4-q.z)/2.2,0.15,1);thumb(id,q,d*grow*(active>=0?.7:1),false)});
 // region labels during expand
 const lab=seg(p,.14,.22)*(1-seg(p,.22,.26));if(lab>0){REG.forEach((r,i)=>{const q=proj(r.c[0],r.c[1],r.c[2]);g.globalAlpha=lab*clamp(regA[i],0,1);g.font='600 10.5px "JetBrains Mono", monospace';if('letterSpacing' in g)g.letterSpacing='1.4px';g.fillStyle=`rgb(${r.col})`;g.textAlign='center';g.fillText(r.name.toUpperCase(),q.x,q.y);g.textAlign='left';if('letterSpacing' in g)g.letterSpacing='0px'});g.globalAlpha=1}
 // scenes
 SCENES.forEach((sc,k)=>{const [a,b]=SC[k];const D=S2[k];const local=seg(p,a,b);const inS=p>=a-.02&&p<b+.02;
  const lift=eio(seg(p,a,a+.04)),drop=eio(seg(p,b-.03,b));const vis=lift*(1-drop);
  const q=P[NODE[sc.photo]];const sw=30*q.p,sh=sw*.5625;const from={x:q.x-sw/2,y:q.y-sh/2,w:sw,h:sh};const to=L.card;const u=vis;
  const x=from.x+(to.x-from.x)*u,y=from.y+(to.y-from.y)*u,w=from.w+(to.w-from.w)*u,h=from.h+(to.h-from.h)*u;
  D.card.style.display=inS&&vis>0.01?'block':'none';D.card.style.transform=`translate(${x}px,${y}px)`;D.card.style.width=w+'px';D.card.style.height=h+'px';D.card.style.opacity=Math.min(1,vis*3);
  D.card.querySelectorAll('.hud,.tagx').forEach(e=>e.style.opacity=clamp((u-.7)/.3,0,1));
  D.tr.style.left=L.trace.x+'px';D.tr.style.top=L.trace.y+'px';D.tr.style.opacity=vis>0.5?Math.min(1,(vis-.5)*2):0;
  if(!inS)return;
  // trace progress inside the scene (leave a little room at both ends)
  const tp=seg(local,.12,.86)*sc.steps.length;const reached=Math.min(sc.steps.length-1,Math.floor(tp));
  D.lis.forEach((li,i)=>{li.classList.toggle('on',i<=reached&&vis>0.5);li.classList.toggle('cur',i===reached)});
  D.out.classList.toggle('on',local>.88);
  if(D.inset)D.inset.classList.toggle('on',reached>=sc.insetAt&&vis>.8);
  AVOID=[{x:x-6,y:y-6,w:w+12,h:h+12}];const tb=D.tr.getBoundingClientRect();AVOID.push({x:tb.left-6,y:tb.top-6,w:tb.width+12,h:tb.height+12});
  if(vis<0.6)return;
  sc.steps.forEach((s,i)=>{const e=s[0];const qn=P[NODE[e]];if(i>0){const pa=P[NODE[sc.steps[i-1][0]]];const pr=clamp(tp-i+0.6,0,1)/0.6;if(tp>i-0.6)drawArc(pa,qn,pr,s[3]?[255,179,107]:[190,238,220],pr>=1?.45:.9,pr>=1?1.4:2)}
   if(tp>=i){const amt=eo((tp-i)/0.4);const r=ENTS.find(x=>x[0]===e)[1];if(e.startsWith('ph_'))thumb(e,qn,1,true);else bloom(qn,r,amt*(i===reached?1:.65),true,!!s[3])}});
  const cur=sc.steps[reached];const rr=REG[ENTS.find(x=>x[0]===cur[0])[1]];label(P[NODE[cur[0]]],(cur[3]?'GUARDRAIL · HELD':rr.name.toUpperCase()),cur[2],cur[3]?[255,179,107]:rr.col);
 });
 title.style.opacity=Math.min(seg(heroP(),.55,.95),1-seg(p,.12,.2));title.style.transform=`translateY(${-seg(p,.12,.2)*30}px)`;
 closing.style.opacity=seg(p,.88,.94);
 const stop=p<.24?0:p<.46?1:p<.66?2:p<.86?3:4;dots.forEach((d,i)=>d.classList.toggle('on',i===stop));
 requestAnimationFrame(frame)}
(document.fonts&&document.fonts.ready||Promise.resolve()).then(()=>requestAnimationFrame(frame));
})();
