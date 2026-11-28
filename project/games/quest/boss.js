
/* ================= Bosse ================= */
const LBOSSN={15:'schrat',30:'koenig',45:'stier'};
const LBOSSTXT={schrat:{name:'Der Wurzelschrat',wi:0,tip:'Pralle von der Seite gegen den Schrat, an der sein Pilz leuchtet. Weiche aus, wenn eine Reihe rot aufglüht.',
    intro:'Am Waldrand versperrt ein uralter Baumstumpf den Weg, und er ist wach. Verwundbar ist er nur dort, wo sein Leuchtpilz sitzt: Pralle von genau dieser Seite gegen ihn. Glüht deine Reihe oder Spalte rot, schlagen gleich seine Wurzeln zu.'},
  stier:{name:'Der verhexte Stier',wi:2,tip:'Bleib nicht stehen, er trabt auf dich zu. Stell dich so, dass das rote Tor hinter dir liegt, und roll zur Seite, sobald er schnaubt.',
    intro:'Morvan hat Henriks Stier verhext. Er trabt auf dich zu, bis er dich in seiner Reihe oder Spalte sieht. Dann schnaubt er nur ganz kurz und stürmt los, bis ihn etwas aufhält. Portale tragen auch ihn weiter. Lass ihn dreimal ins rote Scheunentor krachen.'},
  koenig:{name:'Der Krähenkönig',wi:1,tip:'Rolle über beide Scheuchenfelder, solange der König dazwischen fliegt. Die Scheuchen bleiben nur sechs Sekunden stehen.',
    intro:'Der Krähenkönig fliegt quer über das letzte Feld. Auf seiner Bahn liegen zwei Scheuchenfelder. Wer darüberrollt, lässt dort eine Vogelscheuche hochklappen. Fängst du ihn zwischen zwei Scheuchen, stürzt er ab.'}};
function labBossLevel(type){const L=labAscii(LBOSS[type].rows),T=LBOSSTXT[type];L.boss=Object.assign({type},LBOSS[type],T);L.noProp=new Set(type==='schrat'?[L.marks.B]:B2[type]?Object.values(L.marks):[]);if(B2[type]&&B2[type].level)B2[type].level(L);return{L,wi:T.wi,name:T.name}}
function labBossIntro(n){const type=LBOSSN[n],T=LBOSSTXT[type],seen=store.get('lbs',[]),go=()=>labStart(n,undefined,labBossLevel(type));
  if(seen.includes(type)){go();return}
  const s=openSheet(`<div class="sh-head"><h2>${T.name}</h2></div><p class="lst-w">Bosskampf · Welt ${T.wi+1}</p><p>${T.intro}</p><p class="lst-g">Drei Treffer besiegen ihn. Wirst du erwischt, landest du am Start, seine Treffer bleiben.</p><div class="btns"><button class="primary" id="lbGo">Auf in den Kampf</button></div>`,true);
  s.querySelector('#lbGo').onclick=()=>{closeSheet();seen.push(type);store.set('lbs',seen);go()}}
/* Alle Fristen laufen auf der Spieluhr LB.clock, damit ein langsames Gerät den Kampf nicht verzerrt */
function labBossInit(){const L=LB.L,B=LB.boss={type:L.boss.type,hp:3,phase:0,hitAt:0};if(B2[B.type]){B2[B.type].init(B,L);return}
  if(B.type==='schrat'){B.side=L.boss.seq[0];B.next=LB.clock+3600;B.tel=null;B.alt=false}else if(B.type==='stier')labStierPhase();else{B.props=[];labKoenigPhase()}}
function labStierPhase(){const L=LB.L,B=LB.boss,W=L.W,P=L.boss.ph[B.phase];L.port.fill(-1);if(P.port){const a=P.port[0][1]*W+P.port[0][0],b=P.port[1][1]*W+P.port[1][0];L.port[a]=b;L.port[b]=a}
  B.bp=P.home[1]*W+P.home[0];B.bx=P.home[0];B.by=P.home[1];B.sc=1;B.mode='idle';B.dir=0;B.from=B.bp;B.ws=0;B.wt=LB.clock+1400;LB.roll=null;LB.queue=[];LB.bump=null;LB.pos=L.start;LB.bx=L.start%W;LB.by=(L.start/W)|0;LB.tp=1;LB.safe=performance.now()+1200}
