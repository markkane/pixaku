/* ================= CORE: Zufall, Farben, Motive, Generator, Löser ================= */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const lumOf=h=>{const c=hex2rgb(h);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
function hsl(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return rgb2hex(f(0)*255,f(8)*255,f(4)*255)}
const mk=(W,H,colors)=>({W,H,colors:colors.slice(),cells:new Uint8Array(W*H)});

function compact(img){
  const used=new Map(),colors=[],cells=new Uint8Array(img.cells.length);
  for(let i=0;i<cells.length;i++){const h=img.colors[img.cells[i]];let k=used.get(h);if(k===undefined){k=colors.length;used.set(h,k);colors.push(h)}cells[i]=k}
  return{W:img.W,H:img.H,colors,cells};
}

const RAMPS=[
  {id:'orig',name:'Original',ramp:null},
  {id:'glut',name:'Abendglut',ramp:['#2d0a31','#7a1745','#c9324a','#f26b3a','#fbb13c','#fff1b8']},
  {id:'lagune',name:'Lagune',ramp:['#06283d','#0b5d8a','#1594c4','#3fc5d8','#8fe8dc','#effcf4']},
  {id:'moos',name:'Moos',ramp:['#10231c','#1f4d38','#3c7d4c','#7fb35a','#c9d971','#f6f3c2']},
  {id:'bonbon',name:'Bonbon',ramp:['#5b3a8c','#9b6bd6','#f08ac0','#ffb38a','#ffe08a','#f7fff0']},
  {id:'neon',name:'Neon',ramp:['#0d0221','#3d0e61','#b5179e','#f72585','#4cc9f0','#f8f9fa']},
  {id:'lcd',name:'Retro-LCD',ramp:['#0f380f','#306230','#8bac0f','#c4dc5a']},
  {id:'tinte',name:'Tinte',ramp:['#111318','#3a3f4b','#6b7280','#a3aab8','#d6dbe4','#ffffff']},
  {id:'synth',name:'Synthwave',ramp:['#12002b','#3a0ca3','#7209b7','#f72585','#ff9e00','#ffe66d']},
  {id:'neon80',name:'Neon 80er',ramp:['#0a0a23','#2b00a6','#ff00a8','#00e5ff','#f9f002','#ffffff']},
  {id:'miami',name:'Miami',ramp:['#1b1035','#5f2a84','#ff5fa2','#ff9a8b','#7df9e9','#fdfcdc']},
  {id:'vapor',name:'Vaporwave',ramp:['#2d1b69','#7b5ea7','#f06292','#ffb3ba','#a0e7e5','#fbf8cc']},
  {id:'sepia',name:'Sepia',ramp:['#2b1d0e','#5c4326','#8c6b43','#b9966b','#dcc59f','#f5ecd7']},
  {id:'fade',name:'Verblasst',ramp:['#3b3a4a','#6b6a7b','#9a8f97','#c9b8a8','#e6d5b8','#f7efdf']},
  {id:'gold',name:'Goldstunde',ramp:['#3d1c02','#8a3b12','#d9661f','#f6a94a','#fbd38d','#fff6e0']},
  {id:'kuehl',name:'Kühl',ramp:['#0f1c2e','#1f3a5f','#4d7ea8','#8fb8d9','#cfe3ef','#f6fbff']},
  {id:'bluete',name:'Kirschblüte',ramp:['#3d0c2b','#7b2d5b','#c8558a','#f08db3','#f9c6d6','#fff0f3']},
  {id:'plakat',name:'Plakat',ramp:['#14213d','#e63946','#f1faee']},
  {id:'cw1',name:'Werkstattglas',lock:'w1',ramp:['#1b1f3b','#3d5a80','#ee6c4d','#98c1d9','#ffd166','#fdf0d5']},
  {id:'cw2',name:'Gartenlicht',lock:'w2',ramp:['#1b3a2b','#386641','#6a994e','#f28482','#f2e8cf','#fffcf2']},
  {id:'cw3',name:'Hafenblau',lock:'w3',ramp:['#0b132b','#1c2541','#3a506b','#5bc0be','#f4d58d','#fdfcdc']},
  {id:'cw4',name:'Glutstein',lock:'w4',ramp:['#1a0f0a','#5c1a1b','#9d0208','#e85d04','#faa307','#ffeda0']},
  {id:'cw5',name:'Neonnacht',lock:'w5',ramp:['#0b0221','#240046','#ff006e','#7b2cbf','#3a86ff','#fffb00']},
  {id:'cw6',name:'Sternenstaub',lock:'w6',ramp:['#03071e','#22223b','#4a4e69','#9a8c98','#c9ada7','#f2e9e4']},
];
function applyPalette(img,ramp){
  if(!ramp)return compact(img);
  const n=img.colors.length,m=ramp.length;
  const order=[...Array(n).keys()].sort((a,b)=>lumOf(img.colors[a])-lumOf(img.colors[b]));
  const map=new Uint8Array(n);
  order.forEach((ci,rank)=>{map[ci]=n===1?(m>>1):n<=m?Math.round(rank*(m-1)/(n-1)):Math.min(m-1,Math.floor(rank*m/n))});
  const cells=new Uint8Array(img.cells.length);
  for(let i=0;i<cells.length;i++)cells[i]=map[img.cells[i]];
  return compact({W:img.W,H:img.H,colors:ramp,cells});
}

/* ---------- Handgesetzte Motive ---------- */
const SPRITES=[
 {id:'smiley',name:'Smiley',pal:{'.':'#3a2a6b',y:'#ffd23f',k:'#1b1b1b'},rows:[
  '..yyyy..','.yyyyyy.','yykyykyy','yykyykyy','yyyyyyyy','ykyyyyky','.ykkkky.','..yyyy..']},
 {id:'herz',name:'Herz',pal:{'.':'#1d1b3a',r:'#ff4d6d',d:'#c9184a',w:'#ffd6e0'},rows:[
  '.........','.rr...rr.','rwrr.rrrr','rwrrrrrrd','rrrrrrrrd','.rrrrrrd.','..rrrrd..','...rrd...','....d....']},
 {id:'pilz',name:'Pilz',pal:{'.':'#16324a',r:'#e63946',w:'#fff4e0',c:'#f1dcb8',d:'#c9a97c',g:'#3fa34d'},rows:[
  '..........','...rrrr...','..rrwwrr..','.rwrwwrrr.','.rrrrrrwr.','.rrwrrrrr.','..dccccd..','...cccc...','...cccc...','gggggggggg']},
 {id:'diamant',name:'Diamant',pal:{'.':'#1a1433',c:'#4cc9f0',l:'#c4f3ff',d:'#1a8fc4',k:'#0f5e8c'},rows:[
  '..lllllll..','.lcclllccd.','lccclllcccd','.dccclcddk.','..dcclddk..','...dcldk...','....dlk....','.....k.....']},
 {id:'rakete',name:'Rakete',pal:{'.':'#141433',w:'#e8ecf4',r:'#ff4d6d',b:'#4cc9f0',g:'#a9b4c8',f:'#ffb703',y:'#ffe566'},rows:[
  '....rr....','...rrrr...','...wwwg...','..wwwwwg..','..wbbwwg..','..wbbwwg..','..wwwwwg..','.rwwwwwgr.','rrwwwwwgrr','rr.ffff.rr','...fyyf...','....ff....']},
 {id:'kaktus',name:'Kaktus',pal:{'.':'#f4e9cd',g:'#52b788',d:'#2d6a4f',p:'#e07a5f',q:'#b5543c',f:'#ff5d8f'},rows:[
  '....f.....','...ggg....','...ggd....','.g.ggd....','.g.ggd.g..','.ggggd.g..','...ggddg..','...ggd....','...ggd....','..pppppp..','...pppq...','...pppq...']},
 {id:'katze',name:'Katze',pal:{'.':'#26355d',o:'#f4a259',d:'#b86b2c',w:'#fff4e0',k:'#1b1b1b',p:'#ff8fab'},rows:[
  '.oo......oo.','.opo....opo.','.oooooooooo.','oooodoodoooo','ookkooookkoo','ookkooookkoo','ooowwppwwooo','.oowwwwwwoo.','..oowwwwoo..','............']},
 {id:'ente',name:'Ente',pal:{'.':'#1f5673',y:'#ffd23f',o:'#ff7b00',k:'#1b1b1b',s:'#e0a800',w:'#7cc6de'},rows:[
  '............','...yyyy.....','..yyyyyy....','..yykyyyoo..','..yyyyyyooo.','..yyyyyy....','yy.yyyyyyy..','yyyyyyyyyyy.','ysyyyyyyyyy.','.sssyyyyys..','wwwwwwwwwwww']},
 {id:'baum',name:'Baum',pal:{'.':'#9bd4f5',g:'#3fa34d',l:'#7bd389',d:'#1f6f3a',t:'#8b5a2b',e:'#5c9e4a'},rows:[
  '...gggg...','..gglggg..','.ggllgggd.','ggllggggdd','gglgggggdd','gggggggddd','.gggggddd.','..ggdddd..','....tt....','....tt....','....tt....','eeeeeeeeee']}, {id:'kirschen',name:'Kirschen',pal:{'.':'#1b2a41',r:'#e63946',d:'#a4161a',w:'#ffd6d9',g:'#52b788',b:'#7f5539'},rows:[
  '......gg..','.....bgg..','....b.b...','...b...b..','..b....b..','.rrr..rrr.','rwrr.rwrrd','rrrr.rrrrd','rrrd.rrrdd','.dd...ddd.']},
 {id:'krone',name:'Krone',pal:{'.':'#2b1b3d',y:'#ffd23f',o:'#f4a020',r:'#e63946',b:'#4cc9f0'},rows:[
  '............','.y...yy...y.','.y...yy...y.','.yy.yyyy.yy.','.yyyyyyyyyy.','.yryybbyyry.','.yyyyyyyyyy.','.oooooooooo.','............']},
 {id:'schwert',name:'Schwert',pal:{'.':'#1f2937',s:'#dfe7ef',h:'#9aa7b5',g:'#ffd23f',b:'#8b5a2b',r:'#e63946'},rows:[
  '...s...','..ssh..','..ssh..','..ssh..','..ssh..','..ssh..','..ssh..','..ssh..','..ssh..','ggggggg','..bbb..','..bbb..','..bbb..','...r...']},
 {id:'trank',name:'Zaubertrank',pal:{'.':'#231942',g:'#cfe8ff',p:'#b5179e',l:'#f72585',c:'#b08968',w:'#ffffff'},rows:[
  '...cccc...','...cccc...','...gggg...','...g..g...','..gg..gg..','.gg....gg.','.glllllpg.','gllwlllppg','gllllllppg','gplllllppg','.gppppppg.','..gggggg..']},
 {id:'schaedel',name:'Totenkopf',pal:{'.':'#14213d',w:'#f1f1e6',s:'#c9c9b8',k:'#0b0b12'},rows:[
  '..wwwwww..','.wwwwwwww.','wwwwwwwwws','wkkwwwkkws','wkkwwwkkws','wwwwkwwwws','.wwwwwwws.','..wkwkwk..','..wwwwws..','..........']},
 {id:'stern',name:'Stern',pal:{'.':'#10002b',y:'#ffd23f',o:'#f4a020',w:'#fff3b0'},rows:[
  '.....y.....','.....y.....','....yyy....','....ywy....','yyyyywyyyyy','.yywwwyyoo.','..yyyyyoo..','..yyyyyoo..','.yyyy.yooo.','.yy.....oo.','...........']},
 {id:'haus',name:'Haus',pal:{'.':'#8ecae6',r:'#c1121f',d:'#780000',w:'#fefae0',b:'#7f5539',g:'#219ebc',e:'#588157',c:'#6c757d'},rows:[
  '........cc..','.....rr.cc..','....rrrrcc..','...rrrrrrd..','..rrrrrrrrd.','.rrrrrrrrrrd','..wwwwwwww..','..wggwwbbw..','..wggwwbbw..','..wwwwwbbw..','eeeeeeeeeeee']},
 {id:'fisch',name:'Fisch',pal:{'.':'#023e8a',o:'#ff9f1c',y:'#ffbf69',w:'#ffffff',k:'#0b0b12',d:'#e76f51'},rows:[
  '............','...oooo.....','d.oooooooo..','ddooyoooowko','ddoyyyooooo.','d.oooooooo..','...oooo.....','............']},
 {id:'tulpe',name:'Tulpe',pal:{'.':'#e9f5db',r:'#e5383b',p:'#ff758f',g:'#2d6a4f',l:'#52b788'},rows:[
  '.........','.r..r..r.','.rr.r.rr.','.rrrrrrr.','.rprrrrr.','.rprrrrr.','..rrrrr..','....g....','.l..g..l.','.ll.g.ll.','..llgll..','....g....']},
 {id:'roboter',name:'Roboter',pal:{'.':'#264653',m:'#adb5bd',d:'#6c757d',y:'#ffd23f',r:'#e63946',k:'#1b1b1b'},rows:[
  '....rr....','....dd....','.mmmmmmmm.','.myymmyym.','.myymmyym.','dmmmmmmmmd','dmkkkkkkmd','.mmmmmmmm.','..dd..dd..','..........']},
 {id:'melone',name:'Melone',pal:{'.':'#f1faee',g:'#2d6a4f',l:'#95d5b2',r:'#e63946',k:'#1b1b1b'},rows:[
  '............','gggggggggggg','llllllllllll','.rrkrrrrkrr.','.rrrrkrrrrr.','..rrkrrrkr..','...rrrrrr...','.....rr.....']},
 {id:'pinguin',name:'Pinguin',pal:{'.':'#a8dadc',k:'#1d3557',w:'#f1faee',o:'#f4a261'},rows:[
  '...kkkk...','..kkkkkk..','..kwkkwk..','..kkookk..','.kkwwwwkk.','.kwwwwwwk.','kkwwwwwwkk','kkwwwwwwkk','.kwwwwwwk.','.kkwwwwkk.','..kkkkkk..','..oo..oo..']},
 {id:'ufo',name:'Ufo',pal:{'.':'#0b132b',g:'#5bc0be',m:'#c0c7d1',d:'#7d8597',y:'#ffd23f',b:'#fff3b0'},rows:[
  '....gggg....','...gggggg...','.mmmmmmmmmm.','mymmymmymmym','.dddddddddd.','....bbbb....','...bbbbbb...','..bbbbbbbb..']},
];
function spriteImage(sp){
  const H=sp.rows.length,W=sp.rows[0].length,keys=Object.keys(sp.pal),im=mk(W,H,keys.map(k=>sp.pal[k]));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)im.cells[y*W+x]=keys.indexOf(sp.rows[y][x]);
  return im;
}

