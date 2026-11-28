/* ---------- Eingabe ---------- */
const pos=e=>{const r=bcv.getBoundingClientRect();return{x:(e.clientX-r.left)*cw/(r.width||cw),y:(e.clientY-r.top)*ch/(r.height||ch)}};
const dragRect=()=>({x:Math.min(drag.ax,drag.bx),y:Math.min(drag.ay,drag.by),w:Math.abs(drag.ax-drag.bx)+1,h:Math.abs(drag.ay-drag.by)+1});
function moveDrag(p){const c=cellAt(p.x,p.y);drag.bx=Math.max(0,Math.min(G.W-1,c.x));drag.by=Math.max(0,Math.min(G.H-1,c.y));
  const d=dragRect(),e=evalRect(d.x,d.y,d.w,d.h),b=$('#bubble');const bl=blockedAt(d.x,d.y,d.w,d.h);b.textContent=bl?'belegt':`${d.w} × ${d.h} = ${d.w*d.h}`;b.classList.toggle('ok',e.valid&&!bl);b.classList.toggle('no',bl);b.classList.toggle('on',d.w*d.h>1);
  let by=V.oy+d.y*V.s-42;if(by<INS.top+4)by=V.oy+(d.y+d.h)*V.s+10;b.style.left=Math.max(60,Math.min(cw-60,V.ox+(d.x+d.w/2)*V.s))+'px';b.style.top=by+'px'}
bcv.addEventListener('pointerdown',e=>{if(!G||G.won||(A&&A.hold))return;try{bcv.setPointerCapture(e.pointerId)}catch(_){}
  const p=pos(e);ptrs.set(e.pointerId,p);lastPtr=p;tween=null;
  lastDown={x:p.x,t:Date.now()};
  if(ptrs.size===2){drag=null;pan=null;tap=null;$('#bubble').classList.remove('on');if(G.fixed){requestDraw();return}const[a,b]=[...ptrs.values()],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,s:V.s,wx:(mx-V.ox)/V.s,wy:(my-V.oy)/V.s};requestDraw();return}
  if(ptrs.size>2)return;
  const c=cellAt(p.x,p.y),inside=c.x>=0&&c.y>=0&&c.x<G.W&&c.y<G.H;
  const hit=inside?G.rects.get(G.cellR[c.y*G.W+c.x]):null;tap=null;
  if(G.fixed&&!inside){}else if(!G.fixed&&(tool==='pan'||e.button===1||e.button===2||spaceDown||!inside))pan=p;else if(hit&&(hit.valid||hit.lock)){if(!G.fixed)pan=p;tap={x:c.x,y:c.y,px:p.x,py:p.y}}else{drag={ax:c.x,ay:c.y,bx:c.x,by:c.y};moveDrag(p)}
  requestDraw()});
bcv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId)||!G)return;const p=pos(e);ptrs.set(e.pointerId,p);lastPtr=p;
  if(pinch&&ptrs.size>=2){const[a,b]=[...ptrs.values()],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,[lo,hi]=limits();V.s=Math.max(lo,Math.min(hi,pinch.s*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d));V.ox=mx-pinch.wx*V.s;V.oy=my-pinch.wy*V.s;clampView()}
  else if(pan){V.ox+=p.x-pan.x;V.oy+=p.y-pan.y;pan=p;clampView()}
  else if(drag)moveDrag(p);
  requestDraw()});
const up=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
  if(pinch){if(ptrs.size<2){pinch=null;pan=ptrs.size?[...ptrs.values()][0]:null}return}
  if(drag){const d=dragRect();drag=null;$('#bubble').classList.remove('on');if(e.type==='pointerup'&&G&&!G.won)commit(d.x,d.y,d.w,d.h);else if(e.type==='pointercancel')edgeDrag={d,t:Date.now()}}
  if(tap&&e.type==='pointerup'&&lastPtr&&Math.hypot(lastPtr.x-tap.px,lastPtr.y-tap.py)<9&&G&&!G.won)commit(tap.x,tap.y,1,1);tap=null;
  pan=null;requestDraw()};
bcv.addEventListener('pointerup',up);bcv.addEventListener('pointercancel',up);
bcv.addEventListener('contextmenu',e=>e.preventDefault());
bcv.addEventListener('wheel',e=>{if(!G)return;e.preventDefault();const p=pos(e);zoomAt(p.x,p.y,Math.exp(-e.deltaY*(e.ctrlKey?.012:.0016)))},{passive:false});
addEventListener('keydown',e=>{if(!$('#game').classList.contains('on')||sheetOpen||!G)return;
  if(e.code==='Space'){spaceDown=true;e.preventDefault()}else if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo()}
  else if(e.key==='h')hint();else if(e.key==='0')tweenTo(fitTarget());else if(e.key==='+'||e.key==='=')zoomAt(cw/2,ch/2,1.25);else if(e.key==='-')zoomAt(cw/2,ch/2,.8)});
addEventListener('keyup',e=>{if(e.code==='Space')spaceDown=false});

