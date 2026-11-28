/* ================= LABYRINTH: Regeln, Generator, Prüfung ================= */
if(typeof module!=='undefined'&&typeof mulberry32==='undefined'){const C=require('../pixaku/core.js');global.mulberry32=C.mulberry32;global.hashStr=C.hashStr}
/* Feldarten: 0 Wand, 1 Boden, 2 Gegenstand, 3 Wasser, 4 Loch. Richtungen: 0 rechts, 1 links, 2 unten, 3 oben.
   Schlösser: L.locks=[{d:Türfeld,k:Schlüsselfeld,bomb}], der Spielstand dazu ist eine Bitmaske der geöffneten Schlösser. */
const LDIR=[[1,0],[-1,0],[0,1],[0,-1]];
const labNearXY=(W,a,b)=>Math.abs(a%W-b%W)<=1&&Math.abs(((a/W)|0)-((b/W)|0))<=1;
const labNear=(L,k,i)=>labNearXY(L.W,L.locks[k].k,i);
function labSlide(L,pos,d,mask,raw){
  const W=L.W,H=L.H,g=L.grid,cells=[],lim=W*H*2;let x=pos%W,y=(pos/W)|0,dx=LDIR[d][0],dy=LDIR[d][1],dead=false,bad=false,hit=-1,keys=0;
  for(;;){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)break;const i=ny*W+nx,c=g[i];if(c!==1&&c!==4)break;const dr=L.doorAt[i];if(dr>=0&&!(mask>>dr&1))break;
    x=nx;y=ny;cells.push(i);if(c===4){dead=true;break}if(cells.length>lim){bad=true;break}
    const ky=L.keyAt[i];if(ky>=0&&!(mask>>ky&1)){keys|=1<<ky;if(L.locks[ky].bomb)hit=ky}
    const a=L.arr[i];if(a>=0){dx=LDIR[a][0];dy=LDIR[a][1]}
    const bm=L.bmp[i];if(bm){const t=dx;if(bm===1){dx=-dy;dy=-t}else{dx=dy;dy=t}}
    const p=L.port[i];if(p>=0){x=p%W;y=(p/W)|0;cells.push(p)}}
  const end=y*W+x;let trap=false;
  /* Bombe: der Zug gilt nur, wenn man danach mit einem weiteren Zug aus dem Sprengkreis kommt */
  if(hit>=0&&!raw&&!dead&&!bad&&labNear(L,hit,end)){trap=true;for(let k=0;k<4;k++){const s=labSlide(L,end,k,mask,true);if(!s.dead&&!s.bad&&s.cells.length&&!labNear(L,hit,s.end)){trap=false;break}}}
  /* Wachen und Krähen: Ein Zug über ihren Laufweg gilt nur, wenn es ein Zeitfenster gibt, in dem man unberührt durchkommt */
  if(!raw&&!trap&&!dead&&L.guards.length){let touch=false;for(const c of cells)if(L.gAt[c]>=0){touch=true;break}
    if(touch){const key=(pos*4+d)*8+mask;let ok=L.gc.get(key);if(ok===undefined){ok=labDodge(L,pos,cells,end);L.gc.set(key,ok)}if(!ok)trap=true}}
  return{end,cells,dead,bad,trap,keys};
}
/* Zeitablauf wie im Spiel: Die Kugel braucht je Zug höchstens 0,82 s, ein Wächter 0,64 s je Feld */
const LG_STEP=.64,LG_OFF=1.37,LG_K=[1.25,1/1.2,.625]; /* Zeitfaktor je Rollgeschwindigkeit: langsam, normal, schnell */
let labK=LG_K[1];
function labGuardPos(L,k,t){const cells=L.guards[k],n=cells.length-1,W=L.W;let ph=(t/LG_STEP+k*LG_OFF)%(2*n);if(ph<0)ph+=2*n;const p=ph<n?ph:2*n-ph,i0=Math.min(n-1,Math.floor(p)),f=p-i0,a=cells[i0],b=cells[i0+1];return[a%W+(b%W-a%W)*f,((a/W)|0)+(((b/W)|0)-((a/W)|0))*f]}
/* Bewegungsablauf eines Zuges, für Spiel und Prüfung derselbe: sanft anrollen, beschleunigen, vor Wasser abbremsen, gegen Wände ungebremst prallen. Portale teilen den Zug in Abschnitte. */
function labRollPlan(L,pos,cells,kk){const K=kk||labK,W=L.W,pts=[pos].concat(cells),far=(a,b)=>Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0))!==1,legs=[];let cur=[0];
  for(let i=1;i<pts.length;i++){if(far(pts[i-1],pts[i])){legs.push(cur);cur=[i]}else cur.push(i)}legs.push(cur);
  const n=pts.length;let soft=false;if(n>1&&!far(pts[n-2],pts[n-1])){const d=pts[n-1]-pts[n-2],nx=pts[n-1]+d;soft=nx>=0&&nx<W*L.H&&!far(pts[n-1],nx)&&L.grid[nx]===3}
  const segs=[];let t=0;legs.forEach((lg,k)=>{const m=lg.length-1,first=k===0,last=k===legs.length-1,T=m?K*Math.min(.82,.105+.057*m)*(first?1.12:.8)*(last&&soft?1.25:1):0;segs.push({lg,m,t0:t,T,mode:first&&last?(soft?0:1):first?1:last&&soft?2:3});t+=T;if(!last)t+=.18*K});
  const ease=(mode,u)=>mode===0?(u<.5?2*u*u:1-2*(1-u)*(1-u)):mode===1?Math.pow(u,1.7):mode===2?1-(1-u)*(1-u):u,xy=i=>[pts[i]%W,(pts[i]/W)|0];
  const state=tt=>{for(let k=0;k<segs.length;k++){const sg=segs[k],last=k===segs.length-1,end=sg.t0+sg.T;
      if(tt<end||last){if(!sg.m){const[x,y]=xy(sg.lg[0]);return{x,y,sc:1,arr:sg.lg[0]}}const u=Math.min(1,Math.max(0,(tt-sg.t0)/sg.T)),s=ease(sg.mode,u)*sg.m,i=Math.min(sg.m-1,Math.floor(s)),f=s-i,[ax,ay]=xy(sg.lg[i]),[bx,by]=xy(sg.lg[i+1]);return{x:ax+(bx-ax)*f,y:ay+(by-ay)*f,sc:1,arr:sg.lg[0]+Math.min(sg.m,Math.floor(s+1e-6))}}
      if(tt<end+.18*K){const u=(tt-end)/(.18*K),[x,y]=xy(u<.5?sg.lg[sg.m]:segs[k+1].lg[0]);return{x,y,sc:Math.abs(1-2*u),arr:sg.lg[sg.m]}}}};
  return{pts,T:t,soft,state,ball(tt){const s=state(Math.min(tt,t));return[s.x,s.y]}}}