/* ---------- Prozedurale Szenen (beliebige Größe) ---------- */
function sceneSunset(S,rng){
  const im=mk(S,S,['#2b1055','#6a1b7a','#c2337a','#f2644b','#fba949','#ffe08a','#fff6d6','#3a1c5c','#1c0f33','#35307a','#231a5c']);
  const hz=Math.round(S*.62),cx=S*(.3+rng()*.4),cy=hz-S*.06,R=S*.17,p1=rng()*6.28,p2=rng()*6.28,p3=rng()*6.28;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c;
    if(y<hz){c=Math.min(4,Math.floor(y/hz*5));
      const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<R)c=d<R*.55?6:5;
      if(y>=hz-S*(.10+.06*Math.sin(x/S*7+p1)+.03*Math.sin(x/S*17+p2)))c=7;
      if(y>=hz-S*(.04+.04*Math.sin(x/S*5+p3)+.02*Math.sin(x/S*23+p1)))c=8;
    }else{const dy=y-hz;c=dy<(S-hz)*.45?9:10;
      if(dy%2===1&&Math.abs(x+.5-cx)<R*(1-dy/(S-hz))*.9)c=4}
    im.cells[y*S+x]=c}
  return im;
}
function scenePlanet(S,rng){
  const im=mk(S,S,['#0b0b24','#ffffff','#8fa3ff','#f4a261','#e76f51','#e9c46a','#c8553d','#7a2e2a','#e8d9b5','#a8946c','#c8d0e0','#7d869c']);
  const cx=S/2,cy=S*.53,R=S*.27,ph=rng()*6.28,ca=Math.cos(-.38),sa=Math.sin(-.38),mx=S*.18,my=S*.19,mr=Math.max(1.3,S*.07);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=0;const r=rng();if(r<.02)c=r<.013?1:2;
    const dm=Math.hypot(x+.5-mx,y+.5-my);if(dm<mr)c=(x+.5-mx)+(y+.5-my)>mr*.35?11:10;
    const dx=x+.5-cx,dy=y+.5-cy,inP=dx*dx+dy*dy<R*R,u=dx*ca+dy*sa,v=-dx*sa+dy*ca,e=(u/(1.8*R))**2+(v/(.45*R))**2;
    if(inP){const b=Math.floor((dy/R+1)*3+.45*Math.sin(dx/R*3+ph));c=3+((b%4)+4)%4;if(dx*.8+dy*.6>R*.55)c=7}
    if(e<1&&e>.5&&(!inP||v>0))c=e>.8?9:8;
    im.cells[y*S+x]=c}
  return im;
}
function sceneSkyline(S,rng){
  const im=mk(S,S,['#0d1b3e','#172a5e','#2a4585','#fdf6c9','#dfe7ff','#070b18','#0e1630','#1b2850','#ffd166','#ff9f6b','#04060d']);
  const mx=S*(.2+rng()*.6),my=S*.2,mr=Math.max(1.5,S*.09);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=Math.min(2,Math.floor(y/S*3.4));
    if(y<S*.5&&rng()<.016)c=4;if(Math.hypot(x+.5-mx,y+.5-my)<mr)c=3;im.cells[y*S+x]=c}
  const layer=(cols,hMin,hVar,wMin,wMax)=>{let x=0,i=0;while(x<S){
    const w=Math.max(2,Math.round(S*(wMin+rng()*(wMax-wMin)))),h=Math.round(S*(hMin+rng()*hVar)),top=S-h,col=cols[i++%cols.length];
    for(let yy=top;yy<S;yy++)for(let xx=x;xx<Math.min(S,x+w);xx++){let c=col;
      if(S>=12&&(xx-x)%2===1&&(yy-top)%2===1&&xx<x+w-1&&yy<S-2&&rng()<.4)c=rng()<.75?8:9;
      im.cells[yy*S+xx]=c}
    x+=w}};
  layer([7],.34,.34,.08,.18);layer([5,6],.14,.3,.07,.16);
  for(let x=0;x<S;x++)im.cells[(S-1)*S+x]=10;
  return im;
}
function sceneMandala(S,rng){
  const pool=['#e63946','#f4a261','#ffd166','#2a9d8f','#4cc9f0','#b5179e','#f7f1e3'];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const im=mk(S,S,['#141433',...pool.slice(0,5)]),c0=(S-1)/2;
  const rings=Math.max(2,Math.min(3+Math.floor(rng()*4),S/4)),amp=.6+rng()*.9,k=1+Math.floor(rng()*3),f=1+Math.floor(rng()*3);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=Math.abs(x-c0),dy=Math.abs(y-c0),a=Math.max(dx,dy),b=Math.min(dx,dy),r=Math.hypot(a,b)/(S/2);
    if(r>.99){im.cells[y*S+x]=0;continue}
    const t=Math.atan2(b,a)/(Math.PI/4),v=Math.floor(r*rings+amp*Math.cos(t*Math.PI*k)*Math.sin(r*Math.PI*f));
    im.cells[y*S+x]=1+((v%5)+5)%5}
  return im;
}
const _put=(im,S,x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<S&&y<S)im.cells[y*S+x]=c};
const _blob=(im,S,cx,cy,rx,ry,c,c2)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)_put(im,S,x,y,c2!==undefined&&y+.5>cy+ry*.35?c2:c)};
function sceneSynth(S,rng){
  const im=mk(S,S,['#12002b','#2a0a4a','#5a1a7a','#a3247a','#ffd23f','#ff8c42','#ff3c8e','#0d0221','#ff2bd6','#1b0b3a','#ffffff']);
  const hz=Math.round(S*.58),cx=S/2,cy=hz-S*.04,R=S*.26,per=Math.max(2,Math.round(S*.055)),gap=Math.max(1,Math.round(per*.35)),p=rng()*6.28,rows=new Set();
  const nr=S<16?2:S<48?4:7,nv=S<16?0:S<48?3:7;for(let j=0;j<=nr;j++)rows.add(hz+Math.round((S-hz)*Math.pow(j/nr,1.9)));
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c;
    if(y<hz){c=Math.min(3,Math.floor(y/hz*4));if(y<hz*.6&&rng()<.012)c=10;
      const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<R&&!(y>cy-R*.15&&((y-Math.round(cy))%per+per)%per<gap)){const t=(y-(cy-R))/(2*R);c=t<.38?4:t<.68?5:6}
      if(y>=hz-S*(.03+.07*Math.abs(Math.sin(x/S*8+p)))&&Math.abs(x+.5-cx)>R*.75)c=9}
    else{c=7;if(rows.has(y))c=8;const t=(y-hz+1)/(S-hz);for(let i=-nv;i<=nv;i++)if(Math.abs(x+.5-(cx+i*S*(nv<7?.3:.16)*(t+.12)))<.5)c=8}
    im.cells[y*S+x]=c}
  return im;
}
function scenePalm(S,rng){
  const im=mk(S,S,['#3a1c71','#d76d77','#ffaf7b','#ffe29a','#fff3c4','#1d6fa3','#2a9fd6','#f2d6a2','#7f5539','#2d6a4f','#52b788']);
  const hz=Math.round(S*.6),sx=S*(.62+rng()*.2);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=y<hz?Math.min(3,Math.floor(y/hz*4)):(y-hz<(S-hz)*.45?6:5);if(y<hz&&Math.hypot(x+.5-sx,y+.5-(hz-S*.03))<S*.12)c=4;im.cells[y*S+x]=c}
  _blob(im,S,S*.34,S*.93,S*.42,S*.13,7);
  const bx=S*.3,by=S*.84,tx=S*.42,ty=S*.36,th=Math.max(1,S*.035);
  for(let t=0;t<=1;t+=.5/S){const x=bx+(tx-bx)*t+S*.05*Math.sin(t*3.14),y=by+(ty-by)*t;for(let a=-th/2;a<=th/2;a+=.5)_put(im,S,x+a,y,8)}
  [-2.75,-2.1,-1.35,-.6,.1,.55].forEach((a,i)=>{const L=S*(.24+.05*(i%2));for(let d=0;d<=L;d+=.4){const w=Math.max(.6,S*.04*(1-d/L)+.5);for(let q=-w/2;q<=w/2;q+=.5)_put(im,S,tx+Math.cos(a)*d,ty+Math.sin(a)*d+(d/L)**2*S*.13+q,9+i%2)}});
  return im;
}
function sceneGipfel(S,rng){
  const im=mk(S,S,['#4ea8de','#74c0e8','#a8dcf0','#ffffff','#6c757d','#495057','#2d6a4f','#1b4332','#48cae4','#0096c7','#ffe066']);
  const pk=[[.3+rng()*.08,.2,1.05],[.64+rng()*.06,.3,1.1],[.88,.42,1.2],[.08,.44,1.2]].sort((a,b)=>a[1]-b[1]);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=Math.min(2,Math.floor(y/(S*.75)*3));if(Math.hypot(x+.5-S*.82,y+.5-S*.13)<S*.075)c=10;
    if(y<S*.74)for(const[px,py,sl]of pk){const dx=x+.5-px*S,dy=y+.5-py*S;if(dy>=0&&Math.abs(dx)<=dy*sl+.5)c=dy<S*.09+(Math.abs(Math.round(dx))%3?0:S*.03)?3:dx>0?5:4}
    if(y>=S*.7-((x%3)===1?S*.05:(x%3)===0?S*.02:0))c=(x+((y/2)|0))%2?6:7;
    if(y>=S*.8)c=y<S*.9?8:9;
    im.cells[y*S+x]=c}
  return im;
}
function sceneLeuchtturm(S,rng){
  const im=mk(S,S,['#0b1d3a','#12305c','#1d4a85','#ffffff','#fdf6c9','#0a2a4a','#1f5f8b','#2b2d42','#f1faee','#e63946','#ffd23f','#fff3b0','#1b1b2f']);
  const hz=Math.round(S*.7),lx=S*.62,ly=S*.32,t0=S*.36;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c;
    if(y<hz){c=Math.min(2,Math.floor(y/hz*3));if(rng()<.014)c=3;if(Math.hypot(x+.5-S*.18,y+.5-S*.16)<Math.max(1.3,S*.07))c=4;
      if(x+.5<lx&&Math.abs(y+.5-ly)<(lx-x)*.2)c=11}
    else c=(y-hz)%2===1&&(x+y*3)%7<3?6:5;
    im.cells[y*S+x]=c}
  _blob(im,S,lx,hz+S*.03,S*.22,S*.08,7);
  for(let y=Math.floor(S*.22);y<hz+S*.02;y++)for(let x=0;x<S;x++){const dx=Math.abs(x+.5-lx);
    if(y<S*.28){if(dx<(y-S*.22)*.9+.7)im.cells[y*S+x]=12}
    else if(y<t0){if(dx<Math.max(1,S*.05))im.cells[y*S+x]=10}
    else if(dx<S*(.045+.045*(y-t0)/(hz-t0)))im.cells[y*S+x]=Math.floor((y-t0)/Math.max(1,S*.085))%2?8:9}
  return im;
}
function sceneRegenbogen(S,rng){
  const im=mk(S,S,['#90e0ef','#caf0f8','#ffffff','#dbe7f0','#e63946','#f77f00','#ffd23f','#52b788','#4361ee','#7b2cbf','#74c69d','#40916c']);
  const cx=S/2,cy=S*.82,R=S*.47,bw=Math.max(1,S*.047),p=rng()*6.28,p2=rng()*6.28;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=y<S*.5?0:1;const d=Math.hypot(x+.5-cx,y+.5-cy),i=Math.floor((R-d)/bw);if(i>=0&&i<6&&y<cy)c=4+i;
    if(y>=S*.8-S*.06*Math.sin(x/S*4+p))c=10;if(y>=S*.9-S*.04*Math.sin(x/S*6+p2))c=11;im.cells[y*S+x]=c}
  for(const bx of[.1,.9])for(const[ox,oy,r]of[[-.06,0,.07],[0,-.04,.09],[.07,0,.07]])_blob(im,S,S*(bx+ox),S*(.78+oy),S*r,S*r,2,3);
  return im;
}
function sceneRiff(S,rng){
  const im=mk(S,S,['#03045e','#023e8a','#0077b6','#0096c7','#e9c46a','#d4a373','#2d6a4f','#52b788','#ff9f1c','#f72585','#caf0f8','#ff6b6b']);
  const p=rng()*6.28;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=3-Math.min(3,Math.floor(y/(S*.86)*4));if(y<S*.8&&rng()<.006)c=10;im.cells[y*S+x]=c}
  for(let i=0,n=2+Math.floor(S/12);i<n;i++){const fx=S*(.12+rng()*.76),fy=S*(.1+rng()*.6),L=Math.max(3,S*.1),dir=rng()<.5?1:-1,col=8+i%2;
    _blob(im,S,fx,fy,L/2,Math.max(1,L/3.2),col);for(let d=1;d<=L/2.4;d++)for(let q=-d;q<=d;q++)_put(im,S,fx-dir*(L/2+d-.5),fy+q*.8,col);_put(im,S,fx+dir*L*.25,fy-L*.08,0)}
  for(let i=0,n=2+Math.floor(S/20);i<n;i++)_blob(im,S,S*(.1+rng()*.8),S*.86,S*.05,S*.045,11);
  for(let i=0,n=3+Math.floor(S/14);i<n;i++){const x0=S*(.05+rng()*.9),h=S*(.14+rng()*.22),ph=rng()*6;for(let k=0;k<h;k++)_put(im,S,x0+Math.sin(k/2.2+ph)*Math.max(1,S*.02),S*.9-k,6+(k%2))}
  for(let y=Math.floor(S*.8);y<S;y++)for(let x=0;x<S;x++){if(y>=S*.87+S*.03*Math.sin(x/S*8+p))im.cells[y*S+x]=4;if(y>=S*.95)im.cells[y*S+x]=5}
  return im;
}
function sceneWueste(S,rng){
  const im=mk(S,S,['#ff7b00','#ff9500','#ffb700','#ffd000','#fff3b0','#e09f3e','#c77d2b','#9e5a1c','#386641','#1f3d2a']);
  const p1=rng()*6.28,p2=rng()*6.28,p3=rng()*6.28,cx=Math.round(S*(.6+rng()*.2)),t=Math.max(1,Math.round(S*.05));
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=Math.min(3,Math.floor(y/(S*.6)*4));if(Math.hypot(x+.5-S*.28,y+.5-S*.28)<S*.1)c=4;
    if(y>=S*.55-S*.06*Math.sin(x/S*5+p1))c=5;if(y>=S*.68-S*.07*Math.sin(x/S*3.3+p2))c=6;if(y>=S*.84-S*.05*Math.sin(x/S*4.4+p3))c=7;im.cells[y*S+x]=c}
  const bar=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)_put(im,S,x,y,x===x0+w-1&&w>1?9:8)};
  bar(cx,Math.round(S*.42),t,Math.round(S*.38));
  if(S>=10){bar(cx-2*t,Math.round(S*.6),2*t,t);bar(cx-2*t,Math.round(S*.5),t,Math.round(S*.1));bar(cx+t,Math.round(S*.66),2*t,t);bar(cx+2*t,Math.round(S*.55),t,Math.round(S*.11))}
  return im;
}
function sceneVulkan(S,rng){
  const im=mk(S,S,['#10002b','#240046','#3c096c','#6c757d','#495057','#2b2118','#463a2c','#ff4800','#ffb703','#9d0208','#1b140e']);
  const cx=S*(.45+rng()*.1),top=S*.38;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=Math.min(2,Math.floor(y/(S*.9)*3));const dx=x+.5-cx;
    if(y>=S*.3&&y<top&&Math.abs(dx)<S*.1)c=9;
    if(y>=top){const hw=S*.08+(y-top)*.95;if(Math.abs(dx)<hw)c=dx>hw*.3?6:5;if(y<top+Math.max(1,S*.04)&&Math.abs(dx)<S*.07)c=8}
    if(y>=S*.88)c=10;im.cells[y*S+x]=c}
  for(let i=0;i<3;i++){const off=(i-1)*S*.06,ph=rng()*6,end=S*(.58+rng()*.26),w=Math.max(1,S*.03);
    for(let y=top;y<end;y+=.5)for(let q=-w/2;q<=w/2;q+=.5)_put(im,S,cx+off*(1+(y-top)/S*2.2)+S*.02*Math.sin(y/S*16+ph)+q,y,w>=3&&Math.abs(q)<w*.25?8:7)}
  for(let i=0;i<4;i++)_blob(im,S,cx+S*.06*i,S*.27-S*.075*i,S*(.07+.018*i),S*(.06+.014*i),3,4);
  return im;
}
function scenePolarlicht(S,rng){
  const im=mk(S,S,['#03071e','#0b132b','#1c2541','#ffffff','#80ffdb','#48bfe3','#7400b8','#e0fbfc','#98c1d9','#0b2b26']);
  const ph=[rng()*6,rng()*6,rng()*6],p=rng()*6.28,p2=rng()*6.28;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=Math.min(2,Math.floor(y/(S*.75)*3));if(rng()<.014)c=3;
    for(let r=2;r>=0;r--){const yc=S*(.14+.12*r)+S*.06*Math.sin(x/S*(5+r)+ph[r]);if(y>=yc&&y<yc+S*.05+S*.07*(.5+.5*Math.sin(x*1.7+r*2)))c=4+r}
    im.cells[y*S+x]=c}
  const hill=x=>S*.72-S*.05*Math.sin(x/S*4+p);
  for(let i=0,n=3+Math.floor(S/9);i<n;i++){const x0=Math.round(S*(.04+rng()*.92)),h=S*(.12+rng()*.12),b=hill(x0)+1;for(let d=0;d<=h;d++)for(let q=-d*.38;q<=d*.38;q+=.5)_put(im,S,x0+q,b-h+d,9)}
  for(let y=Math.floor(S*.6);y<S;y++)for(let x=0;x<S;x++){if(y>=hill(x))im.cells[y*S+x]=7;if(y>=S*.87-S*.03*Math.sin(x/S*7+p2))im.cells[y*S+x]=8}
  return im;
}
function sceneBallons(S,rng){
  const im=mk(S,S,['#48cae4','#90e0ef','#caf0f8','#ffffff','#e63946','#ffd23f','#7b2cbf','#f77f00','#2a9d8f','#7f5539','#74c69d']);
  const p=rng()*6.28;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++)im.cells[y*S+x]=y>=S*.9-S*.04*Math.sin(x/S*5+p)?10:Math.min(2,Math.floor(y/(S*.9)*3));
  for(const[cxx,cyy]of[[.2,.62],[.78,.74],[.55,.5]])for(const[ox,r]of[[-.07,.05],[0,.07],[.08,.05]])_blob(im,S,S*(cxx+ox),S*cyy,S*r*1.3,S*r*.7,3);
  const slots=[[.27,.3,.16],[.7,.42,.13],[.5,.14,.09],[.86,.16,.08]],n=S>=40?4:S>=18?3:2;
  for(let i=0;i<n;i++){const[fx,fy,fr]=slots[i],bx=S*(fx+(rng()-.5)*.06),by=S*fy,r=Math.max(2,S*fr),A=4+Math.floor(rng()*5),B=4+(A-4+1+Math.floor(rng()*4))%5;
    for(let y=Math.floor(by-r);y<=by+r*1.3;y++)for(let x=Math.floor(bx-r);x<=bx+r;x++){const dx=x+.5-bx,dy=y+.5-by,hw=dy<r*.3?Math.sqrt(Math.max(0,r*r-dy*dy)):r*(.95-.75*(dy-r*.3)/r);
      if(dy>=-r&&Math.abs(dx)<hw)_put(im,S,x,y,Math.floor((dx+r)/(2*r)*5)%2?B:A)}
    const bw=Math.max(1,Math.round(r*.4)),bh=Math.max(1,Math.round(r*.28));for(let y=0;y<bh;y++)for(let x=0;x<bw;x++)_put(im,S,bx-bw/2+x,by+r*1.5+y,9)}
  return im;
}
function sceneKacheln(S,rng){
  const pool=['#e63946','#f4a261','#ffd166','#2a9d8f','#4cc9f0','#7b2cbf','#f7f1e3','#264653'];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const im=mk(S,S,pool.slice(0,5)),n=S<=10?2:S<=24?3:S<=64?4:6,b=S/n,k=Math.floor(rng()*3);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const bi=Math.floor(x/b)+Math.floor(y/b),u=(x%b)/b,v=(y%b)/b,a=Math.min(u,1-u-1/b/2+.0001),c=Math.min(v,1-v-1/b/2+.0001),m=(bi+k)%3;let q;
    if(m===0)q=a+c<.28?0:a+c<.52?1:2;else if(m===1)q=Math.min(a,c)<.14?3:Math.max(a,c)<.3?4:1;else q=Math.abs(a-c)<.09?4:a>c?0:2;
    im.cells[y*S+x]=(q+(bi%2))%5}
  return im;
}
function sceneWellen(S,rng){
  const im=mk(S,S,['#ffd6a5','#ffadad','#fffbe0','#caf0f8','#48cae4','#0096c7','#0077b6','#023e8a','#03045e']);
  const L=[0,1,2,3,4].map(i=>({b:S*(.4+.13*i),a:S*(.05-.004*i),f:3+i*1.3+rng()*2,p:rng()*6.28})),sx=S*(.3+rng()*.4);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){let c=y<S*.2?1:0;if(Math.hypot(x+.5-sx,y+.5-S*.3)<S*.11)c=2;
    L.forEach((w,i)=>{const t=w.b+w.a*Math.sin(x/S*w.f+w.p)+w.a*.4*Math.sin(x/S*w.f*2.7+w.p*2);if(y>=t)c=S>=14&&y<t+Math.max(1,S*.02)?3:4+i});
    im.cells[y*S+x]=c}
  return im;
}
function pixling(W,H,rng){
  const hue=rng()*360,im=mk(W,H,[hsl(hue+180,35,15),hsl(hue,72,60),hsl(hue,66,41),hsl(hue+35,85,79),'#ffffff','#16161d',hsl(hue+150,85,62)]);
  const hw=Math.ceil(W/2),odd=W%2;let m=new Uint8Array(hw*H);
  for(let y=1;y<H-1;y++)for(let x=0;x<hw-1;x++){const d=Math.hypot(x/(hw-.5),(y+.5-H/2)/(H/2))*1.05;m[y*hw+x]=rng()<(d<.45?.97:d<.95?.62:.08)?1:0}
  const g=(x,y)=>{if(x<0)x=odd?1:0;return x>=hw||y<0||y>=H?0:m[y*hw+x]};
  for(let it=0;it<2;it++){const n2=new Uint8Array(hw*H);
    for(let y=1;y<H-1;y++)for(let x=0;x<hw-1;x++){let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)n+=g(x+a,y+b);n2[y*hw+x]=n>=5||(m[y*hw+x]&&n>=3)?1:0}
    m=n2}
  const ey=Math.max(1,Math.round(H*.36)),ex=Math.max(1,Math.min(hw-2,Math.round(hw*.5)));
  for(let y=ey-1;y<=ey+2;y++)for(let x=0;x<=ex+1;x++)if(y>=1&&y<H-1&&x<hw-1)m[y*hw+x]=1;
  const hx=x=>odd?Math.abs(x-(W-1)/2):(x<W/2?W/2-1-x:x-W/2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=hx(x);let c=0;
    if(m[y*hw+X]){c=1;const ny=(y+.5-H/2)/(H/2);
      if(ny>.05&&ny<.65&&X<hw*.4)c=3;
      if(!g(X,y+1))c=2;
      if(W>=9){if(X===ex&&y===ey)c=4;if(X===ex&&y===ey+1)c=5}else if(X===ex&&y===ey)c=5;
      if(W>=8&&X===0&&y===ey+3&&g(0,y+1))c=5;
    }else if(y<H-1&&X===ex&&m[(y+1)*hw+X]&&!g(X,y-1)&&y<ey)c=6;
    im.cells[y*W+x]=c}
  return im;
}
function mosaic(W,H,rng){
  const im=mk(W,H,['#f4f1de','#e63946','#ffb703','#219ebc','#2a9d8f','#1d3557','#fb8500']);
  const rs=partition(W,H,im.cells,Math.max(6,Math.min(24,Math.round(W*H/8))),rng);
  for(const r of rs){const c=rng()<.3?0:1+Math.floor(rng()*6);for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)im.cells[y*W+x]=c}
  return im;
}