function labKoenigPhase(){const L=LB.L,B=LB.boss,W=L.W;for(const i of B.props)L.grid[i]=1;B.props=labKoenigProps(L,L.boss.ph[B.phase]);for(const i of B.props)L.grid[i]=2;L.noProp=new Set(B.props);L.gc.clear();
  B.up=[0,0];B.kx=W-2;B.kd=-1;B.stun=0;LB.roll=null;LB.queue=[];LB.bump=null;LB.pos=L.start;LB.bx=L.start%W;LB.by=(L.start/W)|0;LB.tp=1;LB.safe=performance.now()+1200}
function labBossHit(now){const B=LB.boss;B.hp--;B.hitAt=now;LB.shake=now;sfx.ok(6);tone(220,.3,'sawtooth',.07);tone(660,.25,'triangle',.06,.1);labHud();
  if(B.hp<=0){setTimeout(()=>{if(LB&&LB.boss===B&&!LB.won)labWin()},900);return}
  toast(B.hp===2?'Treffer! Noch zwei.':'Treffer! Noch einer.',1600)}
/* Aufprall: zählt beim Schrat nur von der Pilzseite */
function labBossBump(end,dx,dy,now){const B=LB.boss,L=LB.L,c=LB.clock;if(B2[B.type]){if(B.hp>0&&B2[B.type].bump)B2[B.type].bump(B,L,end,dx,dy,now);return}if(B.type!=='schrat'||B.hp<=0||end+dx+dy*L.W!==L.marks.B)return;
  if(LDIR[B.side][0]===-dx&&LDIR[B.side][1]===-dy&&now-B.hitAt>600){labSpark(L.marks.B,'#58e6ff',26,4);labBossHit(now);if(B.hp>0){B.side=L.boss.seq[3-B.hp];B.tel=null;B.next=c+2200}}
  else{tone(160,.15,'square',.05);toast('Hier ist seine Rinde zu dick. Such die Seite mit dem Leuchtpilz.',1800);B.next=Math.min(B.next,c+500)}}
function labBossArrive(cell,now){const B=LB.boss,L=LB.L;if(B2[B.type]){if(B.hp>0&&B2[B.type].arrive)B2[B.type].arrive(B,L,cell,now);return}if(B.type!=='koenig'||B.hp<=0||B.stun)return;const p=L.boss.ph[B.phase],y=L.boss.lane;
  for(let k=0;k<2;k++)if(cell===y*L.W+p[k]&&!B.up[k]){B.up[k]=LB.clock+6000;tone(500+k*160,.12,'triangle',.06);labSpark(cell,'#ffd84d',12)}}
