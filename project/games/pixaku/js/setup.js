/* ---------- Setup ---------- */
let SUGG=[];
const thumbOf=id=>{const sp=SPRITES.find(s=>s.id===id);if(sp)return spriteImage(sp);const sc=SCENES.find(s=>s.id===id);return compact(sc.gen(id==='pixling'?12:20,mulberry32(11)))};
const nameOf=id=>(SPRITES.find(s=>s.id===id)||SCENES.find(s=>s.id===id)).name;
function openPicker(){
  const s=openSheet(`<div class="sh-head"><h2>Alle Motive</h2><button class="ib" id="pkX" aria-label="Zurück zur Auswahl">${I.x}</button></div>
  <h3>Szenen<output>jede Größe, immer neu</output></h3><div class="pgrid" id="pg1"></div><h3>Motive<output>feste Größe</output></h3><div class="pgrid" id="pg2"></div>`);
  const add=(host,id)=>{const b=document.createElement('button');b.className='mo'+(id===cfg.motif?' sel':'');const cv=document.createElement('canvas');cv.className='px';paintImg(cv,thumbOf(id));b.append(cv,nameOf(id));
    b.onclick=()=>{cfg.motif=id;seed=(Math.random()*2**32)>>>0;openSetup()};host.append(b)};
  SCENES.forEach(sc=>add(s.querySelector('#pg1'),sc.id));SPRITES.forEach(sp=>add(s.querySelector('#pg2'),sp.id));
  s.querySelector('#pkX').onclick=()=>openSetup();const sel=s.querySelector('.mo.sel');if(sel)sel.scrollIntoView({block:'center'})}