/* ---------- Foto → Pixel-Art (Median Cut) ---------- */
function quantize(rgba,W,H,N){
  const n=W*H,all=new Uint32Array(n);for(let i=0;i<n;i++)all[i]=i;
  const stat=idx=>{let mn=[255,255,255],mx=[0,0,0];for(const i of idx)for(let c=0;c<3;c++){const v=rgba[i*4+c];if(v<mn[c])mn[c]=v;if(v>mx[c])mx[c]=v}
    let ch=0;for(let c=1;c<3;c++)if(mx[c]-mn[c]>mx[ch]-mn[ch])ch=c;return{idx,ch,range:mx[ch]-mn[ch]}};
  let boxes=[stat(all)];
  while(boxes.length<N){let bi=-1,best=0;boxes.forEach((b,i)=>{const s=b.range*Math.sqrt(b.idx.length);if(b.idx.length>1&&b.range>6&&s>best){best=s;bi=i}});
    if(bi<0)break;const b=boxes[bi],ch=b.ch;b.idx.sort((p,q)=>rgba[p*4+ch]-rgba[q*4+ch]);const mid=b.idx.length>>1;
    boxes.splice(bi,1,stat(b.idx.slice(0,mid)),stat(b.idx.slice(mid)))}
  const im=mk(W,H,[]);
  boxes.forEach((b,k)=>{let s=[0,0,0];for(const i of b.idx){s[0]+=rgba[i*4];s[1]+=rgba[i*4+1];s[2]+=rgba[i*4+2];im.cells[i]=k}
    im.colors.push(rgb2hex(s[0]/b.idx.length,s[1]/b.idx.length,s[2]/b.idx.length))});
  if(W*H>=400){const src=im.cells.slice(),cnt=new Uint8Array(im.colors.length);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){cnt.fill(0);let bc=src[y*W+x],bn=0;
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const xx=x+a,yy=y+b;if(xx<0||yy<0||xx>=W||yy>=H)continue;const c=src[yy*W+xx];if(++cnt[c]>bn){bn=cnt[c];bc=c}}
      if(bn>=6)im.cells[y*W+x]=bc}}
  return compact(im);
}

