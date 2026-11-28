/* ================= PIX-LABYRINTH: Spiel, 3D-Szene, Reise ================= */
const LTH=[
 {id:'wald',ball:'#ff3f9c',name:'Dunkler Wald',amb:.1,sun:.1,sunC:'#7f95ff',bg:['#03060f','#071614'],floor:['#3f7059','#376650'],ground:'#0b1a16',wall:'#1f4a35',wh:.5,jit:.3,ws:'tree',paint:'#ffb03a',props:['stumpf','busch','stein','pilz','pilz','augen'],lamp:'laterne',fx:1},
 {id:'feld',ball:'#2fb4ff',name:'Kornfelder',amb:.52,sun:1.3,sunC:'#fff0c8',bg:['#6cc6ff','#ffe6a0'],floor:['#ecd98f','#e2cd80'],ground:'#b08a34',wall:'#e0ad2c',wh:.55,jit:.35,ws:'wheat',paint:'#ff4f8b',props:['scheuche','heu','heu','kuerbis','stein','kraehe','busch'],guard:'flieger',gname:'Die Krähe'},
 {id:'hof',ball:'#ff4f8b',name:'Bauernhof',amb:.42,sun:.95,sunC:'#ffe2b8',bg:['#4a3426','#1c120c'],floor:['#dcae74','#d2a268'],ground:'#3a2a20',wall:'#c9b48e',wh:.9,jit:0,ws:'box',paint:'#35b8ff',props:['fass','kiste','sack'],
  rooms:[{n:'Küche',f:['#f2ecd9','#bfd3d6'],p:['herd','tisch','fass','sack']},{n:'Stube',f:['#dcae74','#d2a268'],p:['sessel','regal','tisch','katze','pflanze']},{n:'Kammer',f:['#b98458','#ad7a50'],p:['bett','regal','pflanze','kiste']},{n:'Stall',f:['#ead27c','#dfc66e'],p:['heu','huhn','kiste','fass','huhn']}]},
 {id:'stadt',ball:'#ff4f8b',name:'Stadt',amb:.3,sun:.5,sunC:'#ffb088',bg:['#2a2152','#ff9566'],floor:['#a3a2b0','#9695a4'],ground:'#454158',wall:'#d8b08a',wh:1.3,jit:.35,ws:'house',paint:'#ffd84d',props:['stand','fass','kiste','katze','stand','pflanze'],lamp:'laterne'},
 {id:'hafen',ball:'#ff4f8b',name:'Hafen',amb:.16,sun:.2,sunC:'#8fb4ff',bg:['#050a1c','#0c2a3a'],floor:['#a8845c','#9c7850'],ground:'#0c2634',wall:'#5c4030',wh:.6,jit:.25,ws:'box',spitz:0,paint:'#4fe3ff',props:['kiste','fass','sack','boot','moewe','kiste','netz'],lamp:'laterne',fx:0},
 {id:'burghof',ball:'#7a5cff',name:'Burghof',amb:.48,sun:1.2,sunC:'#fff4dc',bg:['#8fbde8','#dcebc4'],floor:['#bdb8a8','#b0ab9a'],ground:'#6c8a4c',wall:'#8d8d99',wh:1.1,jit:.04,ws:'box',zinnen:1,paint:'#ff6a3d',props:['wache','fass','heu','kiste','banner','wache','busch'],guard:'flieger',gname:'Der Falke'},
 {id:'schloss',ball:'#ff4f8b',name:'Schloss',amb:.11,sun:.07,sunC:'#8ea6ff',bg:['#07060f','#15101f'],floor:['#8c8a96','#817f8b'],ground:'#17151f',wall:'#6a6a7a',wh:1,jit:.03,ws:'box',zinnen:1,paint:'#ffc233',props:['saeule','ruestung','fass'],lamp:'fackel',guard:'geist',gname:'Das Gespenst',
  rooms:[{n:'Thronsaal',f:['#9a2f3e','#872636'],p:['saeule','thron','ruestung','banner']},{n:'Bibliothek',f:['#9c6a40','#8f5f38'],p:['regal','regal','tisch','kerze']},{n:'Küche',f:['#b9b6ae','#8d9aa0'],p:['herd','fass','tisch','sack']},{n:'Waffenkammer',f:['#7e7c88','#72707c'],p:['ruestung','kiste','fass','ruestung']}]},
 {id:'eis',ball:'#ff6a3d',name:'Eisfelder',amb:.6,sun:1.15,sunC:'#eaf5ff',bg:['#a9dcff','#f4fbff'],floor:['#dcf2ff','#c8e8fb'],ground:'#8fc4e4',wall:'#9fd8f5',wh:.7,jit:.6,ws:'ice',paint:'#b06bff',props:['eisblock','schneemann','tanne','kristall','fels','tanne']},
 {id:'berge',ball:'#ff4f8b',name:'Berge',amb:.28,sun:.6,sunC:'#ffc49a',bg:['#35285c','#f09c6c'],floor:['#b9a792','#ad9b86'],ground:'#544a42',wall:'#7b7068',wh:.9,jit:.5,ws:'rock',paint:'#3ff0c4',props:['tanne','fels','kristall','stumpf','tanne','fels'],lamp:'feuer'},
 {id:'mine',ball:'#ff4f8b',name:'Alte Mine',amb:.09,sun:.05,sunC:'#9ab0ff',bg:['#050406','#15100c'],floor:['#8a7868','#7e6c5e'],ground:'#120e0c',wall:'#5a4c44',wh:.9,jit:.5,ws:'rock',paint:'#ffd23a',props:['lore','kristall','fass','kiste','stein','balken','kristall'],lamp:'laterne',fx:0},
 {id:'sumpf',ball:'#ff7a2a',name:'Nebelsumpf',amb:.17,sun:.2,sunC:'#a8ffc8',bg:['#06120e','#1c3a2a'],floor:['#6f8a52','#647e4a'],ground:'#0f2018',wall:'#1f4a35',wh:.5,jit:.3,ws:'tree',paint:'#c58aff',props:['pilz','frosch','stumpf','busch','augen','seerose','pilz'],lamp:'irrlicht',fx:1},
 {id:'schlacht',ball:'#4fe3ff',name:'Schlachtfeld',amb:.14,sun:.22,sunC:'#ff6a4a',bg:['#12060a','#5a1812'],floor:['#75604e','#6a5644'],ground:'#241814',wall:'#5c4232',wh:.95,jit:.3,ws:'box',spitz:1,paint:'#ff4f8b',props:['zelt','banner','kiste','fass','ruestung','zelt'],lamp:'feuer',fx:2,guard:'flieger',gname:'Der Geier'},
 {id:'turm',ball:'#ff4f8b',name:'Zaubererturm',amb:.14,sun:.1,sunC:'#b08aff',bg:['#070318','#260c44'],floor:['#5a4a8c','#50417f'],ground:'#120a26',wall:'#4a3a7a',wh:1.05,jit:.03,ws:'box',zinnen:1,paint:'#6dffb0',props:['kristall','saeule','kerze'],lamp:'kristall',fx:1,guard:'geist',gname:'Das Gespenst',
  rooms:[{n:'Labor',f:['#3e6a78','#365f6c'],p:['kristall','regal','kerze','fass']},{n:'Saal',f:['#6a3f8c','#5e367e'],p:['saeule','thron','banner','kristall']},{n:'Bibliothek',f:['#7a5a48','#6e5040'],p:['regal','regal','tisch','kerze']},{n:'Kammer',f:['#5a4a8c','#50417f'],p:['bett','kiste','kerze','pflanze']}]}];
const LSTORY=[
 ['Verhext','Der Zauberer Morvan hat Prinzessin Pia in eine Kugel verwandelt und tief in den Dunklen Wald geworfen. Sein Bann hat eine Schwäche: Jeder Fleck, den Pia berührt, beginnt zu leuchten, und wo alles leuchtet, verliert Morvan seine Macht. Roll los, Pia.'],
 ['Raus ins Helle','Der Wald liegt hinter dir. Vor dir wogen goldene Kornfelder, Vogelscheuchen halten Wache, und irgendwo dahinter raucht der Schornstein eines Bauernhofs.'],
 ['Bauer Henrik','Bauer Henrik staunt über die sprechende Kugel in seiner Küche, dann holt er ein Säckchen Feenstaub vom Regal. Seitdem tragen dich schimmernde Portale von einem Ort zum anderen.','Neu: Portale'],
 ['In die Stadt','Henrik bringt dich auf seinem Karren in die Stadt. Der Weg zur Burg führt quer über den Markt, vorbei an schrägen Prellböcken, die jeden um die Ecke schicken.','Neu: Prellböcke'],
 ['Am Kai','Der kürzeste Weg zur Burg führt nachts durch den Hafen. Der Kai ist schmal, das Wasser tief, und die Tore sind verschlossen. Die Schlüssel liegen irgendwo zwischen den Kisten.','Neu: Schlüssel und Türen'],
 ['Der Hofzauberer','Über dem Burghof kreisen Morvans Falken. Der alte Hofzauberer Balduin erkennt dich trotzdem sofort und zeigt dir den Weg ins Schloss.','Neu: Falken'],
 ['Hauptmann Gero','Im Schloss wartet Hauptmann Gero, der treu zu deiner Familie steht. Er rollt dir seine Pulverfässchen zu. Wer darüberrollt, zündet die Lunte, und wer dann nicht schnell Abstand gewinnt, fliegt mit in die Luft.','Neu: Bomben sprengen rissige Wände'],
 ['Verbannt','Morvan hat dich entdeckt. Ein Blitz, ein Wirbel, und du liegst weit im Norden auf blankem Eis. Die glatten Rinnen dort lenken dich in ihre Richtung, ob du willst oder nicht.','Neu: Eisrinnen ändern die Richtung'],
 ['Über die Berge','Hinter den Eisfeldern türmen sich die Berge. Lagerfeuer zeigen dir den Pass, und auf der anderen Seite liegt dein Königreich.'],
 ['Durch den Berg','Der Pass ist zugeschneit. Alte Bergleute zeigen dir ihren Stollen unter dem Gipfel. Ihre Sprengladungen liegen noch überall herum, und manche Wand gibt nur mit einem Knall nach.'],
 ['Im Nebel','Der Stollen endet im Nebelsumpf. Irrlichter tanzen über dem Wasser, Frösche quaken, und zwischen den Seerosen gähnen mehr Schlünde als irgendwo sonst.'],
 ['Vor den Toren','Vor der Hauptstadt stehen sich Geros Getreue und Morvans Söldner gegenüber. Der kürzeste Weg zum Thron führt mitten hindurch.'],
 ['Der Turm','Morvan hat sich im höchsten Turm verschanzt. Jede Kammer, die du mit Licht füllst, nimmt ihm ein Stück seiner Macht. Bring es zu Ende, Pia.']];
