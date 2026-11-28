
/* ================= Bosse 4 bis 13 ================= */
const B2MD=[1,0,2,3];
Object.assign(LBOSSN,{60:'zoellner',75:'krake',90:'eisenhans',105:'spiegel',120:'frost',135:'troll',150:'geist',165:'irrlicht',180:'katapult',195:'morvan'});
Object.assign(LBOSSTXT,{
  zoellner:{name:'Der Zöllner',wi:3,tip:'Stoße jeden Karren von links an, bis er auf der goldenen Platte steht. Wartest du in einer Reihe, stellt sich der Zöllner dort hin. Roll los, wenn er weit weg ist.',
    intro:'Am Stadttor lässt der Zöllner niemanden durch. Drei Marktkarren stehen auf Schienen. Jeder Stoß schiebt einen Karren ein Feld weiter. Stehen alle drei auf ihren goldenen Platten, fällt das Tor.'},
  krake:{name:'Der Krake',wi:4,tip:'Rolle über alle drei Ankerwinden. Blubbert das Wasser neben dir, roll sofort weiter.',
    intro:'Im Hafenbecken lauert ein Krake. Wo das Wasser blubbert, schnellt gleich ein Fangarm heraus und packt, wer daneben steht. Rolle über die drei Ankerwinden am Kai. Jede dreht sich nach zehn Sekunden zurück, du brauchst also alle drei in einem Zug.'},
  eisenhans:{name:'Ritter Eisenhans',wi:5,tip:'Er dreht sich langsam zu dir. Wische mehrere Züge hintereinander, damit du in seinem Rücken bist, bevor er sich umgedreht hat.',
    intro:'Ritter Eisenhans bewacht den Burghof. Schild und Rüstung halten jeden Stoß aus, nur sein Rücken ist ungeschützt. Er dreht sich langsam zu dir hin. Sei schneller als er und pralle von hinten gegen ihn. Stehst du vor ihm in seiner Linie, schlägt er mit dem Schwert zu.'},
  spiegel:{name:'Pias Spiegelbild',wi:6,tip:'Die dunkle Kugel rollt bei links und rechts genau andersherum. Rolle so, dass sie in einen Schlund fällt und du nicht.',
    intro:'Aus dem großen Spiegel im Thronsaal rollt eine dunkle Kugel. Sie macht jeden deiner Züge mit, nur links und rechts sind vertauscht. Bring sie dazu, in einen Schlund zu fallen, ohne selbst hineinzurollen. Stoßt ihr zusammen oder brauchst du zu viele Züge, geht es von vorn los.'},
  frost:{name:'Der Frostwurm',wi:7,tip:'Die Kristalle zerspringen nur mit viel Schwung. Nimm einen langen Anlauf, der über eine Eisrinne um die Ecke führt.',
    intro:'Der Frostwurm zieht seine Runde um drei Eiskristalle. Ein Kristall zerspringt nur, wenn du mit viel Schwung dagegenprallst. Den nötigen Anlauf bekommst du über die Eisrinnen. Der Wurm wird mit jedem Kristall länger und dreht um.'},
  troll:{name:'Der Lawinentroll',wi:8,tip:'Seine Felsbrocken bleiben dort liegen, wo du gestanden hast. Nutze sie als Bande, um unter ihm anzuhalten, und roll dann nach oben.',
    intro:'Oben auf dem Sims steht der Lawinentroll und wirft Felsbrocken dorthin, wo du gerade stehst. Die Brocken bleiben liegen. Mit ihnen als Bande kommst du in seine Spalte. Pralle dann von unten gegen den Sims. Leuchtet eine ganze Spalte orange, rauscht dort gleich eine Lawine herunter.'},
  geist:{name:'Der Grubengeist',wi:9,tip:'Rolle über eine Bombe, wenn der Geist nah ist, und bleib nicht daneben stehen. Die Funken locken ihn an.',
    intro:'Der Grubengeist schwebt durch jede Wand hinter dir her. Im Stollen liegen drei Bomben. Wer darüberrollt, zündet die Lunte. Die Funken locken den Geist an. Sorge dafür, dass er beim Knall danebensteht und du nicht. Nach dem ersten Treffer teilt er sich.'},
  irrlicht:{name:'Die Irrlichtmutter',wi:10,tip:'Das Irrlicht zeigt, wo sie als Nächstes landet. Rolle kurz vorher über dieses Seerosenblatt, dann leuchtet es bei ihrer Landung.',
    intro:'Die Irrlichtmutter springt von Seerosenblatt zu Seerosenblatt. Ein kleines Irrlicht verrät, wo sie als Nächstes landet. Rollst du kurz vorher über dieses Blatt, leuchtet es auf und sie verbrennt sich. Die Schlünde wandern bei jedem ihrer Sprünge.'},
  katapult:{name:'Das Katapult',wi:11,tip:'Das Katapult schießt dorthin, wo du stehst. Stell dich direkt neben eine Palisade und roll weg, bevor der Stein einschlägt.',
    intro:'Morvans Katapult schießt auf das Feld, auf dem du stehst. Drei Palisaden schützen es. Stell dich neben eine Palisade, warte auf das Fadenkreuz und roll weg. Dann zerlegt das Katapult seinen eigenen Schutz. Später streut es auf drei Felder nebeneinander.'},
  morvan:{name:'Morvan',wi:12,tip:'Von vorn schützt ihn sein Schild. Das Portal unter ihm bringt dich in seinen Rücken. Triff ihn, während er den Blitz lädt.',
    intro:'Ganz oben im Turm wartet Morvan. Sein Blitz fährt durch die Reihe und die Spalte, in der du stehst. Während er lädt, flackert sein Schild. Genau dann musst du durch das Portal in seinen Rücken prallen. Nach jedem Treffer wandert das Portal.'}});