function commit(x,y,w,h){
  if(TUT&&!tutAllow(x,y,w,h))return;
  const ids=new Set();for(let b=y;b<y+h;b++)for(let a=x;a<x+w;a++){const id=G.cellR[b*G.W+a];if(id>=0)ids.add(id)}
  for(const id of ids){const q=G.rects.get(id);if(w*h>1&&(q.lock||q.valid)){buzz(15);sfx.tick();toast('Dort liegt schon ein Block. Tippe ihn an, um ihn zu entfernen.',1700);return}if(q.lock)return}
  if(w*h===1){if(!ids.size)return;const r=G.rects.get([...ids][0]);removeRect(r.id);if(r.valid)R3.puff(r);G.undo.push({add:[],del:[[r.x,r.y,r.w,r.h]]});sfx.pop();changed();return}
  const del=[...ids].map(id=>{const r=G.rects.get(id);removeRect(id);return[r.x,r.y,r.w,r.h]}),r=addRect(x,y,w,h,0);
  G.undo.push({add:[[x,y,w,h]],del});if(G.undo.length>300)G.undo.shift();
  if(r.valid){sfx.ok(w*h);buzz(8);R3.burst(r)}else if(r.wrong){sfx.bad();buzz(24)}else sfx.tick();
  if(!r.valid&&G.meta.rule==='strikes'){G.strikes=(G.strikes||0)+1;if(G.strikes>=3){G.strikes=0;clearBoard();toast('Dritter Fehler. Das Brett ist geleert.',2800);return}toast(`Fehler ${G.strikes} von 3`,1500)}
  changed();
}
function undo(){if(!G||G.won)return;if(G.meta.rule==='nohelp'){toast('Heute ohne Tipp und ohne Zurück.',1800);return}if(TUT&&TUT.step<4){toast('Gleich. Erst die markierte Stelle.',1500);return}const u=G.undo.pop();if(!u){toast('Nichts zum Zurücknehmen.',1200);return}
  for(const[x,y,w,h]of u.add){const r=G.rects.get(G.cellR[y*G.W+x]);if(r&&!r.lock&&r.x===x&&r.y===y&&r.w===w&&r.h===h)removeRect(r.id)}
  for(const[x,y,w,h]of u.del)if(free(x,y,w,h))addRect(x,y,w,h,0,true);
  sfx.pop();changed()}
function hint(){if(!G||G.won)return;if(G.meta.rule==='nohelp'){toast('Heute ohne Tipp und ohne Zurück.',1800);return}if(TUT&&TUT.step<4){toast('Gleich. Erst die markierte Stelle.',1500);return}if(!A&&G.meta.diff==='master'){toast('Im Meister-Modus gibt es keine Tipps.');return}
  const off=[...G.rects.values()].filter(r=>!r.lock&&(r.wrong||(r.valid&&!r.exact)));
  if(off.length){off.forEach(r=>removeRect(r.id));G.hints++;G.undo.length=0;if(A)A.time=Math.max(1,A.time-8);sfx.pop();toast(off.length===1?'Ein Block lag falsch und ist wieder frei.':`${off.length} Blöcke lagen falsch und sind wieder frei.`,2600);changed();return}
  const mx=(cw/2-V.ox)/V.s,my=((INS.top+ch-INS.bot)/2-V.oy)/V.s;let best=null,bd=1e18;
  for(const r of G.puz.rects){if(r.w*r.h===1)continue;const p=G.rects.get(G.cellR[r.cy*G.W+r.cx]);if(p&&p.valid&&p.x===r.x&&p.y===r.y&&p.w===r.w&&p.h===r.h)continue;
    const d=Math.hypot(r.x+r.w/2-mx,r.y+r.h/2-my);if(d<bd){bd=d;best=r}}
  if(!best)return;
  for(let b=best.y;b<best.y+best.h;b++)for(let a=best.x;a<best.x+best.w;a++){const id=G.cellR[b*G.W+a];if(id>=0)removeRect(id)}
  R3.burst(addRect(best.x,best.y,best.w,best.h,1));G.hints++;G.undo.length=0;if(A)A.time=Math.max(1,A.time-8);sfx.ok(best.w*best.h);
  const sx=V.ox+(best.x+best.w/2)*V.s,sy=V.oy+(best.y+best.h/2)*V.s;
  if(sx<20||sx>cw-20||sy<INS.top+10||sy>ch-INS.bot-10)tweenTo({s:V.s,ox:V.ox+cw/2-sx,oy:V.oy+(INS.top+ch-INS.bot)/2-sy});
  changed()}
{const mini=$('#mini');let dn=false;const go=e=>{if(!G)return;const r=$('#miniCv').getBoundingClientRect(),wx=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*G.W,wy=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))*G.H;
  tween=null;V.ox=cw/2-wx*V.s;V.oy=(INS.top+ch-INS.bot)/2-wy*V.s;clampView();requestDraw()};
 mini.addEventListener('pointerdown',e=>{e.preventDefault();try{mini.setPointerCapture(e.pointerId)}catch(_){}dn=true;go(e)});mini.addEventListener('pointermove',e=>{if(dn)go(e)});
 ['pointerup','pointercancel'].forEach(n=>mini.addEventListener(n,()=>{dn=false}))}