function labBossStep(now,dt){const B=LB.boss,L=LB.L,W=L.W,c=LB.clock,px=Math.round(LB.bx),py=Math.round(LB.by);if(B.hp<=0)return;
  if(B2[B.type]){if(B.pause){if(c<B.pause)return;B.pause=0;if(B.then){const f=B.then;B.then=null;f()}}B2[B.type].step(B,L,now,dt,c,px,py);return}
  if(B.type==='schrat'){
    if(!B.tel&&c>=B.next){B.alt=!B.alt;B.tel={row:B.alt,v:B.alt?py:px,t:c,done:0};tone(140,.5,'sawtooth',.04)}
    if(B.tel&&!B.tel.done&&c-B.tel.t>=1150){B.tel.done=c;LB.shake=now;tone(70,.3,'square',.08);if((B.tel.row?py:px)===B.tel.v&&now>LB.safe)labCaught(now,'Die Wurzeln haben dich erwischt. Zurück zum Start.')}
    if(B.tel&&B.tel.done&&c-B.tel.done>520){B.tel=null;B.next=c+[0,1500,2000,2600][B.hp]}}
  else if(B.type==='stier'){const P=L.boss.ph[B.phase],ph=Math.min(2,B.phase),TEL=[520,440,380][ph],WALK=[520,430,360][ph],bx=B.bp%W,by=(B.bp/W)|0;
    if(B.mode==='idle'){const u=B.ws?Math.min(1,(c-B.ws)/(WALK*.8)):1,fx=B.from%W,fy=(B.from/W)|0;B.bx=fx+(bx-fx)*u;B.by=fy+(by-fy)*u;B.sc=1;
      if(b2Near(B.bx,B.by,.6,now)){labCaught(now,'Der Stier hat dich auf die Hörner genommen. Zurück zum Start.');labStierPhase();return}
      if(now>LB.safe&&u>=1){let d=-1;if(!LB.roll){if(py===by&&px!==bx)d=px>bx?0:1;else if(px===bx&&py!==by)d=py>by?2:3;
          if(d>=0)for(let x=bx+LDIR[d][0],y=by+LDIR[d][1];x!==px||y!==py;x+=LDIR[d][0],y+=LDIR[d][1])if(L.grid[y*W+x]!==1){d=-1;break}}
        if(d>=0){B.mode='tel';B.dir=d;B.t=c;tone(110,.4,'sawtooth',.07);tone(90,.3,'square',.05,.15)}
        else if(c>=B.wt){/* Er trabt Schritt für Schritt auf Pias Reihe oder Spalte zu */
          const dx=px-bx,dy=py-by,sx=dx>0?0:1,sy=dy>0?2:3,o=[];if(Math.abs(dy)<=Math.abs(dx)){if(dy)o.push(sy);if(dx)o.push(sx)}else{if(dx)o.push(sx);if(dy)o.push(sy)}
          for(const k of o){const nc=B.bp+LDIR[k][0]+LDIR[k][1]*W;if(L.grid[nc]===1&&L.port[nc]<0){B.from=B.bp;B.bp=nc;B.ws=c;B.dir=k;tone(120,.05,'square',.03);break}}B.wt=c+WALK}}}
    else if(B.mode==='tel'){if(c-B.t>=TEL){const s=labSlide(L,B.bp,B.dir,0,true);if(!s.cells.length){B.mode='idle';B.wt=c+400}else{B.plan=labRollPlan(L,B.bp,s.cells,[1,.86,.74][ph]);B.rt=0;B.mode='run';tone(200,.4,'sawtooth',.05)}}}
    else if(B.mode==='run'){B.rt+=dt;const st=B.plan.state(Math.min(B.rt,B.plan.T));B.bx=st.x;B.by=st.y;B.sc=st.sc;
      if(now>LB.safe&&Math.abs(B.bx-LB.bx)<.6&&Math.abs(B.by-LB.by)<.6){labCaught(now,'Der Stier hat dich überrannt. Zurück zum Start.');labStierPhase();return}
      if(B.rt>=B.plan.T){const pts=B.plan.pts,e=pts[pts.length-1];B.bp=e;B.from=e;B.ws=0;B.bx=e%W;B.by=(e/W)|0;B.sc=1;LB.shake=now;tone(70,.25,'square',.08);
        if(e%W+LDIR[B.dir][0]===P.door[0]&&((e/W)|0)+LDIR[B.dir][1]===P.door[1]){labSpark(e,'#e0403a',26,4);labBossHit(now);if(B.hp>0){B.mode='stun';B.t=c}}else{B.mode='idle';B.wt=c+450}}}
    else if(B.mode==='stun'&&c-B.t>1300){B.phase++;labStierPhase()}}
  else{const p=L.boss.ph[B.phase],y=L.boss.lane;
    if(B.stun){if(c>B.stun){B.phase++;labKoenigPhase()}return}
    for(let k=0;k<2;k++)if(B.up[k]&&c>B.up[k])B.up[k]=0;
    let lo=1,hi=W-2;for(let k=0;k<2;k++)if(B.up[k]){if(B.kx>p[k])lo=Math.max(lo,p[k]+1);else hi=Math.min(hi,p[k]-1)}
    B.kx+=B.kd*dt/p[2];if(B.kx>=hi){B.kx=hi;B.kd=-1}if(B.kx<=lo){B.kx=lo;B.kd=1}
    if(B.up[0]&&B.up[1]&&B.kx>p[0]&&B.kx<p[1]){labSpark(y*W+Math.round(B.kx),'#23232c',24,4);labBossHit(now);B.up=[0,0];if(B.hp>0)B.stun=c+1300;return}
    if(now>LB.safe&&Math.abs(B.kx-LB.bx)<.55&&Math.abs(y-LB.by)<.5){B.up=[0,0];labCaught(now,'Der König hat dich gepackt. Zurück zum Start.')}}}