function b2Near(x,y,r,now){return now>LB.safe&&!LB.dead&&Math.abs(x-LB.bx)<r&&Math.abs(y-LB.by)<r}
function b2Home(){const L=LB.L;LB.roll=null;LB.queue=[];LB.bump=null;LB.pos=L.start;LB.bx=L.start%L.W;LB.by=(L.start/L.W)|0;LB.tp=1;LB.safe=performance.now()+1200}
function b2Hit(now,then){const B=LB.boss;labBossHit(now);if(B.hp>0){B.phase++;B.pause=LB.clock+1100;B.then=then||null}}
function b2Tile(c,hex,op,sc){const m=new THREE.Mesh(LAB.geo.pl,c.flat(hex,op));m.scale.set(sc||.86,1,sc||.86);m.visible=false;c.S.add(m);return m}
function b2Put(m,x,y,h){m.position.set(LAB.X(x),h===undefined?.113:h,LAB.Z(y))}
function b2Ph(B){return Math.min(2,B.phase)}
/* Schattenkugel: macht Pias Züge mit, links und rechts vertauscht */
function b2MirMove(B,L){if(LB.moves===B.lm||!LB.roll)return;B.lm=LB.moves;if(B.mp){if(B.mDead)return;B.m=B.mEnd;B.mp=null}const s=labSlide(L,B.m,B2MD[LB.roll.d],0,true);if(!s.cells.length)return;B.mp=labRollPlan(L,B.m,s.cells);B.mt=0;B.mEnd=s.end;B.mDead=s.dead}
function b2MirStep(B,L,dt){if(!B.mp){B.mx=B.m%L.W;B.my=(B.m/L.W)|0;B.ms=1;return false}B.mt+=dt;const st=B.mp.state(Math.min(B.mt,B.mp.T));B.mx=st.x;B.my=st.y;B.ms=st.sc;if(B.mt>=B.mp.T){B.mp=null;B.m=B.mEnd;return true}return false}
function b2Shadow(c){const g=new THREE.Group();c.M('ball','#2a1640',.78,.78,.78,0,.5,0,{emissive:'#7a2aff',emissiveIntensity:.5},g);for(const k of[-1,1])c.M('sph','#ff3a5a',.14,.16,.08,k*.16,.58,.36,{emissive:'#ff3a5a',emissiveIntensity:1.6},g);const h=labHalo('#9a4aff',1.9,.45);h.position.y=.5;g.add(h);c.S.add(g);return g}
const B2={
zoellner:{
  level(L){for(const[y,a]of L.boss.rail)L.noProp.add(y*L.W+a)},
  init(B,L){const W=L.W;for(const[y,a,b]of L.boss.rail)for(let x=a;x<=b;x++)L.grid[y*W+x]=1;B.carts=L.boss.rail.map(([y,a,b])=>({y,x:a,a,b,done:false,vx:a}));for(const k of B.carts)L.grid[k.y*W+k.x]=2;B.zy=4;B.zd=1},
  step(B,L,now,dt,c,px,py){const col=L.boss.col[b2Ph(B)];if(c<(B.zh||0)){}else{const y0=B.zy;B.zy+=B.zd*L.boss.sp[b2Ph(B)]*dt;if(B.zy>=L.H-2){B.zy=L.H-2;B.zd=-1}if(B.zy<=1){B.zy=1;B.zd=1}
      /* Steht Pia in einer Reihe, bleibt er dort kurz stehen und versperrt sie */
      if(!LB.roll&&px!==col&&(y0-py)*(B.zy-py)<=0&&c>(B.zn||0)){B.zy=py;B.zh=c+900;B.zn=c+2600;tone(200,.1,'square',.04)}}
    if(b2Near(col,B.zy,.6,now))labCaught(now,'Der Zöllner hat dich erwischt. Zurück zum Start.')},
  bump(B,L,end,dx,dy,now){const W=L.W,t=end+dx+dy*W,k=B.carts.find(k=>k.y*W+k.x===t);if(!k||k.done)return;
    if(dy){toast('Der Karren rollt nur auf seiner Schiene.',1700);return}const nx=k.x+dx;if(nx<k.a||nx>k.b)return;L.grid[t]=1;k.x=nx;L.grid[k.y*W+nx]=2;tone(260,.12,'square',.05);
    if(nx===k.b){k.done=true;labSpark(k.y*W+nx,'#ffd84d',22,4);labBossHit(now);if(B.hp>0)B.phase++}},
  build(c){const{M,S,T,L,bo}=c,D=L.boss;bo.carts=[];
    D.rail.forEach(([y,a,b])=>{for(let x=a;x<=b;x++){const r=b2Tile(c,'#2a1c14',.6);r.scale.set(1,1,.14);r.visible=true;b2Put(r,x,y,.111)}const p=b2Tile(c,'#ffd84d',.75,.8);p.visible=true;b2Put(p,b,y,.112);
      const g=new T.Group();M('box','#b8763a',.8,.34,.6,0,.42,0,null,g);M('box','#e0403a',.86,.08,.66,0,.63,0,null,g);for(const sx of[-.3,.3])for(const sz of[-.32,.32])M('cyl','#3a2a20',.3,.08,.3,sx,.17,sz,null,g).rotation.x=Math.PI/2;
      for(let k=0;k<3;k++)M('sph',['#ff9a3a','#7ac74f','#ffd84d'][k],.26,.26,.26,(k-1)*.25,.78,0,null,g);S.add(g);bo.carts.push(g)});
    const z=new T.Group();M('cyl','#3a4a8a',.62,.8,.62,0,.5,0,null,z);M('sph','#f0c8a0',.44,.44,.44,0,1.1,0,null,z);M('cyl','#23233a',.6,.08,.6,0,1.32,0,null,z);M('cyl','#23233a',.36,.26,.36,0,1.44,0,null,z);
    for(const k of[-1,1])M('sph','#15151a',.07,.09,.05,k*.1,1.14,.2,null,z);M('box','#8a3a2a',.3,.06,.06,0,1.02,.21,null,z);M('cyl','#6a4a2a',.07,1.7,.07,.42,.85,.1,null,z);M('cone','#c8d0d8',.2,.34,.08,.42,1.8,.1,{emissive:'#c8d0d8',emissiveIntensity:.3},z);
    const h=labHalo('#ff3a2a',1.6,.3);h.position.y=.7;z.add(h);S.add(z);bo.g=z;
    bo.lane=[];for(let y=1;y<L.H-1;y++){const m=b2Tile(c,'#ff3a4a',.4,.3);m.rotation.y=Math.PI/4;m.visible=true;bo.lane.push(m)}},
  frame(B,L,bo,now,t,dt,hurt,dead){B.carts.forEach((k,i)=>{k.vx+=(k.x-k.vx)*Math.min(1,dt*14);bo.carts[i].position.set(LAB.X(k.vx),k.done?Math.abs(Math.sin(t*3))*.03:0,LAB.Z(k.y))});
    B.vc=B.vc===undefined?L.boss.col[0]:B.vc+(L.boss.col[b2Ph(B)]-B.vc)*Math.min(1,dt*6);bo.lane.forEach((m,i)=>b2Put(m,L.boss.col[b2Ph(B)],i+1,.108));bo.g.position.set(LAB.X(B.vc),dead?-2.2*Math.min(1,(now-B.hitAt)/700):Math.abs(Math.sin(t*7))*.07,LAB.Z(B.zy));bo.g.rotation.y=dead?t*10:B.zd>0?0:Math.PI}},
krake:{
  init(B,L){B.on=[0,0,0];B.tt=null;B.next=LB.clock+2600;B.water=[];for(let i=0;i<L.grid.length;i++)if(L.grid[i]===3)B.water.push(i)},
  arrive(B,L,cell,now){const c=LB.clock;L.boss.win.forEach((q,k)=>{if(cell!==q[1]*L.W+q[0])return;if(B.on[k]>c){B.on[k]=c+10000;return}B.on[k]=c+10000;labSpark(cell,'#58e6ff',20,4);tone(520,.2,'triangle',.06);labBossHit(now);B.phase=3-Math.max(0,B.hp)})},
  step(B,L,now,dt,c,px,py){const W=L.W,adj=i=>Math.abs(i%W-px)+Math.abs(((i/W)|0)-py)===1,TEL=[1200,1050,900][b2Ph(B)];
    /* Jede Winde dreht sich nach zehn Sekunden zurück */
    B.on.forEach((v,k)=>{if(v&&v<=c&&B.hp>0){B.on[k]=0;B.hp++;B.phase=3-B.hp;labHud();tone(160,.3,'sawtooth',.05);toast('Eine Winde hat sich zurückgedreht. Du brauchst alle drei auf einmal.',2200)}});
    if(!B.tt&&c>=B.next){const near=B.water.filter(adj),pick=()=>B.water[(Math.random()*B.water.length)|0],cells=[near.length?near[(c|0)%near.length]:pick()];
      const o=near.find(i=>i!==cells[0]);cells.push(o!==undefined?o:pick());B.tt={cells,cell:cells[0],t:c,done:0};tone(180,.5,'sine',.05)}
    if(B.tt&&!B.tt.done&&c-B.tt.t>=TEL){B.tt.done=c;tone(90,.25,'square',.07);if(B.tt.cells.some(adj)&&now>LB.safe)labCaught(now,'Ein Fangarm hat dich gepackt. Bleib nicht neben blubberndem Wasser stehen.')}
    if(B.tt&&B.tt.done&&c-B.tt.done>600){B.tt=null;B.next=c+L.boss.gap[b2Ph(B)]}},
  build(c){const{M,S,T,L,W,bo}=c;bo.win=L.boss.win.map(q=>{const g=new T.Group(),tl=b2Tile(c,'#ffd84d',.6,.9);tl.visible=true;b2Put(tl,q[0],q[1],.112);M('cyl','#6a4a2a',.5,.3,.5,0,.26,0,null,g).rotation.z=Math.PI/2;M('cyl','#c8a060',.56,.1,.56,-.2,.26,0,null,g).rotation.z=Math.PI/2;M('cyl','#c8a060',.56,.1,.56,.2,.26,0,null,g).rotation.z=Math.PI/2;g.position.set(LAB.X(q[0]),.02,LAB.Z(q[1]));g.scale.setScalar(.7);S.add(g);return{g,tl}});
    bo.tas=[0,1].map(()=>{const ta=new T.Group();for(let k=0;k<5;k++)M('sph','#d85a8a',.46-k*.06,.4,.46-k*.06,Math.sin(k*.8)*.08,.2+k*.3,0,null,ta);M('sph','#ffc0d8',.2,.2,.2,.1,1.6,0,null,ta);S.add(ta);return ta});bo.rings=[0,1].map(()=>b2Tile(c,'#ff3a4a',.5,2.6));
    bo.bub=[];for(let k=0;k<4;k++){const b=M('sph','#e8fbff',.14,.14,.14,0,0,0,{emissive:'#e8fbff',emissiveIntensity:.8});bo.bub.push(b)}
    const hd=new T.Group();M('sph','#b8427a',1.5,1.2,1.3,0,.3,0,null,hd);for(const k of[-1,1]){M('sph','#fff6e6',.34,.4,.2,k*.34,.5,.56,{emissive:'#fff6e6',emissiveIntensity:.5},hd);M('sph','#15151a',.14,.22,.1,k*.34,.5,.66,null,hd)}const w=L.grid.lastIndexOf(3);hd.position.set(LAB.X(w%W),-.2,LAB.Z((w/W)|0)-.5);S.add(hd);bo.hd=hd},
  frame(B,L,bo,now,t,dt,hurt,dead){const W=L.W,tt=B.tt;bo.win.forEach((w,k)=>{const left=B.on[k]-LB.clock;w.g.rotation.x=B.on[k]?t*6:0;w.tl.material.color.set(B.on[k]?'#58e6ff':'#ffd84d');w.tl.material.opacity=B.on[k]?(left<3000&&!dead?.2+.5*Math.abs(Math.sin(LB.clock*.012)):.6):.5+.25*Math.sin(t*5)});
    bo.hd.position.y=dead?-.2-2*Math.min(1,(now-B.hitAt)/800):-.25+Math.sin(t*1.6)*.08+(hurt?.25:0);
    bo.tas.forEach((ta,k)=>{const cl=tt?tt.cells[k]:0,x=cl%W,y=(cl/W)|0;ta.visible=!!tt&&!!tt.done;if(ta.visible){const u=(LB.clock-tt.done)/600;ta.position.set(LAB.X(x),-1.6+Math.sin(Math.min(1,u)*Math.PI)*1.7,LAB.Z(y));ta.rotation.z=Math.sin(t*20+k)*.2}
      const r=bo.rings[k];r.visible=!!tt&&!tt.done;if(r.visible){b2Put(r,x,y,.116);r.material.opacity=.15+.3*Math.abs(Math.sin(LB.clock*.012));r.rotation.y=Math.PI/4}});
    bo.bub.forEach((bb,k)=>{bb.visible=!!tt&&!tt.done;if(bb.visible){const cl=tt.cells[k%2],u=((LB.clock-tt.t)/500+k*.25)%1;bb.position.set(LAB.X(cl%W)+Math.sin(k*2.1)*.25,.1+u*.6,LAB.Z((cl/W)|0)+Math.cos(k*1.7)*.25);bb.scale.setScalar(.1+.1*u)}})}},
eisenhans:{
  init(B,L){B.a=Math.PI/2;B.front=0},
  step(B,L,now,dt,c){const W=L.W,m=L.marks.B,kx=m%W,ky=(m/W)|0;let d=Math.atan2(LB.by-ky,LB.bx-kx)-B.a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;const w=L.boss.om[b2Ph(B)]*Math.PI/180*dt;B.a+=Math.abs(d)<w?d:Math.sign(d)*w;
    /* Schwerthieb: Steht Pia bis zu drei Felder vor ihm in seiner Reihe oder Spalte, holt er aus und schlägt durch die ganze Linie */
    const px=LB.pos%W,py=(LB.pos/W)|0,ax=px-kx,ay=py-ky,inl=!LB.roll&&((ax===0&&ay!==0)||(ay===0&&ax!==0))&&Math.abs(ax)+Math.abs(ay)<=3&&Math.abs(d)<.5;
    if(B.sw){if(c-B.sw.t>=[750,650,560][b2Ph(B)]){const sx=Math.round(LB.bx)-kx,sy=Math.round(LB.by)-ky,k=sx*B.sw.dx+sy*B.sw.dy;tone(900,.12,'sawtooth',.06);B.sws=c;if(k>=1&&k<=3&&sx*B.sw.dy===sy*B.sw.dx&&now>LB.safe)labCaught(now,'Sein Schwert hat dich erwischt. Bleib nicht vor ihm stehen.');B.sw=null;B.swn=c+1300}}
    else if(inl&&c>(B.swn||0)){B.sw={t:c,dx:Math.sign(ax),dy:Math.sign(ay)};tone(500,.2,'square',.04)}},
  bump(B,L,end,dx,dy,now){if(end+dx+dy*L.W!==L.marks.B)return;const dot=Math.cos(B.a)*dx+Math.sin(B.a)*dy;
    if(dot>.05){labSpark(L.marks.B,'#ff5a4a',26,4);labBossHit(now);if(B.hp>0){B.phase++;B.a+=Math.PI}}
    else{tone(700,.1,'square',.05);toast(dot<-.3?'Sein Schild hält. Du musst ihm in den Rücken rollen.':'Die Rüstung hält. Nur sein Rücken ist verwundbar.',1900)}},
  build(c){const{M,S,T,L,bo}=c,g=new T.Group(),m=L.marks.B;M('cyl','#8a94a4',.7,.8,.7,0,.5,0,null,g);M('cyl','#6a7484',.78,.16,.78,0,.2,0,null,g);M('sph','#aab4c4',.52,.52,.52,0,1.14,0,null,g);M('box','#15151a',.3,.07,.1,0,1.16,.24,null,g);M('cone','#e0403a',.14,.4,.14,0,1.56,-.05,null,g);
    M('box','#3a5aa8',.62,.74,.1,0,.6,.42,{emissive:'#3a5aa8',emissiveIntensity:.2},g);M('box','#ffd84d',.14,.5,.12,0,.6,.44,null,g);M('box','#ffd84d',.44,.14,.12,0,.66,.44,null,g);M('box','#d8e0e8',.08,.9,.08,.5,.8,.2,{emissive:'#d8e0e8',emissiveIntensity:.3},g);
    bo.gem=M('sph','#ff3a2a',.3,.3,.14,0,.62,-.37,{emissive:'#ff3a2a',emissiveIntensity:1.6},g);const h=labHalo('#ff5a4a',1.5,.6);h.position.set(0,.62,-.5);g.add(h);g.position.set(c.wx(m),0,c.wz(m));S.add(g);bo.g=g;bo.mark=b2Tile(c,'#ff5a4a',.5,.7);bo.mark.visible=true;bo.sw=[0,1,2].map(()=>b2Tile(c,'#ffffff',.5,.9))},
  frame(B,L,bo,now,t,dt,hurt,dead){const m=L.marks.B,kx=m%L.W,ky=(m/L.W)|0,g=bo.g;g.rotation.y=dead?t*12:Math.atan2(Math.cos(B.a),Math.sin(B.a));g.rotation.z=hurt?Math.sin(now*.05)*.14:0;g.scale.setScalar(dead?Math.max(.05,1-(now-B.hitAt)/800):1);
    b2Put(bo.mark,kx-Math.cos(B.a)*.95,ky-Math.sin(B.a)*.95,.114);bo.mark.material.opacity=.3+.25*Math.sin(t*5);bo.mark.visible=!dead;bo.gem.scale.z=.14+.05*Math.sin(t*6);const sw=B.sw,fl=LB.clock-(B.sws||-999)<160;bo.sw.forEach((p,i)=>{p.visible=(!!sw||fl)&&!dead;if(sw){b2Put(p,kx+sw.dx*(i+1),ky+sw.dy*(i+1),.116);p.material.color.set('#ff3a2a');p.material.opacity=.25+.35*Math.abs(Math.sin(LB.clock*.016))}else if(fl){p.material.color.set('#ffffff');p.material.opacity=.9}})}},
spiegel:{
  place(B,L){const h=L.boss.home[b2Ph(B)];B.m=h[1]*L.W+h[0];B.mp=null;B.mDead=false;B.gone=false;B.lm=LB.moves;B.mx=h[0];B.my=h[1];B.ms=1;B.used=0;B.hitT=0;B.out=0},
  init(B,L){this.place(B,L)},caught(B,L){if(!B.gone)this.place(B,L)},
  step(B,L,now,dt,c){if(B.gone)return;const fin=b2MirStep(B,L,dt);if(fin&&B.mDead){B.gone=true;labSpark(B.m,'#b06aff',26,4);b2Hit(now,()=>{b2Home();B2.spiegel.place(B,L)});return}
    if(B.hitT&&c>=B.hitT){B.hitT=0;labCaught(now,'Du bist mit deinem Spiegelbild zusammengestoßen. Zurück zum Start.');return}
    const lm=B.lm;b2MirMove(B,L);
    if(B.lm!==lm&&LB.roll){B.used++;const pts=LB.roll.plan.pts.slice(1),pe=pts[pts.length-1],me=B.mp?B.mEnd:B.m,mc=B.mp?B.mp.pts.slice(1):[];if(!B.mDead&&(pe===me||pts.includes(me)||mc.includes(pe)))B.hitT=c+260;
      else if(B.used>=L.boss.lim[b2Ph(B)]&&!B.mDead)B.out=c+900}
    if(B.out&&c>=B.out){B.out=0;if(!B.gone&&!B.mDead)labCaught(now,'Das Spiegelbild lacht dich aus. Du hast zu viele Züge gebraucht.')}},
  build(c){c.bo.g=b2Shadow(c)},
  frame(B,L,bo,now,t,dt,hurt,dead){const g=bo.g;g.visible=!B.gone&&!dead;g.position.set(LAB.X(B.mx),0,LAB.Z(B.my));g.scale.setScalar(Math.max(.05,B.ms||1));g.rotation.y=Math.sin(t*2)*.3}},
frost:{
  level(L){for(const[x,y,d]of L.boss.arr)L.arr[y*L.W+x]=d},
  init(B,L){B.cr={A:1,B:1,C:1};for(const k in B.cr)L.grid[L.marks[k]]=2;B.wp=0;const[x0,y0,x1,y1]=L.boss.loop,p=[];for(let x=x0;x<x1;x++)p.push([x,y0]);for(let y=y0;y<y1;y++)p.push([x1,y]);for(let x=x1;x>x0;x--)p.push([x,y1]);for(let y=y1;y>y0;y--)p.push([x0,y]);B.path=p;B.seg=[]},
  at(B,u){const p=B.path,n=p.length;u=((u%n)+n)%n;const i=Math.floor(u),f=u-i,a=p[i],b=p[(i+1)%n];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]},
  step(B,L,now,dt){const dr=B.phase%2?-1:1,n=4+2*b2Ph(B);B.wp+=dr*L.boss.sp[b2Ph(B)]*dt;B.seg=[];for(let k=0;k<n;k++)B.seg.push(this.at(B,B.wp-dr*k*.8));for(const[x,y]of B.seg)if(b2Near(x,y,.55,now)){labCaught(now,'Der Frostwurm hat dich erwischt. Zurück zum Start.');break}},
  bump(B,L,end,dx,dy,now){const W=L.W,a=L.arr[end];if(a>=0){dx=LDIR[a][0];dy=LDIR[a][1]}const t=end+dx+dy*W,k=['A','B','C'].find(k=>B.cr[k]&&L.marks[k]===t);if(!k)return;
    if(LB.lastN>=L.boss.run){B.cr[k]=0;B.crT=now;L.grid[t]=1;labSpark(t,'#bdf3ff',30,5);tone(1200,.2,'triangle',.06);labBossHit(now);if(B.hp>0)B.phase++}else{tone(900,.08,'triangle',.05);toast('Zu wenig Schwung. Nimm Anlauf über eine Eisrinne.',1900)}},
  build(c){const{M,S,T,L,bo}=c;bo.cr={};for(const k of'ABC'){const g=new T.Group(),m=L.marks[k];M('oct','#9ae8ff',.7,1.3,.7,0,.75,0,{emissive:'#4ac8ff',emissiveIntensity:.9},g);M('oct','#d8f8ff',.36,.7,.36,.3,.4,.1,{emissive:'#4ac8ff',emissiveIntensity:.7},g);M('oct','#d8f8ff',.3,.6,.3,-.28,.36,-.1,{emissive:'#4ac8ff',emissiveIntensity:.7},g);const h=labHalo('#7adfff',2.2,.5);h.position.y=.7;g.add(h);g.position.set(c.wx(m),0,c.wz(m));S.add(g);bo.cr[k]=g}
    bo.seg=[];for(let k=0;k<8;k++){const g=new T.Group();M('sph',k?'#bfe9ff':'#e8f8ff',.9-k*.07,.8-k*.06,.9-k*.07,0,.42,0,{emissive:'#6ac8ff',emissiveIntensity:.35},g);if(!k){for(const s of[-1,1]){M('sph','#15233a',.14,.18,.1,s*.2,.56,.36,null,g);M('cone','#ffffff',.1,.26,.1,s*.14,.22,.4,null,g).rotation.x=Math.PI}const h=labHalo('#9adfff',1.8,.35);h.position.y=.4;g.add(h)}else M('cone','#7ad0ff',.2,.4,.2,0,.9-k*.05,0,null,g);S.add(g);bo.seg.push(g)}
    for(const q of B2.frost.ring(L))if((q[0]+q[1])%2===0){const m=b2Tile(c,'#7adfff',.35,.24);m.rotation.y=Math.PI/4;m.visible=true;b2Put(m,q[0],q[1],.108)}},
  ring(L){const[x0,y0,x1,y1]=L.boss.loop,p=[];for(let x=x0;x<=x1;x++){p.push([x,y0]);p.push([x,y1])}for(let y=y0+1;y<y1;y++){p.push([x0,y]);p.push([x1,y])}return p},
  frame(B,L,bo,now,t,dt,hurt,dead){for(const k of'ABC'){const g=bo.cr[k];g.visible=!!B.cr[k];g.rotation.y=t*.6;g.position.y=Math.sin(t*2+k.charCodeAt(0))*.05}
    bo.seg.forEach((g,k)=>{const s=B.seg[k];g.visible=!!s;if(!s)return;g.position.set(LAB.X(s[0]),dead?-1.5*Math.min(1,(now-B.hitAt)/700):Math.sin(t*8-k)*.06,LAB.Z(s[1]));if(!k&&B.seg[1])g.rotation.y=Math.atan2(s[0]-B.seg[1][0],s[1]-B.seg[1][1])})}},
