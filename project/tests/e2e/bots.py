# Bots, die Bosse im echten Spiel besiegen. Jeder liefert [gewonnen, Leben, Fehlversuche, Züge, Sekunden].
SCHRAT="""(async()=>{const t0=performance.now();let g=0;while(!LB.won&&g++<400&&performance.now()-t0<120000){if(LB.roll||LB.boss.hp<=0){await new Promise(r=>setTimeout(r,30));continue}
  const L=LB.L,B=LB.boss,T=L.marks.B+LDIR[B.side][0]+LDIR[B.side][1]*L.W,seen=new Map([[LB.pos,[]]]),q=[LB.pos];let path=null;
  while(q.length&&!path){const p=q.shift();for(let d=0;d<4;d++){const s=labSlide(L,p,d,0,true);if(!s.cells.length)continue;const np=seen.get(p).concat(d);if(s.end===T&&LDIR[d][0]===-LDIR[B.side][0]&&LDIR[d][1]===-LDIR[B.side][1]){path=np;break}if(!seen.has(s.end)){seen.set(s.end,np);q.push(s.end)}}}
  if(!path){await new Promise(r=>setTimeout(r,100));continue}labMove(path[0]);await new Promise(r=>setTimeout(r,40))}
  return [LB.won,LB.boss.hp,LB.deaths,LB.moves,Math.round((performance.now()-t0)/1000)]})()"""
KOENIG="""(async()=>{const t0=performance.now();let g=0;const W=LB.L.W,at=(x,y)=>LB.pos===y*W+x,wait=ms=>new Promise(r=>setTimeout(r,ms));
  while(!LB.won&&g++<4000&&performance.now()-t0<180000){const B=LB.boss;if(LB.roll||B.stun||B.hp<=0||performance.now()<LB.safe-600){await wait(30);continue}
    const p=LB.L.boss.ph[B.phase],a=p[0],b=p[1],far=x=>Math.abs(B.kx-x)>1.6;let d=-1;
    if(at(1,1))d=0;else if(at(a,1)){if(B.kx>a+1.6)d=2}else if(at(a,7))d=0;else if(at(b,7)){if(B.kx<b-1.6&&B.up[0])d=3;else if(!B.up[0]&&far(b))d=3}
    else if(at(b,1))d=1;else if(at(a+2,1)){if(far(a+2))d=2}else if(at(a+2,7))d=1;else if(at(1,7)){if(far(1))d=3}
    else{for(let k=0;k<4;k++){const s=labSlide(LB.L,LB.pos,k,0,true);if(s.cells.length&&!s.cells.some(c=>((c/W)|0)===4)){d=k;break}}}
    if(d>=0){labMove(d);await wait(60)}else await wait(30)}
  return [LB.won,LB.boss.hp,LB.deaths,LB.moves,Math.round((performance.now()-t0)/1000)]})()"""
STIER="""(async()=>{const t0=performance.now(),L=LB.L,W=L.W,wait=ms=>new Promise(r=>setTimeout(r,ms));let g=0;
  while(!LB.won&&LB.boss.hp>0&&performance.now()-t0<150000){const B=LB.boss;if(LB.roll||B.mode==='run'||B.mode==='stun'||performance.now()<LB.safe){await wait(25);continue}
    const T=B.phase<2?4*W+9:2*W+1,bx=B.bp%W,by=(B.bp/W)|0;
    if(B.mode==='tel'){const hor=B.dir<2;let best=-1;for(let d=0;d<4;d++){const s=labSlide(L,LB.pos,d,0,true);if(!s.cells.length)continue;const ex=s.end%W,ey=(s.end/W)|0;if(hor?ey!==by:ex!==bx){best=d;break}}if(best>=0)labMove(best);await wait(250);continue}
    if(LB.pos===T){await wait(25);continue}
    const seen=new Map([[LB.pos,[]]]),q=[LB.pos];let path=null;while(q.length&&!path){const p=q.shift();for(let d=0;d<4;d++){const s=labSlide(L,p,d,0,true);if(!s.cells.length)continue;const np=seen.get(p).concat(d);if(s.end===T){path=np;break}if(!seen.has(s.end)){seen.set(s.end,np);q.push(s.end)}}}
    if(path)labMove(path[0]);await wait(80)}
  return [LB.won,LB.boss.hp,LB.deaths,LB.moves,Math.round((performance.now()-t0)/1000)]})()"""