const LKC=['#ff5a4e','#4ea8ff','#6ee06a'],LMAP=[[.2,.93],[.5,.875],[.8,.82],[.52,.74],[.83,.645],[.26,.63],[.5,.525],[.19,.085],[.54,.065],[.83,.15],[.78,.31],[.47,.27],[.2,.38]];
const LAB={r:null,ready:false,fail:false,geo:null,mats:new Map(),disp:[],anim:[],pops:[],lamps:[],parts:[],view:{d:10,eW:9,eH:13,tx:0,tz:0}};
let LB=null,GAME=store.get('game',0)?1:0;labK=LG_K[store.get('lspd',1)]||LG_K[1];
const labSpeedRow=()=>`<div class="opt col"><span><b>Rollgeschwindigkeit</b><small>Wie schnell Pia in Pias Quest rollt.</small></span><div class="seg s3" id="oSpd"><button data-v="0">Gemütlich</button><button data-v="1">Normal</button><button data-v="2">Flott</button></div></div>`,
  labSpeedBind=s=>{const box=s.querySelector('#oSpd'),sync=()=>box.querySelectorAll('button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===store.get('lspd',1)));box.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;store.set('lspd',+b.dataset.v);labK=LG_K[+b.dataset.v];sfx.tick();sync()};sync()};
const labData=()=>{const d=store.get('lab',null)||{};return{max:d.max||1,st:d.st||{},seen:d.seen3||[]}};
const LIC={re:svg('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v5h5"/>'),hint:svg('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.300 1 2.200h5.200c0-.9.4-1.700 1-2.200A6 6 0 0 0 12 3z"/>'),lv:svg('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>'),
  l:svg('<path d="M15 5l-7 7 7 7"/>'),r:svg('<path d="M9 5l7 7-7 7"/>')};

/* ---------- Spielablauf ---------- */
function labPlay(n){const d=labData(),w=Math.floor((n-1)/LW_N);
  {const c=LCINE[n],seenC=store.get('lcs',[]);if(c&&window.gsap&&!reduce&&!seenC.includes(c)){cinePlay(c,()=>{const l=store.get('lcs',[]);if(!l.includes(c)){l.push(c);store.set('lcs',l)}const e=labData();if((n-1)%LW_N===0&&!e.seen.includes(w)){e.seen.push(w);labSave(e)}labPlay(n)});return}}
  if(n===1&&!store.get('ltut',0)){labTut(0);return}
  if(n<=LW_N*LW_C&&!d.seen.includes(w)){const st=LSTORY[w],s=openSheet(`<div class="sh-head"><h2>${st[0]}</h2></div><p class="lst-w">Welt ${w+1} · ${LTH[w].name}</p><p>${st[1]}</p>${st[2]?`<p class="lst-g">${st[2]}</p>`:''}<div class="btns"><button class="primary" id="lsGo">Weiter</button></div>`,true);
    s.querySelector('#lsGo').onclick=()=>{closeSheet();d.seen.push(w);labSave(d);labStart(n)};return}
  if(LBOSSN[n]){labBossIntro(n);return}
  labStart(n)}
function labStart(n,seed,pre){
  const rnd=seed!==undefined||!!(pre&&pre.tut!==undefined);loader(true,'Das Level entsteht');
  setTimeout(()=>{let sp,L;
    if(pre){sp={w:pre.wi};L=pre.L}else if(rnd){const cur=Math.min(LW_C-1,Math.floor((labData().max-1)/LW_N)),w=hashStr(seed)%(cur+1);sp=labSpec(w*LW_N+6+hashStr(seed+'j')%10);sp.cand=1;L=labGenSpec(sp,seed)}else{sp=labSpec(n);L=labGen(n)}
    LAB.ball=null;LB={L,n,seed:pre?'tut'+pre.tut:rnd?seed:'n'+n,rnd,th:LTH[sp.w],wi:sp.w,N:L.W*L.H,tut:pre?pre.tut:undefined};labReset();loader(false);show('lab');
    $('#lName').textContent=pre?pre.name:rnd?'Zufallslevel':'Level '+n;$('#lTip').hidden=!(pre&&pre.tut!==undefined);if(pre&&pre.tut!==undefined){$('#lTip').textContent=LTUT[pre.tut];setTimeout(()=>{if(LB&&LB.L===L&&!LB.moves){labHint();LB.hints=0}},1600)}$('#lab').style.background=`linear-gradient(${LB.th.bg[0]},${LB.th.bg[1]})`;
    const go=()=>{if(LB&&LB.L===L){labScene();labResize()}};
    if(LAB.fail||R3.failed){LAB.fail=true;go()}else load3D().then(()=>{try{lab3Init()}catch(e){LAB.fail=true}go()}).catch(()=>{LAB.fail=true;go()});
    labLoop()},40)}
function labReset(){const L=LB.L;LB.painted=new Uint8Array(LB.N);LB.left=0;for(let i=0;i<LB.N;i++)if(L.grid[i]===1)LB.left++;LB.total=LB.left;LB.painted[L.start]=1;LB.left--;
  LB.pos=L.start;LB.mask=0;LB.got=0;LB.fz=L.locks.map(()=>0);LB.doorK=L.locks.map(()=>0);LB.dopen=L.locks.map(()=>false);LB.gp=[];LB.gt0=performance.now();LB.safe=0;LB.moves=0;LB.t0=0;LB.roll=null;LB.queue=[];LB.dead=0;LB.burn=false;LB.won=false;LB.hints=0;LB.fall=0;LB.tp=1;LB.mini=true;
  LB.bx=L.start%L.W;LB.by=(L.start/L.W)|0;LB.stars=L.stars.map(c=>({c,got:false,gone:false}));LB.shields=(L.shields||[]).map(c=>({c,got:false}));LB.shield=false;LB.lost=LB.lost||false;LB.starT=Math.round(10+L.par*1.6);LB.deaths=LB.deaths||0;LB.boss=null;LB.clock=0;if(L.boss)labBossInit();labHud()}
function labRestart(){if(!LB)return;const d=LB.deaths,lo=LB.lost;labReset();LB.deaths=d;LB.lost=lo;if(LAB.ready&&!LAB.fail)lab3Paint()}
function labOpenDoor(k){if(LB.dopen[k])return;LB.dopen[k]=true;const L=LB.L;tone(392,.12,'triangle',.06);tone(523,.14,'triangle',.06,.08);tone(784,.2,'triangle',.06,.16);labSpark(L.locks[k].d,LKC[k%LKC.length],18,4);labInv()}
function labInv(){const e=$('#lInv');if(!e||!LB)return;const L=LB.L;let h='';L.locks.forEach((lk,k)=>{if(!lk.bomb&&((LB.got|LB.mask)>>k&1)&&!LB.dopen[k])h+=`<i style="--c:${LKC[k%LKC.length]}"><svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="4.500" fill="none" stroke="currentColor" stroke-width="3"/><path d="M11.500 11.500 L20 20 M16 16 l3 -3 M18.500 18.500 l2.500 -2.500" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></i>`});
  if(LB.shield)h+=`<i style="--c:#6ad8ff"><svg viewBox="0 0 24 24"><path d="M12 3 L20 6 V12 Q20 18 12 21 Q4 18 4 12 V6 Z" fill="currentColor"/><path d="M12 7 V17 M8 11 H16" stroke="#06222c" stroke-width="2.400" stroke-linecap="round"/></svg></i>`;if(e.dataset.h!==h){e.dataset.h=h;e.innerHTML=h;e.hidden=!h}}
function labMove(d){
  if(!LB||LB.won||LB.dead||sheetOpen)return;if(LB.roll){if(LB.queue.length<4)LB.queue.push(d);return}
  const L=LB.L,s=labSlide(L,LB.pos,d,LB.mask,true);if(!s.cells.length){LB.nudge={d,t:performance.now()};tone(105,.07,'square',.025);return}
  if(!LB.t0)LB.t0=performance.now();LB.moves++;$('#lArrow').classList.remove('on');
  const steps=s.cells.length;LB.bump=null;LB.roll={plan:labRollPlan(L,LB.pos,s.cells),t:0,arr:0,d,dead:s.dead,end:s.end,dr:{}};
  /* Tore gehen erst auf, wenn Pia mit dem Schlüssel direkt davor ankommt */
  {let pv=LB.pos;for(const c of s.cells){const k=L.doorAt[c];if(k>=0&&!L.locks[k].bomb&&!LB.dopen[k])LB.roll.dr[pv]=k;pv=c}if(LB.roll.dr[LB.pos]!==undefined)labOpenDoor(LB.roll.dr[LB.pos])}tone(170+Math.min(14,steps)*14,.1+Math.min(14,steps)*.02,'sine',.035);labHud();
}
const labTp=(a,b)=>{const W=LB.L.W;return Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0))!==1};
function labArrive(c,now){const L=LB.L;if(LB.roll&&LB.roll.dr&&LB.roll.dr[c]!==undefined)labOpenDoor(LB.roll.dr[c]);
  if(L.grid[c]===1&&!LB.painted[c]){LB.painted[c]=1;LB.left--;LB.mini=true;LAB.pops.push({c,t:now});if(LAB.ready&&!LAB.fail)lab3Tint(c)}
  const ky=L.keyAt[c];if(ky>=0&&!(LB.got>>ky&1)){if(L.locks[ky].bomb){if(!LB.fz[ky]){LB.fz[ky]=now+3200;tone(700,.08,'square',.04);tone(900,.08,'square',.04,.1)}}else{LB.got|=1<<ky;tone(880,.12,'triangle',.06);tone(1320,.2,'triangle',.05,.09);labSpark(c,LKC[ky%3],10)}}
  if(L.arr[c]>=0)tone(520,.06,'sine',.03);
  for(const s of LB.stars)if(s.c===c&&!s.got&&!s.gone){s.got=true;sfx.spark();labSpark(c,'#ffe36b',12)}
  for(const s of LB.shields)if(s.c===c&&!s.got){s.got=true;LB.shield=true;sfx.spark();tone(660,.12,'triangle',.06);tone(990,.2,'triangle',.06,.1);labSpark(c,'#6ad8ff',16);toast('Schutzschild! Beim nächsten Sturz in einen Schlund behältst du dein Licht.',2600)}
  if(LB.boss)labBossArrive(c,now);
}
function labSpark(c,col,n,sp){if(!LAB.ready||LAB.fail||!LAB.X)return;const W=LB.L.W,x=LAB.X(c%W),z=LAB.Z((c/W)|0),k=new THREE.Color(col);for(let i=0;i<n;i++){const a=Math.random()*6.3,v=(sp||2.2)*(.4+Math.random());LAB.parts.push({x,y:.4,z,vx:Math.cos(a)*v,vy:2+Math.random()*3,vz:Math.sin(a)*v,t:0,l:.5+Math.random()*.5,c:k,s:.07+Math.random()*.08})}}
function labStep(now,dt){
  if(!LB)return;const L=LB.L,W=L.W;LB.clock+=dt*1000;
  if(LB.t0&&!LB.won){const el=(now-LB.t0)/1000;if(el>LB.starT)for(const s of LB.stars)if(!s.got)s.gone=true}
  for(let k=0;k<L.locks.length;k++){if(L.locks[k].bomb?LB.mask>>k&1:LB.dopen[k])LB.doorK[k]=L.locks[k].bomb?1:Math.min(1,LB.doorK[k]+dt*7);
    if(LB.fz[k]&&now>=LB.fz[k]&&!LB.dead&&!LB.won){LB.fz[k]=0;const lk=L.locks[k],here=Math.round(LB.by)*W+Math.round(LB.bx);tone(70,.5,'sawtooth',.09);tone(45,.7,'square',.07,.04);LB.shake=now;labSpark(lk.k,'#ff8a2a',26,5);labSpark(lk.k,'#ffe36b',14,3);
      if(labNear(L,k,here)){LB.dead=now;LB.burn=true;LB.roll=null;LB.queue=[]}else{LB.got|=1<<k;LB.mask|=1<<k;labSpark(lk.d,LB.th.wall,22,4)}}}
  /* Wachen laufen ihren Weg ab. Wer ihnen in die Arme rollt, wird zum Start zurückgetragen, der Fortschritt bleibt. */
  L.guards.forEach((cells,gi)=>{const tg=(now-LB.gt0)/1000,[x,y]=labGuardPos(L,gi,tg),[x2,y2]=labGuardPos(L,gi,tg+.05),a=cells[0],b=cells[1],sg=(x2-x)*(b%W-a%W)+(y2-y)*(((b/W)|0)-((a/W)|0))>=0?1:-1;
    LB.gp[gi]={x,y,dx:(b%W-a%W)*sg,dy:(((b/W)|0)-((a/W)|0))*sg};
    if(!LB.dead&&!LB.won&&now>LB.safe&&Math.abs(x-LB.bx)<.5&&Math.abs(y-LB.by)<.5)labCaught(now,`Erwischt! ${LB.th.gname||'Die Krähe'} trägt dich zum Start zurück.`)});
  if(LB.boss&&!LB.won&&!LB.dead)labBossStep(now,dt);
  if(LB.dead){LB.fall=Math.min(1,(now-LB.dead)/520);if(LB.fall>=1&&now-LB.dead>760){const b=LB.burn;if(LB.shield){LB.dead=0;LB.fall=0;LB.burn=false;LB.shield=false;labCaught(now,'Dein Schutzschild ist zerplatzt, aber dein Licht bleibt. Zurück zum Start.')}else{LB.deaths++;LB.lost=true;labRestart();toast(b?'Zu nah an der Bombe. Das Level beginnt von vorn und kostet einen Stern.':'In den Schlund gefallen. Das Level beginnt von vorn und kostet einen Stern.',2600)}}return}
  const r=LB.roll;if(!r)return;r.t+=dt;const P=r.plan,st=P.state(Math.min(r.t,P.T));LB.bx=st.x;LB.by=st.y;LB.tp=st.sc;LB.spin=st.sc===1;
  while(r.arr<st.arr){r.arr++;const c=P.pts[r.arr];if(labTp(P.pts[r.arr-1],c)){tone(660,.12,'sine',.05);labSpark(P.pts[r.arr-1],'#b9f6ff',8);labSpark(c,'#b9f6ff',8)}labArrive(c,now)}
  if(r.t>=P.T){const n=P.pts.length,a=P.pts[n-2],b=P.pts[n-1];LB.roll=null;LB.pos=r.end;LB.bx=r.end%W;LB.by=(r.end/W)|0;LB.tp=1;LB.spin=false;
    if(r.dead&&LB.boss){labCaught(now,'In den Schlund gefallen. Zurück zum Start.');return}
    if(r.dead){LB.dead=now;LB.burn=false;LB.queue=[];tone(240,.3,'sawtooth',.04);tone(120,.4,'sawtooth',.04,.12);return}
    /* gegen Wand oder Gegenstand: Aufprall mit Nachfedern. Vor Wasser bremst Pia von selbst. */
    if(!P.soft&&n>1&&!labTp(a,b)){LB.bump={dx:b%W-a%W,dy:((b/W)|0)-((a/W)|0),t:now};LB.lastN=n-1;if(LB.boss)labBossBump(r.end,LB.bump.dx,LB.bump.dy,now);if(!LB)return;tone(88,.07,'square',.045);tone(140,.05,'triangle',.03,.05)}else tone(200,.08,'sine',.02);
    if(LB.got&~LB.mask){LB.mask|=LB.got;tone(392,.16,'triangle',.06);tone(523,.22,'triangle',.06,.1)}
    labHud();if(LB.won)return;if(LB.left<=0&&!LB.boss){labWin();return}
    while(LB.queue.length&&!LB.roll){const q=LB.queue.shift(),m0=LB.moves;labMove(q);if(LB.moves===m0)LB.nudge=null}}
}
function labCaught(now,msg){const L=LB.L,W=L.W;LB.roll=null;LB.queue=[];LB.spin=false;LB.bump=null;LB.mask|=LB.got;labSpark(Math.round(LB.by)*W+Math.round(LB.bx),'#ffffff',14);LB.pos=L.start;LB.bx=L.start%W;LB.by=(L.start/W)|0;LB.tp=1;LB.deaths++;LB.safe=now+1800;LB.mini=true;tone(300,.12,'square',.05);tone(200,.2,'square',.05,.1);if(msg)toast(msg,1900);if(LB.boss&&B2[LB.boss.type]&&B2[LB.boss.type].caught)B2[LB.boss.type].caught(LB.boss,L)}
function labRate(){const L=LB.L,goal=Math.ceil(L.par*1.25),all=LB.stars.every(s=>s.got);return{goal,all,s:Math.max(1,1+(LB.moves<=goal?1:0)+(all?1:0)-(LB.lost?1:0))}}
function labHud(){if(!LB)return;const L=LB.L,pct=Math.round((LB.total-LB.left)/LB.total*100),got=LB.stars.filter(s=>s.got).length,now=performance.now(),el=LB.t0?(now-LB.t0)/1000:0,rest=Math.max(0,Math.ceil(LB.starT-el)),open=LB.stars.some(s=>!s.got&&!s.gone);
  {const nl=L.locks.length,fz=LB.fz.find(v=>v);let op=0;for(let k=0;k<nl;k++)if(LB.mask>>k&1)op++;$('#lSub').textContent=LB.th.name+(fz?', Lunte brennt: '+Math.max(0,Math.ceil((fz-now)/1000)):nl?`, offen ${op}/${nl}`:'')}if(LB.boss){$('#lSub').textContent='Bosskampf · '+LB.th.name;$('#lMoves').textContent='♥'.repeat(Math.max(0,LB.boss.hp))+'♡'.repeat(3-Math.max(0,LB.boss.hp))}else $('#lMoves').textContent=LB.moves+' / '+Math.ceil(L.par*1.25);
  $('#lPct').textContent=LB.boss?'':`★ ${got}/${LB.stars.length}`+(open&&!LB.won?` · ${rest} s`:'')+'';labInv();$('#lProg').style.width=pct+'%';if(LB.mini)labMini()}
function labMini(){const L=LB.L,cv=$('#lMini'),big=L.W>10||L.H>14;cv.hidden=!big;LB.mini=false;if(!big)return;const s=3;cv.width=L.W*s;cv.height=L.H*s;const c=cv.getContext('2d');
  for(let i=0;i<LB.N;i++){const v=L.grid[i];if(v!==1&&v!==4)continue;c.fillStyle=v===4?'#b0372c':LB.painted[i]?LB.th.paint:'rgba(255,255,255,.3)';c.fillRect((i%L.W)*s,((i/L.W)|0)*s,s,s)}
  c.fillStyle='#fff';c.fillRect(Math.round(LB.bx)*s-1,Math.round(LB.by)*s-1,s+2,s+2)}
function labWin(){LB.won=true;LB.wonAt=performance.now();const r=LB.boss?{goal:0,all:true,s:LB.deaths===0?3:LB.deaths<=2?2:1}:labRate(),d=labData();
  if(!LB.rnd){const old=d.st[LB.n]||0;if(r.s>old)d.st[LB.n]=r.s;if(LB.n>=d.max)d.max=LB.n+1;labSave(d)}
  sfx.win();celebrate([LB.th.paint,'#ffffff','#ffc857'],3,250);labHud();if(LB.tut!==undefined){const i=LB.tut;setTimeout(()=>{if(LB&&LB.won&&LB.tut===i)labTut(i+1)},1700);return}const fin=!LB.rnd&&LB.n===LW_N*LW_C,wEnd=!LB.rnd&&LB.n%LW_N===0&&LB.n<LW_N*LW_C;
  const fn=()=>{if(!LB||!LB.won||!$('#lab').classList.contains('on'))return;
    const s=openSheet(`<div class="sh-head"><h2>${LB.boss?LB.L.boss.name+' besiegt':(LB.rnd?'Zufallslevel':'Level '+LB.n)+' geschafft'}</h2></div><div class="stars">${starStr(r.s)}</div>
    <div class="stats">${LB.boss?`<div><b>${LB.moves}</b><span>Züge</span></div><div><b>3</b><span>Treffer</span></div>`:`<div><b>${LB.moves}</b><span>Züge, Ziel ${r.goal}</span></div><div><b>${LB.stars.filter(x=>x.got).length}/${LB.stars.length}</b><span>Bonussterne</span></div>`}<div><b>${LB.deaths}</b><span>Fehlversuche</span></div></div>
    ${fin?'<p style="text-align:center">Der Bann ist gebrochen. Pia steht wieder auf zwei Beinen, und Morvan ist nur noch eine sehr kleine, sehr beleidigte Murmel. Die Reise geht in endlosen Leveln weiter.</p>':wEnd?`<p style="text-align:center">${LTH[LB.wi].name} liegt hinter dir.</p>`:r.s<3?`<p style="text-align:center">${LB.moves>r.goal?`Einen Stern gibt es für höchstens ${r.goal} Züge.`:''} ${r.all?'':'Einen weiteren bringen alle Bonussterne, bevor ihre Zeit abläuft.'}</p>`:''}
    <div class="btns"><button class="ghost" id="lwHome">Zur Reise</button><button class="ghost" id="lwAgain">Nochmal</button><button class="primary" id="lwNext">${LB.rnd?'Neues Zufallslevel':'Nächstes Level'}</button></div>`,true);
    s.querySelector('#lwHome').onclick=()=>{closeSheet();LB=null;show('home');show('lcamp')};
    s.querySelector('#lwAgain').onclick=()=>{closeSheet();LB.deaths=0;labRestart()};
    s.querySelector('#lwNext').onclick=()=>{closeSheet();LB.rnd?labRandom():labPlay(LB.n+1)}};
  setTimeout(()=>{const seen=store.get('lcs',[]);if(fin&&window.gsap&&LB&&LB.won&&!seen.includes('finale')){seen.push('finale');store.set('lcs',seen);cinePlay('finale',fn)}else fn()},1500)}
function labQuit(){LB=null;show('home')}
function labRandom(){labStart(0,'r'+((Math.random()*1e9)|0))}
function labHint(){if(!LB||LB.won||LB.roll||LB.dead)return;if(LB.boss){toast(LB.L.boss.tip,3600);return}const p=labNextPath(LB.L,LB.pos,LB.painted,LB.mask);if(!p||!p.length){if(LB.fz.some(v=>v))toast('Die Lunte brennt. Bleib von der Bombe weg und warte auf den Knall.',2400);return}LB.hints++;
  const a=$('#lArrow');a.style.transform=`translate(-50%,-50%) rotate(${[0,180,90,-90][p[0]]}deg)`;a.classList.remove('on');void a.offsetWidth;a.classList.add('on');sfx.tick()}
function labCamp(){const d=labData(),cur=Math.min(LW_C-1,Math.floor((d.max-1)/LW_N)),box=$('#lcMap'),endless=d.max>LW_N*LW_C,w=box.clientWidth,h=Math.round(Math.max(640,innerHeight-box.getBoundingClientRect().top-scrollY-16-(endless?74:0))),cv=$('#lcCv'),MW=124,MH=Math.round(MW*h/Math.max(1,w));if(w<50)return;
  box.style.height=h+'px';cv.width=MW;cv.height=MH;labMapDraw(cv.getContext('2d'),MW,MH,endless?LW_C:cur);let hh='';
  for(let i=0;i<LW_C;i++){let ws=0;for(let j=0;j<LW_N;j++)ws+=d.st[i*LW_N+j+1]||0;const st=i>cur?'lock':i===cur&&!endless?'cur':'done';
    hh+=`<button class="mn ${st}" data-w="${i}" style="left:${LMAP[i][0]*100}%;top:${LMAP[i][1]*100}%;--pc:${LTH[i].paint}">${st==='cur'?'<u></u>':''}<i>${i+1}</i><span>${LTH[i].name}</span>${st==='lock'?'':`<em>★ ${ws}</em>`}</button>`}
  $('#lcNodes').innerHTML=hh;$('#lcNodes').querySelectorAll('.mn').forEach(b=>b.onclick=()=>{const i=+b.dataset.w;if(i>cur){toast(`Noch verschlossen. Schließe zuerst ${LTH[i-1].name} ab.`,2000);sfx.bad();return}labWorld(i)});
  $('#lcStars').textContent='★ '+Object.values(d.st).reduce((a,b)=>a+b,0);
  $('#lcEnd').innerHTML=endless?`<button class="gbtn go" id="lcEndB">Endlose Reise · Level ${d.max}</button>`:'';if(endless)$('#lcEndB').onclick=()=>labPlay(d.max);
  setTimeout(()=>{const el=document.querySelector('.mn.cur')||document.querySelector('.mn.done');if(el&&scrollY<10)scrollTo(0,Math.max(0,el.getBoundingClientRect().top+scrollY-innerHeight*.6))},40)}