troll:{
  init(B,L){const W=L.W;for(let y=1;y<L.H-1;y++)for(let x=1;x<W-1;x++)L.grid[y*W+x]=1;B.rocks=[];B.tt=null;B.next=LB.clock+2200;B.vx=L.boss.col[0]},
  step(B,L,now,dt,c){const W=L.W;while(B.rocks.length&&(c-B.rocks[0].t>24000||B.rocks.length>7))L.grid[B.rocks.shift().cell]=1;
    if(!B.tt&&c>=B.next&&!LB.roll&&LB.pos!==L.start&&L.grid[LB.pos]===1){B.tt={cell:LB.pos,t:c};tone(160,.4,'sawtooth',.05)}
    /* Lawine: Alle paar Sekunden rauscht Geröll durch Pias ganze Spalte */
    if(!B.av&&c>=(B.avn||(B.avn=c+5200))){B.av={col:Math.round(LB.bx),t:c};tone(90,.9,'sawtooth',.05)}
    if(B.av&&c-B.av.t>=[1400,1250,1100][b2Ph(B)]){const col=B.av.col;B.av=null;B.avs={col,t:c};B.avn=c+[6500,5600,4800][b2Ph(B)];LB.shake=now;tone(55,.5,'square',.09);if(Math.abs(LB.bx-col)<.6&&now>LB.safe&&LB.pos!==L.start)labCaught(now,'Die Lawine hat dich mitgerissen. Zurück zum Start.')}
    if(B.tt&&c-B.tt.t>=[1150,1000,880][b2Ph(B)]){const q=B.tt.cell;B.tt=null;B.next=c+L.boss.gap[b2Ph(B)];LB.shake=now;tone(70,.3,'square',.08);
      if(Math.abs(q%W-LB.bx)<.7&&Math.abs(((q/W)|0)-LB.by)<.7){if(now>LB.safe)labCaught(now,'Ein Felsbrocken hat dich getroffen. Zurück zum Start.')}else{L.grid[q]=2;B.rocks.push({cell:q,t:c});labSpark(q,'#a89a8a',14)}}},
  bump(B,L,end,dx,dy,now){if(dy!==-1||end!==L.W+L.boss.col[b2Ph(B)])return;labSpark(end,'#ffd84d',26,4);for(const r of B.rocks)L.grid[r.cell]=1;B.rocks=[];B.tt=null;B.av=null;B.avn=LB.clock+4200;B.next=LB.clock+2800;b2Hit(now)},
  build(c){const{M,S,T,L,bo}=c,g=new T.Group();M('dod','#7a6a5a',1.1,1.1,.9,0,.6,0,null,g);M('dod','#8a7a6a',.7,.6,.6,0,1.3,.1,null,g);for(const k of[-1,1]){M('sph','#ffe36b',.14,.16,.08,k*.16,1.36,.4,{emissive:'#ffc21a',emissiveIntensity:1.2},g);M('dod','#6a5a4a',.4,.7,.4,k*.7,.7,.1,null,g);M('cone','#fff6e6',.1,.2,.1,k*.12,1.12,.38,null,g)}
    bo.hand=M('dod','#9a8c7c',.5,.5,.5,0,1.9,.1,null,g);S.add(g);bo.g=g;bo.rocks=[];for(let k=0;k<8;k++){const r=M('dod','#9a8c7c',.86,.8,.86,0,-5,0);bo.rocks.push(r)}
    bo.fall=M('dod','#9a8c7c',.8,.8,.8,0,-5,0);bo.cross=b2Tile(c,'#ff3a2a',.5,.9);bo.mark=b2Tile(c,'#ffd84d',.5,.8);bo.mark.visible=true;bo.av=[];for(let y=1;y<L.H-1;y++)bo.av.push(b2Tile(c,'#ff7a2a',.5,.92));bo.avr=[];for(let k=0;k<5;k++)bo.avr.push(M('dod','#8a7c6c',.6,.6,.6,0,-5,0))},
  frame(B,L,bo,now,t,dt,hurt,dead){const W=L.W,tx=L.boss.col[b2Ph(B)];B.vx+=(tx-B.vx)*Math.min(1,dt*5);bo.g.position.set(LAB.X(B.vx),dead?.5-2.5*Math.min(1,(now-B.hitAt)/800):.55+(hurt?Math.abs(Math.sin(now*.03))*.2:0),LAB.Z(0));bo.g.rotation.z=hurt?Math.sin(now*.05)*.2:Math.sin(t*1.5)*.03;bo.hand.visible=!B.tt;
    b2Put(bo.mark,tx,1,.114);bo.mark.material.opacity=.3+.25*Math.sin(t*5);bo.mark.visible=!dead;
    bo.rocks.forEach((r,k)=>{const q=B.rocks[k];if(q){const u=Math.min(1,(LB.clock-q.t)/150);r.position.set(LAB.X(q.cell%W),.4-(1-u)*.2,LAB.Z((q.cell/W)|0));r.rotation.y=q.cell;r.visible=true}else r.visible=false});
    bo.av.forEach((p,i)=>{p.visible=!!B.av;if(B.av){b2Put(p,B.av.col,i+1,.115);p.material.opacity=.15+.35*Math.abs(Math.sin(LB.clock*.012+i*.4))}});const as=B.avs,au=as?(LB.clock-as.t)/450:2;bo.avr.forEach((r,i)=>{r.visible=au<1.3;if(r.visible){r.position.set(LAB.X(as.col)+Math.sin(i*2.3)*.25,.45+Math.abs(Math.sin(au*9+i))*.3,LAB.Z(-1+(au-i*.07)*(L.H+1)));r.rotation.x=au*14+i}});
    const tt=B.tt;bo.cross.visible=bo.fall.visible=!!tt;if(tt){const u=(LB.clock-tt.t)/[1150,1000,880][b2Ph(B)],x=tt.cell%W,y=(tt.cell/W)|0;b2Put(bo.cross,x,y,.116);bo.cross.rotation.y=t*3;bo.cross.material.opacity=.3+.3*Math.abs(Math.sin(LB.clock*.014));
      const sx=LAB.X(B.vx),sz=LAB.Z(0),ex=LAB.X(x),ez=LAB.Z(y);bo.fall.position.set(sx+(ex-sx)*u,2.4+Math.sin(u*Math.PI)*2.2-u*2,sz+(ez-sz)*u);bo.fall.rotation.x=t*6}}},
