/* ---------- Kampagne ---------- */
const WORLDS=[
 {id:'w1',name:'Die Werkstatt',intro:'Der Sturm hat in einer einzigen Nacht jedes Fenster von Lumen zerschlagen. Meisterin Ilva drückt dir einen Glasschneider in die Hand und zeigt auf die kleinen Scheiben über der Werkbank. Mit denen fängt hier jeder an.',
  outro:'Die Werkstatt leuchtet wieder. Ilva nickt nur kurz, aber sie schließt dir das Tor zum Wintergarten auf.',lv:[['herz','easy'],['stern','easy'],['pilz','easy'],['kirschen','easy'],['krone','easy'],['diamant','easy']]},
 {id:'w2',name:'Der Wintergarten',intro:'Im Wintergarten liegen die Scherben zwischen den Beeten. Die Gärtnerin hat jede einzelne aufgehoben und nach Farben sortiert. Sie will ihre Blumenfenster zurück, bevor der Frost kommt.',
  outro:'Durch die neuen Scheiben fällt grünes Licht auf die Beete. Zum Dank verrät dir die Gärtnerin ihre Farbmischung.',lv:[['tulpe','easy'],['baum','easy'],['kaktus','normal'],['melone','normal'],['ente','normal'],['bogen','normal',12]]},
 {id:'w3',name:'Der Hafen',intro:'Am Hafen fehlen die Fenster des Leuchtturms, und die Fischer finden nachts kaum noch heim. Die Scheiben hier sind größer, als du es gewohnt bist. Ilva meint, das Meer verzeihe keine Eile.',
  outro:'Der Leuchtturm strahlt wieder über die Bucht. Die Fischer rufen dich jetzt beim Namen.',lv:[['fisch','normal'],['turm','normal',14],['palme','normal',16],['wellen','normal',16],['riff','normal',18],['sunset','normal',20]]},
 {id:'w4',name:'Das Hochland',intro:'Hinter dem Hafen steigt der Weg ins Hochland. In der Berghütte, am Rand der Wüste und unter dem Vulkan warten Fenster, die seit Jahren niemand angefasst hat. Hier oben arbeitest du zum ersten Mal ohne Ilva.',
  outro:'Vom Gipfel aus siehst du alle Lichter, die du schon zurückgebracht hast. Dunkel sind nur noch die Stadt und der Himmel darüber.',lv:[['gipfel','normal',20],['wueste','normal',20],['ballons','normal',22],['vulkan','hard',24],['polar','hard',24],['kacheln','hard',24]]},
 {id:'w5',name:'Die Neonstadt',intro:'In der Neonstadt hat der Sturm die Leuchtreklamen und die Scheiben der Hochhäuser erwischt. Die Leute hier mögen es grell. Ihre Fenster verraten ihre Farben erst, wenn ein Stück sitzt.',
  outro:'Die Straßen leuchten wieder in Pink und Blau. Auf dem höchsten Dach steht die Sternwarte, und ihre Kuppel ist noch dunkel.',lv:[['roboter','hard'],['ufo','hard'],['skyline','hard',24],['synth','hard',28],['skyline','hard',32,'synth'],['synth','hard',36,'neon80']]},
 {id:'w6',name:'Die Sternwarte',intro:'Die Kuppel der Sternwarte bestand aus den größten Scheiben der Stadt. Ilva sagt, an diese Fenster habe sie sich selbst nie getraut. Dann reicht sie dir ihr eigenes Werkzeug.',
  outro:'Die Kuppel ist geschlossen, und über Lumen stehen wieder alle Farben. Ilva hängt ein neues Schild an die Werkstatttür. Darauf steht jetzt auch dein Name.',lv:[['rakete','hard'],['planet','hard',28],['mandala','hard',32],['planet','master',40],['polar','master',40,'vapor'],['mandala','master',48,null,'Die große Kuppel']]}];
const campGet=()=>Object.assign({lv:{},seen:[]},store.get('camp',{}));
const lvId=(wi,j)=>WORLDS[wi].id+'-'+j,lvDef=id=>{const[w,j]=id.split('-'),wi=WORLDS.findIndex(x=>x.id===w),d=WORLDS[wi].lv[+j];return{wi,j:+j,motif:d[0],diff:d[1],size:d[2],pal:d[3],name:d[4]||nameOf(d[0])}};
const worldCount=(wi,c=campGet())=>WORLDS[wi].lv.filter((_,j)=>c.lv[lvId(wi,j)]).length;
const worldDone=(wi,c)=>wi>=0&&worldCount(wi,c)===WORLDS[wi].lv.length;
const worldOpen=(wi,c)=>wi===0||worldCount(wi-1,c)>=5;
const campStars=(c=campGet())=>Object.values(c.lv).reduce((a,v)=>a+v.s,0);
const starStr=n=>'★'.repeat(n)+'<i>'+'★'.repeat(3-n)+'</i>';
function lvImage(id){const d=lvDef(id),sp=SPRITES.find(s=>s.id===d.motif),base=sp?spriteImage(sp):compact(SCENES.find(s=>s.id===d.motif).gen(d.size,mulberry32(hashStr('lv'+id))));
  return applyPalette(base,d.pal?RAMPS.find(r=>r.id===d.pal).ramp:null)}