function labWorld(w){const d=labData(),th=LTH[w];let g='',ws=0;
  for(let j=0;j<LW_N;j++){const n=w*LW_N+j+1,s=d.st[n]||0,lock=n>d.max;ws+=s;g+=`<button class="lvb${lock?' lock':''}${n===d.max?' cur':''}" data-n="${n}" ${lock?'disabled':''}><b>${j+1}</b><span class="st">${lock?'':starStr(s)}</span><small>${LBOSSN[n]?'♛ Boss':['','•','••','•••'][LW_D[j]]}</small></button>`}
  const s=openSheet(`<div class="lw" style="--c1:${th.bg[0]};--c2:${th.bg[1]};--pc:${th.paint}"><div class="lw-h"><i>${w+1}</i><div><b>${th.name}</b><span>${LSTORY[w][0]} · ★ ${ws}/${LW_N*3}</span></div><button class="ib" data-x aria-label="Schließen">${I.x}</button></div><p>${LSTORY[w][1]}</p>${LSTORY[w][2]?`<p><b>${LSTORY[w][2]}</b></p>`:''}<div class="lvg">${g}</div>${window.gsap?`<div class="btns lwf">${Object.entries(LCINE).filter(([n])=>Math.floor((n-1)/LW_N)===w&&+n<=d.max).map(([n,c])=>`<button class="ghost" data-c="${c}">▶ ${LCNAME[c]}</button>`).join('')}</div>`:''}<p class="lw-n">Die Punkte zeigen, wie knifflig ein Level ist. Große Level dauern länger, kleine sind oft die härteren Nüsse.</p></div>`);
  s.querySelectorAll('.lvb').forEach(b=>b.onclick=()=>{closeSheet();labPlay(+b.dataset.n)});s.querySelectorAll('[data-c]').forEach(f=>f.onclick=()=>{closeSheet();cinePlay(f.dataset.c)})}
/* Landkarte als Pixel-Art: jedes Kartenpixel wird einzeln gesetzt, Bäume, Häuser und Berge sind kleine Sprites */
const LMB=[['#1f5a3c','#184a31'],['#e8c44c','#d8b23c'],['#9ccc68','#8fbe5c'],['#bcae9e','#ae9f90'],['#cdb88c','#bfa97e'],['#a8a8b4','#9a9aa8'],['#8c8ca0','#7e7e94'],['#eefaff','#d8effc'],['#9c9088','#8e827a'],['#6c6058','#5e534c'],['#4c6e4a','#40603f'],['#8e4c3a','#7e4030'],['#5c4c9e','#50418e']],
  LMS={tree:['..a..','.aba.','abbba','.bbb.','..t..'],pine:['..b..','.bbb.','..b..','.bbb.','bbbbb','..t..'],wheat:['y.y','yoy','.o.'],house:['.rrr.','rrrrr','wwwww','wdwlw'],town:['.rr.','rrrr','wwww','wlww','wwdw'],crate:['kkk','kok','kkk'],boat:['..s.','.ss.','hhhh','.hh.'],
    wall:['g.g.g','ggggg','ggdgg'],castle:['r.......r','g...f...g','g..ggg..g','ggggggggg','gglgggllg','ggggdgggg'],ice:['..w..','.wi..','wwii.','wiiii'],mount:['....w....','...www...','..mwwmm..','.mmmmmmm.','mmmmmmmmm'],
    mine:['...m...','..mmm..','.mmdmm.','mmdddmm'],reed:['.a.','aba','.t.','.t.'],lily:['pa','aa'],tent:['..f..','.nnn.','nndnn'],tower:['..p..','.ppp.','..v..','..l..','..v..','..v..','.vvv.','.vdv.'],fire:['.o.','ooy','.t.'],scare:['.o.','ttt','.t.'],cart:['kk','oo']},
  LMP={a:'#2f8a4c',b:'#1f6a3c',t:'#5a3d28',y:'#f6dc6a',o:'#c9922a',r:'#b8442e',w:'#ecdcc0',d:'#3a2a20',l:'#ffd98a',k:'#a67a48',s:'#f4f0e6',h:'#7a5134',g:'#8c8c98',f:'#e0303a',i:'#bfe6ff',m:'#7a6e66',p:'#ff8ac8',n:'#c9b185',v:'#6a58b0'};
function labMapDraw(c,w,h,cur){const rng=mulberry32(4711),P=i=>[LMAP[i][0]*w,LMAP[i][1]*h],img=c.createImageData(w,h),D=img.data,hx=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)],
    nz=(x,y)=>{const n=Math.sin(x*12.9898+y*78.233)*43758.5453;return n-Math.floor(n)},lock=new Uint8Array(w*h),isLand=new Uint8Array(w*h),
    put=(x,y,col,dim)=>{x|=0;y|=0;if(x<0||y<0||x>=w||y>=h)return;const k=(y*w+x)*4,q=typeof col==='string'?hx(col):col;if(dim||lock[y*w+x]){const gy=(q[0]*.3+q[1]*.5+q[2]*.2)*.42;D[k]=gy*.75+10;D[k+1]=gy*.82+14;D[k+2]=gy+34}else{D[k]=q[0];D[k+1]=q[1];D[k+2]=q[2]}D[k+3]=255},
    spr=(name,x,y)=>{const r=LMS[name];x=Math.round(x-r[0].length/2);y=Math.round(y-r.length+1);for(let b=0;b<r.length;b++)for(let a=0;a<r[b].length;a++){const ch=r[b][a];if(ch!=='.')put(x+a,y+b,LMP[ch])}},
    BC=LMB.map(p=>p.map(hx)),grass=[hx('#8ecb68'),hx('#82bf5e')],river=[];
  for(let k=0;k<=260;k++){const u=k/260,a=(1-u)*(1-u)*(1-u),b=3*(1-u)*(1-u)*u,e=3*(1-u)*u*u,f=u*u*u,o=u<.5?[[.4,.02],[.3,.2],[.72,.3],[.64,.46]]:[[.64,.46],[.56,.62],[.7,.74],[.96,.9]],v=u<.5?u*2:u*2-1,A=(1-v)**3,B=3*(1-v)**2*v,C=3*(1-v)*v*v,E=v**3;river.push([(A*o[0][0]+B*o[1][0]+C*o[2][0]+E*o[3][0])*w,(A*o[0][1]+B*o[1][1]+C*o[2][1]+E*o[3][1])*h])}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ax=(x-w/2)/(w*.5),ay=(y-h/2)/(h*.5),an=Math.atan2(ay,ax),rr=1+.05*Math.sin(an*3+1)+.035*Math.sin(an*7+2)+.02*Math.sin(an*13),dd=Math.hypot(ax,ay)/rr,di=(x+y)&1;
    if(dd>1){const sh=dd<1.06;put(x,y,sh?(di?'#4aa0c8':'#3f94bc'):nz(x>>1,y)<.06&&di?'#3a86b4':(((x>>1)+y)&3)===0&&nz(x,y>>1)<.3?'#2f7aa8':'#2a6f9e');continue}
    if(dd>.955){put(x,y,di?'#f0e0a8':'#e4d298');continue}isLand[y*w+x]=1;
    let bi=-1,bd=1e9;for(let i=0;i<LW_C;i++){const dx=x-LMAP[i][0]*w,dy=(y-LMAP[i][1]*h)*.82,q=Math.hypot(dx,dy)+(nz(x>>1,y>>1)-.5)*5;if(q<bd){bd=q;bi=i}}
    const R=bi===7||bi===8?23:17;if(bi>cur&&bd<R+6)lock[y*w+x]=1;
    if(bd<R)put(x,y,BC[bi][(di+(nz(x,y)<.18?1:0))&1]);else if(bd<R+2.5&&di)put(x,y,BC[bi][1]);else put(x,y,grass[(di+(nz(x,y)<.12?1:0))&1])}
  for(const[rx,ry]of river)for(let b=-1;b<2;b++)for(let a=-1;a<2;a++){const x=(rx+a)|0,y=(ry+b)|0;if(x>=0&&y>=0&&x<w&&y<h&&isLand[y*w+x])put(x,y,a===0&&b===0?'#7cc8ee':'#3f94cc')}
  /* Route */
  for(let i=1;i<LW_C;i++){const[x0,y0]=P(i-1),[x1,y1]=P(i),open=i<=cur,mag=i===7,k=mag?.4:.14,mx=(x0+x1)/2+(y1-y0)*k,my=(y0+y1)/2-(x1-x0)*k,len=Math.hypot(x1-x0,y1-y0)*(mag?1.3:1.05),n=Math.max(3,Math.round(len/(mag?3:4)));
    for(let q=1;q<n;q++){const u=q/n,x=(1-u)*(1-u)*x0+2*(1-u)*u*mx+u*u*x1,y=(1-u)*(1-u)*y0+2*(1-u)*u*my+u*u*y1,col=open?(mag?'#e0a8ff':'#fff0a0'):'#5a6078';
      for(let b=0;b<2;b++)for(let a=0;a<2;a++){const X=(x|0)+a,Y=(y|0)+b;if(X>=0&&Y>=0&&X<w&&Y<h){const k4=(Y*w+X)*4,qc=hx(col);D[k4]=qc[0];D[k4+1]=qc[1];D[k4+2]=qc[2];D[k4+3]=255}}if(open){put((x|0)+2,(y|0)+1,'#3a3020');put((x|0)+2,(y|0)+2,'#3a3020');put((x|0)+1,(y|0)+2,'#3a3020')}}}
  /* Sprites: von hinten nach vorn */
  const deco=[['tree','tree','pine'],['wheat','wheat','scare'],['house','wheat','tree'],['town','town','house'],['crate','boat','town'],['wall','wall','tree'],['wall','town','wall'],['ice','ice','ice'],['mount','mount','pine'],['mine','mount','cart'],['reed','lily','reed'],['tent','tent','fire'],['tower','town','wall']],big=['pine','scare','house','town','boat','wall','castle','ice','mount','mine','reed','tent','tower'],list=[];
  for(let i=0;i<LW_C;i++){const[x,y]=P(i),n=i===0||i===8||i===10?26:16;for(let k=0;k<n;k++){const a=rng()*6.3,dd=5+rng()*(i===7||i===8?16:11),sx=x+Math.cos(a)*dd,sy=y+Math.sin(a)*dd*.95;if(Math.hypot(sx-x,sy-y+1)<5.5)continue;const X=sx|0,Y=sy|0;if(X<2||Y<2||X>=w-2||Y>=h-2)continue;const wat=!isLand[Y*w+X];if(wat!==(deco[i][k%3]==='boat'))continue;list.push([sy,deco[i][k%3],sx])}
    list.push([y-4,big[i],x])}
  for(let k=0;k<30;k++){const x=rng()*w,y=rng()*h;if(isLand[(y|0)*w+(x|0)]&&LMAP.every(q=>Math.hypot(x-q[0]*w,y-q[1]*h)>22))list.push([y,'tree',x])}
  list.sort((p,q)=>p[0]-q[0]).forEach(q=>spr(q[1],q[2],q[0]));
  c.putImageData(img,0,0)}
function labHelp(){const s0=openSheet(`<div class="sh-head"><h2>So geht Pias Quest</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
 <ul class="rules"><li><i>1</i><span>Wische in eine Richtung. Pia rollt geradeaus, bis eine Wand oder ein Gegenstand sie aufhält.</span></li>
 <li><i>2</i><span>Jedes Feld, über das sie rollt, beginnt zu leuchten. Leuchten alle Felder, ist das Level geschafft. In großen Leveln zeigt die kleine Karte, was noch fehlt.</span></li>
 <li><i>3</i><span>Wirbelnde Schlünde schlucken die Kugel. Dann beginnt das Level von vorn und ein Stern ist weg. Ab dem Bauernhof liegt manchmal ein blaues Schutzschild im Level. Wer es eingesammelt hat, behält beim nächsten Sturz sein Licht. Portale tragen sie zum Gegenstück, und sie rollt dort in gleicher Richtung weiter.</span></li>
 <li><i>4</i><span>Ein überrollter Schlüssel landet oben links im Inventar. Das Tor in seiner Farbe geht auf, sobald Pia damit davor ankommt. Eine Bombe zündet beim Überrollen und sprengt nach drei Sekunden die rissige Wand. Wer dann noch direkt daneben steht, fängt von vorn an.</span></li>
 <li><i>5</i><span>Schräge Prellböcke schicken die Kugel um die Ecke, ohne sie anzuhalten. Eisrinnen mit Pfeilen lenken die Kugel in ihre Richtung. Bonussterne verschwinden nach einiger Zeit.</span></li>
 <li><i>6</i><span>Krähen, Falken und Gespenster fliegen eine gerade Bahn hin und her, auch über Wände. Rote Rauten und ihr Schatten zeigen, wo sie kreuzen. Wer berührt wird, landet am Start, das Leuchten bleibt.</span></li>
 <li><i>7</i><span>Jedes Level ist geprüft: Festfahren kannst du dich nicht, es gibt von jeder Stelle aus einen Weg zum Ziel.</span></li></ul>${labSpeedRow()}<div class="btns"><button class="ghost" id="lhTut">Übungslevel spielen</button></div>`);labSpeedBind(s0);s0.querySelector('#lhTut').onclick=()=>{closeSheet();labTut(0)}}

/* ---------- Eingabe ---------- */
{const el=$('#lab');let p0=null;LAB.down={x:200,t:0};
  el.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;p0={x:e.clientX,y:e.clientY,id:e.pointerId};LAB.down={x:e.clientX,t:Date.now()}});
  el.addEventListener('pointermove',e=>{if(!p0||e.pointerId!==p0.id)return;const dx=e.clientX-p0.x,dy=e.clientY-p0.y,need=p0.last===undefined?22:30;if(Math.hypot(dx,dy)<need)return;
    /* Der Finger bleibt unten: Jede neue Richtung im selben Wisch zählt als nächster Zug und wird vorgemerkt */
    const d=Math.abs(dx)>Math.abs(dy)?(dx>0?0:1):(dy>0?2:3);LAB.swipe=Date.now();p0.x=e.clientX;p0.y=e.clientY;if(d===p0.last)return;p0.last=d;labMove(d)});
  const up=()=>{p0=null};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  addEventListener('keydown',e=>{if(!LB||!el.classList.contains('on')||sheetOpen)return;const d={ArrowRight:0,d:0,ArrowLeft:1,a:1,ArrowDown:2,s:2,ArrowUp:3,w:3}[e.key];if(d!==undefined){e.preventDefault();labMove(d)}else if(e.key==='r')labRestart()});
  $('#lBack').innerHTML=I.back;$('#lBack').onclick=labQuit;$('#lcBack').innerHTML=I.back;$('#lcBack').onclick=()=>show('home');
  $('#ltRe').innerHTML=LIC.re+'Neustart';$('#ltHint').innerHTML=LIC.hint+'Tipp';$('#ltLv').innerHTML=LIC.lv+'Reise';$('#ltHelp').innerHTML=svg('<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.4-1 .9-1 1.700"/><path d="M12 17v.01"/>')+'Regeln';
  $('#ltRe').onclick=()=>{if(LB&&!LB.won)labRestart()};$('#ltHint').onclick=labHint;$('#ltLv').onclick=()=>{LB=null;show('home');show('lcamp')};addEventListener('resize',()=>{if($('#lcamp').classList.contains('on'))labCamp()});$('#ltHelp').onclick=labHelp}
function labNavBack(){ /* Zurück-Geste des Systems: Wischer am Rand gehören zum Spiel */
  if(Date.now()-LAB.down.t<1300||Date.now()-(LAB.swipe||0)<900)return;
  const s=openSheet(`<div class="sh-head"><h2>Level verlassen?</h2></div><p>Der Stand in diesem Level geht dabei verloren.</p><div class="btns"><button class="ghost" id="lvY">Verlassen</button><button class="primary" id="lvN">Weiterspielen</button></div>`);
  s.querySelector('#lvN').onclick=closeSheet;s.querySelector('#lvY').onclick=()=>{closeSheet();labQuit()}}