/* Trifft die Kugel auf diesem Zug einen Wächter, wenn sie zur Zeit t0 losrollt? r = Abstand, ab dem es als Treffer zählt */
function labHit(L,plan,t0,r,ks){for(let t=0;t<=plan.T+.02;t+=.025){const[bx,by]=plan.ball(Math.min(t,plan.T));for(const k of ks){const[gx,gy]=labGuardPos(L,k,t0+t);if(Math.abs(gx-bx)<r&&Math.abs(gy-by)<r)return true}}return false}
/* Ausweichbar heißt: Der Zug endet nicht auf einem Laufweg, und es gibt ein Startfenster von mindestens 0,4 s, großzügiger gerechnet als im Spiel */
function labDodge(L,pos,cells,end){if(L.gAt[end]>=0)return false;const ks=[];for(const c of cells){const k=L.gAt[c];if(k>=0&&!ks.includes(k))ks.push(k)}
  const plan=labRollPlan(L,pos,cells,LG_K[0]),S=192,dt=15.36/S,ok=new Uint8Array(S);let any=false;for(let s=0;s<S;s++){ok[s]=labHit(L,plan,s*dt,.66,ks)?0:1;if(ok[s])any=true}if(!any)return false;
  let run=0,best=0;for(let s=0;s<S*2;s++){if(ok[s%S]){run++;if(run>best)best=run}else run=0}return best>=5}
/* Prüft über alle Zustände (Position, geöffnete Schlösser): Von überall führt ein Weg zum Start mit allen Schlössern offen, und von dort ist jedes Feld erreichbar. */
/* Ein Tor zählt nur, wenn es wirklich einen Zugang versperrt: Ist es zu, kommt man vom Start aus zu Fuß nicht mehr in den Bereich dahinter. Der Schlüssel liegt auf der Startseite. */
function labGate(L,id){const W=L.W,N=W*L.H,lk=L.locks[id],seen=new Uint8Array(N),q=[L.start];seen[L.start]=1;
  while(q.length){const p=q.pop(),nb=[p-1,p+1,p-W,p+W];if(L.port[p]>=0)nb.push(L.port[p]);for(const c of nb)if(c>=0&&c<N&&!seen[c]&&c!==lk.d&&L.grid[c]===1){seen[c]=1;q.push(c)}}
  let beh=0,tot=0;for(let i=0;i<N;i++)if(L.grid[i]===1&&i!==lk.d){tot++;if(!seen[i])beh++}return !!seen[lk.k]&&beh>=Math.max(4,tot*.12)}
function labCheck(L){
  const W=L.W,N=W*L.H,full=(1<<L.locks.length)-1,M=full+1,seen=new Uint8Array(N*M),q=[L.start*M],rev=new Map(),no=st=>({ok:false,un:[],stuck:st||[]});seen[q[0]]=1;
  for(let h=0;h<q.length;h++){const s0=q[h],p=(s0/M)|0,m=s0%M;for(let d=0;d<4;d++){const s=labSlide(L,p,d,m);if(s.bad)return no();if(s.dead||s.trap||!s.cells.length)continue;
      const t=s.end*M+(m|s.keys);let l=rev.get(t);if(!l)rev.set(t,l=[]);l.push(s0);if(!seen[t]){seen[t]=1;q.push(t)}}}
  const goal=L.start*M+full;if(!seen[goal])return no();
  const ok=new Uint8Array(N*M),b=[goal];ok[goal]=1;while(b.length){const t=b.pop(),l=rev.get(t);if(l)for(const a of l)if(!ok[a]){ok[a]=1;b.push(a)}}
  const st=[];for(const s of q)if(!ok[s])st.push((s/M)|0);if(st.length)return no(st);
  const cover=new Uint8Array(N),sn=new Uint8Array(N),qq=[L.start];sn[L.start]=cover[L.start]=1;
  while(qq.length){const p=qq.pop();for(let d=0;d<4;d++){const s=labSlide(L,p,d,full);if(s.bad)return no();if(s.dead||s.trap||!s.cells.length)continue;for(const c of s.cells)cover[c]=1;if(!sn[s.end]){sn[s.end]=1;qq.push(s.end)}}}
  const un=[];for(let i=0;i<N;i++)if(L.grid[i]===1&&!cover[i])un.push(i);return{ok:true,un,cover};
}
/* Ein Schlund zählt nur, wenn eine Rollbahn von einem erreichbaren Haltepunkt aus hineinführt */
function labThreat(L,hole){const N=L.W*L.H,full=(1<<L.locks.length)-1,sn=new Uint8Array(N),q=[L.start];sn[L.start]=1;
  while(q.length){const p=q.pop();for(let d=0;d<4;d++){const s=labSlide(L,p,d,full);if(s.dead){if(s.cells[s.cells.length-1]===hole)return true;continue}if(s.bad||!s.cells.length)continue;if(!sn[s.end]){sn[s.end]=1;q.push(s.end)}}}return false}