geist:{
  spawn(B,L,n){const W=L.W,H=L.H,cs=[[W-2,H-2],[W-2,1],[1,H-2],[1,1]].sort((a,b)=>Math.hypot(b[0]-LB.bx,b[1]-LB.by)-Math.hypot(a[0]-LB.bx,a[1]-LB.by));B.gs=[];for(let k=0;k<n;k++)B.gs.push({x:cs[k][0],y:cs[k][1],a:0,small:n>1,on:true})},
  init(B,L){this.spawn(B,L,1);B.bm=L.boss.bomb.map(q=>({cell:q[1]*L.W+q[0],x:q[0],y:q[1],fz:0,cd:0,boom:-9999}))},
  caught(B,L){const on=B.gs.map(g=>g.on);this.spawn(B,L,B.phase?2:1);B.gs.forEach((g,k)=>{g.on=on[k]!==false});for(const b of B.bm)b.fz=0},
  arrive(B,L,cell){const c=LB.clock;for(const b of B.bm)if(b.cell===cell&&!b.fz&&c>=b.cd&&!B.bm.some(o=>o.fz)){b.fz=c;tone(900,.1,'square',.05)}},
  step(B,L,now,dt,c){const lit=B.bm.find(b=>b.fz);
    B.gs.forEach((g,k)=>{if(!g.on)return;const sp=L.boss.sp[b2Ph(B)]*(g.small?1.12:1)*(lit?2:1),tx=lit?lit.x:LB.bx+(g.small&&k?Math.sin(c*.0011)*1.6:0),ty=lit?lit.y:LB.by+(g.small&&k?Math.cos(c*.0011)*1.6:0),dx=tx-g.x,dy=ty-g.y,d=Math.hypot(dx,dy);if(d>.05){const s=Math.min(d,sp*dt);g.x+=dx/d*s;g.y+=dy/d*s;g.a=Math.atan2(dx,dy)}});
    if(B.gs.some(g=>g.on&&b2Near(g.x,g.y,.55,now))){labCaught(now,'Der Grubengeist hat dich berührt. Zurück zum Start.');return}
    for(const b of B.bm)if(b.fz&&c-b.fz>=2000){b.fz=0;b.cd=c+3500;b.boom=c;LB.shake=now;tone(60,.4,'square',.09);labSpark(b.cell,'#ffb84a',30,5);
      if(Math.hypot(LB.bx-b.x,LB.by-b.y)<1.5&&now>LB.safe){labCaught(now,'Zu nah an der Bombe. Zurück zum Start.');return}
      const hit=B.gs.filter(g=>g.on&&Math.hypot(g.x-b.x,g.y-b.y)<1.3);if(!hit.length){toast('Kein Geist war nah genug. Zünde, wenn einer näher ist.',1900);continue}
      for(const g of hit){if(B.hp<=0)break;g.on=false;labBossHit(now)}LB.safe=Math.max(LB.safe,now+1300);
      /* Nach dem ersten Treffer teilt er sich in zwei kleine Geister */
      if(B.hp===2&&B.phase===0){B.phase=1;this.spawn(B,L,2);toast('Er hat sich geteilt! Jetzt sind es zwei.',2200)}else if(B.hp===1)B.phase=2}},
  build(c){const{M,S,T,L,bo}=c;bo.gs=[0,1].map(()=>{const g=new T.Group();M('sph','#e8f4ff',.8,.8,.8,0,.9,0,{emissive:'#9ad8ff',emissiveIntensity:.7,transparent:true,opacity:.85},g);M('cone','#e8f4ff',.78,.9,.78,0,.4,0,{emissive:'#9ad8ff',emissiveIntensity:.7,transparent:true,opacity:.85},g).rotation.x=Math.PI;
      for(const k of[-1,1])M('sph','#15233a',.14,.2,.1,k*.17,.95,.34,null,g);M('sph','#15233a',.14,.1,.1,0,.74,.36,null,g);const h=labHalo('#9ad8ff',2.4,.5);h.position.y=.8;g.add(h);S.add(g);return g});
    bo.bm=L.boss.bomb.map(q=>{const b=new T.Group();M('sph','#23232c',.52,.52,.52,0,.3,0,null,b);M('cyl','#c8a060',.08,.2,.08,0,.62,0,null,b);const sp=labHalo('#ffb84a',.9,.9);sp.position.y=.78;b.add(sp);b.position.set(LAB.X(q[0]),0,LAB.Z(q[1]));S.add(b);const ring=b2Tile(c,'#ff5a2a',.3,3);b2Put(ring,q[0],q[1],.115);return{b,sp,ring}})},
  frame(B,L,bo,now,t,dt,hurt,dead){bo.gs.forEach((m,k)=>{const g=B.gs[k];m.visible=!!g&&g.on&&!dead;if(!m.visible)return;m.position.set(LAB.X(g.x),.15+Math.sin(t*3+k*2)*.1,LAB.Z(g.y));m.rotation.y=g.a;m.scale.setScalar(g.small?.68:1)});
    B.bm.forEach((b,k)=>{const o=bo.bm[k],c=LB.clock,ready=c>=b.cd;o.b.visible=ready&&!dead;o.sp.visible=!!b.fz&&Math.sin(now*.04)>-.3;o.b.scale.setScalar(b.fz?1+.15*Math.sin(now*.03):1);o.ring.visible=!!b.fz||c-b.boom<300;o.ring.material.opacity=b.fz?.15+.25*Math.abs(Math.sin(c*.012)):.7;o.ring.material.color.set(b.fz?'#ff5a2a':'#fff2c0')})}},