function openSetup(fresh){
  if(cfg.motif==='upload'&&!uploadSrc)cfg.motif='katze';
  if(fresh||SUGG.length<3){const mix=a=>a.map(x=>x.id).filter(i=>i!==cfg.motif).sort(()=>Math.random()-.5),sc=mix(SCENES),sp=mix(SPRITES);SUGG=[sc[0],sp[0],sc[1]]}
  const s=openSheet(`<div class="sh-head"><h2>Neues Bild</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
  <div class="pvrow"><div class="frame"><canvas class="px" id="pv"></canvas></div><div><b id="pvName"></b><p id="pvInfo"></p><button class="ghost" id="reroll" style="margin-top:8px;min-height:38px">Neu würfeln</button></div></div>
  <h3>Motiv</h3><div class="strip" id="motifs"></div>
  <div id="sizeRow"><h3><label for="size">Größe</label><output id="sizeOut" for="size"></output></h3><div class="stepper"><button class="ib" id="szM" aria-label="Kleiner">−</button><input type="range" id="size" min="0" max="${SIZES.length-1}" step="1"><button class="ib" id="szP" aria-label="Größer">+</button></div><p id="sizeNote"></p></div>
  <h3>Schwierigkeit</h3><div class="seg" id="diffs">${DIFFS.map(d=>`<button data-d="${d.id}">${d.name}</button>`).join('')}</div><p id="diffDesc"></p>
  <h3>Palette</h3><div class="strip" id="pals"></div>
  <button class="primary" id="go">Los geht's</button>`);
  const mo=s.querySelector('#motifs');
  const addMo=(id,name,img)=>{const b=document.createElement('button');b.className='mo';b.dataset.m=id;const cv=document.createElement('canvas');cv.className='px';if(img)paintImg(cv,img);b.append(cv,name);mo.append(b);return cv};
  if(uploadSrc){const cv=addMo('upload','Dein Bild');cv.className='';cv.width=cv.height=120;const a=uploadSrc.width/uploadSrc.height,c=cv.getContext('2d'),tc=document.createElement('canvas');tc.width=uploadSrc.width;tc.height=uploadSrc.height;tc.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(uploadSrc.data),uploadSrc.width,uploadSrc.height),0,0);c.drawImage(tc,a>1?(uploadSrc.width-uploadSrc.height)/2:0,a>1?0:(uploadSrc.height-uploadSrc.width)/2,Math.min(uploadSrc.width,uploadSrc.height),Math.min(uploadSrc.width,uploadSrc.height),0,0,120,120)}
  [...new Set([cfg.motif,...SUGG])].filter(id=>id!=='upload').forEach(id=>addMo(id,nameOf(id),thumbOf(id)));
  const all=document.createElement('button');all.className='mo';all.innerHTML=`<span class="up">${I.grid}</span>Alle ${SCENES.length+SPRITES.length}`;all.onclick=openPicker;mo.append(all);
  const up=document.createElement('button');up.className='mo';up.innerHTML='<span class="up">+</span>Foto';up.onclick=()=>$('#file').click();mo.append(up);
  const pals=s.querySelector('#pals');
  const strips=[mo,pals].map(el=>{const w=document.createElement('div');w.className='sw';el.replaceWith(w);
    const mk=(c,l,d)=>{const b=document.createElement('button');b.className='ar '+c;b.setAttribute('aria-label',l);b.innerHTML=I.back;b.onclick=()=>el.scrollBy({left:d*el.clientWidth*.7,behavior:reduce?'auto':'smooth'});return b};
    const ind=document.createElement('i');ind.className='ind';ind.innerHTML='<b></b>';w.append(mk('p','Zurück blättern',-1),el,mk('n','Weiter blättern',1),ind);
    const upd=()=>{const max=el.scrollWidth-el.clientWidth;w.classList.toggle('fit',max<=2);w.classList.toggle('l',el.scrollLeft>4);w.classList.toggle('r',el.scrollLeft<max-4);
      const f=el.clientWidth/el.scrollWidth;ind.firstChild.style.width=Math.max(18,f*100)+'%';ind.firstChild.style.left=(max>0?el.scrollLeft/max*(100-Math.max(18,f*100)):0)+'%'};
    el.addEventListener('scroll',upd,{passive:true});
    el.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&el.scrollWidth>el.clientWidth){e.preventDefault();el.scrollLeft+=e.deltaY}},{passive:false});
    let dn=null,moved=false;el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dn={x:e.clientX,l:el.scrollLeft};moved=false}});
    el.addEventListener('pointermove',e=>{if(dn&&Math.abs(e.clientX-dn.x)>5){moved=true;el.scrollLeft=dn.l-(e.clientX-dn.x)}});
    addEventListener('pointerup',()=>{dn=null},{passive:true});el.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
    return upd});
  const sync=()=>{
    mo.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('sel',b.dataset.m===cfg.motif));
    s.querySelectorAll('#diffs button').forEach(b=>b.classList.toggle('sel',b.dataset.d===cfg.diff));
    s.querySelector('#diffDesc').textContent=DIFFS.find(d=>d.id===cfg.diff).desc;
    const fx=isFixed();s.querySelector('#sizeRow').classList.toggle('off',fx);s.querySelector('#size').disabled=s.querySelector('#szM').disabled=s.querySelector('#szP').disabled=fx;s.querySelector('#sizeNote').textContent=fx?'Dieses Motiv ist von Hand gesetzt und hat eine feste Größe. Szenen, Pixling, Mosaik und eigene Fotos lassen sich frei skalieren.':'';s.querySelector('#reroll').hidden=fx||cfg.motif==='upload';
    s.querySelector('#size').value=cfg.size;
    const base=baseImage(),img=applyPalette(base,(RAMPS.find(r=>r.id===cfg.pal)||RAMPS[0]).ramp);
    const pv=s.querySelector('#pv');paintImg(pv,img);pv.style.aspectRatio=img.W+'/'+img.H;pv.style.width=img.W>=img.H?'100%':(img.W/img.H*100)+'%';
    s.querySelector('#pvName').textContent=motifName();s.querySelector('#pvInfo').textContent=`${img.W} × ${img.H} Felder, ${img.colors.length} Farben`;
    const mx=Math.max(img.W,img.H);s.querySelector('#sizeOut').textContent=(fx?'fest ':'')+`${img.W} × ${img.H}, ${mx<=8?'Häppchen':mx<=16?'Klassiker':mx<=32?'Großformat':mx<=64?'Wandbild':'Monument'}`;
    const pl=pals.scrollLeft;pals.innerHTML='';RAMPS.forEach(r=>{const cols=(r.ramp||base.colors.slice(0,6)),n=cols.length,b=document.createElement('button'),wi=r.lock?WORLDS.findIndex(w=>w.id===r.lock):-1,lk=wi>=0&&!worldDone(wi);b.className='pal'+(r.id===cfg.pal?' sel':'')+(lk?' lk':'');
      b.innerHTML=`<i style="background:linear-gradient(90deg,${cols.map((c,i)=>`${c} ${i/n*100}% ${(i+1)/n*100}%`).join(',')})"></i>${lk?'Welt '+(wi+1):r.name}`;b.onclick=()=>{if(lk){toast(`„${r.name}“ gibt es als Belohnung für Welt ${wi+1} der Kampagne.`,2800);return}cfg.pal=r.id;sync()};pals.append(b)});
    pals.scrollLeft=pl;strips.forEach(u=>u());store.set('cfg',cfg)};
  mo.onclick=e=>{const b=e.target.closest('[data-m]');if(b){cfg.motif=b.dataset.m;sync()}};
  s.querySelector('#diffs').onclick=e=>{const b=e.target.closest('[data-d]');if(b){cfg.diff=b.dataset.d;sync()}};
  s.querySelector('#size').oninput=e=>{cfg.size=+e.target.value;sync()};
  s.querySelector('#szM').onclick=()=>{cfg.size=Math.max(0,cfg.size-1);sync()};s.querySelector('#szP').onclick=()=>{cfg.size=Math.min(SIZES.length-1,cfg.size+1);sync()};
  s.querySelector('#reroll').onclick=()=>{seed=(Math.random()*2**32)>>>0;sync()};
  s.querySelector('#go').onclick=()=>{closeSheet();startArt()};
  sync();const sel=mo.querySelector('.sel');if(sel)mo.scrollLeft=sel.offsetLeft-90;const ps=pals.querySelector('.sel');if(ps)pals.scrollLeft=ps.offsetLeft-90;strips.forEach(u=>u());
}
async function build(img,max,rng){const big=img.W*img.H>3000;
  return buildPuzzle(img,max,rng,big?async(it,un)=>{loader(true,un?`Rätsel wird geschärft, noch ${un} offene Stellen`:'Fast fertig');await frame()}:null)}