/* Schwierigkeit: Felder, die nur ein einziger Zug überstreicht und die erst nach mehreren richtigen Zügen erreichbar sind */
function labDiff(L){
  const W=L.W,N=W*L.H,full=(1<<L.locks.length)-1,dep=new Int16Array(N).fill(-1),cnt=new Uint8Array(N),md=new Int16Array(N).fill(999),q=[L.start];dep[L.start]=0;
  for(let h=0;h<q.length;h++){const p=q[h];for(let d=0;d<4;d++){const s=labSlide(L,p,d,full);if(s.dead||s.bad||!s.cells.length)continue;for(const c of s.cells){if(cnt[c]<9)cnt[c]++;if(dep[p]+1<md[c])md[c]=dep[p]+1}if(dep[s.end]<0){dep[s.end]=dep[p]+1;q.push(s.end)}}}
  let sc=0,hard=0;for(let i=0;i<N;i++)if(L.grid[i]===1&&i!==L.start){if(cnt[i]<=1&&md[i]>=3){sc+=md[i]-1;hard++}else if(cnt[i]<=2&&md[i]>=4)sc+=(md[i]-2)*.4}
  return{score:sc,hard};
}
function labSettle(L){ /* Sackgassen und unerreichbare Felder nach und nach mit Gegenständen entschärfen: jeder Gegenstand schafft neue Haltepunkte */
  const free=i=>L.keyAt[i]<0&&L.doorAt[i]<0&&i!==L.start&&L.port[i]<0&&L.arr[i]<0&&!L.bmp[i]&&!(L.keep&&L.keep[i]);
  for(let k=0;k<150;k++){const r=labCheck(L);
    if(!r.ok){if(!r.stuck.length)return false;let c=r.stuck.filter(free);
      if(!c.length||L.rnd()<.4){const o=r.stuck[Math.floor(L.rnd()*r.stuck.length)],W=L.W;c=[];for(let b=-3;b<4;b++)for(let a=-3;a<4;a++){const x=o%W+a,y=((o/W)|0)+b,i=y*W+x;if(x>0&&y>0&&x<W-1&&y<L.H-1&&L.grid[i]===1&&free(i))c.push(i)}}
      if(!c.length)return false;L.grid[c[Math.floor(L.rnd()*c.length)]]=2;continue}
    if(!r.un.length)return true;const W=L.W,fr=r.un.filter(i=>r.cover[i+1]||r.cover[i-1]||r.cover[i+W]||r.cover[i-W]);let c=fr.filter(free);
    if(!fr.length){const isUn=new Uint8Array(L.W*L.H);for(const i of r.un)isUn[i]=1;const p=[];for(let i=W;i<L.W*L.H-W;i++)if(L.grid[i]===2&&(isUn[i+1]||isUn[i-1]||isUn[i+W]||isUn[i-W])&&(r.cover[i+1]||r.cover[i-1]||r.cover[i+W]||r.cover[i-W]))p.push(i);
      if(!p.length)return false;L.grid[p[Math.floor(L.rnd()*p.length)]]=1;continue}
    if(!c.length||L.rnd()<.25){for(const o of fr)for(let b=-2;b<3;b++)for(let a=-2;a<3;a++){const x=o%W+a,y=((o/W)|0)+b,i=y*W+x;if(x>0&&y>0&&x<W-1&&y<L.H-1&&L.grid[i]===1&&free(i))c.push(i)}}
    if(!c.length)return false;
    for(let m=Math.max(1,Math.ceil(fr.length*.12));m>0&&c.length;m--)L.grid[c.splice(Math.floor(L.rnd()*c.length),1)[0]]=2}
  return false;
}
/* Ein kurzer Lösungsweg: immer der nächste Zug, der neue Felder berührt */
function labNextPath(L,pos,painted,mask){
  const N=L.W*L.H,seen=new Uint8Array(N),q=[[pos,[]]];seen[pos]=1;
  for(let h=0;h<q.length;h++){const[a,path]=q[h];for(let d=0;d<4;d++){const s=labSlide(L,a,d,mask);if(s.dead||s.trap||s.bad||!s.cells.length)continue;
      let nw=false;for(const c of s.cells)if(!painted[c]&&L.grid[c]===1){nw=true;break}
      if(nw)return path.concat(d);if(!seen[s.end]){seen[s.end]=1;q.push([s.end,path.concat(d)])}}}
  /* Nichts Neues erreichbar: Dann führt der Weg zum nächsten Schlüssel oder zur nächsten Bombe, auch über schon leuchtende Felder */
  seen.fill(0);seen[pos]=1;const q2=[[pos,[]]];
  for(let h=0;h<q2.length;h++){const[a,path]=q2[h];for(let d=0;d<4;d++){const s=labSlide(L,a,d,mask);if(s.dead||s.trap||s.bad||!s.cells.length)continue;
      if(s.keys&~mask)return path.concat(d);if(!seen[s.end]){seen[s.end]=1;q2.push([s.end,path.concat(d)])}}}
  return null;
}
function labGreedy(L){
  const N=L.W*L.H,painted=new Uint8Array(N),moves=[];let pos=L.start,mask=0,left=0;
  for(let i=0;i<N;i++)if(L.grid[i]===1)left++;painted[pos]=1;left--;
  while(left>0){const path=labNextPath(L,pos,painted,mask);if(!path||moves.length>5000)return null;
    for(const d of path){const s=labSlide(L,pos,d,mask);for(const c of s.cells)if(!painted[c]&&L.grid[c]===1){painted[c]=1;left--}pos=s.end;moves.push(d);mask|=s.keys}}
  return moves;
}
/* ---------- Welten: Größe, Zutaten und Schwierigkeit je Level ---------- */
const LW_N=15,LW_C=13,
  LW_SIZE=[[6,8,11,15],[7,10,12,16],[8,11,12,16],[8,11,12,16],[8,11,12,17],[8,11,12,17],[9,12,13,17],[8,11,13,17],[9,12,13,18],[9,12,13,18],[9,12,13,18],[9,12,13,18],[9,12,14,18]],
  /* Zutaten je Welt: p Portale, k höchste Zahl an Schlössern, b Bomben (1 gemischt, 2 nur Bomben), a Eisrinnen, g Wachen, rm Zimmer, wa Wasser, h Schlünde */
  LW_F=[{},{g:1},{p:1,rm:1},{p:1,m:.7},{p:1,k:1,wa:.15,m:.4},{p:1,k:1,g:1,m:.4},{p:1,k:3,b:1,g:1,rm:1},{p:1,k:1,b:1,a:1.7},{p:1,k:1,b:1,a:1},{p:1,k:2,b:2,a:.5},{p:1,k:1,a:.9,wa:.15,h:1.3},{p:1,k:1,b:1,a:1,g:1},{p:1,k:3,b:1,a:1,g:1,rm:1}],
  /* Verlauf einer Welt: Größe und Schwierigkeit wechseln sich ab und steigern sich gegenseitig */
  LW_U=[.1,.4,.5,.15,.8,.55,.2,.9,.6,.25,.95,.65,1,.5,1],LW_D=[0,0,1,2,0,1,2,1,2,3,1,2,2,3,2];
