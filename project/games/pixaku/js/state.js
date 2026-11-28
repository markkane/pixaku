/* ---------- Spielzustand ---------- */
let G=null,A=null,V={s:20,ox:0,oy:0},tool='draw',cw=0,ch=0,dpr=1,drag=null,pan=null,pinch=null,lastPtr=null,tween=null,spaceDown=false,rafOn=false;
const bcv=$('#board'),bctx=bcv.getContext('2d'),ptrs=new Map(),INS={top:88,bot:104};let tap=null,lastDown={x:200,t:0},edgeDrag=null;
const blockedAt=(x,y,w,h)=>{for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++){const r=G.rects.get(G.cellR[b*G.W+a]);if(r&&(r.valid||r.lock))return true}return false};
function newGame(puz,meta,saved){
  const{W,H}=puz,N=W*H,paint=document.createElement('canvas');paint.width=W;paint.height=H;
  G={puz,meta,W,H,N,rects:new Map(),cellR:new Int32Array(N).fill(-1),clueAt:new Int32Array(N).fill(-1),nid:1,covered:0,undo:[],time:saved?saved.time:0,hints:saved?saved.hints:0,won:false,winT:0,winAt:0,animUntil:0,
    paint,pctx:paint.getContext('2d'),diff:meta.mode==='arcade'?{max:8,color:true,check:true}:DIFFS.find(d=>d.id===meta.diff)||DIFFS[1]};
  if(meta.rule==='strikes')G.diff=Object.assign({},G.diff,{check:true});
  puz.rects.forEach((r,i)=>{G.clueAt[r.cy*W+r.cx]=i});
  puz.rects.forEach(r=>{if(r.w*r.h===1)addRect(r.x,r.y,1,1,1,true)});
  G.given=G.covered;
  if(saved)for(const[x,y,w,h,l]of saved.pl)if(free(x,y,w,h))addRect(x,y,w,h,l,true);
  drag=pan=pinch=tween=null;ptrs.clear();tool='draw';
  $('#gName').textContent=A?`Arcade, Runde ${A.level}`:meta.name;
  $('#gSub').textContent=A?`${A.score} Punkte`:`${W} × ${H}, ${G.diff.name}`;
  $('#gNum').classList.remove('warn');
  show('game');setView(R3.on);
  G.fixed=Math.max(W,H)<=10;const t=fitTarget();V=t.s<18?{s:30,ox:SIDE(),oy:INS.top+10}:t;
  toolbar();hud();draw();
  if(!A&&!TUT&&!saved&&!store.get('seen')){store.set('seen',1);toast('Ziehe ein Rechteck um jede Zahl. Die Zahl nennt die Fläche.',4200)}
  else if(t.s<18&&!A)toast('Zwei Finger verschieben und zoomen das Brett.',3200);
}
function free(x,y,w,h){for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++)if(G.cellR[b*G.W+a]>=0)return false;return true}
function evalRect(x,y,w,h){const{W,puz}=G;let k=-1,c=0;for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++){const q=G.clueAt[b*W+a];if(q>=0){c++;k=q}}
  if(c!==1)return{valid:false,wrong:false,col:null};const s=puz.rects[k],fits=s.w*s.h===w*h,exact=fits&&s.x===x&&s.y===y&&s.w===w&&s.h===h;
  return{valid:fits,exact,wrong:false,col:fits?puz.colors[puz.cells[s.cy*W+s.cx]]:null}}
function addRect(x,y,w,h,lock,quiet){const e=evalRect(x,y,w,h);if(G.diff.check&&e.valid&&!e.exact){e.valid=false;e.wrong=true}
  const r={id:G.nid++,x,y,w,h,lock:lock?1:0,exact:!!e.exact,valid:e.valid,wrong:e.wrong,col:e.col,t0:quiet?-1e9:performance.now()};
  G.rects.set(r.id,r);for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++)G.cellR[b*G.W+a]=r.id;
  if(r.valid){G.covered+=w*h;G.pctx.fillStyle=r.col;G.pctx.fillRect(x,y,w,h)}
  if(!quiet)G.animUntil=performance.now()+260;return r}
function removeRect(id){const r=G.rects.get(id);if(!r)return;G.rects.delete(id);for(let b=r.y;b<r.y+r.h;b++)for(let a=r.x;a<r.x+r.w;a++)G.cellR[b*G.W+a]=-1;
  if(r.valid){G.covered-=r.w*r.h;G.pctx.clearRect(r.x,r.y,r.w,r.h)}}
const pct=()=>Math.floor((G.covered-G.given)/Math.max(1,G.N-G.given)*100);
function hud(){if(!G)return;
  if(A){$('#gTime').textContent=Math.ceil(A.time)+' s';$('#gPct').textContent='Zeit';$('#gProg').style.width=Math.min(100,A.time/75*100)+'%';$('#gNum').classList.toggle('warn',A.time<15);$('#gSub').textContent=`${A.score} Punkte`}
  else{$('#gTime').textContent=G.limit?fmt(Math.max(0,G.limit-G.time)):fmt(G.time);$('#gNum').classList.toggle('warn',!!G.limit&&G.limit-G.time<20);$('#gPct').textContent=pct()+' %';$('#gProg').style.width=pct()+'%'}}
function toolbar(){const b=(id,ic,l)=>{$(id).innerHTML=ic+`<span>${l}</span>`};b('#tUndo',I.undo,'Zurück');b('#tHint',I.hint,A?'Tipp −8 s':'Tipp');
  b('#tMode',tool==='draw'?I.draw:I.pan,tool==='draw'?'Zeichnen':'Schieben');$('#tMode').classList.toggle('act',tool==='pan');b('#tFit',I.fit,'Ganz');b('#tSet',I.gear,'Optionen')}
let saveT=0;
function saveNow(){if(!G||A||TUT||G.won||G.meta.mode==='sprint'||G.meta.mode==='rule')return;const p=G.puz,pl=[...G.rects.values()].filter(r=>!(r.lock&&r.w*r.h===1)).map(r=>[r.x,r.y,r.w,r.h,r.lock]);
  if(!pl.length&&!G.meta.sid)return;const sid=G.meta.sid||(G.meta.sid='s'+Date.now().toString(36)+Math.floor(Math.random()*1e3)),thumb=G.paint.toDataURL();
  if(!store.set('sv.'+sid,{meta:G.meta,W:p.W,H:p.H,colors:p.colors,data:enc(p.cells),sol:p.rects.flatMap(r=>[r.x,r.y,r.w,r.h,r.cx,r.cy]),pl,time:Math.round(G.time),hints:G.hints,pct:pct(),thumb})){
    if(!saveNow.warned){saveNow.warned=1;toast('Der Speicher des Geräts ist voll, dieses Bild wird gerade nicht gesichert. Lösche ein angefangenes Bild, um Platz zu schaffen.',6000)}return}
  const ix=saves().filter(s=>s.sid!==sid);ix.unshift({sid,name:G.meta.name,id:G.meta.id||null,W:p.W,H:p.H,pct:pct(),time:Math.round(G.time),at:Date.now(),thumb});store.set('saves',ix)}
function changed(){hud();requestDraw();clearTimeout(saveT);saveT=setTimeout(saveNow,1200);if(G.covered===G.N&&!G.won)win();else tutCheck()}

