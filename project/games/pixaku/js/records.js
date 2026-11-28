/* ---------- Rekorde und Erfolge ---------- */
function ST(){let st=store.get('stats',null);if(!st){const g=store.get('gal',[]);st={done:g.length,maxSize:g.reduce((a,x)=>Math.max(a,x.W,x.H),0)}}
  return Object.assign({done:0,blocks:0,maxSize:0,noHint:0,master:0,photo:0,pals:[],motifs:[],streak:0,streakBest:0,lastDaily:'',arcBoards:0},st)}
function recordWin(){const st=ST(),p=G.puz,m=G.meta,sz=Math.max(p.W,p.H);st.done++;st.blocks+=p.rects.filter(r=>r.w*r.h>1).length;st.maxSize=Math.max(st.maxSize,sz);
  if(!G.hints&&Math.min(p.W,p.H)>=16)st.noHint++;if(m.diff==='master')st.master++;if(m.motif==='upload')st.photo++;if(m.pal&&!st.pals.includes(m.pal))st.pals.push(m.pal);
  if(m.motif&&m.motif!=='upload'&&!st.motifs.includes(m.motif))st.motifs.push(m.motif);
  if(m.id&&m.id.startsWith('daily-')){const d=today(),y=new Date(Date.now()-864e5).toLocaleDateString('sv');if(st.lastDaily!==d){st.streak=st.lastDaily===y?st.streak+1:1;st.lastDaily=d;st.streakBest=Math.max(st.streakBest,st.streak)}}
  store.set('stats',st);if(!m.lv)setTimeout(checkAch,G.winDur+900)}
const ACH=[
 ['first','Erstes Licht','Ein Bild fertig malen',s=>[s.done,1]],['ten','Stammkundschaft','10 Bilder fertig malen',s=>[s.done,10]],['fifty','Volles Atelier','50 Bilder fertig malen',s=>[s.done,50]],
 ['b500','Blockleger','500 Blöcke in fertigen Bildern',s=>[s.blocks,500]],['b5k','Baumeister','5000 Blöcke in fertigen Bildern',s=>[s.blocks,5000]],
 ['free','Freihand','Ein Bild ab 16 × 16 ohne Tipp',s=>[s.noHint,1]],['s32','Großformat','Ein Bild ab 32 × 32',s=>[s.maxSize,32]],['s64','Wandbild','Ein Bild ab 64 × 64',s=>[s.maxSize,64]],['s100','Monument','Ein Bild ab 100 × 100',s=>[s.maxSize,100]],
 ['mast','Meisterstück','Ein Bild auf Meister',s=>[s.master,1]],['foto','Eigene Handschrift','Ein eigenes Foto fertig malen',s=>[s.photo,1]],
 ['pal','Farbenlehre','8 verschiedene Paletten benutzen',s=>[s.pals.length,8]],['mot','Sammlung','20 verschiedene Motive malen',s=>[s.motifs.length,20]],
 ['a2','Flinke Finger','2000 Punkte im Arcade',s=>[s.best,2000]],['a6','Hochbetrieb','6000 Punkte im Arcade',s=>[s.best,6000]],['a12','Rekordjagd','12000 Punkte im Arcade',s=>[s.best,12000]],['ab','Fließband','10 Bretter in einem Arcade-Lauf',s=>[s.arcBoards,10]],
 ['d3','Drei am Stück','Tagesbild an 3 Tagen in Folge',s=>[s.streakBest,3]],['d7','Wochenwerk','Tagesbild an 7 Tagen in Folge',s=>[s.streakBest,7]],['d30','Monatswerk','Tagesbild an 30 Tagen in Folge',s=>[s.streakBest,30]],
 ['w1','Lehrzeit','Die Werkstatt abschließen',s=>[s.w1?1:0,1]],['w3','Gesellenstück','Den Hafen abschließen',s=>[s.w3?1:0,1]],['w6','Meisterbrief','Die Sternwarte abschließen',s=>[s.w6?1:0,1]],
 ['day3','Tagewerk','Alle drei Tagesaufgaben an einem Tag',s=>[s.allDaily||0,1]],['spr','Sprinter','Den Tages-Sprint in höchstens 60 Sekunden',s=>[s.sprintBest&&s.sprintBest<=60?1:0,1]],['wk','Sieben Scheiben','Ein Wochenbild vollenden',s=>[s.weeks||0,1]],
 ['st50','Sternenfänger','50 Sterne in der Kampagne',s=>[s.stars,50]],['st108','Alle Lichter','Alle 108 Sterne der Kampagne',s=>[s.stars,108]],['perf','Makellos','Eine Welt mit 18 Sternen',s=>[s.perfect,1]]];
function achState(){const s=ST(),c=campGet();s.best=store.get('best',0);s.stars=campStars(c);s.worlds=WORLDS.filter((_,i)=>worldDone(i,c)).length;s.w1=worldDone(0,c);s.w3=worldDone(2,c);s.w6=worldDone(5,c);
  s.perfect=WORLDS.some((w,wi)=>w.lv.every((_,j)=>(c.lv[lvId(wi,j)]||{}).s===3))?1:0;return s}
function checkAch(){const s=achState(),got=store.get('ach',{}),fresh=[];for(const[id,name,,fn]of ACH){if(got[id])continue;const[a,b]=fn(s);if(a>=b){got[id]=today();fresh.push(name)}}
  if(!fresh.length)return;store.set('ach',got);fresh.forEach((n,i)=>setTimeout(()=>{toast('Erfolg freigeschaltet: '+n,2600);tone(784,.18,'triangle',.06);tone(1047,.3,'triangle',.06,.12)},i*2800))}
function renderAch(){const s=achState(),got=store.get('ach',{}),host=$('#achList');host.innerHTML='';$('#achCount').textContent=`${Object.keys(got).length} / ${ACH.length}`;
  $('#recs').innerHTML=[[s.done,'Bilder gemalt'],[s.blocks,'Blöcke gesetzt'],[s.maxSize?s.maxSize+'er':'0','Größtes Bild'],[s.best,'Arcade-Bestwert'],[s.streak+' / '+s.streakBest,'Serie, aktuell und beste'],['★ '+s.stars,'Kampagne']].map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
  [...ACH].sort((a,b)=>(got[b[0]]?1:0)-(got[a[0]]?1:0)).forEach(([id,name,desc,fn])=>{const[a,b]=fn(s),ok=!!got[id],d=document.createElement('div');d.className='glass ach'+(ok?' got':'');
    d.innerHTML=`<i class="ic">${I.trophy}</i><div><b>${name}</b><span>${desc}${ok?', erreicht am '+got[id].split('-').reverse().join('.'):b>1?` (${Math.min(a,b)} von ${b})`:''}</span>${ok||b<=1?'':`<div class="pb"><u style="width:${Math.min(100,a/b*100)}%"></u></div>`}</div>`;host.append(d)})}