function labSpec(n,world){
  const k=Math.floor((n-1)/LW_N),end=k>=LW_C,w=world!==undefined?world:end?[8,9,10,11,12,6,4][k%7]:k,j=(n-1)%LW_N,F=LW_F[w],u=LW_U[j],df=LW_D[j],S=LW_SIZE[w],W=Math.round(S[0]+(S[2]-S[0])*u),H=Math.round(S[1]+(S[3]-S[1])*u),a=W*H/100,rm=!!F.rm,locks=[];
  if(F.k){const nl=Math.min(F.k,a>2.3?3:a>1.2?2:1);for(let i=0;i<nl;i++)locks.push(F.b===2||(F.b&&(i+j)%2===0)?'bomb':'key')}
  const ar=!rm&&[4,7,10,12,14].includes(j);
  return{W:ar?Math.min(23,Math.round(W*1.4)):W,H:ar?Math.round(H*1.3):H,w,j,df,areas:ar?Math.min(4,2+(u>.85?1:0)+(w>=6?1:0)):0,bridge:[3,4,5,7,8,9,10].includes(w),style:rm?'rooms':ar?'areas':'cave',holes:w===0&&j<5?0:w===0&&j===5?1:Math.round(a*(.9+df*.35)*(w<1?.8:1.05)*(F.h||1)),holeSafe:w===0&&j===5,ports:F.p?Math.min(4,1+Math.floor(a/1.6)):0,locks,
    arr:F.a?Math.round(a*F.a):0,bmp:F.m?Math.max(1,Math.round(a*F.m)):w>=8?Math.round(a*.5):0,stars:w===0&&j<10?0:Math.min(5,1+Math.floor(a/1.2)),water:rm?0:F.wa||.06,guards:F.g&&j>=({1:5,5:2}[w]||0)?Math.min(4,1+Math.floor(a/1.4)):0,cand:[3,1,rm?3:6,rm?4:10][df]};
}
function labGenSpec(sp,seedStr,depth){
  const rng=mulberry32(hashStr('lab3'+seedStr)),ri=k=>Math.floor(rng()*k),rm=sp.style==='rooms';let W=sp.W,H=sp.H,N=W*H,area=(W-2)*(H-2),bridge=null,first=null;
  const count=(g,v)=>{let c=0;for(let i=0;i<N;i++)if(g[i]===v)c++;return c};
  for(let att=0;att<90;att++){
    W=sp.W;H=sp.H;N=W*H;first=null;bridge=null;let fail=false,g=new Uint8Array(N),room=new Int8Array(N).fill(-1),keep=new Uint8Array(N);const rooms=[],lax=att>45?.8:1;
    if(rm){ /* Grundriss: getrennte Zimmer, durch Flure verbunden */
      const cen=[];for(let t=0,want=Math.max(3,Math.round(area/17));t<want*30&&rooms.length<want;t++){const w=3+ri(4),h=3+ri(4),x=1+ri(Math.max(1,W-1-w)),y=1+ri(Math.max(1,H-1-h));if(x+w>W-1||y+h>H-1)continue;
        if(rooms.some(r=>x<r.x+r.w+1&&r.x<x+w+1&&y<r.y+r.h+1&&r.y<y+h+1))continue;rooms.push({x,y,w,h,type:0});cen.push([x+(w>>1),y+(h>>1)])}
      if(rooms.length<2)continue;const t0=ri(4),ord=rooms.map((_,k)=>k).sort((p,q)=>(cen[p][1]*3+cen[p][0])-(cen[q][1]*3+cen[q][0]));
      rooms.forEach((r,k)=>{r.type=(k+t0)%4;for(let b=r.y;b<r.y+r.h;b++)for(let a=r.x;a<r.x+r.w;a++){g[b*W+a]=1;room[b*W+a]=k}});
      const link=(p,q)=>{let[x,y]=cen[p];const[tx,ty]=cen[q],hx=()=>{while(x!==tx){g[y*W+x]=1;keep[y*W+x]=room[y*W+x]<0?1:0;x+=x<tx?1:-1}},vy=()=>{while(y!==ty){g[y*W+x]=1;keep[y*W+x]=room[y*W+x]<0?1:0;y+=y<ty?1:-1}};if(rng()<.5){hx();vy()}else{vy();hx()}};
      for(let k=1;k<ord.length;k++)link(ord[k-1],ord[k]);for(let k=2;k<ord.length;k++)if(rng()<.45)link(ord[k-2],ord[k]);
      for(let i=0;i<N;i++)if(g[i]===1&&!keep[i]&&rng()<.09)g[i]=2}
    else if(sp.style==='areas'){ /* mehrere Areale, durch schmale Wege oder Brücken verbunden */
      const rs=[],links=[];bridge=new Uint8Array(N);
      for(let t=0;t<400&&rs.length<sp.areas;t++){const w=6+ri(4),h=6+ri(5);let x,y,par=-1,dir=0;
        if(!rs.length){x=1+ri(Math.max(1,W-w-1));y=1+ri(Math.max(1,H-h-1))}
        else{par=ri(rs.length);const p=rs[par],gap=3+ri(3);dir=ri(4);
          if(dir<2){y=p.y-h+3+ri(p.h+h-5);x=dir===0?p.x+p.w+gap:p.x-gap-w}else{x=p.x-w+3+ri(p.w+w-5);y=dir===2?p.y+p.h+gap:p.y-gap-h}}
        if(x<1||y<1||x+w>W-1||y+h>H-1||rs.some(r=>x<r.x+r.w+3&&r.x<x+w+3&&y<r.y+r.h+3&&r.y<y+h+3))continue;
        rs.push({x,y,w,h});if(par>=0)links.push([par,rs.length-1,dir])}
      if(rs.length<2)continue;area=0;
      /* jedes Areal bekommt innen sein eigenes kleines Gewirr aus Kammern und Gängen */
      for(const r of rs){area+=r.w*r.h;const cen=[],nR=Math.max(2,Math.round(r.w*r.h/12))+ri(2);
        for(let k=0;k<nR;k++){const w=2+ri(4),h=2+ri(4),x=r.x+ri(Math.max(1,r.w-w+1)),y=r.y+ri(Math.max(1,r.h-h+1));for(let b=y;b<Math.min(r.y+r.h,y+h);b++)for(let a=x;a<Math.min(r.x+r.w,x+w);a++)g[b*W+a]=1;cen.push([Math.min(r.x+r.w-1,x+(w>>1)),Math.min(r.y+r.h-1,y+(h>>1))])}
        for(let k=1;k<cen.length;k++){let[x,y]=cen[k-1];const[tx,ty]=cen[k];while(x!==tx){g[y*W+x]=1;x+=x<tx?1:-1}while(y!==ty){g[y*W+x]=1;y+=y<ty?1:-1}g[y*W+x]=1}
        for(let b=r.y;b<r.y+r.h;b++)for(let a=r.x;a<r.x+r.w;a++)if(g[b*W+a]===1&&rng()<.07)g[b*W+a]=2}
      /* Verbindung: gerade Linie von Boden zu Boden, das freie Stück dazwischen ist Weg oder Brücke */
      for(const[pa,ch,dir]of links){const p=rs[pa],q=rs[ch],hz=dir<2,lo=hz?Math.max(p.y,q.y):Math.max(p.x,q.x),hi=(hz?Math.min(p.y+p.h,q.y+q.h):Math.min(p.x+p.w,q.x+q.w))-1,fwd=dir===0||dir===2,A=fwd?p:q,B=fwd?q:p;let done=false;
        for(let tr=0;tr<12&&!done;tr++){const line=lo+ri(hi-lo+1),at=k=>hz?line*W+k:k*W+line,e0=hz?A.x+A.w-1:A.y+A.h-1,e1=hz?B.x:B.y,s0=hz?A.x:A.y,s1=hz?B.x+B.w-1:B.y+B.h-1;let a0=e0,b0=e1;
          while(a0>=s0&&g[at(a0)]!==1)a0--;while(b0<=s1&&g[at(b0)]!==1)b0++;if(a0<s0||b0>s1)continue;
          for(let k=a0;k<=b0;k++){const i=at(k);g[i]=1;keep[i]=1;if(k>e0&&k<e1){bridge[i]=1;if(sp.bridge)for(const o of hz?[i-W,i+W]:[i-1,i+1])if(g[o]===0)g[o]=3}}done=true}
        if(!done)fail=true}
      if(fail)continue;
      /* auf das belegte Rechteck zuschneiden */
      {let x0=W,y0=H,x1=0,y1=0;for(let i=0;i<N;i++)if(g[i]){const x=i%W,y=(i/W)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}x0--;y0--;x1++;y1++;const nW=x1-x0+1,nH=y1-y0+1,ng=new Uint8Array(nW*nH),nk=new Uint8Array(nW*nH),nb=new Uint8Array(nW*nH);
        for(let y=0;y<nH;y++)for(let x=0;x<nW;x++){const o=(y+y0)*W+x+x0;ng[y*nW+x]=g[o];nk[y*nW+x]=keep[o];nb[y*nW+x]=bridge[o]}
        first={x:rs[0].x-x0,y:rs[0].y-y0,w:rs[0].w,h:rs[0].h};W=nW;H=nH;N=W*H;g=ng;keep=nk;bridge=nb;room=new Int8Array(N).fill(-1)}}
    else{const cen=[],big=area>100?1:0,nR=Math.max(3,Math.round(area/(13-big*2)))+ri(2);
      for(let r=0;r<nR;r++){const w=2+big+ri(4),h=2+big+ri(4),x=1+ri(Math.max(1,W-1-w)),y=1+ri(Math.max(1,H-1-h));
        for(let b=y;b<Math.min(H-1,y+h);b++)for(let a=x;a<Math.min(W-1,x+w);a++)g[b*W+a]=1;cen.push([Math.min(W-2,x+(w>>1)),Math.min(H-2,y+(h>>1))])}
      for(let r=1;r<cen.length;r++){let[x,y]=cen[r-1];const[tx,ty]=cen[r],hf=rng()<.5;
        const hx=()=>{while(x!==tx){g[y*W+x]=1;x+=x<tx?1:-1}},vy=()=>{while(y!==ty){g[y*W+x]=1;y+=y<ty?1:-1}};
        if(hf){hx();vy()}else{vy();hx()}g[y*W+x]=1}
      for(let i=0;i<N;i++)if(g[i]===1&&rng()<.07)g[i]=2}
    const fl=[];for(let i=0;i<N;i++)if(g[i]===1&&(!first||(i%W>=first.x&&i%W<first.x+first.w&&((i/W)|0)>=first.y&&((i/W)|0)<first.y+first.h)))fl.push(i);if(fl.length<6)continue;
    const L={W,H,grid:g,start:fl[ri(fl.length)],locks:[],doorAt:new Int8Array(N).fill(-1),keyAt:new Int8Array(N).fill(-1),port:new Int32Array(N).fill(-1),arr:new Int8Array(N).fill(-1),bmp:new Int8Array(N),ports:[],stars:[],guards:[],gAt:new Int8Array(N).fill(-1),gc:new Map(),room:rm?room:null,rooms:rm?rooms:null,spec:sp,rnd:rng,keep,bridge};
    const roomsOk=()=>{if(!rm)return true;for(const r of rooms){let c=0;for(let b=r.y;b<r.y+r.h;b++)for(let a=r.x;a<r.x+r.w;a++)if(L.grid[b*W+a]===1)c++;if(c<r.w*r.h*.4)return false}return true};
    if(!labSettle(L)||!roomsOk())continue;
    const fN=count(g,1);if(fN<area*(rm?.34:first?.3:.36)*lax)continue;
    let sol=labGreedy(L);if(!sol||sol.length<Math.max(4,fN*.24*lax))continue;
    const floors=()=>{const o=[];for(let i=0;i<N;i++)if(L.grid[i]===1&&i!==L.start&&L.keyAt[i]<0&&L.doorAt[i]<0&&L.port[i]<0&&L.arr[i]<0&&!L.bmp[i])o.push(i);return o};
    const trial=(apply,valid)=>{const bg=L.grid.slice(),bp=L.port.slice(),ba=L.arr.slice(),bm0=L.bmp.slice(),bd=L.doorAt.slice(),bk=L.keyAt.slice(),bn=L.locks.length,bl=L.ports.length;apply();
      if(labSettle(L)&&count(L.grid,1)>=fN*.75&&valid()&&roomsOk())return true;L.grid.set(bg);L.port.set(bp);L.arr.set(ba);L.bmp.set(bm0);L.doorAt.set(bd);L.keyAt.set(bk);L.locks.length=bn;L.ports.length=bl;return false};
    for(let t=0,made=0;t<sp.holes*5&&made<sp.holes;t++){const c=[],fr=i=>L.grid[i]===1||L.grid[i]===4;for(let i=W+1;i<N-W-1;i++){const x=i%W;if(x<1||x>W-2)continue;if(sp.holeSafe?L.grid[i]===0&&!fr(i-1)&&!fr(i+1)&&!fr(i-W)&&!fr(i+W)&&(fr(i-W-1)||fr(i-W+1)||fr(i+W-1)||fr(i+W+1)||L.grid[i-1]===2||L.grid[i+1]===2):(L.grid[i]===1||L.grid[i]===2)&&i!==L.start&&!keep[i])c.push(i)}if(!c.length)break;const i=c[ri(c.length)];if(trial(()=>{L.grid[i]=4},()=>L.grid[i]===4&&labThreat(L,i)===!sp.holeSafe))made++}
    for(let t=0,made=0;t<sp.ports*7&&made<sp.ports;t++){const f=floors();if(f.length<8)break;const a=f[ri(f.length)],b=f[ri(f.length)];
      if(a===b||Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0))<5)continue;if(trial(()=>{L.port[a]=b;L.port[b]=a;L.ports.push([a,b])},()=>L.grid[a]===1&&L.grid[b]===1))made++}
    for(let t=0,made=0;t<sp.arr*6&&made<sp.arr;t++){const f=floors();if(f.length<8)break;const a=f[ri(f.length)],d=ri(4),nb=a+LDIR[d][0]+LDIR[d][1]*W;if(L.grid[nb]!==1)continue;
      if(trial(()=>{L.arr[a]=d},()=>L.grid[a]===1))made++}
    for(const kind of sp.locks)for(let t=0,n0=L.locks.length;t<90&&L.locks.length===n0;t++){const f=floors();if(f.length<8)break;const fb=bridge&&t<28?f.filter(i=>bridge[i]):[],d=fb.length?fb[ri(fb.length)]:f[ri(f.length)],k=f[ri(f.length)],x=d%W,y=(d/W)|0,bl=i=>L.grid[i]!==1&&L.grid[i]!==4;
      if(d===k||x<1||y<1||x>W-2||y>H-2||labNearXY(W,d,k)||L.locks.some(q=>labNearXY(W,q.d,d)||labNearXY(W,q.k,k)))continue;const hor=bl(d-W)&&bl(d+W)&&!bl(d-1)&&!bl(d+1),ver=bl(d-1)&&bl(d+1)&&!bl(d-W)&&!bl(d+W);if(!hor&&!ver)continue;
      trial(()=>{const id=L.locks.length;L.locks.push({d,k,bomb:kind==='bomb'});L.doorAt[d]=id;L.keyAt[k]=id},()=>L.grid[d]===1&&L.grid[k]===1&&labGate(L,L.locks.length-1))}
    /* Fehlt noch ein Schloss, weil es keine Engstelle gibt, wird eine gebaut: eine Mauer quer durch das Level mit dem Tor als einzigem Durchgang */
    for(let li=L.locks.length;li<sp.locks.length;li++){const kind=sp.locks[li];for(let t=0,n0=L.locks.length;t<50&&L.locks.length===n0;t++){const hz=ri(2)===0,ln=2+ri((hz?H:W)-4),at=k=>hz?ln*W+k:k*W+ln,len=hz?W:H,st=hz?W:1,cells=[];let bad=false;
        for(let k=1;k<len-1;k++){const i=at(k),g=L.grid[i];if(g===1||g===2||g===4){if(i===L.start||(keep&&keep[i])||L.port[i]>=0||L.arr[i]>=0||L.keyAt[i]>=0||L.doorAt[i]>=0||L.bmp[i]){bad=true;break}cells.push(i)}}
        if(bad||cells.length<2)continue;const cand=cells.filter(i=>L.grid[i]===1&&L.grid[i-st]===1&&L.grid[i+st]===1);if(!cand.length)continue;const d=cand[ri(cand.length)],f=floors().filter(i=>!cells.includes(i));if(f.length<6)continue;const k=f[ri(f.length)];
        if(labNearXY(W,d,k)||L.locks.some(q=>labNearXY(W,q.d,d)||labNearXY(W,q.k,k)))continue;
        trial(()=>{for(const i of cells)if(i!==d)L.grid[i]=0;const id=L.locks.length;L.locks.push({d,k,bomb:kind==='bomb'});L.doorAt[d]=id;L.keyAt[k]=id},()=>L.grid[d]===1&&L.grid[k]===1&&labGate(L,L.locks.length-1))}}
    /* Prellböcke nur dort, wo sie gebraucht werden: Ein Gegenstand, ohne den das Level unlösbar wäre, wird entfernt und durch einen Prellbock ersetzt, der es wieder lösbar macht.
       Der Prellbock steht nie in einem engen Gang, und nach der Kurve geht es in beide Richtungen mindestens zwei Felder weiter. */
    if(sp.bmp){const fl=i=>L.grid[i]===1,okC=r=>r.ok&&!r.un.length,free2=(i,d)=>fl(i+LDIR[d][0]+LDIR[d][1]*W)&&fl(i+2*(LDIR[d][0]+LDIR[d][1]*W));
      const shape=(a,o)=>{const x=a%W,y=(a/W)|0;if(x<2||y<2||x>W-3||y>H-3||a===L.start||(keep&&keep[a])||L.port[a]>=0||L.arr[a]>=0||L.keyAt[a]>=0||L.doorAt[a]>=0||L.bmp[a]||(bridge&&bridge[a]))return false;
          if((!fl(a-1)&&!fl(a+1))||(!fl(a-W)&&!fl(a+W)))return false;for(let d=0;d<4;d++)if(L.bmp[a+LDIR[d][0]+LDIR[d][1]*W])return false;
          return o===1?(free2(a,1)&&free2(a,2))||(free2(a,0)&&free2(a,3)):(free2(a,1)&&free2(a,3))||(free2(a,0)&&free2(a,2))};
      for(let made=0,round=0;round<3&&made<sp.bmp;round++){const props=[];for(let i=W+1;i<N-W-1;i++){const x=i%W;if(L.grid[i]===2&&x>0&&x<W-1&&!(keep&&keep[i]))props.push(i)}
        for(let k=props.length-1;k>0;k--){const j=ri(k+1),t=props[k];props[k]=props[j];props[j]=t}let tries=0;
        for(const p of props){if(made>=sp.bmp||tries>=16)break;L.grid[p]=1;if(okC(labCheck(L))){L.grid[p]=2;continue}tries++;const f=floors();let done=false;
          for(let t=0;t<30&&!done&&f.length;t++){const a=f.splice(ri(f.length),1)[0];if(a===p)continue;for(const o of ri(2)?[1,2]:[2,1]){if(!shape(a,o))continue;L.bmp[a]=o;
              if(okC(labCheck(L))&&(sp.holeSafe||!L.grid.some((g,i)=>g===4&&!labThreat(L,i)))){done=true;break}L.bmp[a]=0}}
          if(done)made++;else L.grid[p]=2}}
      /* Im ersten Level der Stadt steht auf jeden Fall einer, damit man ihn kennenlernt */
      if(sp.w===3&&sp.j===0&&!L.bmp.some(v=>v))for(let t=0;t<60;t++){const f=floors();if(!f.length)break;const a=f[ri(f.length)],o=1+ri(2);if(shape(a,o)&&trial(()=>{L.bmp[a]=o},()=>L.grid[a]===1))break}}
    {const f=floors();for(let s=0;s<sp.stars&&f.length;s++)L.stars.push(f.splice(ri(f.length),1)[0])}
    L.shields=[];if(sp.w>=2&&!sp.holeSafe&&(sp.j*3+sp.w)%5<2&&L.grid.some(g=>g===4)){const f=floors().filter(i=>!L.stars.includes(i)&&i!==L.start);if(f.length)L.shields.push(f[ri(f.length)])}
    if(sp.water&&!first)for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(L.grid[i]===0&&(rng()<sp.water||((L.grid[i-1]===3||L.grid[i-W]===3)&&rng()<.55)))L.grid[i]=3}
    /* Schlünde, die nach allen Umbauten auf keiner Rollbahn mehr liegen, werden zu Gegenständen */
    if(!sp.holeSafe)for(let i=0;i<N;i++)if(L.grid[i]===4&&!labThreat(L,i)){L.grid[i]=2;const r=labCheck(L);if(!r.ok||r.un.length)L.grid[i]=4}
    if(!L.grid.some(g=>g===4))L.shields=[];
    /* Wachen: kurze gerade Laufwege auf freien Feldern, fern vom Start */
    if(sp.guards){const used=new Uint8Array(N),stop=new Uint8Array(N),sq=[L.start],fm=(1<<L.locks.length)-1;stop[L.start]=1;
      /* Laufwege nur über Felder, auf denen die Kugel nie zum Stehen kommt */
      for(let m=0;m<=fm;m++){const q2=sq.slice(),sn=new Uint8Array(N);for(const p of q2)sn[p]=1;while(q2.length){const p=q2.pop();for(let d=0;d<4;d++){const s=labSlide(L,p,d,m,true);if(s.dead||s.bad||!s.cells.length)continue;stop[s.end]=1;if(!sn[s.end]){sn[s.end]=1;q2.push(s.end);if(m<fm)sq.push(s.end)}}}}
      /* Flieger ziehen auf einer geraden Bahn von vier bis fünf Feldern hin und her, auch über Wände und Gegenstände hinweg. Bodenfelder auf der Bahn dürfen keine Haltepunkte sein. */
      const sx=L.start%W,sy=(L.start/W)|0;
      for(let t=0;t<sp.guards*60&&L.guards.length<sp.guards;t++){const len=4+ri(2),hor=rng()<.5,x0=1+ri(Math.max(1,W-2-(hor?len-1:0))),y0=1+ri(Math.max(1,H-2-(hor?0:len-1))),cells=[];let ok=true,fl=0;
        for(let k=0;k<len&&ok;k++){const x=x0+(hor?k:0),y=y0+(hor?0:k),i=y*W+x;if(x>W-2||y>H-2||used[i]||used[i+1]||used[i-1]||used[i+W]||used[i-W]||L.grid[i]===4){ok=false;break}
          if(L.grid[i]===1){if(stop[i]||L.port[i]>=0||L.arr[i]>=0||L.bmp[i]||L.keyAt[i]>=0||L.doorAt[i]>=0||Math.abs(x-sx)+Math.abs(y-sy)<3)ok=false;fl++}cells.push(i)}
        if(!ok||fl<1||fl>len-1)continue;
        /* nur behalten, wenn das Level auch mit dieser Bahn lösbar und ohne Sackgasse bleibt */
        const id=L.guards.length;L.guards.push(cells);cells.forEach(c=>L.gAt[c]=id);L.gc.clear();const r=labCheck(L);if(!r.ok||r.un.length){L.guards.pop();cells.forEach(c=>L.gAt[c]=-1);L.gc.clear();continue}cells.forEach(c=>used[c]=1)}}
    sol=labGreedy(L);if(!sol)continue;L.sol=sol;L.par=sol.length;L.floor=count(L.grid,1);L.diff=labDiff(L);return L;
  }
  if((depth|0)<2)return labGenSpec(sp,seedStr+'~',(depth|0)+1);
  if(W>8)return labGenSpec(Object.assign({},sp,{W:W-2,H:H-3,holes:Math.round(sp.holes*.8)}),seedStr+'s',0);
  const g=new Uint8Array(N);for(let x=1;x<W-1;x++)g[W+x]=g[(H-2)*W+x]=1;for(let y=1;y<H-1;y++)g[y*W+1]=g[y*W+W-2]=1;
  const L={W,H,grid:g,start:W+1,locks:[],doorAt:new Int8Array(N).fill(-1),keyAt:new Int8Array(N).fill(-1),port:new Int32Array(N).fill(-1),arr:new Int8Array(N).fill(-1),bmp:new Int8Array(N),ports:[],stars:[],guards:[],gAt:new Int8Array(N).fill(-1),gc:new Map(),room:null,rooms:null,spec:sp,rnd:rng,keep:null,fallback:true};L.sol=labGreedy(L)||[];L.par=L.sol.length;L.floor=count(g,1);L.diff={score:0,hard:0};return L;
}
/* Handgebaute Level aus Zeilen: # Wand, . Boden, o Gegenstand, X Schlund, ~ Wasser, S Start, Buchstaben als Marken */
function labAscii(rows){const W=rows[0].length,H=rows.length,N=W*H,g=new Uint8Array(N),marks={};let st=0;rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const i=y*W+x;g[i]=ch==='#'?0:ch==='o'?2:ch==='X'?4:ch==='~'?3:1;if(ch==='S')st=i;else if(/[A-Z]/.test(ch)&&ch!=='X'){marks[ch]=i;g[i]=2}}));
  const L={W,H,grid:g,start:st,locks:[],doorAt:new Int8Array(N).fill(-1),keyAt:new Int8Array(N).fill(-1),port:new Int32Array(N).fill(-1),arr:new Int8Array(N).fill(-1),bmp:new Int8Array(N),ports:[],stars:[],guards:[],gAt:new Int8Array(N).fill(-1),gc:new Map(),room:null,rooms:null,marks,sol:[],par:0};return L}