async function startArt(){
  if(slotsFull())return;
  loader(true,'Rätsel wird gebaut');await frame();
  try{const img=finalImage(),d=DIFFS.find(x=>x.id===cfg.diff),puz=await build(img,d.max,mulberry32((Math.random()*2**32)>>>0));
    A=null;newGame(puz,{mode:'art',name:motifName(),diff:cfg.diff,motif:cfg.motif,pal:cfg.pal})}
  catch(e){console.error(e);toast('Das Rätsel ließ sich nicht bauen. Versuch es bitte noch einmal.')}
  loader(false);
}
const RULES=[{id:'blind',name:'Farblos',desc:'Die Zahlen verraten keine Farbe.',diff:'hard',size:12},
 {id:'strikes',name:'Drei Fehler',desc:'Beim dritten falschen Rechteck wird das Brett geleert.',diff:'normal',size:12},
 {id:'nohelp',name:'Ohne Netz',desc:'Kein Tipp und kein Zurück.',diff:'normal',size:12},
 {id:'zeit',name:'Sanduhr',desc:'Die Zeit ist knapp. Läuft sie ab, beginnt das Brett von vorn.',diff:'normal',size:10},
 {id:'brocken',name:'Große Brocken',desc:'Blöcke bis 32 Felder und farblose Zahlen.',diff:'master',size:14}];
const dayNo=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),ruleOf=()=>RULES[dayNo()%RULES.length],dayOf=()=>(store.get('daily',{})[today()])||{};
const dayIdx=()=>(new Date().getDay()+6)%7;
function weekId(){const d=new Date(),t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()-((t.getUTCDay()+6)%7)+3);const y=t.getUTCFullYear(),j4=new Date(Date.UTC(y,0,4));
  return y+'-W'+String(1+Math.round(((t-j4)/864e5-3+((j4.getUTCDay()+6)%7))/7)).padStart(2,'0')}