/* ---------- Zerlegung in einfarbige Rechtecke ---------- */
function partition(W,H,cells,maxArea,rng){
  const fx=rng()<.5,fy=rng()<.5,cov=new Uint8Array(W*H),rects=[],at=(x,y)=>(fy?H-1-y:y)*W+(fx?W-1-x:x),opts=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(cov[at(x,y)])continue;
    const col=cells[at(x,y)];let w=0;
    while(x+w<W&&w<9&&!cov[at(x+w,y)]&&cells[at(x+w,y)]===col)w++;
    opts.length=0;let tot=0;
    for(let h=1;y+h<=H&&h<=9;h++){
      if(h>1){let ww=0;while(ww<w&&!cov[at(x+ww,y+h-1)]&&cells[at(x+ww,y+h-1)]===col)ww++;w=ww;if(!w)break}
      for(let k=1;k<=w&&k*h<=maxArea;k++){if(Math.min(k,h)===1&&k*h>5)continue;if(Math.min(k,h)===2&&k*h>16)continue;let wt=Math.pow(k*h,1.6);if(Math.min(k,h)===1&&k*h>3)wt*=.3;opts.push(k,h,wt);tot+=wt}}
    let pick=rng()*tot,i=0;for(;i<opts.length-3;i+=3){pick-=opts[i+2];if(pick<=0)break}
    const k=opts[i],h=opts[i+1];
    for(let b=0;b<h;b++)for(let a=0;a<k;a++)cov[at(x+a,y+b)]=1;
    rects.push({x:fx?W-x-k:x,y:fy?H-y-h:y,w:k,h});
  }
  for(const r of rects){r.cx=r.x+Math.floor(rng()*r.w);r.cy=r.y+Math.floor(rng()*r.h)}
  return rects;
}

