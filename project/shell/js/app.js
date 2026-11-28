/* ================= APP ================= */
const $=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get(k,d){try{const v=localStorage.getItem('pixaku.'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('pixaku.'+k,JSON.stringify(v));return true}catch(e){return false}},del(k){try{localStorage.removeItem('pixaku.'+k)}catch(e){}}};
const svg=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const I={back:svg('<path d="M15 5l-7 7 7 7"/>'),undo:svg('<path d="M8 5L3 10l5 5"/><path d="M3 10h11a6 6 0 010 12h-3"/>'),
  hint:svg('<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>'),
  draw:svg('<rect x="4" y="6" width="16" height="12" rx="2" stroke-dasharray="3 3"/>'),
  pan:svg('<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>'),
  fit:svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),restart:svg('<path d="M5 12a7 7 0 107-7H8"/><path d="M11 2L8 5l3 3"/>'),
  son:svg('<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M17 9a4 4 0 010 6"/>'),soff:svg('<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),x:svg('<path d="M6 6l12 12M18 6L6 18"/>'),grid:svg('<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>'),trophy:svg('<path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8.5 20h7"/>'),lock:svg('<rect x="6" y="11" width="12" height="9" rx="1"/><path d="M8.5 11V8a3.5 3.5 0 017 0v3"/>'),gear:svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>')};
const DIFFS=[
 {id:'easy',name:'Entspannt',max:6,color:true,check:true,desc:'Kleine Blöcke, farbige Zahlen, und falsch gesetzte Rechtecke werden rot markiert.'},
 {id:'normal',name:'Klassisch',max:12,color:true,check:false,desc:'Blöcke bis 12 Felder. Die farbigen Zahlen verraten, welche Farbe ein Block bekommt.'},
 {id:'hard',name:'Knifflig',max:20,color:false,check:false,desc:'Blöcke bis 20 Felder. Die Farbe zeigt sich erst, wenn ein Rechteck passt.'},
 {id:'master',name:'Meister',max:32,color:false,check:false,desc:'Blöcke bis 32 Felder, farblose Zahlen und keine Tipps.'}];
const SCENES=[{id:'pixling',name:'Pixling',gen:(S,r)=>pixling(S,S,r)},{id:'mosaik',name:'Mosaik',gen:(S,r)=>mosaic(S,S,r)},{id:'sunset',name:'Abendsee',gen:sceneSunset},
 {id:'planet',name:'Ringplanet',gen:scenePlanet},{id:'skyline',name:'Nachtstadt',gen:sceneSkyline},{id:'mandala',name:'Mandala',gen:sceneMandala},
 {id:'synth',name:'Neonsonne',gen:sceneSynth},{id:'palme',name:'Palmeninsel',gen:scenePalm},{id:'gipfel',name:'Gipfel',gen:sceneGipfel},{id:'turm',name:'Leuchtturm',gen:sceneLeuchtturm},{id:'bogen',name:'Regenbogen',gen:sceneRegenbogen},{id:'riff',name:'Riff',gen:sceneRiff},
 {id:'wueste',name:'Wüste',gen:sceneWueste},{id:'vulkan',name:'Vulkan',gen:sceneVulkan},{id:'polar',name:'Polarlicht',gen:scenePolarlicht},{id:'ballons',name:'Ballons',gen:sceneBallons},{id:'kacheln',name:'Kacheln',gen:sceneKacheln},{id:'wellen',name:'Wellen',gen:sceneWellen}];
const SIZES=[6,8,10,12,16,20,24,32,48,64,100,150,200];
const S={sound:store.get('snd',true)};
let cfg=Object.assign({motif:'katze',size:3,diff:'normal',pal:'orig'},store.get('cfg',{}));
let uploadSrc=null,seed=(Math.random()*2**32)>>>0,downloads=null;
window.claude?.use?.('downloads').then(d=>downloads=d).catch(()=>{});
const today=()=>new Date().toLocaleDateString('sv');
const fmt=t=>{t=Math.max(0,Math.round(t));const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=String(t%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${s}`:`${m}:${s}`};
const enc=c=>{let s='';for(let i=0;i<c.length;i+=8192)s+=String.fromCharCode.apply(null,Array.from(c.subarray(i,i+8192),v=>48+v));return s};
const dec=s=>{const c=new Uint8Array(s.length);for(let i=0;i<s.length;i++)c[i]=s.charCodeAt(i)-48;return c};
const inkCache={};const inkOn=h=>inkCache[h]||(inkCache[h]=lumOf(h)>150?'#0b1a24':'#ffffff');

function paintImg(cv,img){cv.width=img.W;cv.height=img.H;const c=cv.getContext('2d'),d=c.createImageData(img.W,img.H),rgb=img.colors.map(hex2rgb);
  for(let i=0;i<img.cells.length;i++){const p=rgb[img.cells[i]];d.data[i*4]=p[0];d.data[i*4+1]=p[1];d.data[i*4+2]=p[2];d.data[i*4+3]=255}c.putImageData(d,0,0);return cv}
function toast(t,ms=2200){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),ms)}
function buzz(n=8){try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
let AC=null;
function tone(f,d=.14,type='triangle',v=.07,when=0){if(!S.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+when;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const SCALE=[261.6,293.7,329.6,392,440,523.3,587.3,659.3,784,880];
const sfx={ok:a=>tone(SCALE[Math.min(9,Math.floor(Math.log2(a)*2))],.2),bad:()=>tone(150,.16,'sawtooth',.035),tick:()=>tone(620,.05,'sine',.04),pop:()=>tone(330,.07,'sine',.05),
  spark:()=>{tone(1320+Math.random()*500,.28,'sine',.035);tone(1980+Math.random()*400,.34,'sine',.02,.05)},
  win:()=>[0,2,4,7,9].forEach((n,i)=>tone(SCALE[n],.32,'triangle',.07,i*.09))};

/* ---------- Screens & Sheet ---------- */
let sheetOpen=false,sheetLocked=false;
/* Bildschirme mit scrollbarem Inhalt melden die Spiele über das Feld scrollScreens an */
const syncLock=()=>document.documentElement.classList.toggle('lock',sheetOpen||!Shell.games.some(g=>(g.scrollScreens||[]).some(i=>$('#'+i).classList.contains('on'))));
addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role=button]')){e.preventDefault();e.target.click()}});
let navDepth=0,navSkip=false,inPop=false,backArmed=0;
const navPush=()=>{try{history.pushState({px:1},'');navDepth++}catch(e){}};
addEventListener('popstate',()=>{if(navSkip){navSkip=false;return}navDepth=Math.max(0,navDepth-1);inPop=true;
  try{if(sheetOpen){if(!sheetLocked)closeSheet();navPush()}
    else if(Shell.games.some(g=>g.onBack&&g.onBack())){}
    else if(!$('#home').classList.contains('on'))show('home')}finally{inPop=false}});
addEventListener('pagehide',()=>saveNow());
function show(id){const was=document.querySelector('.screen.on');if(id!=='home'&&was&&was.id==='home')navPush();
  if(id==='home'&&!inPop&&navDepth>0){navSkip=true;const n=navDepth;navDepth=0;try{history.go(-n)}catch(e){navSkip=false}}
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));syncLock();scrollTo(0,0);if(id==='home')refreshHome();Shell.each('onShow',id)}
function openSheet(html,locked){const s=$('#sheet');s.innerHTML=html;s.scrollTop=0;s.classList.add('on');$('#scrim').classList.add('on');sheetOpen=true;sheetLocked=!!locked;syncLock();
  const x=s.querySelector('[data-x]');if(x)x.onclick=closeSheet;return s}
function closeSheet(){$('#sheet').classList.remove('on');$('#scrim').classList.remove('on');sheetOpen=false;syncLock()}
$('#scrim').onclick=()=>{if(!sheetLocked)closeSheet()};
const loader=(on,t)=>{$('#loader').classList.toggle('on',on);if(t)$('#loadTxt').textContent=t};
const frame=()=>new Promise(r=>setTimeout(r,16));

/* ---------- Glaskachel ---------- */
let RND=1;
let SKIN='k3';
function setSkin(k,user){if(!['rund','k3','arc'].includes(k))k='k3';SKIN=k;const d=document.documentElement.classList;d.toggle('k3',k!=='rund');d.toggle('arc',k==='arc');RND=k==='rund'?1:0;if(user){store.set('skin',k);drawLogo(false);if($('#home').classList.contains('on'))heroStart();if(G)requestDraw()}}
setSkin(store.get('skin','k3'));
document.addEventListener('pointerdown',e=>{if(SKIN==='arc'&&e.target.closest&&e.target.closest('.gbtn,.primary,.ghost,.ib'))tone(190,.05,'square',.03)});
function rr(c,x,y,w,h,r){r*=RND;c.beginPath();if(r<=.5){c.rect(x,y,w,h);return}r=Math.min(r,w/2,h/2);c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function tile(c,x,y,w,h,col,s,k){const g=Math.min(1.5,s*.05)*k,rad=Math.min(s*.24,9)*k;c.fillStyle=col;rr(c,x+g,y+g,w-2*g,h-2*g,rad);c.fill();
  if(k>.02){const gr=c.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,`rgba(255,255,255,${.3*k})`);gr.addColorStop(.45,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(0,0,0,${.18*k})`);
    c.fillStyle=gr;c.fill();c.strokeStyle=`rgba(255,255,255,${.3*k})`;c.lineWidth=1;c.stroke()}}

const shade=(h,f)=>{const c=hex2rgb(h);return rgb2hex(c[0]*f,c[1]*f,c[2]*f)};
function cubo(c,x,y,w,h,col,s,k){if(SKIN==='rund'||k<.05){tile(c,x,y,w,h,col,s,k);return}const d=Math.min(h*.3,s*.2)*k,g=Math.min(1.5,s*.05)*k;c.fillStyle=shade(col,.5);c.fillRect(x+g,y+h-d-g,w-2*g,d);tile(c,x,y,w,h-d,col,s,k)}