/* Bossarenen */
const LBOSS={schrat:{rows:['###########','#S....o...#','#.........#','#.........#','#........o#','#....B....#','#o........#','#.........#','#.........#','#...o.....#','###########'],seq:[3,1,0]},
  stier:{rows:['###########','#S........#','#.........#','#o........#','#.........#','#........o#','#.........#','#.........#','###########'],
    /* je Phase: Tor (Wandfeld), Startfeld des Stiers, Portalpaar */
    ph:[{door:[10,4],home:[3,4],port:null},{door:[10,2],home:[2,4],port:[[6,4],[4,2]]},{door:[0,6],home:[8,2],port:[[3,2],[7,6]]}]},
  zoellner:{rows:['###########','#S........#','#.........#','#.........#','#.........#','#o........#','#.........#','#.........#','###########'],rail:[[1,5,7],[4,5,7],[7,5,7]],col:[3,2,4],sp:[2.4,3,3.6]},
  krake:{rows:['###########','#S...~....#','#....~....#','#.........#','#~~..o..~~#','#.........#','#....~....#','#....~....#','###########'],win:[[4,2],[8,3],[2,5]],gap:[2600,2100,1700]},
  eisenhans:{rows:['###########','#S....o...#','#.........#','#.........#','#........o#','#....B....#','#o........#','#.........#','#.........#','#...o.....#','###########'],om:[28,34,40]},
  spiegel:{rows:['###########','#S........#','#.........#','#.XX......#','#o..X...o.#','#......o..#','#...o.....#','#.........#','###########'],home:[[6,5],[6,7],[8,7]],lim:[9,9,11]},
  frost:{rows:['###########','#S........#','#.........#','#....A....#','#.........#','#.........#','#.B.....C.#','#.........#','###########'],arr:[[5,1,2],[9,6,1],[1,6,0]],run:5,loop:[1,2,9,5],sp:[3.2,4,4.8]},
  troll:{rows:['#########','#S......#','#.......#','#.......#','#.......#','#.......#','#.......#','#.......#','#########'],gap:[2500,2100,1800],col:[2,6,3]},
  geist:{rows:['###########','#S...o....#','#.........#','#o.......o#','#.........#','#....o....#','#.........#','#...o.....#','###########'],bomb:[[4,2],[7,4],[2,6]],sp:[1.15,1.4,1.65]},
  irrlicht:{rows:['###########','#S....o...#','#.........#','#o........#','#........o#','#.........#','#.........#','#..o......#','###########'],pad:[[5,2],[8,5],[2,5],[7,7],[4,1],[6,4]],holes:[[[3,1],[8,6]],[[6,3],[5,7]],[[3,5],[4,7]]],wait:[3600,3000,2500]},
  katapult:{rows:['###########','#o...C...o#','#...PQR...#','#.........#','#.........#','#.........#','#.........#','#S....o...#','###########'],gap:[2400,2000,1700]},
  morvan:{rows:['###########','#S..o.o...#','#...o.o...#','#....M....#','#.........#','#.........#','#.........#','#.....o...#','###########'],port:[[5,6],[5,1]],pa:[[5,6],[8,4],[2,4]],mh:[9,7],cyc:[2400,2000,1700]},
  koenig:{rows:['###########','#S........#','#.........#','#.........#','#.........#','#.........#','#.........#','#.........#','###########'],lane:4,ph:[[3,7,.52],[2,6,.42],[4,7,.34]]}};