COMMON="""
window.wait=ms=>new Promise(r=>setTimeout(r,ms));
window.idle=async()=>{let g=0;while((LB.roll||LB.queue.length)&&g++<300)await wait(20)};
window.bfs=(goal,from)=>{const L=LB.L,st=from===undefined?LB.pos:from,seen=new Map([[st,[]]]),q=[st];while(q.length){const p=q.shift();for(let d=0;d<4;d++){const s=labSlide(L,p,d,0,true);if(!s.cells.length||s.dead)continue;const np=seen.get(p).concat(d);if(goal(s,p,d))return np;if(!seen.has(s.end)){seen.set(s.end,np);q.push(s.end)}}}return null};
window.goto=async(cell)=>{for(let k=0;k<12&&LB.pos!==cell;k++){const p=bfs(s=>s.end===cell);if(!p)return false;labMove(p[0]);await wait(40);await idle()}return LB.pos===cell};
window.res=t0=>[LB.won,LB.boss.hp,LB.deaths,LB.moves,Math.round((performance.now()-t0)/1000)];
window.alive=t0=>!LB.won&&LB.boss.hp>0&&performance.now()-t0<(window.TMAX||150000);
"""
BOTS={
'zoellner':"""(async()=>{const t0=performance.now(),W=LB.L.W;while(alive(t0)){await idle();const B=LB.boss,k=B.carts.find(k=>!k.done);if(!k)break;const tg=k.y*W+k.x-1,col=LB.L.boss.col[Math.min(2,B.phase)];
  const p=bfs((s,p,d)=>d===0&&s.end===tg);if(!p){await wait(50);continue}const s=labSlide(LB.L,LB.pos,p[0],0,true),cross=[LB.pos].concat(s.cells).filter(c=>c%W===col).map(c=>(c/W)|0);
  if(cross.length&&cross.some(y=>Math.abs(B.zy-y)<2.6)){await wait(40);continue}labMove(p[0]);if(p.length===1&&k.x<k.b-0){await wait(30);labMove(0)}await wait(60)}return res(t0)})()""",
'krake':"""(async()=>{const t0=performance.now(),W=LB.L.W;while(alive(t0)){await idle();const B=LB.boss,k=B.on.findIndex(v=>!v);if(k<0)break;const q=LB.L.boss.win[k],c=q[1]*W+q[0];const p=bfs(s=>s.cells.includes(c));if(p)labMove(p[0]);await wait(60)}return res(t0)})()""",
'eisenhans':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W,m=L.marks.B,ST=[[8*1+4*W,0],[4+8*W,2]];let k=0;while(alive(t0)){await idle();const B=LB.boss,[S,d]=ST[k%2];
  if(LB.pos!==S){if(!(await goto(S))){await wait(100)}continue}const dot=Math.cos(B.a)*LDIR[d][0]+Math.sin(B.a)*LDIR[d][1];if(dot<.93){await wait(30);continue}
  const p=bfs((s,p,dd)=>dd===d&&s.end+LDIR[d][0]+LDIR[d][1]*W===m);if(!p)return ['KEIN WEG',LB.pos];const h=B.hp;for(const dd of p){labMove(dd);await wait(30)}await idle();await wait(200);if(LB.boss.hp<h)k++;const far=bfs(s=>Math.abs(s.end%W-5)+Math.abs(((s.end/W)|0)-5)>2);if(far)labMove(far[0]);await wait(100)}return res(t0)})()""",
'spiegel':"""(async()=>{const t0=performance.now(),L=LB.L,MD=[1,0,2,3];while(alive(t0)){await idle();const B=LB.boss;if(B.gone||B.pause||B.mp||B.hitT||B.out||performance.now()<LB.safe){await wait(50);continue}
  const key=(a,b,n)=>a*100000+b*100+n,lim=L.boss.lim[Math.min(2,B.phase)],seen=new Map([[key(LB.pos,B.m,B.used),[]]]),q=[[LB.pos,B.m,B.used]];let sol=null;while(q.length&&!sol){const[p,mm,n]=q.shift();if(n>=lim)continue;for(let d=0;d<4;d++){const a=labSlide(L,p,d,0,true);if(!a.cells.length||a.dead)continue;const b=labSlide(L,mm,MD[d],0,true),np=seen.get(key(p,mm,n)).concat(d),me=b.cells.length?b.end:mm,dead=b.cells.length&&b.dead;
      if(dead){sol=np;break}if(a.end===me||a.cells.includes(me)||b.cells.includes(a.end))continue;if(!seen.has(key(a.end,me,n+1))){seen.set(key(a.end,me,n+1),np);q.push([a.end,me,n+1])}}}
  if(!sol)return ['KEINE LÖSUNG',B.phase,B.used,LB.pos,B.m];labMove(sol[0]);await wait(80);await idle();let g=0;while(LB.boss.mp&&g++<100)await wait(20)}return res(t0)})()""",
'frost':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W;while(alive(t0)){await idle();if(!alive(t0))break;const B=LB.boss,ms=['A','B','C'].filter(k=>B.cr[k]).map(k=>L.marks[k]);
  const p=bfs((s,p,d)=>{if(s.cells.length<L.boss.run)return false;const n=s.cells.length,pv=n>1?s.cells[n-2]:p;let dx=s.end%W-pv%W,dy=((s.end/W)|0)-((pv/W)|0);const a=L.arr[s.end];if(a>=0){dx=LDIR[a][0];dy=LDIR[a][1]}return ms.includes(s.end+dx+dy*W)});
  if(!p)return ['KEIN WEG',B.phase,LB.pos];labMove(p[0]);await wait(80)}return res(t0)})()""",
