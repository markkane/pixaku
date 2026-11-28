/* ---------- Pixaku auf der Startseite: Menü, Schriftzug, Vorschau, Anmeldung beim Rahmen ---------- */
function pixakuHome(){
  const ix=saves(),sv=ix[0],gal=store.get('gal',[]),best=store.get('best',0);$('#contN').hidden=ix.length<2;$('#contN').textContent=ix.length;
  $('#bCont').hidden=!sv;$('#bCamp').classList.toggle('go',!sv);$('.menu').classList.toggle('has',!!sv);{const n=campStars();$('#campTag').hidden=!n;$('#campTag').textContent='★ '+n}
  if(sv){$('#contName').textContent=sv.name;$('#contInfo').textContent=`${sv.W} × ${sv.H}, ${sv.pct} %`;const cv=$('#contCv');cv.width=sv.W;cv.height=sv.H;const im=new Image();im.onload=()=>cv.getContext('2d').drawImage(im,0,0);im.src=sv.thumb}
  {const e=dayOf(),n=((e.b||gal.some(g=>g.id==='daily-'+today()))?1:0)+(e.s?1:0)+(e.r?1:0);$('#dailyTag').textContent=n===3?'Fertig':n+'/3';$('#dailyTag').classList.toggle('done',n===3);$('#icDaily').classList.toggle('mute',!n)}
  $('#galTxt').hidden=!gal.length;$('#galTxt').textContent=gal.length;$('#arcTxt').hidden=!best;$('#arcTxt').textContent=best;
}
function pixakuLogo(anim,run){
  const L=[['1110','1001','1110','1000','1000'],['111','010','010','010','111'],['1001','1001','0110','1001','1001'],['0110','1001','1111','1001','1001'],['1001','1010','1100','1010','1001'],['1001','1001','1001','1001','0110']],
    cols=['#ff7a59','#ffc857','#4fe3c1','#ff5d8f','#5cc8ff','#ffc857'],cv=$('#logo'),s=HOME.col/28,d=Math.min(3,devicePixelRatio||1);
  cv.style.width=28*s+'px';cv.style.height=5*s+'px';cv.width=28*s*d;cv.height=5*s*d;const c=cv.getContext('2d'),t0=performance.now();
  (function f(now){if(run!==logoRun)return;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,28*s,5*s);let x0=0,more=false;
    L.forEach((g,li)=>{g.forEach((row,y)=>[...row].forEach((b,x)=>{if(b!=='1')return;const age=anim&&!reduce?(now-t0-(x0+x)*38-y*22)/260:1;if(age<=0){more=true;return}
      const t=Math.min(1,age),sc=.4+.6*(1-Math.pow(1-t,3));if(t<1)more=true;c.save();c.translate((x0+x+.5)*s,(y+.5)*s);c.scale(sc,sc);cubo(c,-s/2,-s/2,s,s,cols[li],s,1);c.restore()}));x0+=g[0].length+1});
    if(more)requestAnimationFrame(f)})(t0)}