const MAPSC=[['kacheln',12],['bogen',22],['wellen',14],['gipfel',8],['skyline',22],['planet',14]],
  MAPPOS=[[[9,74],[27,36],[45,70],[62,30],[79,64],[92,28]],[[8,30],[26,68],[44,30],[61,70],[78,34],[92,66]]];
let campMove=null;
function drawMap(cv,wi,c){const[sc,r0]=MAPSC[wi],im=compact(SCENES.find(s=>s.id===sc).gen(64,mulberry32(hashStr('map'+wi)))),W=384,H=240,k=6,x=cv.getContext('2d'),tmp=document.createElement('canvas');
  cv.width=W;cv.height=H;paintImg(tmp,im);x.imageSmoothingEnabled=false;x.drawImage(tmp,0,r0,64,40,0,0,W,H);x.fillStyle='rgba(6,19,27,.42)';x.fillRect(0,0,W,H);
  const P=MAPPOS[wi%2].map(p=>[p[0]/100*W,p[1]/100*H]);
  for(let a=0;a<5;a++){const done=c.lv[lvId(wi,a)],[x0,y0]=P[a],[x1,y1]=P[a+1],n=Math.round(Math.hypot(x1-x0,y1-y0)/(k*2));
    for(let q=0;q<=n;q++){const px=Math.round((x0+(x1-x0)*q/n)/k)*k,py=Math.round((y0+(y1-y0)*q/n)/k)*k;x.fillStyle='rgba(6,19,27,.7)';x.fillRect(px-k/2-1,py-k/2-1,k+2,k+2);x.fillStyle=done?'#ffc857':'rgba(255,255,255,.75)';x.fillRect(px-k/2,py-k/2,k,k)}}}