/* ---------- Logik-Löser: liefert die Hinweise, die sich nicht eindeutig herleiten lassen ---------- */
function solve(W,H,rects){
  const n=rects.length,N=W*H,W1=W+1,P=new Int32Array(W1*(H+1));
  const isClue=new Uint8Array(N);for(const r of rects)isClue[r.cy*W+r.cx]=1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)P[(y+1)*W1+x+1]=isClue[y*W+x]+P[y*W1+x+1]+P[(y+1)*W1+x]-P[y*W1+x];
  const X0=[],Y0=[],CW=[],CH=[],OWN=[],cs=new Int32Array(n+1);
  for(let k=0;k<n;k++){const r=rects[k],a=r.w*r.h;cs[k]=X0.length;
    for(let w=1;w<=a;w++){if(a%w)continue;const h=a/w;if(w>W||h>H)continue;
      const xa=Math.max(0,r.cx-w+1),xb=Math.min(r.cx,W-w),ya=Math.max(0,r.cy-h+1),yb=Math.min(r.cy,H-h);
      for(let x0=xa;x0<=xb;x0++)for(let y0=ya;y0<=yb;y0++)
        if(P[(y0+h)*W1+x0+w]-P[y0*W1+x0+w]-P[(y0+h)*W1+x0]+P[y0*W1+x0]===1){X0.push(x0);Y0.push(y0);CW.push(w);CH.push(h);OWN.push(k)}}}
  const nc=X0.length;cs[n]=nc;
  const cst=new Int32Array(N+1);
  for(let c=0;c<nc;c++)for(let y=Y0[c];y<Y0[c]+CH[c];y++)for(let x=X0[c];x<X0[c]+CW[c];x++)cst[y*W+x+1]++;
  for(let i=0;i<N;i++)cst[i+1]+=cst[i];
  const cc=new Int32Array(cst[N]),fill=cst.slice(0,N);
  for(let c=0;c<nc;c++)for(let y=Y0[c];y<Y0[c]+CH[c];y++)for(let x=X0[c];x<X0[c]+CW[c];x++)cc[fill[y*W+x]++]=c;
  const alive=new Uint8Array(nc).fill(1),ac=new Int32Array(n),owner=new Int32Array(N).fill(-1);
  for(let k=0;k<n;k++)ac[k]=cs[k+1]-cs[k];
  const qk=new Int32Array(n),ink=new Uint8Array(n),qc=new Int32Array(N),inc=new Uint8Array(N);let nk=0,ncq=0;
  for(let k=n-1;k>=0;k--){qk[nk++]=k;ink[k]=1}
  for(let i=0;i<N;i++){qc[ncq++]=i;inc[i]=1}
  const kill=c=>{alive[c]=0;const k=OWN[c];ac[k]--;if(!ink[k]){ink[k]=1;qk[nk++]=k}
    for(let y=Y0[c];y<Y0[c]+CH[c];y++)for(let x=X0[c];x<X0[c]+CW[c];x++){const i=y*W+x;if(owner[i]<0&&!inc[i]){inc[i]=1;qc[ncq++]=i}}};
  while(nk||ncq){
    if(nk){const k=qk[--nk];ink[k]=0;let a=-1,b=-1,c2=1e9,d=1e9;
      for(let c=cs[k];c<cs[k+1];c++)if(alive[c]){if(X0[c]>a)a=X0[c];if(Y0[c]>b)b=Y0[c];if(X0[c]+CW[c]<c2)c2=X0[c]+CW[c];if(Y0[c]+CH[c]<d)d=Y0[c]+CH[c]}
      for(let y=b;y<d;y++)for(let x=a;x<c2;x++){const i=y*W+x;if(owner[i]===k)continue;owner[i]=k;
        for(let j=cst[i];j<cst[i+1];j++){const c=cc[j];if(alive[c]&&OWN[c]!==k)kill(c)}}
    }else{const i=qc[--ncq];inc[i]=0;if(owner[i]>=0)continue;let k=-1,multi=false;
      for(let j=cst[i];j<cst[i+1];j++){const c=cc[j];if(!alive[c])continue;if(k<0)k=OWN[c];else if(OWN[c]!==k){multi=true;break}}
      if(multi||k<0)continue;const x=i%W,y=(i/W)|0;
      for(let c=cs[k];c<cs[k+1];c++)if(alive[c]&&!(X0[c]<=x&&x<X0[c]+CW[c]&&Y0[c]<=y&&y<Y0[c]+CH[c]))kill(c)}
  }
  const un=[];for(let k=0;k<n;k++)if(ac[k]!==1)un.push(k);
  return un;
}