irrlicht:{
  holes(B,L){const W=L.W;for(const s of L.boss.holes)for(const q of s){const i=q[1]*W+q[0];if(L.grid[i]===4)L.grid[i]=1}B.hs=[];for(const q of L.boss.holes[(B.jn||0)%L.boss.holes.length]){const i=q[1]*W+q[0];if(i!==LB.pos){L.grid[i]=4;B.hs.push(q)}}},
  pick(B,L){let n;do n=(Math.random()*L.boss.pad.length)|0;while(n===B.cur);B.nx=n;B.t=LB.clock},
  init(B,L){B.cur=0;B.from=0;B.jump=-9999;B.lit=L.boss.pad.map(()=>0);this.holes(B,L);this.pick(B,L)},
  arrive(B,L,cell){L.boss.pad.forEach((q,k)=>{if(cell===q[1]*L.W+q[0]){B.lit[k]=LB.clock+[2200,1900,1600][b2Ph(B)];tone(700+k*40,.1,'triangle',.05)}})},
  step(B,L,now,dt,c){if(c-B.t<L.boss.wait[b2Ph(B)])return;const q=L.boss.pad[B.nx];B.from=B.cur;B.cur=B.nx;B.jump=c;
    B.jn=(B.jn||0)+1;this.holes(B,L);
    if(B.lit[B.cur]>c){labSpark(q[1]*L.W+q[0],'#7dffb0',28,5);labBossHit(now);if(B.hp>0)B.phase++}
    else{tone(120,.2,'square',.06);if(Math.hypot(LB.bx-q[0],LB.by-q[1])<1.3&&now>LB.safe)labCaught(now,'Die Irrlichtmutter ist neben dir gelandet. Zurück zum Start.')}
    B.lit[B.cur]=0;this.pick(B,L)},
  build(c){const{M,S,T,L,bo}=c;bo.pad=L.boss.pad.map(q=>{const p=M('cyl','#3f9a48',.9,.05,.9,LAB.X(q[0]),.13,LAB.Z(q[1]),{emissive:'#7dffb0',emissiveIntensity:0});p.material=p.material.clone();LAB.disp.push(p.material);const h=labHalo('#7dffb0',2,.0);h.position.set(LAB.X(q[0]),.4,LAB.Z(q[1]));S.add(h);return{p,h}});
    const g=new T.Group();M('sph','#5a8a6a',.9,.7,.9,0,.5,0,{emissive:'#7dffb0',emissiveIntensity:.3},g);M('cone','#4a7a5a',.8,.5,.8,0,.95,0,null,g);for(const k of[-1,1])M('sph','#fff6a0',.2,.24,.12,k*.2,.6,.38,{emissive:'#fff6a0',emissiveIntensity:1.4},g);const h=labHalo('#9dffb0',2.6,.5);h.position.y=.6;g.add(h);S.add(g);bo.g=g;
    bo.wisp=labHalo('#fff6a0',1.2,.95);S.add(bo.wisp);bo.wt=b2Tile(c,'#fff6a0',.5,1.1);
    bo.hole=[];for(let k=0;k<2;k++){const d=M('cyl','#05030a',.86,.02,.86,0,.118,0),r=M('tor','#b06aff',.84,.84,.5,0,.13,0,{emissive:'#b06aff',emissiveIntensity:1.2});r.rotation.x=Math.PI/2;bo.hole.push([d,r])}},
  frame(B,L,bo,now,t,dt,hurt,dead){const P=L.boss.pad,c=LB.clock,W=L.boss.wait[b2Ph(B)];bo.pad.forEach((o,k)=>{const on=B.lit[k]>c;o.p.material.emissiveIntensity=on?1.2:0;o.h.material.opacity=on?.6:0});
    const u=Math.min(1,(c-B.jump)/380),a=P[B.from],b=P[B.cur];bo.g.position.set(LAB.X(a[0]+(b[0]-a[0])*u),dead?-2*Math.min(1,(now-B.hitAt)/700):Math.sin(u*Math.PI)*1.6+Math.sin(t*3)*.04,LAB.Z(a[1]+(b[1]-a[1])*u));bo.g.rotation.z=hurt?Math.sin(now*.05)*.25:0;
    const n=P[B.nx],left=1-(c-B.t)/W;bo.wisp.visible=bo.wt.visible=!dead;bo.wisp.position.set(LAB.X(n[0])+Math.sin(t*4)*.15,.7+left*.9,LAB.Z(n[1])+Math.cos(t*3)*.15);b2Put(bo.wt,n[0],n[1],.116);bo.wt.rotation.y=t*2;bo.wt.material.opacity=.2+.4*(1-Math.max(0,left))*Math.abs(Math.sin(c*.01));
    bo.hole.forEach(([d,r],k)=>{const q=B.hs[k];d.visible=r.visible=!!q;if(q){d.position.set(LAB.X(q[0]),.118,LAB.Z(q[1]));r.position.set(LAB.X(q[0]),.13,LAB.Z(q[1]));r.rotation.z=t*2}})}},