function weekState(){const w=store.get('week',null),id=weekId();return w&&w.id===id?w:{id,done:[0,0,0,0,0,0,0]}}
function weekImage(){const id=weekId(),L=['sunset','synth','palme','gipfel','turm','polar','vulkan','ballons','wellen','wueste','planet','riff'],sc=L[hashStr('wk'+id)%L.length],f=SCENES.find(s=>s.id===sc).gen(42,mulberry32(hashStr('wi'+id))),im={W:30,H:42,colors:f.colors,cells:new Uint8Array(30*42)};
  for(let y=0;y<42;y++)for(let x=0;x<30;x++)im.cells[y*30+x]=f.cells[y*42+x+6];return{im,name:nameOf(sc)}}
function weekShown(w){const{im}=weekImage(),o={W:30,H:42,colors:im.colors.concat('#0b1b25'),cells:im.cells.slice()};for(let k=0;k<7;k++)if(!w.done[k])o.cells.fill(im.colors.length,k*180,k*180+180);return o}
async function startDaily(){
  const id='daily-'+today();if(dayOf().b||store.get('gal',[]).some(g=>g.id===id)){toast('Das heutige Tagesbild hängt schon in deiner Galerie.');return}
  const dv=saves().find(s=>s.id===id);if(dv){resume(dv.sid);return}
  if(slotsFull())return;
  loader(true,'Tagesbild wird gebaut');await frame();const rng=mulberry32(hashStr(id)),puz=await build(compact(pixling(12,12,rng)),12,rng);
  A=null;newGame(puz,{mode:'art',name:'Tagesbild',diff:'normal',id});loader(false);
}
async function startSprint(){const id='sprint-'+today(),rng=mulberry32(hashStr(id));loader(true,'Sprint wird gebaut');await frame();
  const puz=await build(compact(dayNo()%2?mosaic(10,10,rng):pixling(10,10,rng)),12,rng);A=null;newGame(puz,{mode:'sprint',name:'Tages-Sprint',diff:'normal',id});loader(false);toast('Die Uhr läuft. Das Brett ist heute für alle gleich.',2600)}
async function startRule(){const r=ruleOf(),id='rule-'+today();if(dayOf().r){toast('Die Sonderregel von heute hast du schon geschafft.');return}
  const rng=mulberry32(hashStr(id)),L=SCENES.filter(s=>s.id!=='pixling'&&s.id!=='mosaik'),sc=L[hashStr(id)%L.length];loader(true,'Brett wird gebaut');await frame();
  const puz=await build(compact(sc.gen(r.size,rng)),DIFFS.find(d=>d.id===r.diff).max,rng);A=null;newGame(puz,{mode:'rule',rule:r.id,name:sc.name,diff:r.diff,id,motif:sc.id});
  if(r.id==='zeit')G.limit=Math.max(60,puz.rects.filter(q=>q.w*q.h>1).length*7);$('#gSub').textContent='Sonderregel: '+r.name;hud();loader(false);toast(r.desc,3200)}
async function startWeek(k){const w=weekState(),id=`week-${w.id}-${k}`;if(w.done[k]){toast('Dieser Streifen ist schon fertig.');return}if(k>dayIdx()){toast('Dieser Streifen kommt erst an seinem Wochentag dazu.');return}
  const sv=saves().find(s=>s.id===id);if(sv){resume(sv.sid);return}if(slotsFull())return;
  loader(true,'Streifen wird gebaut');await frame();const{im}=weekImage(),band=compact({W:30,H:6,colors:im.colors,cells:im.cells.slice(k*180,k*180+180)});
  const puz=await build(band,12,mulberry32(hashStr(id)));A=null;newGame(puz,{mode:'week',name:`Wochenbild, Teil ${k+1}`,diff:'normal',id,wk:k,wid:w.id});loader(false)}