/* ---------- 2D-Zeichnung: Vorschau im Menü und Ersatz ohne 3D ---------- */
const labSave=d=>store.set('lab',{max:d.max,st:d.st,seen3:d.seen});
const labFloor=(L,th,i)=>(L.bridge&&L.bridge[i]&&L.spec&&L.spec.bridge?['#b89060','#a88252']:L.room&&L.room[i]>=0&&th.rooms?th.rooms[L.rooms[L.room[i]].type].f:th.floor)[(i%L.W+((i/L.W)|0))&1];
function labDraw2D(c,L,th,st,ox,oy,s,now){const{W,H}=L,g=L.grid,ne=i=>{const x=i%W,y=(i/W)|0;for(let b=-1;b<2;b++)for(let a=-1;a<2;a++){const X=x+a,Y=y+b,v=X>=0&&Y>=0&&X<W&&Y<H?g[Y*W+X]:0;if(v===1||v===2||v===4)return true}return false},dark=th.amb<.25;
  for(let i=0;i<W*H;i++){const x=ox+(i%W)*s,y=oy+((i/W)|0)*s,v=g[i];
    if(v===0){if(ne(i)){c.fillStyle=th.wall;c.fillRect(x,y,s+.5,s+.5);c.fillStyle='rgba(255,255,255,.1)';c.fillRect(x,y,s,s*.18)}continue}
    c.fillStyle=th.ground;c.fillRect(x,y,s+.5,s+.5);
    if(v===1){c.fillStyle=st.painted[i]?th.paint:labFloor(L,th,i);c.globalAlpha=st.painted[i]||!dark?1:.55;c.fillRect(x+s*.05,y+s*.05,s*.9,s*.9);c.globalAlpha=1;
      if(L.bmp[i]){c.strokeStyle='#e0403a';c.lineWidth=Math.max(2,s*.16);c.beginPath();if(L.bmp[i]===1){c.moveTo(x+s*.12,y+s*.88);c.lineTo(x+s*.88,y+s*.12)}else{c.moveTo(x+s*.12,y+s*.12);c.lineTo(x+s*.88,y+s*.88)}c.stroke()}
      if(L.arr[i]>=0){c.save();c.translate(x+s/2,y+s/2);c.rotate([0,Math.PI,Math.PI/2,-Math.PI/2][L.arr[i]]);c.strokeStyle='#eaffff';c.lineWidth=Math.max(1.2,s*.1);c.beginPath();c.moveTo(-s*.15,-s*.22);c.lineTo(s*.12,0);c.lineTo(-s*.15,s*.22);c.stroke();c.restore()}}
    else if(v===2){c.fillStyle=dark?'#5d6b62':'#7a6a4a';c.beginPath();c.arc(x+s/2,y+s/2,s*.34,0,7);c.fill();c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.arc(x+s*.42,y+s*.42,s*.14,0,7);c.fill()}
    else if(v===3){c.fillStyle='#2a8fb5';c.fillRect(x,y,s+.5,s+.5);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x+s*(.2+.2*Math.sin(now/700+i)),y+s*.45,s*.4,s*.07)}
    else if(v===4){c.fillStyle='#05080c';c.beginPath();c.arc(x+s/2,y+s/2,s*.4,0,7);c.fill();c.strokeStyle='#ff5a2a';c.lineWidth=Math.max(1,s*.08);c.beginPath();c.arc(x+s/2,y+s/2,s*.34,now/300+i,now/300+i+4);c.stroke()}}
  L.ports.forEach(([a,b],k)=>{for(const i of[a,b]){c.fillStyle=['#5cf0ff','#ff7ae0','#b6ff6a','#ffb347'][k%4];c.globalAlpha=.55+.25*Math.sin(now/260+k);c.beginPath();c.arc(ox+(i%W+.5)*s,oy+(((i/W)|0)+.5)*s,s*.36,0,7);c.fill();c.globalAlpha=1}});
  L.locks.forEach((q,k)=>{const col=LKC[k%3],m=st.mask||0;if(!(m>>k&1)){const x=ox+(q.d%W)*s,y=oy+((q.d/W)|0)*s;c.fillStyle=q.bomb?th.wall:col;c.fillRect(x+s*.04,y+s*.04,s*.92,s*.92);if(q.bomb){c.strokeStyle='#000';c.lineWidth=1.5;c.beginPath();c.moveTo(x+s*.2,y+s*.2);c.lineTo(x+s*.55,y+s*.5);c.lineTo(x+s*.4,y+s*.85);c.stroke()}}
    if(!(((st.got||0)|m)>>k&1)){c.fillStyle=q.bomb?'#15151a':col;c.beginPath();c.arc(ox+(q.k%W+.5)*s,oy+(((q.k/W)|0)+.5)*s,s*(q.bomb?.28:.2),0,7);c.fill();c.strokeStyle=q.bomb?'#ff7a2a':'#fff';c.lineWidth=1.5;c.stroke()}});
  for(const q of st.gp||[]){c.fillStyle='#23232c';c.beginPath();c.arc(ox+(q.x+.5)*s,oy+(q.y+.5)*s,s*.3,0,7);c.fill();c.fillStyle='#f0c9a0';c.beginPath();c.arc(ox+(q.x+.5)*s,oy+(q.y+.4)*s,s*.16,0,7);c.fill()}
  for(const q of st.stars||[])if(!q.got&&!q.gone){c.fillStyle='#fff3a0';c.font=`${s*.6}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('★',ox+(q.c%W+.5)*s,oy+(((q.c/W)|0)+.56)*s)}
  const r=s*.34*(st.tp===undefined?1:st.tp)*(1-(st.fall||0)*.9),bx=ox+(st.bx+.5)*s,by=oy+(st.by+.5)*s;if(dark){const gl=c.createRadialGradient(bx,by,0,bx,by,s*1.6);gl.addColorStop(0,th.ball+'88');gl.addColorStop(1,th.ball+'00');c.fillStyle=gl;c.fillRect(bx-s*1.6,by-s*1.6,s*3.2,s*3.2)}
  const gr=c.createRadialGradient(bx-r*.35,by-r*.4,r*.1,bx,by,r);gr.addColorStop(0,'#ffffff');gr.addColorStop(.35,th.ball);gr.addColorStop(1,'#00000055');c.fillStyle=th.ball;c.beginPath();c.arc(bx,by,r,0,7);c.fill();c.fillStyle=gr;c.fill();c.strokeStyle='#fff';c.lineWidth=Math.max(1,s*.05);c.stroke();
  c.fillStyle='#ffd84d';c.beginPath();c.moveTo(bx-r*.5,by-r*.75);c.lineTo(bx-r*.5,by-r*1.25);c.lineTo(bx-r*.2,by-r);c.lineTo(bx,by-r*1.35);c.lineTo(bx+r*.2,by-r);c.lineTo(bx+r*.5,by-r*1.25);c.lineTo(bx+r*.5,by-r*.75);c.fill()}

/* ---------- 3D-Szene ---------- */
const lc=h=>new THREE.Color(h).convertSRGBToLinear();
const UVV=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
function lab3Init(){if(LAB.ready)return;const T=THREE,cv=$('#lgl'),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setClearColor(0,0);r.outputEncoding=T.sRGBEncoding;r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;
  LAB.r=r;LAB.scene=new T.Scene();LAB.cam=new T.PerspectiveCamera(30,1,.5,200);
  const flat=g=>{const n=g.index?g.toNonIndexed():g;n.computeVertexNormals();return n};
  const G=LAB.geo={box:new T.BoxGeometry(1,1,1),sph:flat(new T.IcosahedronGeometry(.5,1)),cyl:flat(new T.CylinderGeometry(.5,.5,1,8)),cone:flat(new T.ConeGeometry(.5,1,7)),pyr:flat(new T.ConeGeometry(.72,1,4)),dod:flat(new T.DodecahedronGeometry(.5)),tor:new T.TorusGeometry(.5,.1,6,18),oct:flat(new T.OctahedronGeometry(.5)),pl:new T.PlaneGeometry(1,1),ball:new T.SphereGeometry(.5,28,18),tube:new T.CylinderGeometry(.5,.5,1,20,1,true)};
  G.pl.rotateX(-Math.PI/2);G.tor.rotateX(Math.PI/2);G.pyr.rotateY(Math.PI/4);
  const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,0,32,32,32);gg.addColorStop(0,'rgba(255,255,255,1)');gg.addColorStop(.25,'rgba(255,255,255,.55)');gg.addColorStop(1,'rgba(255,255,255,0)');gx.fillStyle=gg;gx.fillRect(0,0,64,64);LAB.glowTex=new T.CanvasTexture(gc);
  const ac=document.createElement('canvas');ac.width=ac.height=64;const ax=ac.getContext('2d');ax.strokeStyle='#fff';ax.lineWidth=7;ax.lineCap='round';ax.lineJoin='round';for(const o of[4,36]){ax.beginPath();ax.moveTo(o+4,14);ax.lineTo(o+20,32);ax.lineTo(o+4,50);ax.stroke()}LAB.arrTex=new T.CanvasTexture(ac);LAB.arrTex.wrapS=T.RepeatWrapping;
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();LAB.fail=true;labResize()});LAB.ready=true}
function labMat(hex,o){const k=hex+(o?JSON.stringify(o):'');let m=LAB.mats.get(k);if(!m){const p=Object.assign({color:lc(hex)},o||{});if(p.emissive)p.emissive=lc(p.emissive);m=new THREE.MeshLambertMaterial(p);LAB.mats.set(k,m)}return m}
function labHalo(col,size,op){const m=new THREE.SpriteMaterial({map:LAB.glowTex,color:new THREE.Color(col),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op===undefined?.8:op,fog:false});LAB.disp.push(m);const s=new THREE.Sprite(m);s.scale.setScalar(size);return s}
function labProp(type,rng,th){const T=THREE,G=LAB.geo,g=new T.Group(),dark=th.amb<.25,P=(geo,hex,sx,sy,sz,x,y,z,o)=>{const m=new T.Mesh(G[geo],labMat(hex,o));m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m},pick=a=>a[(rng()*a.length)|0],
    eyes=(par,x,y,z,s)=>{for(const k of[-1,1]){const e=P('sph','#ffffff',s,s,s*.6,x+k*s*.75,y,z);par.add(e);const p=P('sph','#15151a',s*.5,s*.5,s*.4,x+k*s*.75,y,z+s*.22);par.add(p)}},lit=(col,y,sz)=>{g.userData.lamp={col,y};const h=labHalo(col,sz||1.7,dark?.75:.3);h.position.y=y;g.add(h);LAB.anim.push({o:h,k:'halo',ph:rng()*6,s:sz||1.7})};
  switch(type){
   case'busch':{const c=pick(['#3f9a48','#4aa652','#358a40']);P('sph',c,.66,.54,.66,-.08,.26,.04);P('sph',c,.48,.42,.48,.2,.2,-.1);P('sph','#57b55c',.38,.34,.38,.02,.44,.12);if(rng()<.5)P('sph','#ff7a9c',.1,.1,.1,.18,.46,.2);break}
   case'stein':P('dod','#9aa0a6',.64,.44,.58,0,.2,0).rotation.y=rng()*3;P('dod','#858b92',.3,.22,.3,.26,.11,.22).rotation.y=rng()*3;break;
   case'fels':P('dod','#8a8078',.8,.9,.7,0,.4,0).rotation.set(rng(),rng()*3,0);P('dod','#f4f8ff',.5,.3,.46,0,.82,0).rotation.y=rng()*3;break;
   case'augen':{P('cyl','#2a1c14',.3,.9,.3,0,.45,0).rotation.z=.12;P('cone','#16382a',.9,.8,.9,.06,1.1,0);P('cone','#1d4a36',.64,.6,.64,.1,1.5,0);for(const k of[-1,1])P('sph','#fff36b',.09,.11,.05,k*.08+.03,.55,.15,{emissive:'#ffe000',emissiveIntensity:1.2});LAB.anim.push({o:g.children[3],k:'blink',o2:g.children[4],ph:rng()*9});break}
   case'pilz':{const col=pick(dark?['#58e6ff','#ff6ad8','#9dff6a']:['#e2463e','#e86a3e']);P('cyl','#f3ead6',.16,.4,.16,0,.2,0);P('cone',col,.7,.36,.7,0,.56,0,dark?{emissive:col,emissiveIntensity:.9}:null);P('cyl','#f3ead6',.09,.2,.09,.28,.1,.16);P('cone',col,.32,.2,.32,.28,.28,.16,dark?{emissive:col,emissiveIntensity:.9}:null);if(dark){const h=labHalo(col,1.1,.45);h.position.y=.5;g.add(h)}break}
   case'stumpf':P('cyl','#6b4a32',.5,.3,.5,0,.15,0);P('cyl','#c9a070',.42,.02,.42,0,.31,0);if(rng()<.6)P('cone','#58e6ff',.16,.14,.16,.16,.38,.06,{emissive:'#2fb8d8',emissiveIntensity:.9});break;
   case'tanne':P('cyl','#5a3d28',.14,.4,.14,0,.2,0);P('cone','#2f7a52',.8,.6,.8,0,.62,0);P('cone','#38895c',.6,.5,.6,0,.98,0);P('cone','#f4f8ff',.38,.42,.38,0,1.3,0);break;
   case'huhn':{const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('sph','#fff6e6',.44,.4,.52,0,.27,0);Q('sph','#fff6e6',.28,.28,.28,0,.54,.16);Q('cone','#ff9a3c',.09,.16,.09,0,.52,.34).rotation.x=Math.PI/2;Q('box','#e0403a',.05,.1,.14,0,.7,.15);Q('cone','#fff6e6',.2,.28,.12,0,.38,-.28).rotation.x=-1;eyes(b,0,.58,.27,.07);b.rotation.y=rng()*6.3;LAB.anim.push({o:b,k:'peck',ph:rng()*6});break}
   case'kraehe':{P('cyl','#8a6a3a',.12,.5,.12,0,.25,0);const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('sph','#23232c',.34,.3,.44,0,.66,0);Q('sph','#23232c',.22,.22,.22,0,.86,.14);Q('cone','#ffb03a',.08,.16,.08,0,.84,.3).rotation.x=Math.PI/2;eyes(b,0,.9,.22,.06);b.rotation.y=rng()*6.3;LAB.anim.push({o:b,k:'peck',ph:rng()*6});break}
   case'katze':{const c=pick(['#e8943a','#6b6f78','#f2f2f2','#2b2b30']),b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('sph',c,.38,.32,.54,0,.2,0);Q('sph',c,.3,.28,.28,0,.42,.22);Q('cone',c,.1,.15,.1,-.09,.6,.22);Q('cone',c,.1,.15,.1,.09,.6,.22);const t=Q('cyl',c,.06,.38,.06,0,.34,-.3);t.rotation.x=-.5;eyes(b,0,.46,.34,.08);b.rotation.y=rng()*6.3;LAB.anim.push({o:t,k:'wag',ph:rng()*6});break}
   case'scheuche':{P('cyl','#8a6a3a',.08,1.1,.08,0,.55,0);P('box','#8a6a3a',.9,.07,.07,0,.78,0);P('box',pick(['#d04a3a','#3a78c8','#7a4ab8']),.4,.44,.2,0,.7,0);P('sph','#f0d9a0',.3,.3,.3,0,1.08,0);P('cone','#6a4a2a',.5,.3,.5,0,1.32,0);eyes(g,0,1.1,.13,.06);g.rotation.y=(rng()-.5)*.8;LAB.anim.push({o:g,k:'sway',ph:rng()*6});break}
   case'heu':if(rng()<.5){const m=P('cyl','#e8c44a',.66,.6,.66,0,.33,0);m.rotation.z=Math.PI/2;m.rotation.y=rng()*3}else{P('box','#e8c44a',.74,.4,.5,0,.2,0).rotation.y=rng();P('box','#dab63c',.6,.34,.44,.04,.56,0).rotation.y=rng()}break;
   case'kuerbis':P('sph','#ff8a2a',.52,.4,.52,0,.2,0);P('cyl','#3f7a34',.07,.14,.07,0,.44,0);P('sph','#ff9a3a',.3,.24,.3,.3,.12,.2);break;
   case'tisch':P('box','#a8703f',.84,.07,.84,0,.46,0);for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])P('box','#8a5830',.08,.44,.08,a*.33,.22,b*.33);P('cyl','#ffffff',.2,.03,.2,.12,.51,-.1);P('sph',pick(['#ff7a59','#ffc857','#e0403a']),.13,.13,.13,.12,.58,-.1);break;
   case'sessel':{const c=pick(['#3ea7a0','#e0708a','#e0b040','#6a82d8']);P('box',c,.7,.28,.7,0,.2,0);P('box',c,.7,.5,.18,0,.5,-.26);P('box',c,.14,.2,.6,-.3,.4,.03);P('box',c,.14,.2,.6,.3,.4,.03);g.rotation.y=((rng()*4)|0)*Math.PI/2;break}
   case'bett':{const c=pick(['#4a7ad8','#d85a7a','#5ab88a']);P('box','#7a5134',.74,.24,.94,0,.12,0);P('box','#f4f0e6',.68,.14,.86,0,.3,0);P('box',c,.7,.1,.56,0,.4,.14);P('box','#ffffff',.44,.1,.2,0,.42,-.3);P('box','#7a5134',.76,.5,.08,0,.36,-.46);g.rotation.y=((rng()*4)|0)*Math.PI/2;break}
   case'herd':P('box','#3a3a42',.8,.6,.7,0,.3,0);P('box','#22222a',.82,.05,.72,0,.62,0);P('cyl','#55555e',.14,.9,.14,.26,.9,-.2);P('box','#ff8a2a',.34,.2,.03,-.1,.3,.36,{emissive:'#ff6a1a',emissiveIntensity:1});P('cyl','#c9c9d2',.26,.14,.26,-.14,.72,0);if(dark)lit('#ff8a3a',.5,1.4);break;
   case'pflanze':P('cyl','#c8683f',.34,.3,.34,0,.15,0);P('sph','#3f9a48',.52,.52,.52,0,.58,0);P('cone','#57b55c',.3,.5,.3,.1,.92,0);break;
   case'regal':{P('box','#7a5134',.86,1.02,.42,0,.51,0);const cs=['#e0584f','#ffc857','#5cc8ff','#4fe3c1','#c58aff'];for(let r=0;r<3;r++)for(let k=0;k<4;k++)P('box',pick(cs),.14,.22,.06,-.27+k*.18,.2+r*.32,.2);g.rotation.y=((rng()*2)|0)*Math.PI/2;break}
   case'fass':P('cyl','#8a5a36',.6,.66,.6,0,.33,0);P('cyl','#3b3b42',.63,.05,.63,0,.16,0);P('cyl','#3b3b42',.63,.05,.63,0,.5,0);P('cyl','#6f4627',.5,.02,.5,0,.67,0);break;
   case'kiste':P('box','#a67a48',.64,.56,.64,0,.28,0).rotation.y=rng()*.5-.25;P('box','#8a6236',.68,.06,.68,0,.57,0);if(rng()<.4)P('box','#b8894f',.36,.3,.36,.06,.75,.02).rotation.y=rng();break;
   case'sack':P('sph','#c9b185',.58,.62,.52,0,.27,0);P('cyl','#b09a70',.16,.14,.16,0,.62,0);break;
   case'stand':{const c=pick(['#e0403a','#3a8ad8','#3aa86a','#e0a030']);P('box','#a67a48',.86,.4,.6,0,.2,0);for(const k of[-1,1])P('box','#7a5134',.06,.9,.06,k*.4,.65,-.26);const r=P('box',c,.96,.08,.8,0,1.08,0);r.rotation.x=.3;for(let k=0;k<3;k++)P('sph',pick(['#ff7a59','#ffc857','#9dff6a','#e0403a']),.16,.16,.16,-.24+k*.24,.48,.1);break}
   case'wache':{const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('cyl','#7a2a3a',.4,.56,.34,0,.3,0);Q('sph','#f0c9a0',.3,.3,.3,0,.72,0);Q('cone','#9aa3b0',.36,.3,.36,0,.96,0);Q('box','#8a6236',.05,1.2,.05,.3,.6,.1);Q('cone','#c9d2dc',.1,.24,.1,.3,1.3,.1);Q('cyl','#c9a23e',.3,.4,.06,-.26,.36,.14).rotation.x=Math.PI/2;eyes(b,0,.74,.13,.06);b.rotation.y=((rng()*4)|0)*Math.PI/2;LAB.anim.push({o:b,k:'guard',ph:rng()*6,r0:b.rotation.y});break}
   case'banner':{const c=pick(['#d0303a','#3a5ad8','#8a3ad0','#e0a030']);P('cyl','#55402e',.07,1.5,.07,0,.75,0);const f=P('box',c,.46,.6,.04,.25,1.1,0);P('cone','#ffd84d',.12,.18,.12,0,1.58,0);LAB.anim.push({o:f,k:'flag',ph:rng()*6});break}
   case'thron':P('box','#c9a23e',.7,.3,.6,0,.15,0);P('box','#9a1f2e',.56,.1,.5,0,.34,.02);P('box','#c9a23e',.7,1.1,.14,0,.7,-.26);P('box','#9a1f2e',.5,.6,.04,0,.8,-.18);for(const k of[-1,1])P('cone','#ffd84d',.14,.24,.14,k*.26,1.36,-.26);g.rotation.y=((rng()*4)|0)*Math.PI/2;break;
   case'saeule':P('box','#8c8c96',.6,.14,.6,0,.07,0);P('cyl','#a5a5ae',.4,.94,.4,0,.61,0);P('box','#8c8c96',.56,.12,.56,0,1.14,0);break;
   case'ruestung':P('cyl','#9aa3b0',.38,.52,.32,0,.3,0);P('sph','#b6bfcc',.32,.32,.32,0,.7,0);P('cone','#e0403a',.1,.34,.1,0,.98,0);P('box','#6f7783',.1,.36,.1,-.25,.34,0);P('box','#6f7783',.1,.36,.1,.25,.34,0);P('box','#c9a23e',.06,.76,.06,.32,.48,.14);P('box','#15151a',.2,.05,.04,0,.72,.15);break;
   case'zelt':{const c=pick(['#c9b185','#b04a3a','#5a6a8a']);P('pyr',c,1,.9,1,0,.45,0);P('box','#2a1c14',.2,.4,.04,0,.2,.36);P('cone','#ffd84d',.08,.2,.08,0,.98,0);break}
   case'eisblock':P('box','#bfe9ff',.7,.6,.66,0,.3,0,{emissive:'#6ac8ff',emissiveIntensity:.25}).rotation.y=rng();P('box','#e6f7ff',.4,.34,.4,.1,.76,.04,{emissive:'#6ac8ff',emissiveIntensity:.25}).rotation.y=rng();break;
   case'schneemann':P('sph','#ffffff',.6,.56,.6,0,.26,0);P('sph','#ffffff',.44,.42,.44,0,.68,0);P('sph','#ffffff',.32,.3,.32,0,1,0);P('cone','#ff8a2a',.08,.24,.08,0,1,.24).rotation.x=Math.PI/2;P('cyl','#23232c',.3,.18,.3,0,1.22,0);P('cyl','#23232c',.42,.03,.42,0,1.14,0);eyes(g,0,1.06,.13,.05);g.rotation.y=(rng()-.5)*1.2;break;
   case'kristall':{const c=pick(['#6dffe0','#ff6ad8','#8a9dff','#b6ff6a']);for(let k=0;k<3;k++){const m=P('oct',c,.2+rng()*.14,.6+rng()*.5,.2+rng()*.14,(k-1)*.2,.34+k*.04,(rng()-.5)*.2,{emissive:c,emissiveIntensity:dark?1:.35});m.rotation.z=(k-1)*.35}lit(c,.6,dark?1.9:1.1);break}
   case'kerze':P('cyl','#c9a23e',.3,.06,.3,0,.03,0);P('cyl','#c9a23e',.06,.7,.06,0,.38,0);for(const k of[-1,0,1]){P('cyl','#f4f0e6',.07,.2,.07,k*.16,.78+(k?0:.08),0);const f=P('cone','#ffd98a',.07,.14,.07,k*.16,.95+(k?0:.08),0,{emissive:'#ffb347',emissiveIntensity:1.4});f.castShadow=false}lit('#ffc46b',.95,1.5);break;
   case'boot':{const c=pick(['#c0503a','#3a78c8','#e0b040']);P('box','#7a5134',.5,.2,.9,0,.12,0);P('box',c,.56,.08,.96,0,.24,0);P('cone','#7a5134',.5,.3,.2,0,.12,.5).rotation.x=Math.PI/2;P('cyl','#55402e',.05,.8,.05,0,.6,0);P('pyr','#f4f0e6',.5,.6,.05,.02,.7,0).rotation.y=Math.PI/2;g.rotation.y=rng()*6.3;break}
   case'moewe':{P('cyl','#6a4a36',.16,.6,.16,0,.3,0);const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('sph','#ffffff',.32,.26,.44,0,.74,0);Q('sph','#ffffff',.2,.2,.2,0,.92,.16);Q('cone','#ffb03a',.07,.16,.07,0,.9,.32).rotation.x=Math.PI/2;Q('box','#8a9098',.36,.04,.3,0,.8,-.06);eyes(b,0,.95,.23,.05);b.rotation.y=rng()*6.3;LAB.anim.push({o:b,k:'peck',ph:rng()*6});break}
   case'netz':P('cyl','#55402e',.06,.9,.06,-.3,.45,0);P('cyl','#55402e',.06,.9,.06,.3,.45,0);P('box','#c9b185',.6,.5,.03,0,.6,0,{transparent:true,opacity:.55});P('sph','#ff8a3c',.14,.14,.14,.1,.2,.14);P('sph','#3a8ad8',.12,.12,.12,-.12,.16,.1);break;
   case'lore':P('box','#55555e',.7,.36,.5,0,.36,0);P('box','#3a3a42',.76,.06,.56,0,.56,0);for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])P('cyl','#23232c',.2,.06,.2,a*.24,.12,b*.26).rotation.x=Math.PI/2;for(let k=0;k<3;k++)P('dod',pick(['#ffd23a','#8a8078','#6dffe0']),.2,.18,.2,(k-1)*.2,.64,(rng()-.5)*.2);g.rotation.y=((rng()*2)|0)*Math.PI/2;break;
   case'balken':P('box','#6b4a32',.12,1.1,.12,-.34,.55,0);P('box','#6b4a32',.12,1.1,.12,.34,.55,0);P('box','#7a5134',.9,.12,.16,0,1.12,0);P('dod','#77777f',.3,.2,.3,0,.1,.1);break;
   case'frosch':{const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('cyl','#3f8a4a',.7,.04,.7,0,.02,0);Q('sph','#5ad06a',.4,.3,.44,0,.2,0);for(const k of[-1,1]){Q('sph','#5ad06a',.15,.15,.15,k*.12,.38,.12);Q('sph','#15151a',.07,.07,.05,k*.12,.4,.19)}b.rotation.y=rng()*6.3;LAB.anim.push({o:b,k:'hop',ph:rng()*9});break}
   case'seerose':P('cyl','#3f8a4a',.8,.04,.8,0,.02,0);P('cone','#ff8ac8',.3,.24,.3,.06,.16,0);P('cone','#ffd0ea',.16,.3,.16,.06,.2,0);P('cyl','#3f8a4a',.4,.04,.4,-.3,.03,.24);break;
   case'irrlicht':{const c=pick(['#7dffb0','#8ad8ff','#d9a0ff']);P('cyl','#3f5a48',.3,.06,.3,0,.03,0);const o2=P('sph',c,.22,.26,.22,0,.7,0,{emissive:c,emissiveIntensity:1.6});o2.castShadow=false;LAB.anim.push({o:o2,k:'float',ph:rng()*6});lit(c,.7,2.2);break}
   case'flieger':{const b=new T.Group();g.add(b);const Q=(...a)=>{const m=P(...a);b.add(m);return m};Q('sph','#23232c',.4,.32,.56,0,.75,0);Q('sph','#23232c',.26,.26,.26,0,.92,.24);Q('cone','#ffb03a',.09,.2,.09,0,.9,.44).rotation.x=Math.PI/2;Q('cone','#23232c',.2,.3,.08,0,.78,-.36).rotation.x=-1.2;eyes(b,0,.97,.33,.06);
     for(const k of[-1,1]){const w=Q('box','#33333e',.5,.04,.34,k*.42,.8,0);LAB.anim.push({o:w,k:'flap',ph:k})}break}
   case'geist':{const b=new T.Group();g.add(b);const m=labMat('#eaf6ff',{emissive:'#9fd8ff',emissiveIntensity:.7,transparent:true,opacity:.88}),Q=(geo,sx,sy,sz,x,y,z)=>{const q=new T.Mesh(G[geo],m);q.scale.set(sx,sy,sz);q.position.set(x,y,z);b.add(q);return q};Q('sph',.6,.6,.56,0,.86,0);Q('cyl',.56,.4,.52,0,.62,0);for(let k=0;k<4;k++)Q('cone',.2,.3,.2,Math.cos(k*1.57+.8)*.17,.3,Math.sin(k*1.57+.8)*.17).rotation.x=Math.PI;
     for(const k of[-1,1]){const e=new T.Mesh(G.sph,labMat('#15151a'));e.scale.set(.11,.15,.06);e.position.set(k*.13,.9,.26);b.add(e)}const mo=new T.Mesh(G.sph,labMat('#15151a'));mo.scale.set(.1,.12,.05);mo.position.set(0,.72,.27);b.add(mo);break}
   case'laterne':P('cyl','#2a2d33',.08,.9,.08,0,.45,0);P('box','#ffe2a0',.24,.28,.24,0,1.02,0,{emissive:'#ffb347',emissiveIntensity:1.5}).castShadow=false;P('cone','#2a2d33',.38,.16,.38,0,1.24,0);lit('#ffc46b',1.02,2.1);break;
   case'fackel':P('cyl','#3a3a42',.4,.1,.4,0,.05,0);P('cyl','#55402e',.09,.8,.09,0,.45,0);P('cyl','#3a3a42',.22,.1,.22,0,.86,0);{const f=P('cone','#ffb347',.22,.36,.22,0,1.08,0,{emissive:'#ff7a2a',emissiveIntensity:1.6});f.castShadow=false;LAB.anim.push({o:f,k:'flame',ph:rng()*6})}lit('#ff9a4a',1.05,2.2);break;
   case'feuer':for(let k=0;k<3;k++)P('cyl','#5a3d28',.1,.6,.1,0,.08,0).rotation.set(Math.PI/2,k*1.05,0);for(let k=0;k<5;k++)P('dod','#77777f',.16,.12,.16,Math.cos(k*1.26)*.36,.06,Math.sin(k*1.26)*.36);{const f=P('cone','#ffb347',.34,.56,.34,0,.38,0,{emissive:'#ff6a1a',emissiveIntensity:1.6});f.castShadow=false;LAB.anim.push({o:f,k:'flame',ph:rng()*6,s:.34,h:.56});const f2=P('cone','#ffe36b',.18,.34,.18,0,.3,0,{emissive:'#ffc21a',emissiveIntensity:1.6});f2.castShadow=false}lit('#ff8a3a',.5,2.6);break}
  return g}
function labScene(){
  if(!LAB.ready||LAB.fail||!LB)return;const T=THREE,G=LAB.geo,L=LB.L,th=LB.th,{W,H}=L,N=W*H,g=L.grid,S=LAB.scene,rng=mulberry32(hashStr('deko'+LB.seed)),X=x=>x-(W-1)/2,Z=y=>y-(H-1)/2,dark=th.amb<.25,dusk=th.amb<.4;
  while(S.children.length)S.remove(S.children[0]);for(const m of LAB.mats.values())m.dispose();LAB.mats.clear();for(const o of LAB.disp)o.dispose();LAB.disp=[];LAB.anim=[];LAB.pops=[];LAB.lamps=[];LAB.parts=[];LAB.X=X;LAB.Z=Z;
  S.fog=dark?new T.Fog(new T.Color(th.bg[1]),20,60):null;
  S.add(new T.HemisphereLight(lc(dark?th.sunC:'#ffffff'),lc(th.ground),th.amb));
  const sun=new T.DirectionalLight(lc(th.sunC),th.sun);sun.castShadow=true;const sc=sun.shadow.camera;sc.left=-10;sc.right=10;sc.top=12;sc.bottom=-12;sc.near=1;sc.far=34;sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-.0008;sun.shadow.normalBias=.03;S.add(sun);S.add(sun.target);LAB.sun=sun;
  const dm=new T.Object3D(),put=(mesh,i,x,y,z,sx,sy,sz,ry)=>{dm.position.set(x,y,z);dm.scale.set(sx,sy,sz);dm.rotation.set(0,ry||0,0);dm.updateMatrix();mesh.setMatrixAt(i,dm.matrix)},
    inst=(geo,mat,n,sh)=>{const m=new T.InstancedMesh(G[geo],mat,Math.max(1,n));m.count=n;m.castShadow=sh!==false;m.receiveShadow=true;m.frustumCulled=false;S.add(m);return m},tint=(hex,j)=>{const c=lc(hex);c.offsetHSL((rng()-.5)*.03,0,(rng()-.5)*j);return c};
  /* Boden, bei Dunkelheit mit leuchtender Spur */
  const fl=[];for(let i=0;i<N;i++)if(g[i]===1)fl.push(i);LB.fi=new Int32Array(N).fill(-1);
  const fm=inst('box',labMat('#ffffff'),fl.length,false);LAB.floor=fm;LAB.fcol=c=>lc(labFloor(L,th,c));LAB.pc=lc(th.paint).multiplyScalar(dark?1.6:1.05);
  LAB.glow=dark||dusk?inst('pl',(()=>{const m=new T.MeshBasicMaterial({color:new T.Color(th.paint),transparent:true,opacity:dark?.62:.3,depthWrite:false,fog:false});LAB.disp.push(m);return m})(),fl.length,false):null;if(LAB.glow)LAB.glow.receiveShadow=false;
  fl.forEach((c,k)=>{LB.fi[c]=k;const x=c%W,y=(c/W)|0;put(fm,k,X(x),.05,Z(y),.94,.1,.94);fm.setColorAt(k,LB.painted[c]?LAB.pc:LAB.fcol(c));if(LAB.glow)put(LAB.glow,k,X(x),.108,Z(y),LB.painted[c]?.9:0,1,LB.painted[c]?.9:0)});fm.instanceColor.needsUpdate=true;
  /* Wände je nach Welt */
  const ws=[];for(let i=0;i<N;i++){if(g[i]!==0)continue;const x=i%W,y=(i/W)|0;let n=false;for(let b=-1;b<2&&!n;b++)for(let a=-1;a<2;a++){const p=x+a,q=y+b,v=p>=0&&q>=0&&p<W&&q<H?g[q*W+p]:0;if(v===1||v===2||v===4){n=true;break}}if(n)ws.push(i)}
  /* Boden nur unter dem, was zum Level gehört: so entstehen Inseln statt eines Rechtecks */
  {const isW=new Uint8Array(N);for(const c of ws)isW[c]=1;const gc=[];for(let i=0;i<N;i++)if(g[i]!==0||isW[i])gc.push(i);const gm=inst('box',labMat(th.ground),gc.length,false);gc.forEach((c,k)=>put(gm,k,X(c%W),-.3,Z((c/W)|0),1,.6,1))}
  const wn=ws.length,wx=c=>X(c%W),wz=c=>Z((c/W)|0),upd=m=>{if(m.instanceColor)m.instanceColor.needsUpdate=true};LAB.wh=new Float32Array(N);
  const front=c=>c>=W&&(g[c-W]===1||g[c-W]===4);
  if(th.ws==='tree'){const tr=inst('cyl',labMat('#3a281c'),wn),c1=inst('cone',labMat('#ffffff'),wn),c2=inst('cone',labMat('#ffffff'),wn);
    ws.forEach((c,k)=>{const x=wx(c)+(rng()-.5)*.24,z=wz(c)+(rng()-.5)*.24,s=front(c)?.32+rng()*.08:.9+rng()*.7;put(tr,k,x,.25*s,z,.22,.5*s,.22);put(c1,k,x,.85*s,z,1.05*s,.95*s,1.05*s,rng()*3);put(c2,k,x,1.4*s,z,.72*s,.8*s,.72*s,rng()*3);c1.setColorAt(k,tint('#17452f',.06));c2.setColorAt(k,tint('#226040',.07))});upd(c1);upd(c2)}
  else if(th.ws==='rock'){const r1=inst('dod',labMat('#ffffff'),wn),r2=inst('dod',labMat('#f4f8ff'),wn);ws.forEach((c,k)=>{const h=front(c)?.3+rng()*.14:.7+rng()*.9;put(r1,k,wx(c),h*.42,wz(c),1.12,h,1.12,rng()*3);r1.setColorAt(k,tint(th.wall,.1));put(r2,k,wx(c)+(rng()-.5)*.2,h*.82,wz(c)+(rng()-.5)*.2,rng()<.6?.6:0,.34,.56,rng()*3)});upd(r1)}
  else{const wm=inst('box',labMat('#ffffff',th.ws==='ice'?{emissive:'#4aa8e8',emissiveIntensity:.22}:null),wn),hs=[];
    ws.forEach((c,k)=>{let h=th.wh*(1+(rng()-.5)*th.jit);if(front(c))h=Math.min(h,.44);hs.push(h);LAB.wh[c]=h;put(wm,k,wx(c),h/2,wz(c),1,h,1);wm.setColorAt(k,th.ws==='house'?lc(['#e8c9a0','#d9a07a','#c9d4e0','#e6d9b0','#c8a8c8'][(rng()*5)|0]):tint(th.wall,th.ws==='ice'?.1:.05))});upd(wm);
    if(th.ws==='house'){const rf=inst('pyr',labMat('#ffffff'),wn),wi=inst('box',(()=>{const m=new T.MeshBasicMaterial({color:new T.Color('#ffd98a'),fog:false});LAB.disp.push(m);return m})(),wn,false);ws.forEach((c,k)=>{{const f=front(c)?.4:1;put(rf,k,wx(c),hs[k]+.3*f,wz(c),1,.6*f,1)}rf.setColorAt(k,lc(['#a8402e','#8a3a2a','#5a4a6a','#7a4a2a'][(rng()*4)|0]));const on=rng()<.6;put(wi,k,wx(c)+(rng()-.5)*.3,hs[k]*.6,wz(c)+.505,on?.2:0,.26,.02)});upd(rf)}
    if(th.ws==='wheat'){const tf=inst('cone',labMat('#ffffff'),wn*3);ws.forEach((c,k)=>{for(let q=0;q<3;q++){put(tf,k*3+q,wx(c)+(rng()-.5)*.6,hs[k]+(front(c)?.1:.18),wz(c)+(rng()-.5)*.6,.3,(.5+rng()*.3)*(front(c)?.45:1),.3);tf.setColorAt(k*3+q,tint('#f2c84a',.1))}});upd(tf)}
    if(th.ws==='ice'){const sp=inst('oct',labMat('#e6f7ff',{emissive:'#6ac8ff',emissiveIntensity:.3}),wn);ws.forEach((c,k)=>put(sp,k,wx(c)+(rng()-.5)*.4,hs[k]+.2,wz(c)+(rng()-.5)*.4,rng()<.5&&!front(c)?.3:0,.7+rng()*.5,.3,rng()*3))}
    if(th.zinnen){const cr=ws.filter(c=>((c%W)+((c/W)|0))%2===0),cm=inst('box',labMat(th.wall),cr.length);cr.forEach((c,k)=>put(cm,k,wx(c),LAB.wh[c]+.09,wz(c),.5,front(c)?.12:.2,.5))}
    if(th.spitz){const cm=inst('cone',labMat('#6a4a36'),wn);ws.forEach((c,k)=>put(cm,k,wx(c),hs[k]+(front(c)?.1:.2),wz(c),.5,front(c)?.25:.5,.5,rng()))}}
  /* Gegenstände und Lichtquellen */
  const pr=[];for(let i=0;i<N;i++)if(g[i]===2)pr.push(i);const lampAt=new Set(),far=(a,b)=>Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0));
  if(th.lamp){const ch=[];for(const c of pr.slice().sort(()=>rng()-.5)){if(ch.length>=18)break;if(ch.every(q=>far(q,c)>=(dark?4:5)))ch.push(c)}ch.forEach(c=>lampAt.add(c))}
  for(const c of pr){if(L.noProp&&L.noProp.has(c))continue;const list=L.room&&L.room[c]>=0&&th.rooms?th.rooms[L.rooms[L.room[c]].type].p:th.props,o=labProp(lampAt.has(c)?th.lamp:list[(rng()*list.length)|0],rng,th);o.position.set(wx(c),0,wz(c));S.add(o);if(front(c)){const hh=new T.Box3().setFromObject(o).max.y;if(hh>.72&&!o.userData.lamp)o.scale.setScalar(Math.max(.5,.72/hh))}if(o.userData.lamp)LAB.lamps.push({x:wx(c),y:o.userData.lamp.y+.1,z:wz(c),col:lc(o.userData.lamp.col),ph:c*1.7})}
  LAB.pool=[];if(LAB.lamps.length)for(let k=0;k<4;k++){const l=new T.PointLight(0xffffff,0,7.5,2);S.add(l);LAB.pool.push(l)}
  /* Wasser mit Fischen */
  const wa=[];for(let i=0;i<N;i++)if(g[i]===3)wa.push(i);LAB.water=null;
  if(wa.length){const ice=th.id==='eis',mat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:{value:0},uDim:{value:dark?.5:dusk?.75:1}},
      vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*instanceMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader:`uniform float uT;uniform float uDim;varying vec3 vW;void main(){vec2 p=vW.xz*3.4;float a=sin(p.x+uT*1.3+sin(p.y*1.1+uT*.7)*1.4),b=sin(p.y*1.2-uT+sin(p.x*.9-uT*.5)*1.6);
        float c=smoothstep(.7,1.,a*b*.5+.5)+smoothstep(.93,1.,sin((p.x+p.y)*.7+uT*.6))*.3;vec3 col=mix(vec3(.05,.36,.62),vec3(.12,.7,.8),.5+.5*sin(p.x*.4+p.y*.3+uT*.3))+c*vec3(.55,.68,.66);gl_FragColor=vec4(col*uDim,.76);}`});
    LAB.disp.push(mat);LAB.water=mat;const wm=inst('pl',mat,wa.length,false),bed=inst('pl',labMat(dark?'#0b2632':ice?'#3a7a9a':'#1d5f73'),wa.length,false);
    wa.forEach((c,k)=>{put(wm,k,wx(c),.085,wz(c),1,1,1);put(bed,k,wx(c),.004,wz(c),1,1,1)});
    wa.forEach(c=>{if(rng()<.6){const f=new T.Group(),col=['#ff8a3c','#ffd84d','#ff5d6c','#f2f2f2'][(rng()*4)|0],fmat=labMat(col,{emissive:col,emissiveIntensity:dark?.8:.15}),b=new T.Mesh(G.sph,fmat);b.scale.set(.28,.06,.12);f.add(b);
        const t=new T.Mesh(G.cone,fmat);t.scale.set(.14,.14,.03);t.rotation.z=Math.PI/2;t.position.x=-.19;f.add(t);f.position.y=.035;S.add(f);
        LAB.anim.push({o:f,k:'fish',cx:wx(c),cz:wz(c),r:.18+rng()*.14,sp:(.5+rng()*.6)*(rng()<.5?1:-1),ph:rng()*6.3})}})}
  /* Schlünde: schwarzes Loch mit kreisendem Ereignishorizont */
  LAB.holeMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:{value:0}},vertexShader:UVV,fragmentShader:`uniform float uT;varying vec2 vUv;void main(){vec2 p=vUv-.5;float r=length(p)*2.,a=atan(p.y,p.x);
     float sw=sin(a*3.+log(r+.04)*7.-uT*4.)*.5+.5,sw2=sin(a*5.-log(r+.04)*9.+uT*2.6)*.5+.5,core=smoothstep(.2,.62,r);
     vec3 col=mix(vec3(.45,.02,.5),vec3(1.,.28,.05),sw)*core*(.35+sw*.9)+vec3(1.,.8,.3)*pow(sw*sw2,3.)*core*1.4;col+=vec3(1.,.35,.1)*smoothstep(.78,.92,r)*(1.-smoothstep(.92,1.,r))*(1.2+.5*sin(uT*5.));
     gl_FragColor=vec4(col,1.-smoothstep(.94,1.,r));}`});LAB.disp.push(LAB.holeMat);
  for(let i=0;i<N;i++)if(g[i]===4&&!(L.boss&&L.boss.type==='irrlicht')){const p=new T.Mesh(G.box,labMat('#020203'));p.scale.set(.98,.02,.98);p.position.set(wx(i),.008,wz(i));S.add(p);const h=new T.Mesh(G.pl,LAB.holeMat);h.scale.set(1.12,1,1.12);h.position.set(wx(i),.03,wz(i));h.rotation.y=rng()*6;S.add(h);
    if(dark||dusk){const hl=labHalo('#ff4a1a',1.5,.32);hl.position.set(wx(i),.25,wz(i));S.add(hl)}}
  /* Portale: wabernde magische Felder mit Lichtsäule */
  LAB.portMats=[];L.ports.forEach(([a,b],k)=>{const col=['#5cf0ff','#ff7ae0','#b6ff6a','#ffb347'][k%4],cc=new T.Color(col),
      m=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:{value:0},uC:{value:cc}},vertexShader:UVV,fragmentShader:`uniform float uT;uniform vec3 uC;varying vec2 vUv;void main(){vec2 p=(vUv-.5)*2.;float r=length(p);
        float w=sin(p.x*7.+uT*2.2+sin(p.y*6.-uT*1.6)*2.2)*sin(p.y*7.5-uT*1.9+sin(p.x*5.+uT*1.2)*2.);float sh=smoothstep(.15,.95,w*.5+.5);
        vec3 iri=.5+.5*cos(uT*.8+r*5.+vec3(0.,2.1,4.2));vec3 col=mix(uC*.55,vec3(1.),sh*.8)+iri*.35*(1.-sh);col+=uC*smoothstep(.72,.9,r)*1.2;
        gl_FragColor=vec4(col,(1.-smoothstep(.9,1.,r))*(.82+.18*sh));}`}),
      bm=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{uT:{value:0},uC:{value:cc}},vertexShader:UVV,fragmentShader:`uniform float uT;uniform vec3 uC;varying vec2 vUv;void main(){float s=.5+.5*sin(vUv.x*38.+uT*3.+vUv.y*6.);gl_FragColor=vec4(uC*(.5+s*.6),pow(1.-vUv.y,2.2)*.55);}`});
    LAB.disp.push(m,bm);LAB.portMats.push(m,bm);
    for(const c of[a,b]){const d=new T.Mesh(G.pl,m);d.scale.set(.98,1,.98);d.position.set(wx(c),.112,wz(c));S.add(d);const t=new T.Mesh(G.tube,bm);t.scale.set(.8,1.5,.8);t.position.set(wx(c),.85,wz(c));S.add(t);LAB.anim.push({o:t,k:'turn',ph:k});
      const hl=labHalo(col,1.9,dark?.6:.3);hl.position.set(wx(c),.5,wz(c));S.add(hl);LAB.anim.push({o:hl,k:'halo',ph:k*2,s:1.9})}});
  /* Eisrinnen */
  LAB.arrMat=null;{const ar=[];for(let i=0;i<N;i++)if(L.arr[i]>=0)ar.push(i);if(ar.length){LAB.arrMat=new T.MeshBasicMaterial({map:LAB.arrTex,color:new T.Color('#dffcff'),transparent:true,opacity:.95,depthWrite:false,fog:false});LAB.disp.push(LAB.arrMat);
      for(const c of ar){const b=new T.Mesh(G.box,labMat('#8fe0ff',{emissive:'#3ab8ff',emissiveIntensity:dark?.7:.3}));b.scale.set(.9,.03,.9);b.position.set(wx(c),.112,wz(c));S.add(b);const m=new T.Mesh(G.pl,LAB.arrMat);m.scale.set(.8,1,.8);m.position.set(wx(c),.132,wz(c));m.rotation.y=[0,Math.PI,-Math.PI/2,Math.PI/2][L.arr[c]];S.add(m)}}}
  /* Prellböcke: schräge, gestreifte Planken */
  for(let i=0;i<N;i++)if(L.bmp[i]){const b=new T.Group();for(let k=0;k<5;k++){const m=new T.Mesh(G.box,labMat(k%2?'#fff6e6':'#e0403a',{emissive:k%2?'#fff6e6':'#e0403a',emissiveIntensity:dark?.5:.15}));m.scale.set(.27,.4,.13);m.position.set((k-2)*.27,.32,0);m.castShadow=true;b.add(m)}for(const k of[-1,1]){const p=new T.Mesh(G.cyl,labMat('#6a4a2a'));p.scale.set(.12,.56,.12);p.position.set(k*.66,.28,0);p.castShadow=true;b.add(p)}b.rotation.y=L.bmp[i]===1?Math.PI/4:-Math.PI/4;b.position.set(wx(i),.08,wz(i));S.add(b)}
  /* Schlüssel und Tür oder Bombe und rissige Wand */
  LAB.lk=L.locks.map((lk,li)=>{const dx=lk.d%W,dy=(lk.d/W)|0,horiz=g[lk.d-1]===1||g[lk.d-1]===4||g[lk.d+1]===1,d=new T.Group(),o={door:d,key:null,bomb:null},col=LKC[li%3];
    if(lk.bomb){const h=th.ws==='box'||th.ws==='house'?th.wh:.9,body=new T.Mesh(G.box,labMat(th.wall));body.scale.set(1,h,1);body.position.y=h/2;body.castShadow=true;d.add(body);for(let k=0;k<5;k++){const cr=new T.Mesh(G.box,labMat('#0c0a0a'));cr.scale.set(.05,.34+rng()*.3,1.03);cr.position.set((rng()-.5)*.7,h*(.3+rng()*.5),0);cr.rotation.z=(rng()-.5)*1.6;d.add(cr);const c2=cr.clone();c2.scale.set(1.03,cr.scale.y,.05);c2.position.set(0,cr.position.y,(rng()-.5)*.7);c2.rotation.set((rng()-.5)*1.6,0,0);d.add(c2)}
      const b=new T.Group(),bb=new T.Mesh(G.ball,new T.MeshLambertMaterial({color:lc('#18181e'),emissive:lc('#ff2a00'),emissiveIntensity:0}));LAB.disp.push(bb.material);bb.scale.setScalar(.5);bb.position.y=.36;bb.castShadow=true;b.add(bb);const fz=new T.Mesh(G.cyl,labMat('#c9b185'));fz.scale.set(.05,.2,.05);fz.position.set(.06,.68,0);fz.rotation.z=-.3;b.add(fz);const sp=labHalo('#ffb347',.7,.9);sp.position.set(.1,.8,0);b.add(sp);
      b.position.set(wx(lk.k),0,wz(lk.k));S.add(b);o.bomb={g:b,body:bb,sp}}
    else{const km=labMat(col,{emissive:col,emissiveIntensity:.8}),k=new T.Group(),ring=new T.Mesh(G.tor,km);ring.scale.set(.3,.5,.3);ring.rotation.x=Math.PI/2;ring.position.y=.2;k.add(ring);
      const sh=new T.Mesh(G.box,km);sh.scale.set(.07,.34,.07);sh.position.y=-.1;k.add(sh);const b1=new T.Mesh(G.box,km);b1.scale.set(.16,.06,.07);b1.position.set(.08,-.22,0);k.add(b1);const b2=b1.clone();b2.position.set(.06,-.12,0);b2.scale.x=.12;k.add(b2);
      const kh=labHalo(col,1.3,.5);k.add(kh);k.traverse(q=>{if(q.isMesh)q.castShadow=true});k.position.set(wx(lk.k),.6,wz(lk.k));S.add(k);o.key=k;
      const body=new T.Mesh(G.box,labMat(col,{emissive:col,emissiveIntensity:dark?.7:.25}));body.scale.set(horiz?.24:1,.95,horiz?1:.24);body.position.y=.475;body.castShadow=true;d.add(body);const kn=new T.Mesh(G.sph,labMat('#ffd84d',{emissive:'#ffb000',emissiveIntensity:.8}));kn.scale.set(horiz?.36:.18,.18,horiz?.18:.36);kn.position.y=.5;d.add(kn)}
    d.position.set(X(dx),0,Z(dy));if(front(lk.d))d.scale.y=.56;S.add(d);return o});
  /* Wachen mit markiertem Laufweg */
  LAB.gy=th.ws==='tree'?1.05:th.ws==='rock'?.75:th.ws==='house'?1.0:Math.min(.9,th.wh)-.1;LAB.gs=[];
  LAB.gd=L.guards.map(cells=>{const o=labProp(th.guard||'flieger',rng,th);S.add(o);const gm=LAB.gmat||(LAB.gmat=new T.MeshBasicMaterial({color:new T.Color('#ff3a4a'),transparent:true,opacity:.5,depthWrite:false,fog:false}));
    for(const c of cells)if(g[c]===1){const m=new T.Mesh(G.pl,gm);m.scale.set(.34,1,.34);m.rotation.y=Math.PI/4;m.position.set(wx(c),.108,wz(c));S.add(m)}
    const sh=new T.Mesh(G.cyl,LAB.gsm||(LAB.gsm=new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.38,depthWrite:false,fog:false})));sh.scale.set(.62,.01,.62);S.add(sh);LAB.gs.push(sh);
    const h=labHalo(th.guard==='geist'?'#bfe8ff':'#ff5a4a',1.5,dark?.45:.15);h.position.y=.8;o.add(h);return o});
  LAB.shs=LB.shields.map(s=>{const g=new T.Group();const m=new T.Mesh(G.cone,labMat('#3aa8ff',{emissive:'#2a8aff',emissiveIntensity:1}));m.scale.set(.5,.5,.16);m.rotation.x=Math.PI;m.position.y=-.06;g.add(m);const b=new T.Mesh(G.box,labMat('#3aa8ff',{emissive:'#2a8aff',emissiveIntensity:1}));b.scale.set(.5,.2,.16);b.position.y=.28;g.add(b);const k=new T.Mesh(G.box,labMat('#ffffff',{emissive:'#ffffff',emissiveIntensity:.8}));k.scale.set(.1,.42,.18);k.position.y=.12;g.add(k);const k2=new T.Mesh(G.box,labMat('#ffffff',{emissive:'#ffffff',emissiveIntensity:.8}));k2.scale.set(.34,.1,.18);k2.position.y=.2;g.add(k2);g.position.set(wx(s.c),.55,wz(s.c));S.add(g);const h=labHalo('#6ad8ff',1.5,dark?.6:.35);g.add(h);return g});
  LAB.stars=LB.stars.map(s=>{const m=new T.Mesh(G.oct,labMat('#ffe36b',{emissive:'#ffc21a',emissiveIntensity:1}));m.scale.set(.3,.42,.3);m.position.set(wx(s.c),.5,wz(s.c));m.castShadow=true;S.add(m);const h=labHalo('#ffe36b',1.2,dark?.55:.3);m.add(h);h.scale.setScalar(3.4);return m});
  /* Glühwürmchen und Funken */
  LAB.flies=[];if(th.fx)for(let k=0,n=Math.min(40,Math.round(W*H/9));k<n;k++){const h=labHalo(th.fx===2?'#ff7a3a':k%3?'#b6ff8a':'#8afff0',.3+rng()*.25,.8);h.position.set(X(rng()*W),.4+rng()*1.6,Z(rng()*H));S.add(h);LAB.flies.push({o:h,x:h.position.x,y:h.position.y,z:h.position.z,ph:rng()*6.3,sp:.3+rng()*.6,up:th.fx===2})}
  /* Partikel */
  {const m=new T.MeshBasicMaterial({color:0xffffff,fog:false});LAB.disp.push(m);LAB.pm=new T.InstancedMesh(G.box,m,120);LAB.pm.count=0;LAB.pm.frustumCulled=false;LAB.pm.setColorAt(0,new T.Color(1,1,1));S.add(LAB.pm)}
  /* Pia: Kugel mit Krone */
  const tc=document.createElement('canvas');tc.width=128;tc.height=64;const tx=tc.getContext('2d');{const gr=tx.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#ffffff');gr.addColorStop(.18,th.ball);gr.addColorStop(.82,th.ball);gr.addColorStop(1,'#00000066');tx.fillStyle=th.ball;tx.fillRect(0,0,128,64);tx.globalAlpha=.55;tx.fillStyle=gr;tx.fillRect(0,0,128,64);tx.globalAlpha=1}tx.fillStyle='rgba(255,255,255,.95)';tx.fillRect(0,26,128,12);tx.fillStyle='#ffd84d';tx.fillRect(0,24,128,2.5);tx.fillRect(0,37.5,128,2.5);tx.fillStyle='rgba(255,255,255,.75)';for(let k=0;k<8;k++){tx.beginPath();tx.arc(8+k*16,k%2?11:53,4.5,0,7);tx.fill()}
  const tex=new T.CanvasTexture(tc);tex.encoding=T.sRGBEncoding;const bm=new T.MeshStandardMaterial({map:tex,roughness:.28,metalness:.05,emissive:lc(th.ball),emissiveMap:tex,emissiveIntensity:dark?1.1:dusk?.6:.2});LAB.disp.push(tex,bm);
  LAB.ball=new T.Mesh(G.ball,bm);LAB.ball.castShadow=true;LAB.bg=new T.Group();LAB.bg.add(LAB.ball);S.add(LAB.bg);LAB.bub=new T.Mesh(G.ball,labMat('#8ae0ff',{emissive:'#4ac8ff',emissiveIntensity:.9,transparent:true,opacity:.3,depthWrite:false}));LAB.bub.visible=false;S.add(LAB.bub);LAB.sq=[1,1,1];LAB.ftex=LAB.ftex||Object.fromEntries(LFACES.map(n=>[n,labFaceTex(n)]));{const fm=new T.SpriteMaterial({map:LAB.ftex.laecheln,transparent:true,depthWrite:false,depthTest:false,fog:false});LAB.disp.push(fm);LAB.face=new T.Sprite(fm);LAB.face.renderOrder=5;S.add(LAB.face);LAB.fname='laecheln'}LAB.bl=new T.PointLight(lc('#ffe9c8'),dark?2.8:dusk?1.3:0,6.5,2);S.add(LAB.bl);LAB.bh=labHalo(th.ball,2.8,dark?.7:dusk?.45:.22);S.add(LAB.bh);
  {const c=new T.Group(),gm=labMat('#ffd84d',{emissive:'#ffb000',emissiveIntensity:dark?1:.35}),r=new T.Mesh(G.cyl,gm);r.scale.set(.42,.12,.42);c.add(r);for(let k=0;k<5;k++){const p=new T.Mesh(G.cone,gm);p.scale.set(.13,.2,.13);p.position.set(Math.cos(k*1.257)*.16,.14,Math.sin(k*1.257)*.16);c.add(p)}const j=new T.Mesh(G.oct,labMat('#ff4f8b',{emissive:'#ff4f8b',emissiveIntensity:.8}));j.scale.setScalar(.09);j.position.set(0,.02,.2);c.add(j);
    const rim=new T.Mesh(G.tor,gm);rim.scale.set(.44,.5,.44);rim.position.y=-.05;c.add(rim);for(let k=0;k<5;k++){const p=new T.Mesh(G.sph,labMat('#fffbe8',{emissive:'#fff0b0',emissiveIntensity:.6}));p.scale.setScalar(.07);p.position.set(Math.cos(k*1.257)*.16,.26,Math.sin(k*1.257)*.16);c.add(p)}c.traverse(o=>{if(o.isMesh)o.castShadow=true});S.add(c);LAB.crown=c}
  LAB.bo=null;if(L.boss)lab3BossBuild(S,th,rng,wx,wz);
  LAB.trail=[];LAB.tsp=[];for(let k=0;k<18;k++){const h=labHalo(k%2?th.ball:'#ffffff',1,0);h.visible=false;S.add(h);LAB.tsp.push(h)}
  LAB.view.tx=X(LB.bx);LAB.view.tz=Z(LB.by);LAB.lt=0;lab3Fit()}
const LFACES=['laecheln','froh','ueber','schrei','benommen','grinsen'];
function labFaceTex(name){const T=THREE,cv=document.createElement('canvas');cv.width=cv.height=128;const c=cv.getContext('2d'),L='#1b1030';c.lineCap=c.lineJoin='round';
  const eye=(x,rx,ry,pr,py)=>{c.fillStyle='#fff';c.strokeStyle=L;c.lineWidth=5;c.beginPath();c.ellipse(x,52,rx,ry,0,0,7);c.fill();c.stroke();c.fillStyle=L;c.beginPath();c.arc(x+2,52+(py||2),pr,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x-2,48,pr*.33,0,7);c.fill()},
    line=(pts,w)=>{c.strokeStyle=L;c.lineWidth=w||6;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()},arc=(x,y,r,a0,a1)=>{c.strokeStyle=L;c.lineWidth=6;c.beginPath();c.arc(x,y,r,a0,a1);c.stroke()},
    blush=()=>{c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(24,76,11,6,0,0,7);c.fill();c.beginPath();c.ellipse(104,76,11,6,0,0,7);c.fill()};
  if(name==='laecheln'){eye(42,13,17,7);eye(86,13,17,7);blush();arc(64,80,15,.35,2.8)}
  else if(name==='froh'){arc(42,58,13,3.5,5.9);arc(86,58,13,3.5,5.9);blush();c.fillStyle='#5a1030';c.strokeStyle=L;c.lineWidth=5;c.beginPath();c.moveTo(46,80);c.quadraticCurveTo(64,108,82,80);c.closePath();c.fill();c.stroke()}
  else if(name==='ueber'){line([[30,42],[50,54],[30,64]]);line([[98,42],[78,54],[98,64]]);c.fillStyle='#5a1030';c.strokeStyle=L;c.lineWidth=5;c.beginPath();c.ellipse(64,90,9,11,0,0,7);c.fill();c.stroke()}
  else if(name==='schrei'){eye(42,15,19,3.500,0);eye(86,15,19,3.500,0);line([[26,26],[50,20]]);line([[102,26],[78,20]]);c.fillStyle='#5a1030';c.strokeStyle=L;c.lineWidth=5;c.beginPath();c.ellipse(64,96,16,19,0,0,7);c.fill();c.stroke();c.fillStyle='#ff7a9c';c.beginPath();c.ellipse(64,106,9,6,0,0,7);c.fill()}
  else if(name==='benommen'){for(const x of[42,86]){line([[x-11,41],[x+11,63]]);line([[x+11,41],[x-11,63]])}line([[44,92],[52,84],[60,92],[68,84],[76,92],[84,84]],5)}
  else{eye(42,13,16,7);eye(86,13,16,7);line([[24,24],[52,36]],7);line([[104,24],[76,36]],7);c.fillStyle='#fff';c.strokeStyle=L;c.lineWidth=5;c.beginPath();c.moveTo(42,80);c.quadraticCurveTo(64,112,86,80);c.closePath();c.fill();c.stroke();line([[50,89],[78,89]],3)}
  const t=new T.CanvasTexture(cv);t.encoding=T.sRGBEncoding;return t}
function lab3Tint(c){const k=LB.fi[c];if(k<0||!LAB.floor)return;LAB.floor.setColorAt(k,LAB.pc);LAB.floor.instanceColor.needsUpdate=true}
function lab3Paint(){if(!LAB.floor)return;const W=LB.L.W,dm=LAB.dm||(LAB.dm=new THREE.Object3D());for(let c=0;c<LB.N;c++){const k=LB.fi[c];if(k<0)continue;LAB.floor.setColorAt(k,LB.painted[c]?LAB.pc:LAB.fcol(c));
    if(LAB.glow){const s=LB.painted[c]?.9:0;dm.position.set(LAB.X(c%W),.108,LAB.Z((c/W)|0));dm.scale.set(s,1,s);dm.rotation.set(0,0,0);dm.updateMatrix();LAB.glow.setMatrixAt(k,dm.matrix)}}
  LAB.floor.instanceColor.needsUpdate=true;if(LAB.glow)LAB.glow.instanceMatrix.needsUpdate=true;LAB.pops=[];if(LAB.ball)LAB.ball.quaternion.identity()}
function lab3Fit(){if(!LAB.ready||LAB.fail||!LB)return;const cv=$('#lgl'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;const L=LB.L,cam=LAB.cam,V=LAB.view,a=V.a=29*Math.PI/180,tf=Math.tan(cam.fov*Math.PI/360),top=96,bot=112,uf=Math.max(.3,(h-top-bot)/h);
  LAB.r.setPixelRatio(Math.min(2,devicePixelRatio||1));LAB.r.setSize(w,h,false);cam.aspect=w/h;const port=w<h;V.eW=L.boss?L.W:Math.min(L.W,port?9:16);V.eH=L.boss?L.H:Math.min(L.H,port?13:9);
  const dw=(V.eW/2+.25)/(tf*cam.aspect)+V.eH/2*Math.sin(a),dh=(V.eH/2*Math.cos(a)+.75)/(tf*uf)+V.eH/2*Math.sin(a);V.d=Math.max(dw,dh);if(LAB.scene.fog){LAB.scene.fog.near=V.d*1.02;LAB.scene.fog.far=V.d*1.75}cam.setViewOffset(w,h,0,(bot-top)/2,w,h);cam.updateProjectionMatrix()}
function lab3Frame(now,dt){
  const T=THREE,L=LB.L,W=L.W,X=LAB.X,Z=LAB.Z,t=now/1000,V=LAB.view,cam=LAB.cam;if(!LAB.ball)return;
  if(LAB.water)LAB.water.uniforms.uT.value=t;LAB.holeMat.uniforms.uT.value=t;for(const m of LAB.portMats)m.uniforms.uT.value=t;if(LAB.arrMat)LAB.arrTex.offset.x=-(t*.9%1);
  for(const a of LAB.anim){const o=a.o;
    if(a.k==='fish'){const an=a.ph+t*a.sp;o.position.x=a.cx+Math.cos(an)*a.r;o.position.z=a.cz+Math.sin(an)*a.r;o.rotation.y=-an-Math.sign(a.sp)*Math.PI/2}
    else if(a.k==='halo'){const s=a.s*(1+.08*Math.sin(t*7+a.ph)+.05*Math.sin(t*17+a.ph*2));o.scale.set(s,s,s)}
    else if(a.k==='turn')o.rotation.y=t*1.2+a.ph;
    else if(a.k==='peck'){const u=(t*.6+a.ph)%4;o.rotation.x=u<.5?Math.sin(u*Math.PI*4)*.3:0;o.position.y=Math.abs(Math.sin(t*2.2+a.ph))*.03}
    else if(a.k==='hop'){const u=(t*.5+a.ph)%3;o.position.y=u<.4?Math.sin(u/.4*Math.PI)*.3:0}
    else if(a.k==='float')o.position.y=.7+Math.sin(t*1.6+a.ph)*.12;
    else if(a.k==='flap')o.rotation.z=a.ph*Math.sin(t*14)*.7;
    else if(a.k==='wag')o.rotation.z=Math.sin(t*2.4+a.ph)*.5;
    else if(a.k==='sway')o.rotation.z=Math.sin(t*1.3+a.ph)*.07;
    else if(a.k==='flag')o.rotation.y=Math.sin(t*3+a.ph)*.35;
    else if(a.k==='guard')o.rotation.y=a.r0+Math.sin(t*.7+a.ph)*.6;
    else if(a.k==='blink'){const v=(t*.5+a.ph)%5>.25;o.visible=a.o2.visible=v}
    else if(a.k==='flame'){const s=(a.s||.22)*(1+.18*Math.sin(t*13+a.ph));o.scale.set(s,(a.h||.36)*(1+.22*Math.sin(t*17+a.ph)),s)}}
  for(const f of LAB.flies){if(f.up){const u=(t*f.sp*.4+f.ph)%1;f.o.position.set(f.x+Math.sin(t+f.ph)*.3,.2+u*3,f.z);f.o.material.opacity=.9*(1-u)}else{f.o.position.set(f.x+Math.sin(t*f.sp+f.ph)*.7,f.y+Math.sin(t*f.sp*1.7+f.ph)*.3,f.z+Math.cos(t*f.sp*.8+f.ph)*.7);f.o.material.opacity=.45+.45*Math.sin(t*2+f.ph)}}
  /* Feld-Hüpfer beim Einfärben und Welle beim Sieg */
  if(LAB.pops.length||LB.won){const dm=LAB.dm||(LAB.dm=new T.Object3D());let ch=false;const set=(c,k,gl)=>{const i=LB.fi[c];if(i<0)return;dm.rotation.set(0,0,0);dm.position.set(X(c%W),.05+k*.1,Z((c/W)|0));dm.scale.set(.94+Math.max(0,k)*.04,.1+Math.max(0,k)*.2,.94+Math.max(0,k)*.04);dm.updateMatrix();LAB.floor.setMatrixAt(i,dm.matrix);
      if(LAB.glow){dm.position.y=.108+k*.1+Math.max(0,k)*.1;dm.scale.set(.9,1,.9);dm.updateMatrix();LAB.glow.setMatrixAt(i,dm.matrix)}ch=true};
    LAB.pops=LAB.pops.filter(p=>{const u=(now-p.t)/560;if(u>=1){set(p.c,0);return false}set(p.c,u<.28?-Math.sin(u/.28*Math.PI)*.75:u<.72?Math.sin((u-.28)/.44*Math.PI)*1.25:-Math.sin((u-.72)/.28*Math.PI)*.22);return true});
    if(LB.won){const d2=now-LB.wonAt;if(d2<3200)for(let c=0;c<LB.N;c++)if(LB.fi[c]>=0){const u=(d2-(c%W+((c/W)|0))*45)/420;set(c,u>0&&u<1?Math.sin(u*Math.PI)*1.5:0)}}
    if(ch){LAB.floor.instanceMatrix.needsUpdate=true;if(LAB.glow)LAB.glow.instanceMatrix.needsUpdate=true}}
  /* Partikel */
  {const dm=LAB.dm||(LAB.dm=new T.Object3D());let n=0;LAB.parts=LAB.parts.filter(p=>{p.t+=dt;if(p.t>p.l||n>=120)return false;p.vy-=9*dt;p.x+=p.vx*dt;p.y=Math.max(.12,p.y+p.vy*dt);p.z+=p.vz*dt;const s=p.s*(1-p.t/p.l);dm.position.set(p.x,p.y,p.z);dm.scale.set(s,s,s);dm.rotation.set(p.t*7,p.t*5,0);dm.updateMatrix();LAB.pm.setMatrixAt(n,dm.matrix);LAB.pm.setColorAt(n,p.c);n++;return true});
    LAB.pm.count=n;if(n){LAB.pm.instanceMatrix.needsUpdate=true;LAB.pm.instanceColor.needsUpdate=true}}
  /* Kugel */
  const b=LAB.ball,rad=.37,sc=LB.tp*(1-LB.fall*(LB.burn?0:.8));let x=X(LB.bx),z=Z(LB.by),y=.1+rad*sc-(LB.burn?-LB.fall*2.5:LB.fall*.75);
  if(LB.nudge){const u=(now-LB.nudge.t)/160;if(u<1){const k=Math.sin(u*Math.PI)*.1;x+=LDIR[LB.nudge.d][0]*k;z+=LDIR[LB.nudge.d][1]*k}else LB.nudge=null}
  if(LB.won){const u=(now-LB.wonAt)/1000;y+=Math.abs(Math.sin(u*5))*Math.max(0,.7-u*.25)}
  if(LB.spin&&LAB.lx!==undefined){const dx=x-LAB.lx,dz=z-LAB.lz,q=LAB.q||(LAB.q=new T.Quaternion()),ax=LAB.ax||(LAB.ax=new T.Vector3());if(Math.abs(dx)+Math.abs(dz)<1.5){ax.set(dz,0,-dx);const l=ax.length();if(l>1e-5){ax.multiplyScalar(1/l);q.setFromAxisAngle(ax,l/rad*1.25);b.quaternion.premultiply(q)}}}
  /* Dehnen in Rollrichtung, Stauchen beim Aufprall */
  let ex=1,ey=1,ez=1,ox=0,oz=0;{const vx=(x-(LAB.lx===undefined?x:LAB.lx))/Math.max(.001,dt),vz=(z-(LAB.lz===undefined?z:LAB.lz))/Math.max(.001,dt),v=Math.hypot(vx,vz);if(LB.roll&&LB.tp===1&&v<40){const e=Math.min(.34,v*.024);if(Math.abs(vx)>Math.abs(vz)){ex+=e;ey-=e*.42;ez-=e*.42}else{ez+=e;ey-=e*.42;ex-=e*.42}}}
  if(LB.bump){const u=(now-LB.bump.t)/420;if(u<1){const env=Math.exp(-4.5*u)*Math.cos(u*9.5),k=.4*env,off=.13*env;ox=LB.bump.dx*off;oz=LB.bump.dy*off;if(LB.bump.dx){ex*=1-k;ey*=1+k*.5;ez*=1+k*.5}else{ez*=1-k;ey*=1+k*.5;ex*=1+k*.5}}else LB.bump=null}
  {const q=LAB.sq,kk=LB.bump?1:.4;q[0]+=(ex-q[0])*kk;q[1]+=(ey-q[1])*kk;q[2]+=(ez-q[2])*kk;ex=q[0];ey=q[1];ez=q[2]}
  LAB.lx=x;LAB.lz=z;LAB.bg.position.set(x+ox,y-rad*sc*(1-ey),z+oz);LAB.bg.scale.set(ex,ey,ez);b.scale.setScalar(rad*2*Math.max(.02,sc));if(LB.dead&&!LB.burn)b.rotation.y+=dt*14;LAB.bl.position.set(x,.95,z);LAB.bh.position.set(x,y,z);LAB.bh.scale.setScalar(2.6*sc*(1+.06*Math.sin(t*5)));
  if(LB.roll&&LB.tp>.9&&(!LAB.trail.length||now-LAB.trail[LAB.trail.length-1].t>22))LAB.trail.push({x,y,z,t:now});while(LAB.trail.length&&(now-LAB.trail[0].t>420||LAB.trail.length>18))LAB.trail.shift();
  LAB.tsp.forEach((h,i)=>{const p=LAB.trail[LAB.trail.length-1-i];if(!p){h.visible=false;return}const u=1-(now-p.t)/420;h.visible=true;h.position.set(p.x,p.y,p.z);h.scale.setScalar(.35+1.25*u);h.material.opacity=.6*u*u});
  {const fn=LB.dead?(LB.burn?'benommen':'schrei'):now<LB.safe?'benommen':LB.won?'froh':LB.bump?'ueber':LB.roll?'grinsen':(t+.3)%3.6<.13?'froh':'laecheln';if(fn!==LAB.fname){LAB.fname=fn;LAB.face.material.map=LAB.ftex[fn];LAB.face.material.needsUpdate=true}
    LAB.face.position.set(x+ox,y-rad*sc*(1-ey)+rad*sc*.12*ey,z+oz+rad*sc*.5);LAB.face.scale.set(.62*sc*ex,.62*sc*(ey+ez)/2,1);LAB.face.visible=b.visible&&LB.fall<.95}
  LAB.crown.position.set(x+ox,y+rad*sc*(.8*ey-(1-ey)),z+oz-rad*sc*.3);LAB.crown.scale.setScalar(sc*.78);LAB.crown.rotation.set(Math.sin(t*2.1)*.08,t*.8,Math.cos(t*1.7)*.08);LAB.crown.visible=LB.fall<.3;b.visible=LAB.crown.visible||LB.fall<1;if(now<LB.safe){const bl=Math.sin(now/60)>0;b.visible=bl;LAB.crown.visible=bl}
  LAB.lk.forEach((o,k)=>{const open=LB.mask>>k&1;if(o.bomb){o.door.visible=!open;const B=o.bomb,fz=LB.fz[k];B.g.visible=!open&&!(LB.burn&&LB.dead);if(fz){const u=1-Math.max(0,(fz-now)/3200),p=.5+.5*Math.sin(now/1000*(8+u*30));B.body.scale.setScalar(.5+u*.16+p*.05);B.body.material.emissiveIntensity=p*(.6+u);B.sp.scale.setScalar(.7+p*.9)}else{B.body.scale.setScalar(.5);B.body.material.emissiveIntensity=0;B.sp.scale.setScalar(.5+.2*Math.sin(t*9))}}
    else{o.door.position.y=-LB.doorK[k];o.door.visible=LB.doorK[k]<1;o.key.visible=!((LB.got|LB.mask)>>k&1);o.key.rotation.y=t*1.6+k;o.key.position.y=.6+Math.sin(t*2.2+k)*.06}});
  LAB.gd.forEach((o,i)=>{const q=LB.gp[i];if(!q)return;o.position.set(X(q.x),LAB.gy+Math.sin(t*3+i)*.07,Z(q.y));o.children[0].rotation.y=Math.atan2(q.dx,q.dy);LAB.gs[i].position.set(X(q.x),.118,Z(q.y))});
  const el=LB.t0?(now-LB.t0)/1000:0,k=Math.max(0,1-el/LB.starT);if(LAB.shs)LAB.shs.forEach((g,i)=>{const s=LB.shields[i];g.visible=!!s&&!s.got;g.rotation.y=t*1.6;g.position.y=.55+Math.sin(t*2.2+i)*.06});if(LAB.bub){LAB.bub.visible=!!LB.shield&&!LB.dead;if(LAB.bub.visible){LAB.bub.position.copy(LAB.bg.position);LAB.bub.position.y+=LAB.ball.position.y;LAB.bub.scale.setScalar((LAB.ball.scale.x||1)*(1.38+.05*Math.sin(t*5)))}}LAB.stars.forEach((m,i)=>{const s=LB.stars[i];m.visible=!s.got&&!s.gone;m.rotation.y=t*2+i;m.position.y=.5+Math.sin(t*2.6+i)*.06;const f=.55+.45*k,bl=k<.25?(.75+.25*Math.sin(t*14)):1;m.scale.set(.3*f*bl,.42*f*bl,.3*f*bl)});
  /* Kamera folgt der Kugel, Sonne und Lampenlichter wandern mit */
  const mx=Math.max(0,(L.W-V.eW)/2),mz=Math.max(0,(L.H-V.eH)/2),gx=Math.max(-mx,Math.min(mx,X(LB.bx))),gz=Math.max(-mz,Math.min(mz,Z(LB.by))),kk=1-Math.exp(-dt*4);V.tx+=(gx-V.tx)*kk;V.tz+=(gz-V.tz)*kk;
  let sx=0,sy=0;if(LB.shake){const u=(now-LB.shake)/450;if(u<1){sx=Math.sin(now*.09)*.16*(1-u);sy=Math.cos(now*.11)*.12*(1-u)}else LB.shake=0}
  cam.position.set(V.tx+sx,V.d*Math.cos(V.a)+sy,V.tz+V.d*Math.sin(V.a)+.25);cam.lookAt(V.tx+sx,0,V.tz+.25);
  LAB.sun.position.set(V.tx-L.W*.3-2,11,V.tz-4);LAB.sun.target.position.set(V.tx,0,V.tz);LAB.sun.target.updateMatrixWorld();
  if(LAB.pool.length){if(now-LAB.lt>180){LAB.lt=now;for(const q of LAB.lamps)q.d=Math.hypot(q.x-V.tx,q.z-V.tz-1);LAB.near=LAB.lamps.slice().sort((p,q)=>p.d-q.d).slice(0,4)}
    LAB.pool.forEach((l,i)=>{const q=LAB.near&&LAB.near[i];if(!q){l.intensity=0;return}l.position.set(q.x,q.y,q.z);l.color.copy(q.col);l.intensity=(3.2+.4*Math.sin(t*9+q.ph)+.2*Math.sin(t*23+q.ph*2))*Math.max(0,Math.min(1,(12-q.d)/3))})}
  if(LAB.bo)lab3BossFrame(now,t,dt);
  LAB.r.render(LAB.scene,cam)}
function labResize(){const use=LAB.ready&&!LAB.fail;$('#lgl').hidden=!use;$('#l2d').hidden=!LAB.fail;if(use)lab3Fit();else if(LAB.fail){const cv=$('#l2d'),d=Math.min(2,devicePixelRatio||1);cv.width=cv.clientWidth*d;cv.height=cv.clientHeight*d}}
let labRun=0;
function labLoop(){const run=++labRun;let last=performance.now(),hud=0;
  (function f(now){if(run!==labRun||!LB||!$('#lab').classList.contains('on'))return;const dt=Math.min(.05,(now-last)/1000);last=now;labStep(now,dt);if(!LB)return;if(now-hud>250){hud=now;LB.mini=LB.mini||!!LB.roll;labHud()}
    if(LAB.ready&&!LAB.fail&&LAB.ball){try{lab3Frame(now,dt)}catch(e){console.error('lab3',e&&e.stack||e);LAB.fail=true;labResize()}}
    else if(LAB.fail){const cv=$('#l2d'),c=cv.getContext('2d'),d=Math.min(2,devicePixelRatio||1),w=cv.width/d,h=cv.height/d,L=LB.L,s=Math.min((w-24)/L.W,(h-220)/L.H);c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);labDraw2D(c,L,LB.th,LB,(w-L.W*s)/2,(h-L.H*s)/2,s,now)}
    requestAnimationFrame(f)})(last)}

/* ---------- Spielauswahl im Hauptmenü ---------- */
function labHomeInfo(){const d=labData(),n=Object.values(d.st).reduce((a,b)=>a+b,0),w=Math.min(LW_C-1,Math.floor((d.max-1)/LW_N));$('#blGo').innerHTML=`<span><b>Level ${d.max}</b><small>${d.max>LW_N*LW_C?'Endlose Reise':'Welt '+(w+1)+' · '+LTH[w].name}</small></span><i class="tag info"${n?'':' hidden'}>★ ${n}</i>`}
function setGame(g,user){GAME=g?1:0;if(user)store.set('game',GAME);$('.hm').classList.toggle('g1',GAME===1);$('.tagline').textContent=GAME?'Ein Kugel-Abenteuer':'Shikaku trifft Pixel-Art';
  $('#gDots').innerHTML=[0,1].map(i=>`<i${i===GAME?' class="on"':''}></i>`).join('');$('#gLbl').textContent=GAME?'Pias Quest':'Pixaku';labHomeInfo();if(user){const h=$('#hero');h.classList.remove('sw');void h.offsetWidth;h.classList.add('sw');sfx.tick();layoutHome();drawLogo(false);heroStart()}}
async function labHero(){const run=++heroRun,cv=$('#hero'),c=cv.getContext('2d'),px=HOME.col,ph=HOME.hh,d=Math.min(3,devicePixelRatio||1);cv.width=px*d;cv.height=ph*d;let k=(Math.random()*LW_C)|0;
  const wait=ms=>new Promise(r=>setTimeout(r,ms)),alive=()=>run===heroRun&&$('#home').classList.contains('on');
  while(alive()){const wi=k++%LW_C,sp=labSpec(wi*LW_N+1+(wi<3?6:0));sp.W=Math.min(sp.W,11);sp.H=Math.min(sp.H,12);sp.guards=0;const L=labGenSpec(sp,'hero'+((Math.random()*1e6)|0)),th=LTH[wi],W=L.W,s=Math.min((px-20)/W,(ph-20)/L.H),ox=(px-W*s)/2,oy=(ph-L.H*s)/2,
      st={painted:new Uint8Array(W*L.H),bx:L.start%W,by:(L.start/W)|0,mask:0,got:0,stars:L.stars.map(q=>({c:q})),tp:1};st.painted[L.start]=1;let pos=L.start;
    const draw=()=>{c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,px,ph);const gr=c.createLinearGradient(0,0,0,ph);gr.addColorStop(0,th.bg[0]);gr.addColorStop(1,th.bg[1]);c.fillStyle=gr;c.globalAlpha=.55;c.fillRect(0,0,px,ph);c.globalAlpha=1;labDraw2D(c,L,th,st,ox,oy,s,performance.now())};draw();
    if(reduce)return;await wait(500);
    for(const mv of L.sol.slice(0,50)){if(!alive())return;const sl=labSlide(L,pos,mv,st.mask,true),pts=[pos].concat(sl.cells);
      for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],far=Math.abs(a%W-b%W)+Math.abs(((a/W)|0)-((b/W)|0))!==1,t0=performance.now(),dur=far?140:62;
        await new Promise(res=>{(function f(now){if(!alive())return res();const u=Math.min(1,(now-t0)/dur);if(far){const p=u<.5?a:b;st.bx=p%W;st.by=(p/W)|0;st.tp=Math.abs(1-u*2)}else{st.bx=a%W+(b%W-a%W)*u;st.by=((a/W)|0)+(((b/W)|0)-((a/W)|0))*u}draw();u<1?requestAnimationFrame(f):res()})(t0)});
        st.tp=1;if(L.grid[b]===1)st.painted[b]=1;{const ky=L.keyAt[b];if(ky>=0)st.got|=1<<ky}for(const q of st.stars)if(q.c===b)q.got=true}
      pos=sl.end;st.mask|=st.got;await wait(150)}
    await wait(1500)}}
{const z=$('.z2');let p=null;
  z.addEventListener('pointerdown',e=>{p={x:e.clientX,y:e.clientY}});
  z.addEventListener('pointerup',e=>{if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p=null;if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy)*1.3)setGame(1-GAME,true)});
  $('#gPrev').innerHTML=LIC.l;$('#gNext').innerHTML=LIC.r;$('#gPrev').onclick=$('#gNext').onclick=e=>{e.stopPropagation();setGame(1-GAME,true)};
  $('#blGo').onclick=()=>labPlay(labData().max);$('#blLv').onclick=()=>show('lcamp');$('#blRnd').onclick=labRandom;$('#blHelp').onclick=labHelp;
  setGame(GAME)}

/* ---------- Übungslevel ---------- */
const LCINE={1:'intro',6:'schlund',16:'felder',21:'kraehen',31:'hof',46:'stadt',61:'hafen',76:'balduin',91:'gero',106:'eis',121:'berge',136:'mine',151:'sumpf',166:'schlacht',181:'turm'},LCNAME={intro:'Die Verwandlung',schlund:'Der Fluch frisst sich durch',felder:'Raus ins Helle',kraehen:'Die Krähe',hof:'Bauer Henrik',stadt:'Auf dem Markt',hafen:'Das Tor am Kai',balduin:'Hofzauberer Balduin',gero:'Hauptmann Gero',eis:'Verbannt ins Eis',berge:'Über die Berge',mine:'Durch den Berg',sumpf:'Wandernde Schlünde',schlacht:'Morvans Heer',turm:'Der Turm',finale:'Der Fluch bricht'};
const LTUT=['Wische in eine Richtung. Pia rollt geradeaus, bis eine Wand sie aufhält. Bring jedes Feld zum Leuchten.','Auch Büsche, Steine und Pilze halten Pia auf. Nutze sie als Bande, um jedes Feld zu erreichen. Der Tipp-Knopf zeigt dir den nächsten Zug.','Vorsicht vor dem wirbelnden Schlund: Wer hineinrollt, beginnt von vorn. Den Bonusstern gibt es nur, solange seine Zeit läuft.'];
function labTut(i){
  if(i>=LTUT.length){store.set('ltut',1);LB=null;show('home');const s=openSheet(`<div class="sh-head"><h2>Du hast den Dreh raus</h2></div><p>Mehr brauchst du für den Anfang nicht. Portale, Schlüssel, Bomben und Eisrinnen lernst du unterwegs kennen, immer dann, wenn die Geschichte sie bringt.</p><div class="btns"><button class="primary" id="ltGo">Auf zur Reise</button></div>`,true);s.querySelector('#ltGo').onclick=()=>{closeSheet();labPlay(labData().max)};return}
  let L;if(i===0){L=labAscii(['#######','#S....#','#.###.#','#.....#','#######']);L.sol=labGreedy(L);L.par=L.sol.length}
  else L=labGenSpec(i===1?{W:7,H:8,holes:0,ports:0,locks:[],arr:0,stars:0,water:0,guards:0,style:'cave'}:{W:8,H:9,holes:1,ports:0,locks:[],arr:0,stars:1,water:.05,guards:0,style:'cave'},i===1?'tut21':'tut31');
  labStart(0,undefined,{L,wi:0,name:`Übung ${i+1} von ${LTUT.length}`,tut:i})}


/* ---------- Schriftzug „Pias Quest“: eigene Pixelbuchstaben mit Kontur, Schatten und Farbverlauf ---------- */
const QL={P:['111110','111111','110011','110011','111111','111110','110000','110000','110000'],I:['20202','22222','00000','01110','01110','01110','01110','01110','01110'],
  A:['011110','111111','110011','110011','111111','111111','110011','110011','110011'],S:['011111','111111','110000','111110','011111','000011','000011','111111','111110'],
  Q:['011110','111111','110011','110011','110011','110011','110111','111111','011101'],U:['110011','110011','110011','110011','110011','110011','110011','111111','011110'],
  E:['111111','111111','110000','111110','111110','110000','110000','111111','111111'],T:['111111','111111','001100','001100','001100','001100','001100','001100','001100']};
function questLogo(anim,run){const word=[['P',0,0],['I',0,1],['A',0,0],['S',0,1],null,['Q',1,1],['U',1,0],['E',1,1],['S',1,0],['T',1,1]],GW=79,GH=14,cv=$('#logo'),W=HOME.col,u=W/GW,d=Math.min(3,devicePixelRatio||1);
  cv.style.width=W+'px';cv.style.height=GH*u+'px';cv.width=Math.round(W*d);cv.height=Math.round(GH*u*d);const c=cv.getContext('2d'),t0=performance.now();
  const G=[['#fff0f8','#ffd0ea','#ffa6d6','#ff7ac0','#ff5cb0','#f0409c','#dc308c','#c4247c','#a81c6c'],['#fffbd8','#fff09a','#ffe066','#ffcf3a','#ffb828','#ffa01e','#ff861a','#f06a1a','#d8521a']],px=[];let x0=2;
  for(const w of word){if(!w){x0+=3;continue}const g=QL[w[0]];g.forEach((row,y)=>[...row].forEach((b,x)=>{if(b!=='0')px.push({x:x0+x,y:2+w[2]+y,col:b==='2'?(y?'#ffc21a':'#ffe36b'):G[w[1]][y],li:x0,hi:b==='1'&&y===(w[0]==='I'?3:0)})}));x0+=g[0].length+1}
  /* Pia rollt hinter dem T her */
  const bx=x0+1,ball=['0011100','0111110','1111111','1111111','1111111','0111110','0011100'],bc=['#ffc0e6','#ff9ad6','#ff6ec7','#ff4fb0','#f03c9c','#d82c88','#b82074'];
  ball.forEach((row,y)=>[...row].forEach((b,x)=>{if(b==='1')px.push({x:bx+x,y:5+y,col:((y===2||y===3)&&(x===2||x===4))?'#2a0f3a':(y===4&&x===3)?'#7a1048':(y===1&&x===1)?'#ffffff':bc[y],li:bx})}));
  ['10101','11111'].forEach((row,y)=>[...row].forEach((b,x)=>{if(b==='1')px.push({x:bx+1+x,y:3+y,col:y?'#ffc21a':'#ffe36b',li:bx})}));
  const sp=[[1,1],[29,1],[58,0],[GW-2,2],[36,12]];
  (function f(now){if(run!==logoRun)return;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,W,GH*u);c.imageSmoothingEnabled=false;let more=false;const el=now-t0,vis=[];
    for(const p of px){const age=anim&&!reduce?(el-p.li*16)/260:1;if(age<=0){more=true;continue}const k=Math.min(1,age);if(k<1)more=true;vis.push([p,(1-k)*(1-k)*-5])}
    const R=(x,y,w,h)=>c.fillRect(Math.round(x*u),Math.round(y*u),Math.round((x+w)*u)-Math.round(x*u),Math.round((y+h)*u)-Math.round(y*u));
    c.fillStyle='rgba(8,4,20,.55)';for(const[p,o]of vis)R(p.x-1,p.y+o+1,3,3);
    c.fillStyle='#2a0f3a';for(const[p,o]of vis)R(p.x-1,p.y+o-1,3,3);
    for(const[p,o]of vis){c.fillStyle=p.col;R(p.x,p.y+o,1,1)}
    c.fillStyle='rgba(255,255,255,.75)';for(const[p,o]of vis)if(p.hi)R(p.x,p.y+o,1,.34);
    if(!more||!anim){const tw=reduce?1:.5+.5*Math.sin(now/260);c.fillStyle='#fff';sp.forEach(([x,y],i)=>{const a=reduce?1:.35+.65*Math.abs(Math.sin(now/420+i*1.7));c.globalAlpha=a;R(x,y-1,1,3);R(x-1,y,3,1)});c.globalAlpha=1}
    if(more||(!reduce&&$('#home').classList.contains('on')&&GAME===1))requestAnimationFrame(f)})(t0)}