katapult:{
  init(B,L){for(const k of'CPQR')L.grid[L.marks[k]]=2;B.pal={P:1,Q:1,R:1};B.tt=null;B.next=LB.clock+2200;B.shot=-9999},
  step(B,L,now,dt,c){const W=L.W;if(!B.tt&&c>=B.next&&!LB.roll&&LB.pos!==L.start){B.tt={cell:LB.pos,t:c,spread:B.phase>=1};B.shot=c;tone(220,.3,'sawtooth',.05)}
    if(B.tt&&c-B.tt.t>=[1250,1100,950][b2Ph(B)]){const q=B.tt.cell,qx=q%W,qy=(q/W)|0,sp=B.tt.spread;B.tt=null;B.next=c+L.boss.gap[b2Ph(B)];LB.shake=now;tone(70,.3,'square',.08);labSpark(q,'#ff9a3a',18,4);
      if(b2Near(qx,qy,.7,now)||(sp&&(b2Near(qx-1,qy,.7,now)||b2Near(qx+1,qy,.7,now)))){labCaught(now,'Volltreffer. Zurück zum Start.');return}if(sp){labSpark(q-1,'#ff9a3a',12,3);labSpark(q+1,'#ff9a3a',12,3)}
      for(const k of'PQR'){const m=L.marks[k];if(B.pal[k]&&Math.abs(m%W-qx)+Math.abs(((m/W)|0)-qy)===1){B.pal[k]=0;L.grid[m]=1;labSpark(m,'#c9a070',26,4);labBossHit(now);if(B.hp>0)B.phase++;break}}}},
  build(c){const{M,S,T,L,bo}=c,g=new T.Group(),m=L.marks.C;M('box','#6a4a2a',.9,.2,.9,0,.2,0,null,g);for(const k of[-1,1]){M('box','#55402e',.1,.9,.1,k*.36,.6,0,null,g);M('cyl','#3a2a20',.4,.1,.4,k*.46,.22,.3,null,g).rotation.z=Math.PI/2}M('box','#55402e',.82,.1,.1,0,1,0,null,g);
    const arm=new T.Group();M('box','#8a6236',.1,.1,1.3,0,0,.5,null,arm);M('sph','#9a8c7c',.36,.36,.36,0,.12,1.1,null,arm);arm.position.set(0,1,0);g.add(arm);bo.arm=arm;g.position.set(c.wx(m),0,c.wz(m));S.add(g);bo.g=g;
    bo.pal={};for(const k of'PQR'){const p=new T.Group(),i=L.marks[k];for(let s=-1;s<2;s++){M('cyl','#a67a48',.26,.9,.26,s*.3,.5,0,null,p);M('cone','#c9a070',.26,.3,.26,s*.3,1.08,0,null,p)}M('box','#7a5134',.96,.1,.12,0,.6,.1,null,p);p.position.set(c.wx(i),0,c.wz(i));S.add(p);bo.pal[k]=p}
    bo.cross=b2Tile(c,'#ff3a2a',.5,.9);bo.cx=[b2Tile(c,'#ff3a2a',.5,.9),b2Tile(c,'#ff3a2a',.5,.9)];bo.ball=M('sph','#9a8c7c',.5,.5,.5,0,-5,0)},
  frame(B,L,bo,now,t,dt,hurt,dead){const W=L.W,c=LB.clock,m=L.marks.C;for(const k of'PQR'){const p=bo.pal[k];p.visible=!!B.pal[k];}bo.g.rotation.z=dead?Math.min(1.2,(now-B.hitAt)/500):hurt?Math.sin(now*.05)*.08:0;
    const sw=Math.min(1,(c-B.shot)/260);bo.arm.rotation.x=B.tt?-1.3*sw:0;
    const tt=B.tt;bo.cross.visible=bo.ball.visible=!!tt;bo.cx.forEach((p,i)=>{p.visible=!!tt&&tt.spread;if(p.visible){const x=tt.cell%W+(i?1:-1),y=(tt.cell/W)|0;p.visible=L.grid[y*W+x]===1;b2Put(p,x,y,.116);p.rotation.y=t*3;p.material.opacity=bo.cross.material.opacity}});if(tt){const u=(c-tt.t)/[1250,1100,950][b2Ph(B)],x=tt.cell%W,y=(tt.cell/W)|0;b2Put(bo.cross,x,y,.116);bo.cross.rotation.y=t*3;bo.cross.material.opacity=.3+.3*Math.abs(Math.sin(c*.014));const sx=LAB.X(m%W),sz=LAB.Z((m/W)|0),ex=LAB.X(x),ez=LAB.Z(y);bo.ball.position.set(sx+(ex-sx)*u,1.2+Math.sin(u*Math.PI)*3.2-u*1,sz+(ez-sz)*u)}}},