'troll':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W,c=(x,y)=>y*W+x,log=[],rock=async cell=>{while(alive(t0)){if(L.grid[cell]===2)return true;if(LB.boss.pause)return false;if(LB.boss.tt){await wait(30);continue}if(LB.pos!==cell){if(!(await goto(cell))){await wait(100);return false}continue}let g=0;while(alive(t0)&&!LB.boss.tt&&g++<500)await wait(20);
    if(LB.boss.tt&&LB.boss.tt.cell===cell){const far=bfs(s=>Math.abs(s.end%W-cell%W)+Math.abs(((s.end/W)|0)-((cell/W)|0))>3);if(far)labMove(far[0]);await wait(60);await idle()}}return false};
  while(alive(t0)){const B=LB.boss,ph=B.phase,tx=L.boss.col[Math.min(2,ph)];if(B.pause){await wait(50);continue}
    if(tx===2){await rock(c(1,7))}else if(tx===6){await rock(c(7,7))}else{if(await rock(c(1,7)))await rock(c(2,7))}
    if(LB.boss.phase!==ph)continue;const p=bfs((s,p,d)=>d===3&&s.end===W+tx);if(!p){log.push('kein Weg '+LB.pos+' '+B.rocks.map(r=>r.cell).join(','));await wait(400);continue}for(const d of p){labMove(d);await wait(40);await idle()}await wait(300)}return res(t0).concat(log.slice(0,30),[LB.pos,LB.boss.phase,JSON.stringify(LB.boss.rocks),'GRID '+Array.from(L.grid).map((g,i)=>g!==1&&i%W>0&&i%W<W-1&&i>W&&i<L.grid.length-W?i+':'+g:'').filter(x=>x).join(' '),'Q'+LB.queue.length+' dead'+LB.dead+' sheet'+sheetOpen+' av'+JSON.stringify(LB.boss.av),JSON.stringify(LB.boss.tt),LB.boss.next-LB.clock,LB.boss.pause,!!LB.roll,LB.clock,await (async()=>{await wait(500);return LB.clock})(),!!LB.dead,LB.fall,LAB.fail])})()""",
'geist':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W;while(alive(t0)){await idle();const B=LB.boss,c=LB.clock,gs=B.gs.filter(g=>g.on),gd=Math.min(...gs.map(g=>Math.hypot(g.x-LB.bx,g.y-LB.by)));let done=false;
  if(!B.bm.some(b=>b.fz)&&!B.pause)for(const b of B.bm){if(c<b.cd)continue;const s0=[0,1,2,3].map(d=>[d,labSlide(L,LB.pos,d,0,true)]).find(([d,s])=>s.cells.includes(b.cell)&&!s.dead&&Math.hypot(s.end%W-b.x,((s.end/W)|0)-b.y)>=2);const bd=Math.min(...gs.map(g=>Math.hypot(g.x-b.x,g.y-b.y)));
    if(s0&&bd<3.6&&bd>1){labMove(s0[0]);done=true;break}}
  if(!done&&gd<2.6){let best=-1,bd=0;for(let d=0;d<4;d++){const s=labSlide(L,LB.pos,d,0,true);if(!s.cells.length)continue;const dd=Math.min(...gs.map(g=>Math.hypot(s.end%W-g.x,((s.end/W)|0)-g.y)));if(dd>bd){bd=dd;best=d}}if(best>=0)labMove(best)}
  else if(!done&&!B.bm.some(b=>b.fz)){const rb=B.bm.find(b=>c>=b.cd);if(rb){const ok=x=>x.cells.includes(rb.cell)&&Math.hypot(x.end%W-rb.x,((x.end/W)|0)-rb.y)>=2;const p=bfs(s=>[0,1,2,3].some(d=>ok(labSlide(L,s.end,d,0,true))));if(p&&![0,1,2,3].some(d=>ok(labSlide(L,LB.pos,d,0,true))))labMove(p[0])}}
  await wait(70)}return res(t0)})()""",