async function pixakuHero(){const run=++heroRun,cv=$('#hero'),c=cv.getContext('2d'),px=HOME.col,ph=HOME.hh,d=Math.min(3,devicePixelRatio||1);cv.width=px*d;cv.height=ph*d;let order=SPRITES.map((_,i)=>i).sort(()=>Math.random()-.5),oi=0;
  while(run===heroRun&&$('#home').classList.contains('on')){
    const puz=await buildPuzzle(spriteImage(SPRITES[order[oi++%order.length]]),12,mulberry32((Math.random()*1e9)|0)),{W,H}=puz,s=Math.min((px-16)/W,(ph-16)/H),ox=(px-W*s)/2,oy=(ph-H*s)/2;
    const seq=puz.rects.map((r,i)=>i).sort(()=>Math.random()-.5),born=new Float64Array(seq.length).fill(1e18);
    const paint=(now,k)=>{c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,px,ph);
      for(const i of seq){const r=puz.rects[i],col=puz.colors[puz.cells[r.cy*W+r.cx]],x=ox+r.x*s,y=oy+r.y*s,w=r.w*s,h=r.h*s,age=now-born[i];
        if(age>=0){const t=Math.min(1,age/240),sc=.8+.2*(1-Math.pow(1-t,3));c.save();c.translate(x+w/2,y+h/2);c.scale(sc,sc);cubo(c,-w/2,-h/2,w,h,col,s,k);c.restore()}
        else{c.strokeStyle='rgba(255,255,255,.1)';c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);if(r.w*r.h>1){c.fillStyle='rgba(255,255,255,.75)';c.font=`700 ${s*.55}px PixNum,Figtree,system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(r.w*r.h,ox+(r.cx+.5)*s,oy+(r.cy+.5)*s+1)}}}};
    if(reduce){born.fill(0);paint(1e6,0);return}
    const t0=performance.now();seq.forEach((i,n)=>born[i]=t0+500+n*95);const end=t0+500+seq.length*95+400;
    await new Promise(res=>{(function f(now){if(run!==heroRun)return res();const k=now<end?1:Math.max(0,1-(now-end)/600);paint(now,k);if(now<end+2600)requestAnimationFrame(f);else res()})(t0)});
  }}
$('#bPlay').onclick=()=>{if(needTut()){startTutorial();return}seed=(Math.random()*2**32)>>>0;openSetup(true)};
$('#bCont').onclick=e=>e.target.id==='contCv'||saves().length<2?resume():openSaves();$('#bCamp').onclick=()=>needTut()?startTutorial():show('camp');$('#bAch').onclick=()=>show('ach');
$('#campBack').innerHTML=I.back;$('#achBack').innerHTML=I.back;$('#campBack').onclick=$('#achBack').onclick=()=>show('home');$('#bDaily').onclick=()=>needTut()?startTutorial():openToday();$('#bArcade').onclick=()=>needTut()?startTutorial():arcadeStart();$('#bGal').onclick=()=>show('gallery');
$('#bSet').onclick=openSettings;
$('#bUpload').onclick=()=>$('#file').click();
$('#bHelp').onclick=()=>openSheet(`<div class="sh-head"><h2>So geht Pixaku</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
 <ul class="rules"><li><i>1</i><span>Ziehe mit dem Finger über das Raster und spanne ein Rechteck auf.</span></li>
 <li><i>2</i><span>In jedes Rechteck gehört genau eine Zahl. Die Zahl nennt die Fläche des Rechtecks in Feldern.</span></li>
 <li><i>3</i><span>Passt beides, füllt sich der Block mit seiner Farbe. Sind alle Felder gefüllt, steht das Bild.</span></li>
 <li><i>4</i><span>Ein Tipp auf einen Block entfernt ihn wieder. Fertige Blöcke lassen sich nicht überzeichnen, und wer auf einem fertigen Block ansetzt, schiebt das Brett. Die kleine Karte oben rechts springt per Fingertipp zu jeder Stelle. Felder mit der Fläche 1 sind schon gesetzt und tragen einen kleinen Punkt.</span></li>
 <li><i>5</i><span>Ein farbiger Block passt zu seiner Zahl, kann aber trotzdem falsch liegen. Der Tipp-Knopf räumt zuerst falsch liegende Blöcke ab. Kein Block ist länger als 9 Felder, und dünne Streifen bleiben kurz.</span></li>
 <li><i>6</i><span>Zwei Finger verschieben und zoomen das Brett. Am Rechner hilft das Mausrad, zum Schieben hältst du die Leertaste oder ziehst außerhalb des Bretts.</span></li></ul>
 <p>Jedes Rätsel hat genau eine Lösung und lässt sich ohne Raten herleiten.</p>
 <button class="primary" id="hTut">Tutorial spielen</button>`).querySelector('#hTut').onclick=startTutorial;
$('#file').onchange=async e=>{const inp=e.target,f=inp.files&&inp.files[0];if(!f)return;
  try{let src=null;if(window.createImageBitmap){try{src=await createImageBitmap(f)}catch(_){}}
    if(!src)src=await new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=fr.result};fr.readAsDataURL(f)});
    const k=Math.min(1,480/Math.max(src.width,src.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(src.width*k));cv.height=Math.max(1,Math.round(src.height*k));
    const c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,cv.width,cv.height);c.drawImage(src,0,0,cv.width,cv.height);const px=c.getImageData(0,0,cv.width,cv.height);if(src.close)src.close();
    uploadSrc={width:cv.width,height:cv.height,data:new Uint8ClampedArray(px.data)};cfg.motif='upload';cfg.pal='orig';if(cfg.size<5)cfg.size=7;openSetup()}
  catch(err){toast('Dieses Bild konnte der Browser nicht lesen. Mit JPG oder PNG klappt es.',3500)}
  inp.value=''};
function paintIcons(){paintImg($('#icDaily'),compact(pixling(12,12,mulberry32(hashStr('daily-'+today())))));
  paintImg($('#icArcade'),spriteImage(SPRITES.find(s=>s.id==='rakete')));paintImg($('#icUpload'),spriteImage(SPRITES.find(s=>s.id==='kaktus')));paintImg($('#icGal'),spriteImage(SPRITES.find(s=>s.id==='diamant')))}
/* Nach einer Pause wirft Android gezeichnete Flächen weg: alles neu zeichnen */
function pixakuWake(){paintIcons();if($('#gallery').classList.contains('on'))renderGallery();
  if(G){G.pctx.clearRect(0,0,G.W,G.H);for(const r of G.rects.values())if(r.valid){G.pctx.fillStyle=r.col;G.pctx.fillRect(r.x,r.y,r.w,r.h)}
    if(R3.ready){R3.lost=R3.r.getContext().isContextLost();if(R3.atlas)R3.atlas.needsUpdate=true;$('#gl').hidden=!use3D()}
    if($('#game').classList.contains('on')){resize();requestDraw()}}}
/* Zurück-Taste oder Wischgeste am Rand, während ein Bild läuft */
function pixakuBack(){if(!($('#game').classList.contains('on')&&G&&!G.won))return false;navPush();const edge=Date.now()-lastDown.t<1200&&(lastDown.x<52||lastDown.x>cw-52);
      if(edge){const q=edgeDrag;edgeDrag=null;if(q&&Date.now()-q.t<1200&&q.d.w*q.d.h>1&&evalRect(q.d.x,q.d.y,q.d.w,q.d.h).valid&&!blockedAt(q.d.x,q.d.y,q.d.w,q.d.h))commit(q.d.x,q.d.y,q.d.w,q.d.h);
        if(Date.now()-backArmed>6000){backArmed=Date.now();toast('Wischgeste am Rand abgefangen, das Spiel läuft weiter.',1800)}}
      else{const quick=A||G.meta.mode==='sprint'||G.meta.mode==='rule'||TUT;
        const s=openSheet(`<div class="sh-head"><h2>Spiel verlassen?</h2></div><p>${quick?'Diese Runde wird nicht gespeichert und endet beim Verlassen.':'Dein Stand bleibt gespeichert, du kannst später weitermalen.'}</p><div class="btns"><button class="ghost" id="lvY">Verlassen</button><button class="primary" id="lvN">Weiterspielen</button></div>`);
        s.querySelector('#lvN').onclick=closeSheet;s.querySelector('#lvY').onclick=()=>{closeSheet();$('#gBack').onclick()}}return true}
Shell.register({id:'pixaku',name:'Pixaku',tagline:'Shikaku trifft Pixel-Art',logo:pixakuLogo,hero:pixakuHero,onHome:pixakuHome,onWake:pixakuWake,onBack:pixakuBack,scrollScreens:['gallery','camp','ach'],
  onShow(id){if(id==='game')resize();if(id==='gallery')renderGallery();if(id==='camp')renderCamp();if(id==='ach')renderAch()},
  init(){paintIcons();
    $('#gl').addEventListener('webglcontextrestored',()=>{R3.lost=false;setTimeout(refreshVisuals,50)});
    $('#gl').addEventListener('webglcontextlost',()=>{R3.lost=true;$('#gl').hidden=true;if(G)requestDraw()});
    for(const id of['board','miniCv','contCv','icDaily','icArcade','icUpload','icGal'])document.getElementById(id).addEventListener('contextrestored',()=>{clearTimeout(rvT);rvT=setTimeout(refreshVisuals,60)});
    window.claude?.hot?.snapshot?.(()=>{saveNow();return{}});
    document.fonts&&document.fonts.load('800 92px PixNum','0123456789').then(()=>{if(R3.numAtlas)R3.numAtlas();if(G)requestDraw()}).catch(()=>{});document.fonts&&document.fonts.ready.then(()=>{if(G)requestDraw()})}});
