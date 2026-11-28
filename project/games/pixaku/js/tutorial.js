/* ---------- Tutorial ---------- */
let TUT=null;
const TUT_COL=['#ffc857','#ff7a59','#4fe3c1','#5cc8ff','#ff5d8f'],
  TUT_R=[[0,0,3,1,0,0,0],[3,0,2,2,3,0,1],[0,1,1,3,0,1,2],[1,1,2,2,1,1,3],[3,2,2,3,3,2,4],[0,4,3,1,1,4,0],[1,3,2,1,2,3,2]],
  TUT_TXT=['Jede Zahl steht für ein Rechteck mit genau so vielen Feldern. Zieh mit dem Finger über die drei markierten Felder.',
   'Ein Rechteck darf auch ein Block sein. Die 4 braucht vier Felder: Zieh von einer Ecke zur gegenüberliegenden.',
   'Vertan? Ein Tipp auf einen Block entfernt ihn wieder. Tippe den Block mit der 4 an.',
   'Und jetzt setz ihn wieder an dieselbe Stelle.',
   'Jetzt du: Jede Zahl bekommt ihr Rechteck, kein Feld bleibt frei. Hängst du fest, hilft der Tipp-Knopf unten.'];
const needTut=()=>!store.get('tut')&&!store.get('seen')&&!saves().length&&!store.get('gal',[]).length&&!store.get('best',0);
function startTutorial(){closeSheet();A=null;const rects=TUT_R.map(r=>({x:r[0],y:r[1],w:r[2],h:r[3],cx:r[4],cy:r[5]})),cells=new Uint8Array(25);
  TUT_R.forEach(r=>{for(let y=r[1];y<r[1]+r[3];y++)for(let x=r[0];x<r[0]+r[2];x++)cells[y*5+x]=r[6]});
  TUT={step:0};newGame({W:5,H:5,colors:TUT_COL,cells,rects},{mode:'tut',name:'Erste Schritte',diff:'easy'});tutShow()}
function tutShow(){if(!TUT)return;$('#coach').hidden=false;$('#coachTxt').textContent=TUT_TXT[TUT.step];$('#coachStep').textContent=`${TUT.step+1} / ${TUT_TXT.length}`;resize();V=fitTarget();requestDraw()}
function tutEnd(){TUT=null;$('#coach').hidden=true;$('#tutHi').style.display='none';store.set('tut',1);store.set('seen',1)}
const tutHas=k=>{const r=TUT_R[k],p=G.rects.get(G.cellR[r[5]*5+r[4]]);return!!(p&&p.valid&&p.exact)};
function tutAllow(x,y,w,h){const s=TUT.step,T=TUT_R[s===0?0:1];if(s>=4)return true;
  if(s===2){if(w*h===1&&x>=T[0]&&x<T[0]+T[2]&&y>=T[1]&&y<T[1]+T[3])return true;toast('Tippe einmal kurz auf den markierten Block.',1700);return false}
  if(x===T[0]&&y===T[1]&&w===T[2]&&h===T[3])return true;if(w*h>1)toast('Fast. Zieh genau über die markierten Felder.',1700);return false}
function tutCheck(){if(!TUT||!G||G.won)return;const s=TUT.step,n=s===0&&tutHas(0)?1:s===1&&tutHas(1)?2:s===2&&!tutHas(1)?3:s===3&&tutHas(1)?4:s;if(n!==s){TUT.step=n;tutShow()}}
function scr(wx,wy){if(use3D()){R3.syncCam();const v=new THREE.Vector3(wx,-wy,0).project(R3.cam);return[(v.x+1)/2*cw,(1-v.y)/2*ch]}return[V.ox+wx*V.s,V.oy+wy*V.s]}
function tutDraw(now){const sv=$('#tutHi');if(!TUT||TUT.step>=4||!G||G.won){if(sv.style.display!=='none')sv.style.display='none';return}
  const T=TUT_R[TUT.step===0?0:1],[x,y,w,h]=T,pg=sv.firstElementChild,dot=sv.lastElementChild;sv.style.display='block';
  pg.setAttribute('points',[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(p=>scr(p[0],p[1]).join(',')).join(' '));
  const u=(now%1900)/1900;let px,py,op=1,r=13;
  if(TUT.step===2){[px,py]=scr(x+w/2,y+h/2);r=10+5*Math.abs(Math.sin(now/260))}
  else{const k=u<.15?0:u>.78?1:(u-.15)/.63,e=k*k*(3-2*k),a=scr(x+.5,y+.5),b=scr(x+w-.5,y+h-.5);px=a[0]+(b[0]-a[0])*e;py=a[1]+(b[1]-a[1])*e;op=u>.88?(1-u)/.12:u<.08?u/.08:1}
  dot.setAttribute('cx',px);dot.setAttribute('cy',py);dot.setAttribute('r',r);dot.setAttribute('opacity',op)}
function tutFinish(){if(!TUT)return;$('#coach').hidden=true;
  const s=openSheet(`<div class="sh-head"><h2>Das war schon alles</h2></div>
  <ul class="rules"><li><i>1</i><span>Auf großen Bildern verschieben und zoomen zwei Finger das Brett. Die kleine Karte oben rechts springt per Tipp an jede Stelle.</span></li>
  <li><i>2</i><span>Ein farbiger Block passt zu seiner Zahl, kann aber trotzdem falsch liegen. Der Tipp-Knopf räumt zuerst falsch liegende Blöcke ab.</span></li>
  <li><i>3</i><span>Felder mit der Fläche 1 sind auf richtigen Bildern schon gesetzt und tragen einen kleinen Punkt.</span></li>
  <li><i>4</i><span>Hinter dem Zahnrad stellst du Ton und Aussehen ein und findest dieses Tutorial wieder.</span></li></ul>
  <button class="primary" id="tutGo">Zum Hauptmenü</button>`,true);
  s.querySelector('#tutGo').onclick=()=>{closeSheet();tutEnd();G=null;show('home')}}
$('#coachSkip').onclick=()=>{tutEnd();G=null;show('home')};
/* La-Ola beim Sieg: liefert [Hüpfer 0..1, Rest an Kachelform 1..0] für einen Block */
function wv(r,now){if(!G.won)return[0,1];if(reduce)return[0,1-G.winT];
  const f=Math.sin(r.id*12.9898)*43758.5453,d=(r.x+r.w/2+r.y+r.h/2)/(G.W+G.H)*G.wSpan+(f-Math.floor(f))*G.wJit,t=(now-G.winAt-d)/G.wHop;
  return t<=0?[0,1]:t<1?[Math.sin(Math.PI*t),1]:[0,Math.max(0,1-(t-1)/.85)]}