/* ---------- Bosse in 3D ---------- */
function lab3BossBuild(S,th,rng,wx,wz){const T=THREE,G=LAB.geo,L=LB.L,W=L.W,B=L.boss,M=(geo,hex,sx,sy,sz,x,y,z,o,par)=>{const m=new T.Mesh(G[geo],labMat(hex,o));m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;(par||S).add(m);return m},bo=LAB.bo={type:B.type},
    flat=(hex,op)=>{const m=new T.MeshBasicMaterial({color:new T.Color(hex),transparent:true,opacity:op,depthWrite:false,fog:false});LAB.disp.push(m);return m};
  if(B2[B.type]){B2[B.type].build({S,T,G,M,flat,wx,wz,bo,L,W,th,rng,D:B});return}
  if(B.type==='schrat'){const c=L.marks.B,g=new T.Group();g.position.set(wx(c),0,wz(c));S.add(g);bo.g=g;
    M('cyl','#5a3d28',.96,1.05,.96,0,.52,0,null,g);M('cyl','#c9a070',.82,.04,.82,0,1.06,0,null,g);M('cyl','#a8804f',.5,.02,.5,0,1.085,0,null,g);
    for(let k=0;k<6;k++){const a=k*1.047+.4,r=M('cone','#4a3020',.34,.7,.34,Math.cos(a)*.5,.14,Math.sin(a)*.5,null,g);r.rotation.set(Math.sin(a)*1.25,0,-Math.cos(a)*1.25)}
    for(let k=0;k<3;k++)M('cone','#3f9a48',.3,.5,.3,(k-1)*.24,1.3+(k%2)*.1,-.1,null,g).rotation.z=(k-1)*-.4;
    bo.eyes=[];for(const k of[-1,1]){bo.eyes.push(M('sph','#ffe36b',.2,.24,.1,k*.2,.74,.47,{emissive:'#ffc21a',emissiveIntensity:1.3},g));M('sph','#15151a',.08,.12,.06,k*.2,.72,.52,null,g);const br=M('box','#2a1a10',.26,.06,.06,k*.2,.92,.49,null,g);br.rotation.z=k*-.45}
    bo.mouth=M('box','#1a0f08',.34,.1,.06,0,.44,.49,null,g);
    bo.spot=new T.Group();S.add(bo.spot);M('cyl','#f3ead6',.12,.2,.12,0,.5,0,null,bo.spot);M('cone','#58e6ff',.42,.26,.42,0,.7,0,{emissive:'#58e6ff',emissiveIntensity:1.4},bo.spot);const h=labHalo('#58e6ff',1.7,.8);h.position.y=.65;bo.spot.add(h);
    bo.mark=new T.Mesh(G.pl,flat('#58e6ff',.5));bo.mark.scale.set(.8,1,.8);S.add(bo.mark);
    bo.tel=[];bo.spk=[];const tm=flat('#ff2a2a',.5);for(let k=0;k<Math.max(W,L.H);k++){const p=new T.Mesh(G.pl,tm);p.scale.set(.9,1,.9);p.visible=false;S.add(p);bo.tel.push(p);const sp=M('cone','#6b4a32',.3,.9,.3,0,-1,0);sp.visible=false;bo.spk.push(sp)}bo.tm=tm}
  else if(B.type==='stier'){const g=new T.Group(),bd=new T.Group();g.add(bd);S.add(g);bo.g=g;bo.bd=bd;
    M('box','#6a4030',.62,.5,.9,0,.5,0,null,bd);M('box','#7a4a36',.5,.44,.42,0,.62,.56,null,bd);M('box','#e8c9a8',.3,.2,.16,0,.5,.8,null,bd);M('tor','#ffd84d',.18,.4,.18,0,.42,.9,{emissive:'#ffb000',emissiveIntensity:.6},bd).rotation.x=Math.PI/2;
    for(const k of[-1,1]){const h=M('cone','#fff6e6',.12,.34,.12,k*.3,.92,.56,null,bd);h.rotation.z=k*-.9;M('sph','#ff2a2a',.1,.1,.06,k*.14,.7,.78,{emissive:'#ff2a2a',emissiveIntensity:1.6},bd);for(const z of[-.3,.3])M('box','#4a2a20',.14,.3,.14,k*.2,.15,z,null,bd)}
    M('cone','#4a2a20',.1,.3,.1,0,.6,-.5,null,bd).rotation.x=-1.2;const hl=labHalo('#ff3a2a',1.6,.35);hl.position.y=.7;g.add(hl);
    bo.door=new T.Group();S.add(bo.door);M('box','#c0303a',1.06,1.02,1.06,0,.51,0,{emissive:'#c0303a',emissiveIntensity:.35},bo.door);for(const k of[-1,1]){const x=M('box','#fff6e6',1.1,.1,1.1,0,.55,0,null,bo.door);x.rotation.z=k*.7;x.scale.set(.1,1.2,1.1)}const dh=labHalo('#ff5a4a',2.4,.5);dh.position.y=.6;bo.door.add(dh);
    bo.pt=[];const pm=flat('#7df0ff',.75);for(let k=0;k<2;k++){const m=new T.Mesh(G.pl,pm);m.scale.set(.9,1,.9);S.add(m);const h=labHalo('#7df0ff',1.8,.5);S.add(h);bo.pt.push([m,h])}
    bo.tel=[];bo.tm=flat('#ff2a2a',.5);for(let k=0;k<W;k++){const p=new T.Mesh(G.pl,bo.tm);p.scale.set(.5,1,.5);p.rotation.y=Math.PI/4;p.visible=false;S.add(p);bo.tel.push(p)}}
  else{const y=B.lane,g=labProp('flieger',rng,th);g.scale.setScalar(1.7);S.add(g);bo.g=g;const cr=new T.Group(),gm=labMat('#ffd84d',{emissive:'#ffb000',emissiveIntensity:.6});for(let k=0;k<5;k++){const p=new T.Mesh(G.cone,gm);p.scale.set(.07,.14,.07);p.position.set(Math.cos(k*1.257)*.09,1.12,.24+Math.sin(k*1.257)*.09);cr.add(p)}const rg=new T.Mesh(G.cyl,gm);rg.scale.set(.24,.06,.24);rg.position.set(0,1.05,.24);cr.add(rg);g.children[0].add(cr);
    bo.sh=new T.Mesh(G.cyl,flat('#000000',.4));bo.sh.scale.set(1,.01,1);S.add(bo.sh);const lm=flat('#ff3a4a',.4);for(let x=1;x<W-1;x++){const m=new T.Mesh(G.pl,lm);m.scale.set(.3,1,.3);m.rotation.y=Math.PI/4;m.position.set(wx(y*W+x),.108,wz(y*W+x));S.add(m)}
    bo.sw=[];bo.sc=[];bo.hay=[];const sm=flat('#ffd84d',.75);for(let k=0;k<2;k++){const m=new T.Mesh(G.pl,sm);m.scale.set(.86,1,.86);S.add(m);const rg2=M('tor','#ffd84d',.7,.5,.7,0,.13,0,{emissive:'#ffb000',emissiveIntensity:.8});bo.sw.push([m,rg2]);const sc=labProp('scheuche',rng,th);LAB.anim.pop();S.add(sc);bo.sc.push(sc);const hy=labProp('heu',rng,th);S.add(hy);bo.hay.push(hy)}}}