'irrlicht':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W;while(alive(t0)){await idle();const B=LB.boss,q=L.boss.pad[B.nx],cell=q[1]*W+q[0],left=L.boss.wait[Math.min(2,B.phase)]-(LB.clock-B.t);
  if(B.lit[B.nx]>LB.clock+left){await wait(40);continue}const p=bfs(s=>s.cells.includes(cell));if(!p){await wait(40);continue}
  if(p.length>1){labMove(p[0]);await wait(60);continue}if(left<[2200,1900,1600][Math.min(2,B.phase)]-300){labMove(p[0]);await wait(60);await idle();const far=bfs(s=>Math.hypot(s.end%W-q[0],((s.end/W)|0)-q[1])>2);if(far&&Math.hypot(LB.pos%W-q[0],((LB.pos/W)|0)-q[1])<=1.4)labMove(far[0])}await wait(40)}return res(t0)})()""",
'katapult':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W,c=(x,y)=>y*W+x,T={P:[c(3,2),c(4,3)],Q:[c(5,3)],R:[c(7,2),c(6,3)]};while(alive(t0)){await idle();const B=LB.boss,k=['P','Q','R'].find(k=>B.pal[k]);if(!k)break;let ok=false;
  for(const cell of T[k]){if(await goto(cell)){ok=true;let g=0;while(alive(t0)&&!(LB.boss.tt&&LB.boss.tt.cell===cell)&&g++<300&&LB.pos===cell)await wait(20);const far=bfs(s=>Math.abs(s.end%W-cell%W)+Math.abs(((s.end/W)|0)-((cell/W)|0))>2);if(far)labMove(far[0]);await wait(1500);break}}
  if(!ok)await wait(100)}return res(t0)})()""",
'morvan':"""(async()=>{const t0=performance.now(),L=LB.L,W=L.W,T=2*W+5;while(alive(t0)){await idle();const B=LB.boss;if(B.pause||performance.now()<LB.safe){await wait(50);continue}
  const p=bfs((s,p,d)=>d===2&&s.end===T&&s.cells.length>1);if(!p){const q=bfs(s=>true);if(q)labMove(q[0]);await wait(200);continue}
  if(p.length>1){labMove(p[0]);await wait(80);continue}if(B.st==='charge'){labMove(p[0]);await wait(600)}else await wait(30)}return res(t0)})()"""}
BOTS['schrat']=SCHRAT;BOTS['koenig']=KOENIG;BOTS['stier']=STIER
LEVEL={'schrat':15,'koenig':30,'stier':45,'zoellner':60,'krake':75,'eisenhans':90,'spiegel':105,'frost':120,'troll':135,'geist':150,'irrlicht':165,'katapult':180,'morvan':195}