function dailyWin(){const m=G.meta,d=today(),D=store.get('daily',{}),e=D[d]||(D[d]={}),was=e.b&&e.s&&e.r,st=ST();
  if(m.id==='daily-'+d)e.b=1;else if(m.mode==='sprint'){const t=Math.max(1,Math.round(G.time));e.s=e.s?Math.min(e.s,t):t;st.sprintBest=st.sprintBest?Math.min(st.sprintBest,t):t}else if(m.mode==='rule')e.r=1;
  else if(m.mode==='week'){const w=weekState();if(w.id===m.wid){w.done[m.wk]=1;store.set('week',w);if(w.done.every(Boolean)){st.weeks=(st.weeks||0)+1;const{im,name}=weekImage(),g=store.get('gal',[]);
      g.unshift({id:'week-'+w.id,name:'Wochenbild '+name,W:30,H:42,colors:im.colors,data:enc(im.cells),time:0,hints:0,diff:'normal',date:d});while(g.length>60)g.pop();while(!store.set('gal',g)&&g.length>1)g.pop()}}}
  if(!was&&e.b&&e.s&&e.r)st.allDaily=(st.allDaily||0)+1;
  const ks=Object.keys(D).sort();while(ks.length>40)delete D[ks.shift()];store.set('daily',D);store.set('stats',st)}
function openToday(){const e=dayOf(),r=ruleOf(),w=weekState(),ti=dayIdx(),bd=e.b||store.get('gal',[]).some(g=>g.id==='daily-'+today()),n=(bd?1:0)+(e.s?1:0)+(e.r?1:0),{name}=weekImage();
  const s=openSheet(`<div class="sh-head"><h2>Heute</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
  <p>${n===3?'Alle drei Tagesaufgaben sind geschafft.':`${n} von 3 Tagesaufgaben geschafft. Um Mitternacht gibt es neue.`}</p>
  <div class="svl"><button class="svo tk" id="tB"><i class="ck${bd?' on':''}">✓</i><span><b>Tagesbild</b><small>Ein Pixling in 12 × 12</small></span><em>${bd?'gelöst':'Start'}</em></button>
  <button class="svo tk" id="tS"><i class="ck${e.s?' on':''}">✓</i><span><b>Tages-Sprint</b><small>Ein Brett auf Zeit, heute für alle gleich</small></span><em>${e.s?fmt(e.s):'Start'}</em></button>
  <button class="svo tk" id="tR"><i class="ck${e.r?' on':''}">✓</i><span><b>Sonderregel: ${r.name}</b><small>${r.desc}</small></span><em>${e.r?'gelöst':'Start'}</em></button></div>
  <h3>Wochenbild<output>${w.done.filter(Boolean).length} von 7 Streifen</output></h3>
  <div class="wkrow"><canvas class="px" id="wkCv"></canvas><div><div class="wkd">${['Mo','Di','Mi','Do','Fr','Sa','So'].map((dn,k)=>`<button data-k="${k}" class="${w.done[k]?'on':k<=ti?'av':''}"${k>ti?' disabled':''}>${dn}</button>`).join('')}</div>
  <p style="margin-top:10px">Jeden Tag kommt ein Streifen dazu, von oben nach unten. Verpasste Tage holst du bis Sonntag nach.</p></div></div>`);
  paintImg(s.querySelector('#wkCv'),weekShown(w));
  s.querySelector('#tB').onclick=()=>{closeSheet();startDaily()};s.querySelector('#tS').onclick=()=>{closeSheet();startSprint()};s.querySelector('#tR').onclick=()=>{closeSheet();startRule()};
  s.querySelector('.wkd').onclick=ev=>{const b=ev.target.closest('[data-k]');if(b&&!b.disabled){if(!w.done[+b.dataset.k])closeSheet();startWeek(+b.dataset.k)}}}