function renderCamp(){const c=campGet(),host=$('#campList');host.innerHTML='';$('#campStars').innerHTML=`★ ${campStars(c)} / ${WORLDS.length*18}`;let focus=null;
  WORLDS.forEach((w,wi)=>{const open=worldOpen(wi,c),card=document.createElement('div'),n=worldCount(wi,c),st=w.lv.reduce((a,_,j)=>a+((c.lv[lvId(wi,j)]||{}).s||0),0),ramp=RAMPS.find(r=>r.lock===w.id);
    let cur=w.lv.findIndex((_,j)=>!c.lv[lvId(wi,j)]);const all=cur<0;if(all)cur=w.lv.length-1;const cd=lvDef(lvId(wi,cur));
    card.className='glass wcard'+(open?'':' locked');
    card.innerHTML=`<div class="wh"><h2>${wi+1}. ${w.name}</h2><b class="ws">${open?`★ ${st} / 18`:''}</b></div><p>${open?(all?w.outro:w.intro):`Verschlossen. Stelle in „${WORLDS[wi-1].name}“ fünf Fenster fertig.`}</p>
      ${open?`<div class="wmap"><canvas class="px"></canvas><i class="mk"></i></div><p>${all?`Alle sechs Fenster leuchten. Die Palette „${ramp.name}“ ist freigeschaltet.`:`Als Nächstes: Fenster ${cur+1}, ${cd.size?cd.size+' × '+cd.size:'kleines Motiv'}, ${DIFFS.find(x=>x.id===cd.diff).name}. Für alle sechs gibt es die Palette „${ramp.name}“.`}</p>`:''}`;
    if(open){const map=card.querySelector('.wmap'),P=MAPPOS[wi%2],mk=map.querySelector('.mk');drawMap(map.querySelector('canvas'),wi,c);
      w.lv.forEach((_,j)=>{const id=lvId(wi,j),d=lvDef(id),res=c.lv[id],can=j===0||c.lv[lvId(wi,j-1)],b=document.createElement('button');
        b.className='nd'+(can&&!res?' next':'');b.disabled=!can;b.style.left=P[j][0]+'%';b.style.top=P[j][1]+'%';b.setAttribute('aria-label',`Fenster ${j+1}${res?', '+d.name+', '+res.s+' Sterne':can?'':', verschlossen'}`);
        if(res){const cv=document.createElement('canvas');cv.className='px';paintImg(cv,lvImage(id));b.append(cv);b.insertAdjacentHTML('beforeend',`<span class="st">${starStr(res.s)}</span>`)}else b.innerHTML=can?String(j+1):I.lock;
        b.onclick=()=>startLevel(id);map.append(b)});
      const place=j=>{mk.style.left=P[j][0]+'%';mk.style.top=P[j][1]+'%'};
      if(campMove&&campMove.wi===wi&&campMove.from!==cur&&!reduce){place(campMove.from);requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>place(cur),350)))}else place(cur);
      if(!all&&!focus)focus=card}
    host.append(card)});
  if(campMove&&campMove.from===5&&host.children[campMove.wi+1])focus=host.children[campMove.wi+1];campMove=null;
  if(focus)setTimeout(()=>focus.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'}),80)}
async function startLevel(id){const d=lvDef(id),w=WORLDS[d.wi],c=campGet(),sv=saves().find(s=>s.id==='camp-'+id);
  if(sv){resume(sv.sid);return}
  if(!c.seen.includes(w.id)){c.seen.push(w.id);store.set('camp',c);
    openSheet(`<div class="sh-head"><h2>${d.wi+1}. ${w.name}</h2></div><p class="story">${w.intro}</p><button class="primary" id="stGo">An die Arbeit</button>`,true).querySelector('#stGo').onclick=()=>{closeSheet();startLevel(id)};return}
  if(slotsFull())return;
  loader(true,'Fenster wird vorbereitet');await frame();
  try{const puz=await build(lvImage(id),DIFFS.find(x=>x.id===d.diff).max,mulberry32(hashStr('pz'+id)));A=null;newGame(puz,{mode:'camp',name:d.name,diff:d.diff,id:'camp-'+id,lv:id,motif:d.motif})}
  catch(e){console.error(e);toast('Das Fenster ließ sich nicht aufbauen. Versuch es bitte noch einmal.')}
  loader(false)}
function showCampWin(){const id=G.meta.lv,d=lvDef(id),w=WORLDS[d.wi],p=G.puz,blocks=p.rects.filter(r=>r.w*r.h>1).length,par=Math.round(8+blocks*({easy:1.7,normal:2.3,hard:3,master:3.8}[d.diff]||2.3)),t=Math.round(G.time),
    s=!G.hints&&t<=par?3:G.hints<=1&&t<=par*2?2:1,c=campGet(),old=c.lv[id],before=worldDone(d.wi,c),openBefore=d.wi+1<WORLDS.length&&worldOpen(d.wi+1,c);
  if(!old||s>old.s||(s===old.s&&t<old.t))c.lv[id]={s,t,h:G.hints};store.set('camp',c);if(!old)campMove={wi:d.wi,from:d.j};
  const nowDone=worldDone(d.wi,c),ramp=RAMPS.find(r=>r.lock===w.id),nextId=d.j+1<w.lv.length?lvId(d.wi,d.j+1):(d.wi+1<WORLDS.length&&worldOpen(d.wi+1,c)?lvId(d.wi+1,0):null),opened=!openBefore&&d.wi+1<WORLDS.length&&worldOpen(d.wi+1,c);
  const sh=openSheet(`<div class="sh-head"><h2>${d.name}</h2></div><div class="stars">${starStr(s)}</div><canvas class="px art" id="winArt" style="max-height:26vh"></canvas>
  <div class="stats"><div><b>${fmt(t)}</b><span>Zeit, Ziel ${fmt(par)}</span></div><div><b>${blocks}</b><span>Blöcke</span></div><div><b>${G.hints}</b><span>Tipps</span></div></div>
  ${s<3?`<p style="text-align:center">Drei Sterne gibt es ohne Tipp in ${fmt(par)}, zwei mit höchstens einem Tipp in ${fmt(par*2)}.</p>`:''}
  ${nowDone&&!before?`<p class="story">${w.outro}</p><div class="reward"><i style="background:linear-gradient(90deg,${ramp.ramp.map((x,i)=>`${x} ${i/ramp.ramp.length*100}% ${(i+1)/ramp.ramp.length*100}%`).join(',')})"></i><span><b>Neue Palette: ${ramp.name}</b><small>Ab jetzt unter „Freies Bild“ wählbar.</small></span></div>`:''}
  ${opened?`<p style="text-align:center;color:var(--amber)">Neue Welt offen: ${WORLDS[d.wi+1].name}</p>`:''}
  <div class="btns"><button class="ghost" id="cMap">Zur Karte</button>${nextId?'<button class="primary" id="cNext">Nächstes Fenster</button>':''}</div>`,true);
  paintImg(sh.querySelector('#winArt'),p).style.aspectRatio=p.W+'/'+p.H;
  sh.querySelector('#cMap').onclick=()=>{closeSheet();G=null;show('camp')};const nx=sh.querySelector('#cNext');if(nx)nx.onclick=()=>{closeSheet();G=null;show('camp');startLevel(nextId)};
  setTimeout(checkAch,600)}