$('#tUndo').onclick=undo;$('#tHint').onclick=hint;
$('#tMode').onclick=()=>{if(G&&G.fixed){toast('Kleine Bretter stehen fest. Schieben und Zoomen gibt es ab 11 Feldern.',2400);return}tool=tool==='draw'?'pan':'draw';toolbar()};
$('#tFit').onclick=()=>{if(G&&!G.fixed)tweenTo(Math.abs(V.s-fitScale())<.5&&fitScale()<18?{s:30,ox:V.ox,oy:V.oy}:fitTarget())};
function clearBoard(){if(!G||G.won)return;for(const r of[...G.rects.values()])if(!(r.lock&&r.w*r.h===1))removeRect(r.id);G.undo.length=0;changed()}
function openSettings(){
  const inGame=$('#game').classList.contains('on')&&G&&!G.won&&!A;
  const s=openSheet(`<div class="sh-head"><h2>Optionen</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
  <button class="opt" id="oSound" role="switch"><span><b>Ton</b><small>Klänge beim Setzen und Lösen</small></span><i class="tg"></i></button>
  <button class="opt" id="o3d" role="switch"><span><b>3D-Ansicht</b><small id="o3dTxt"></small></span><i class="tg"></i></button>
  <div class="opt col"><span><b>Look</b><small id="oSkinTxt"></small></span><div class="seg s3" id="oSkin"><button data-s="rund">Klassisch</button><button data-s="k3">3D</button><button data-s="arc">Retro</button></div></div>
  ${Shell.games.map(g=>g.settingsRows?g.settingsRows():'').join('')}
  <div class="btns"><button class="ghost" id="oHelp">Spielregeln</button>${$('#game').classList.contains('on')?'':'<button class="ghost" id="oTut">Tutorial</button>'}${inGame?'<button class="ghost" id="oClear">Brett leeren</button>':''}${window.PX_CHECK?'<button class="ghost" id="oUpd">Update suchen</button>':''}</div>
  <p style="text-align:center;font-size:12px">Version ${window.PX_VER||'Vorschau in Claude'}</p>`);
  Shell.each('settingsBind',s);
  const up=s.querySelector('#oUpd');if(up)up.onclick=()=>{toast('Suche nach einer neuen Version. Sie wird beim nächsten Besuch der Startseite geladen.',3200);window.PX_CHECK()};
  const a=s.querySelector('#oSound'),b=s.querySelector('#o3d'),sync=()=>{const on3=R3.on&&!R3.failed;a.classList.toggle('on',S.sound);a.setAttribute('aria-checked',S.sound);b.classList.toggle('on',on3);b.setAttribute('aria-checked',on3);b.disabled=R3.failed;s.querySelectorAll('#oSkin button').forEach(x=>x.classList.toggle('sel',x.dataset.s===SKIN));s.querySelector('#oSkinTxt').textContent={rund:'Runde Glasflächen, alles gerade.',k3:'Harte Kanten, Leuchtrand und eine gefaltete Glasbahn auf der Startseite.',arc:'Die Startseite als Spielautomat mit Leuchtschild, Bildschirm und Pult.'}[SKIN];
    s.querySelector('#o3dTxt').textContent=R3.failed?'Auf diesem Gerät nicht verfügbar, das Brett läuft in 2D.':'Glasquader mit Licht und Funken. Ausgeschaltet läuft das flache 2D-Brett.'};
  a.onclick=()=>{S.sound=!S.sound;store.set('snd',S.sound);if(S.sound)sfx.ok(4);sync()};
  b.onclick=()=>{setView(!R3.on,true).then(sync);sync()};
  s.querySelector('#oSkin').onclick=e=>{const x=e.target.closest('[data-s]');if(x){setSkin(x.dataset.s,true);sync()}};
  const ot=s.querySelector('#oTut');if(ot)ot.onclick=startTutorial;
  s.querySelector('#oHelp').onclick=()=>$('#bHelp').click();
  const c=s.querySelector('#oClear');let armed=false;if(c)c.onclick=()=>{if(!armed){armed=true;c.textContent='Wirklich leeren?';return}clearBoard();closeSheet()};
  sync()}
$('#tSet').onclick=openSettings;
$('#gBack').innerHTML=I.back;$('#galBack').innerHTML=I.back;
$('#gBack').onclick=()=>{if(TUT){tutEnd();G=null;show('home');return}if(A){endArcade(true);return}clearTimeout(saveT);saveNow();const kept=!!G.meta.sid,to=G.meta.lv?'camp':'home';G=null;show(to);if(kept)toast('Stand gespeichert.',1500)};
$('#galBack').onclick=()=>show('home');