const labKoenigProps=(L,p)=>[1*L.W+p[0]+1,7*L.W+p[1]+1];
/* Mehrere Entwürfe bauen und den passenden wählen: den zahmsten für leichte Level, den kniffligsten für schwere */
/* Unter den Entwürfen gewinnt zuerst der, in dem die meisten Tore wirklich etwas versperren, danach entscheidet die Schwierigkeit. Fehlen Tore, werden bis zu acht weitere Entwürfe gebaut. */
function labGenPick(sp,seed){let best=null,bq=-1;const want=sp.locks.length;for(let k=0;k<sp.cand+(want?8:0);k++){if(k>=sp.cand&&bq>=want)break;const L=labGenSpec(sp,seed+(k?'c'+k:''));let q=0;for(let i=0;i<L.locks.length;i++)if(labGate(L,i))q++;q-=L.locks.length-q;
    if(!best||q>bq||(q===bq&&(sp.df===0?L.diff.score<best.diff.score:L.diff.score>best.diff.score))){best=L;bq=q}}return best}
const labGen=(n,seed)=>labGenPick(labSpec(n),seed===undefined?'n'+n:seed);
if(typeof module!=='undefined')module.exports={labGate,labAscii,LBOSS,labKoenigProps,LG_K,labGuardPos,labRollPlan,labHit,labThreat,LDIR,labSlide,labCheck,labGreedy,labGen,labGenSpec,labGenPick,labSpec,labNextPath,labNear,labDiff};