function lab3BossFrame(now,t,dt){const bo=LAB.bo,B=LB.boss,L=LB.L,W=L.W,X=LAB.X,Z=LAB.Z;if(!B)return;const hurt=now-B.hitAt<700,dead=B.hp<=0;
  if(B2[bo.type]){B2[bo.type].frame(B,L,bo,now,t,dt,hurt,dead);return}
  if(bo.type==='schrat'){const c=L.marks.B,g=bo.g,k=hurt?Math.sin(now*.05)*.12:Math.sin(t*1.4)*.02;g.rotation.z=k;g.scale.setScalar(dead?Math.max(.05,1-(now-B.hitAt)/800):1+(hurt?.08:0));
    for(const e of bo.eyes)e.scale.y=hurt?.05:(t%3.2<.12?.03:.24);bo.mouth.scale.y=hurt?.3:B.tel?.24:.1;
    const sx=LDIR[B.side][0],sy=LDIR[B.side][1];bo.spot.visible=bo.mark.visible=!dead;bo.spot.position.set(X(c%W)+sx*.56,Math.sin(t*4)*.04,Z((c/W)|0)+sy*.56);bo.spot.rotation.set(sy*.9,0,-sx*.9);bo.mark.position.set(X(c%W+sx),.11,Z(((c/W)|0)+sy));bo.mark.material.opacity=.3+.25*Math.sin(t*5);
    const tl=B.tel,n=tl?(tl.row?W:L.H):0;bo.tm.opacity=tl&&!tl.done?.25+.3*Math.abs(Math.sin((LB.clock-tl.t)*.012)):0;
    bo.tel.forEach((p,i)=>{const on=tl&&i>0&&i<n-1,x=tl&&tl.row?i:tl?tl.v:0,y=tl&&tl.row?tl.v:i,fl=on&&L.grid[y*W+x]===1;p.visible=!!fl&&!tl.done;if(fl)p.position.set(X(x),.112,Z(y));const s=bo.spk[i];s.visible=!!fl&&!!tl.done;if(s.visible){const u=(LB.clock-tl.done)/520;s.position.set(X(x),-.45+Math.sin(Math.min(1,u)*Math.PI)*.85,Z(y))}})}
  else if(bo.type==='stier'){const P=L.boss.ph[B.phase],g=bo.g,tel=B.mode==='tel',stun=B.mode==='stun'||dead;g.position.set(X(B.bx)+(tel?Math.sin(now*.08)*.05:0),0,Z(B.by));g.scale.setScalar(dead?Math.max(.05,1-(now-B.hitAt)/700):Math.max(.05,B.sc||1));
    bo.bd.rotation.y=stun?t*12:[Math.PI/2,-Math.PI/2,0,Math.PI][B.dir];bo.bd.position.y=B.mode==='run'?Math.abs(Math.sin(t*22))*.08:0;bo.bd.rotation.x=tel?-.18:0;
    bo.door.position.set(X(P.door[0]),0,Z(P.door[1]));bo.door.visible=!dead;bo.door.scale.setScalar(hurt?1+.12*Math.sin(now*.06):1);
    bo.pt.forEach(([m,h],k)=>{const on=!!P.port&&!dead;m.visible=h.visible=on;if(on){const q=P.port[k];m.position.set(X(q[0]),.113,Z(q[1]));m.rotation.y=t*2;h.position.set(X(q[0]),.4,Z(q[1]));h.scale.setScalar(1.8+.2*Math.sin(t*6+k))}});
    bo.tm.opacity=tel?.3+.3*Math.abs(Math.sin(LB.clock*.014)):0;const bx=B.bp%W,by=(B.bp/W)|0;bo.tel.forEach((p,i)=>{const x=bx+LDIR[B.dir][0]*(i+1),y=by+LDIR[B.dir][1]*(i+1),on=tel&&x>0&&y>0&&x<W-1&&y<L.H-1&&L.grid[y*W+x]===1&&bo.tel.slice(0,i).every(q=>q.visible);p.visible=!!on;if(on)p.position.set(X(x),.114,Z(y))})}
  else{const y=L.boss.lane,p=L.boss.ph[B.phase],g=bo.g,st=B.stun||dead;g.position.set(X(B.kx),st?LAB.gy*Math.max(0,1-(now-B.hitAt)/500):LAB.gy+Math.sin(t*3)*.08,Z(y));g.children[0].rotation.y=st?t*14:Math.atan2(B.kd,0);g.scale.setScalar(dead?Math.max(.05,1.7-(now-B.hitAt)/500):1.7);bo.sh.position.set(X(B.kx),.118,Z(y));
    for(let k=0;k<2;k++){const up=B.up[k],[m,rg]=bo.sw[k],sc=bo.sc[k];m.position.set(X(p[k]),.112,Z(y));rg.position.set(X(p[k]),.13,Z(y));rg.rotation.y=t*2;m.material.opacity=up?.25:.5+.25*Math.sin(t*5);m.visible=rg.visible=!dead;
      const tg=up?0:-1.5;sc.position.set(X(p[k]),sc.position.y+(tg-sc.position.y)*Math.min(1,dt*12),Z(y));sc.visible=sc.position.y>-1.4;if(up&&up-LB.clock<1500)sc.visible=Math.sin(now*.03)>0;
      const hc=B.props[k];bo.hay[k].position.set(X(hc%W),0,Z((hc/W)|0))}}}