morvan:{
  level(L){L.ports=[]},
  port(B,L){const W=L.W,b=L.boss.port[1][1]*W+L.boss.port[1][0],q=L.boss.pa[b2Ph(B)],a=q[1]*W+q[0];L.port.fill(-1);L.port[a]=b;L.port[b]=a;B.pa=q},
  place(B,L){const h=L.boss.mh;B.m=h[1]*L.W+h[0];B.mp=null;B.mDead=false;B.lm=LB.moves;B.mx=h[0];B.my=h[1];B.ms=1},
  init(B,L){B.st='idle';B.t=LB.clock;this.place(B,L);this.port(B,L)},caught(B,L){this.place(B,L);if(B.st==='charge'){B.st='idle';B.second=false;B.t=LB.clock}},
  step(B,L,now,dt,c,px,py){const cy=L.boss.cyc[b2Ph(B)];
    if(B.phase>=1){b2MirStep(B,L,dt);b2MirMove(B,L);if(b2Near(B.mx,B.my,.55,now)){labCaught(now,'Die Schattenkugel hat dich berührt. Zurück zum Start.');return}}
    if(B.st==='idle'){if(c-B.t>=cy&&!LB.roll&&now>LB.safe){B.st='charge';B.t=c;B.row=py;B.col=px;tone(300,1.1,'sawtooth',.04)}}
    else if(B.st==='charge'){if(c-B.t>=(B.second?560:[1250,1100,950][b2Ph(B)])){B.st='strike';B.t=c;LB.shake=now;tone(60,.3,'square',.09);tone(1400,.15,'sawtooth',.05);if((py===B.row||px===B.col)&&now>LB.safe)labCaught(now,'Morvans Blitz hat dich getroffen. Zurück zum Start.')}}
    else if(c-B.t>=450){/* In der letzten Phase folgt sofort ein zweiter Blitz auf Pias neue Stelle */
      if(B.phase>=2&&!B.second&&now>LB.safe){B.second=true;B.st='charge';B.t=c;B.row=py;B.col=px;tone(400,.5,'sawtooth',.04)}else{B.second=false;B.st='idle';B.t=c}}},
  bump(B,L,end,dx,dy,now){if(end+dx+dy*L.W!==L.marks.M)return;
    if(dy===1){if(B.st==='idle'){tone(700,.1,'square',.05);toast('Sein Schild hält. Triff ihn, während er den Blitz lädt.',2000)}else{labSpark(L.marks.M,'#ffd84d',30,5);B.st='idle';B.second=false;B.t=LB.clock;b2Hit(now,()=>{b2Home();B2.morvan.place(B,L);B2.morvan.port(B,L)})}}
    else{tone(700,.1,'square',.05);toast('Von vorn ist er unverwundbar. Finde den Weg in seinen Rücken.',2000)}},
  build(c){const{M,S,T,L,W,bo}=c,g=new T.Group(),m=L.marks.M;M('cone','#4a2a7a',.9,1.2,.9,0,.62,0,null,g);M('sph','#d8c0a8',.42,.42,.42,0,1.3,0,null,g);M('cone','#2a1a4a',.56,.8,.56,0,1.85,0,null,g);M('cyl','#2a1a4a',.8,.05,.8,0,1.5,0,null,g);M('cone','#e8e8f0',.24,.5,.14,0,1.02,.2,null,g).rotation.x=Math.PI;
    for(const k of[-1,1])M('sph','#ff3a5a',.08,.1,.06,k*.11,1.34,.19,{emissive:'#ff3a5a',emissiveIntensity:1.6},g);M('cyl','#6a4a2a',.07,1.6,.07,.5,.8,.1,null,g);bo.orb=M('sph','#ffd84d',.26,.26,.26,.5,1.7,.1,{emissive:'#ffb000',emissiveIntensity:1.4},g);bo.oh=labHalo('#ffd84d',1.6,.7);bo.oh.position.set(.5,1.7,.1);g.add(bo.oh);
    bo.sh=M('sph','#7a5aff',1.7,2.3,1.7,0,1,0,{emissive:'#7a5aff',emissiveIntensity:.6,transparent:true,opacity:.28,depthWrite:false},g);bo.sh.material=bo.sh.material.clone();LAB.disp.push(bo.sh.material);g.position.set(c.wx(m),0,c.wz(m));S.add(g);bo.g=g;
    bo.pt=[0,1].map(()=>{const m=new T.Mesh(c.G.pl,c.flat('#7df0ff',.75));m.scale.set(.9,1,.9);S.add(m);const h=labHalo('#7df0ff',1.8,.5);S.add(h);return[m,h]});bo.tm=c.flat('#ffe36b',.5);bo.tel=[];for(let k=0;k<W+L.H;k++){const p=new T.Mesh(c.G.pl,bo.tm);p.scale.set(.9,1,.9);p.visible=false;S.add(p);bo.tel.push(p)}bo.mir=b2Shadow(c)},
  frame(B,L,bo,now,t,dt,hurt,dead){const W=L.W,H=L.H,c=LB.clock,ch=B.st==='charge',stk=B.st==='strike',g=bo.g;g.rotation.z=hurt?Math.sin(now*.05)*.15:0;g.position.y=dead?-2.4*Math.min(1,(now-B.hitAt)/900):Math.sin(t*2)*.05;g.rotation.y=dead?t*10:0;
    bo.sh.visible=!dead;bo.sh.material.opacity=ch||stk?(Math.sin(now*.05)>0?.05:.2):.3;bo.orb.scale.setScalar(ch?.26+.3*Math.min(1,(c-B.t)/1250):.26);bo.oh.scale.setScalar(ch?1.6+2.4*Math.min(1,(c-B.t)/1250):stk?4.5:1.6);
    bo.tm.opacity=ch?.2+.35*Math.abs(Math.sin(c*.014)):stk?.95:0;bo.tm.color.set(stk?'#ffffff':'#ffe36b');let n=0;const on=ch||stk;
    for(let x=1;x<W-1&&on;x++)if(L.grid[B.row*W+x]===1){const p=bo.tel[n++];p.visible=true;b2Put(p,x,B.row,.115)}for(let y=1;y<H-1&&on;y++)if(y!==B.row&&L.grid[y*W+B.col]===1){const p=bo.tel[n++];p.visible=true;b2Put(p,B.col,y,.115)}for(;n<bo.tel.length;n++)bo.tel[n].visible=false;
    [B.pa,L.boss.port[1]].forEach((q,k)=>{const[m,h]=bo.pt[k];m.visible=h.visible=!dead;m.position.set(LAB.X(q[0]),.113,LAB.Z(q[1]));m.rotation.y=t*2;h.position.set(LAB.X(q[0]),.4,LAB.Z(q[1]));h.scale.setScalar(1.8+.2*Math.sin(t*6+k))});
    bo.mir.visible=B.phase>=1&&!dead;bo.mir.position.set(LAB.X(B.mx),0,LAB.Z(B.my));bo.mir.scale.setScalar(Math.max(.05,B.ms||1))}}};