function showDayWin(){if(!G||!G.won)return;const m=G.meta,p=G.puz,e=dayOf(),w=weekState(),sp=m.mode==='sprint',st=ST(),t=Math.round(G.time);
  const s=openSheet(`<div class="sh-head"><h2>${sp?'Sprint geschafft':m.name+' ist fertig'}</h2></div>${sp?`<div class="big">${fmt(t)}</div><p style="text-align:center">Deine beste Zeit heute: ${fmt(e.s||t)}. Deine beste Sprint-Zeit überhaupt: ${fmt(st.sprintBest||t)}.</p>`:
    `<canvas class="px art" id="winArt" style="max-height:36vh"></canvas><p style="text-align:center">${w.done.every(Boolean)?'Das Wochenbild ist vollständig und hängt jetzt in deiner Galerie.':`${w.done.filter(Boolean).length} von 7 Streifen sind gesetzt.`}</p>`}
  <div class="btns"><button class="ghost" id="dHome">Zur Übersicht</button><button class="primary" id="dMore">${sp?'Noch einmal':'Zu den Tagesaufgaben'}</button></div>`,true);
  if(!sp)paintImg(s.querySelector('#winArt'),weekShown(w)).style.aspectRatio='30/42';
  s.querySelector('#dHome').onclick=()=>{closeSheet();G=null;show('home')};s.querySelector('#dMore').onclick=()=>{closeSheet();G=null;show('home');sp?startSprint():openToday()}}
const MAXS=10,saves=()=>store.get('saves',[]);
{const old=store.get('save');if(old&&old.meta){const sid='s'+Date.now().toString(36);old.meta.sid=sid;if(store.set('sv.'+sid,old)){const ix=saves();ix.unshift({sid,name:old.meta.name,id:old.meta.id||null,W:old.W,H:old.H,pct:old.pct,time:old.time,at:Date.now(),thumb:old.thumb});store.set('saves',ix);store.del('save')}}}
function dropSave(sid){if(!sid)return;store.del('sv.'+sid);store.set('saves',saves().filter(s=>s.sid!==sid))}
function slotsFull(){if(saves().length<MAXS)return false;openSaves(true);return true}
function openSaves(full){const ix=saves();
  const s=openSheet(`<div class="sh-head"><h2>Angefangene Bilder</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div>
  <p>${full?`Alle ${MAXS} Speicherplätze sind belegt. Lösche ein Bild oder male eines fertig, dann ist wieder Platz für ein neues.`:`Jedes angefangene Bild behält seinen eigenen Platz, bis es fertig ist. ${ix.length} von ${MAXS} Plätzen sind belegt.`}</p><div class="svl" id="svl"></div>`),host=s.querySelector('#svl');
  if(!ix.length)host.innerHTML='<p>Gerade ist kein Bild angefangen.</p>';
  ix.forEach(e=>{const row=document.createElement('div');row.className='svi';
    row.innerHTML=`<button class="svo"><img class="px" alt="" src="${e.thumb}"><span><b></b><small>${e.W} × ${e.H}, ${e.pct} %, ${fmt(e.time)}</small></span></button><button class="ghost svd">Löschen</button>`;
    row.querySelector('b').textContent=e.name;row.querySelector('.svo').onclick=()=>{closeSheet();resume(e.sid)};
    const d=row.querySelector('.svd');let armed=false;d.onclick=()=>{if(!armed){armed=true;d.textContent='Sicher?';return}dropSave(e.sid);row.remove();refreshHome();if(!host.children.length)closeSheet()};host.append(row)})}
function resume(sid){const ix=saves(),e=sid?ix.find(s=>s.sid===sid):ix[0];if(!e)return;const sv=store.get('sv.'+e.sid);if(!sv){dropSave(e.sid);refreshHome();toast('Dieser Stand ließ sich nicht mehr lesen.');return}sv.meta.sid=e.sid;const rects=[];for(let i=0;i<sv.sol.length;i+=6)rects.push({x:sv.sol[i],y:sv.sol[i+1],w:sv.sol[i+2],h:sv.sol[i+3],cx:sv.sol[i+4],cy:sv.sol[i+5]});
  A=null;newGame({W:sv.W,H:sv.H,colors:sv.colors,cells:dec(sv.data),rects},sv.meta,sv)}