/* ---------- Rätsel bauen: zerlegen, prüfen, nachschärfen bis eindeutig ---------- */
async function buildPuzzle(img,maxArea,rng,tick){
  const{W,H}=img,tries=W*H<=400?10:W*H<=4096?3:1;let rects=null,bs=1e9;
  for(let t=0;t<tries;t++){const c=partition(W,H,img.cells,maxArea,rng);let sc=c.length;for(const r of c)if(r.w*r.h===1)sc+=2;if(sc<bs){bs=sc;rects=c}}
  for(let it=0;it<400;it++){
    const un=solve(W,H,rects);
    if(tick)await tick(it,un.length,rects.length);
    if(!un.length)break;
    const add=[];
    for(const k of un){const r=rects[k];
      if(it<3||(it<14&&rng()<.5)){r.cx=r.x+Math.floor(rng()*r.w);r.cy=r.y+Math.floor(rng()*r.h);continue}
      if(it<40&&rng()<.45)continue;
      let b;if(r.w>=r.h){const s=1+Math.floor(rng()*(r.w-1));b={x:r.x+s,y:r.y,w:r.w-s,h:r.h};r.w=s}
      else{const s=1+Math.floor(rng()*(r.h-1));b={x:r.x,y:r.y+s,w:r.w,h:r.h-s};r.h=s}
      for(const q of[r,b]){q.cx=q.x+Math.floor(rng()*q.w);q.cy=q.y+Math.floor(rng()*q.h)}
      add.push(b)}
    rects=rects.concat(add);
  }
  return{W,H,colors:img.colors,cells:img.cells,rects};
}
if(typeof module!=='undefined')module.exports={sceneSynth,scenePalm,sceneGipfel,sceneLeuchtturm,sceneRegenbogen,sceneRiff,sceneWueste,sceneVulkan,scenePolarlicht,sceneBallons,sceneKacheln,sceneWellen,mulberry32,hashStr,RAMPS,applyPalette,SPRITES,spriteImage,sceneSunset,scenePlanet,sceneSkyline,sceneMandala,pixling,mosaic,quantize,partition,solve,buildPuzzle,compact};
