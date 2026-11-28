/* Levelgenerator: gleiche Level bei jedem Lauf, alle lösbar, Regeln für Tore, Prellböcke, Schlünde und Flieger */
const test=require('node:test'),assert=require('node:assert/strict');
const {Q,P,replay,levelSig,golden}=require('./helpers.js');
const ALL=[];for(let n=1;n<=195;n++)if(n%15)ALL.push(n);
const cache=new Map(),gen=n=>{if(!cache.has(n))cache.set(n,Q.labGen(n));return cache.get(n)};
test('Kampagne hat 13 Welten mit je 15 Leveln',()=>{assert.equal(Q.labSpec(1).w,0);assert.equal(Q.labSpec(195).w,12);assert.equal(Q.labSpec(16).j,0)});
test('Generator ist deterministisch',()=>{for(const n of [3,47,88,131,190]){const a=Q.labGen(n),b=Q.labGen(n);assert.equal(levelSig(a),levelSig(b),'Level '+n)}});
test('Alle 182 Level entsprechen dem festgehaltenen Stand',()=>{const now={};for(const n of ALL)now[n]=levelSig(gen(n));const want=golden('quest-levels',now);const diff=ALL.filter(n=>want[n]!==now[n]);
  assert.deepEqual(diff,[],'Geänderte Level. Wenn das gewollt ist: UPDATE_GOLDEN=1 npm test')});
test('Jedes Level ist mit seiner mitgelieferten Lösung vollständig lösbar',()=>{for(const n of ALL){const L=gen(n);assert.equal(replay(L,L.sol),0,'Level '+n);assert.ok(!L.fallback,'Notlevel '+n)}});
test('Kein Level hat eine Sackgasse',()=>{for(const n of ALL){const r=Q.labCheck(gen(n));assert.ok(r.ok&&!r.un.length,'Level '+n)}});
test('Nach zufälligem Herumrollen bleibt jedes Level lösbar',()=>{const rng=P.mulberry32(5);for(const n of ALL){const L=gen(n),N=L.W*L.H;for(let k=0;k<3;k++){const p=new Uint8Array(N);let pos=L.start,mask=0;p[pos]=1;
      for(let i=0;i<60;i++){const s=Q.labSlide(L,pos,Math.floor(rng()*4),mask);if(s.dead||s.trap||!s.cells.length)continue;for(const c of s.cells)if(L.grid[c]===1)p[c]=1;pos=s.end;mask|=s.keys}
      let left=0,g=0;for(let i=0;i<N;i++)if(L.grid[i]===1&&!p[i])left++;while(left>0&&g++<4000){const path=Q.labNextPath(L,pos,p,mask);assert.ok(path,'Level '+n+' hängt fest');for(const d of path){const s=Q.labSlide(L,pos,d,mask);for(const c of s.cells)if(!p[c]&&L.grid[c]===1){p[c]=1;left--}pos=s.end;mask|=s.keys}}assert.equal(left,0,'Level '+n)}}});
test('Jeder Schlund liegt auf einer Rollbahn, außer dem ersten in Level 6',()=>{for(const n of ALL){if(n===6)continue;const L=gen(n);L.grid.forEach((v,i)=>{if(v===4)assert.ok(Q.labThreat(L,i),'Level '+n)})}});
test('Jeder Prellbock ist für die Lösung nötig, außer dem Kennenlern-Prellbock in Level 46',()=>{let c=0;for(const n of ALL){if(n===46)continue;const L=gen(n);for(let i=0;i<L.bmp.length;i++)if(L.bmp[i]){c++;const o=L.bmp[i];L.bmp[i]=0;const r=Q.labCheck(L);L.bmp[i]=o;assert.ok(!r.ok||r.un.length,'Level '+n)}}assert.ok(c>40,'zu wenige Prellböcke: '+c);assert.ok(gen(46).bmp.some(v=>v),'Level 46 ohne Prellbock')});
test('Jedes Tor versperrt einen echten Zugang',()=>{let c=0;for(const n of ALL){const L=gen(n);for(let k=0;k<L.locks.length;k++){c++;assert.ok(Q.labGate(L,k),'Level '+n)}}assert.ok(c>100);assert.ok(gen(61).locks.length>=1,'Erstes Hafenlevel ohne Tor')});
test('Flieger lassen sich bei jeder Rollgeschwindigkeit mit Spielraum umgehen',()=>{for(const n of ALL){const L=gen(n);if(!L.guards.length)continue;for(const K of Q.LG_K){let pos=L.start,mask=0,time=0;for(const d of L.sol){const s=Q.labSlide(L,pos,d,mask,true),plan=Q.labRollPlan(L,pos,s.cells,K),ks=[...new Set(s.cells.map(c=>L.gAt[c]).filter(k=>k>=0))];
        assert.ok(L.gAt[pos]<0,'Halt auf einer Flugbahn, Level '+n);let w=0;while(ks.length&&w<32&&(Q.labHit(L,plan,time+w-.15,.5,ks)||Q.labHit(L,plan,time+w,.5,ks)||Q.labHit(L,plan,time+w+.15,.5,ks)))w+=.04;assert.ok(w<32,'Kein Zeitfenster, Level '+n);time+=w+plan.T+.05;pos=s.end;mask|=s.keys}}}});
test('Levellänge bleibt kindgerecht: kein Level über 80 Züge',()=>{for(const n of ALL)assert.ok(gen(n).sol.length<=80,'Level '+n+': '+gen(n).sol.length)});
test('Schutzschilde gibt es erst ab der dritten Welt und nur in Leveln mit Schlund',()=>{let c=0;for(const n of ALL){const L=gen(n),s=L.shields||[];if(n<=30)assert.equal(s.length,0);if(s.length){c++;assert.ok(L.grid.some(v=>v===4));assert.equal(L.grid[s[0]],1)}}assert.ok(c>=20)});
test('Elemente erscheinen in der vorgesehenen Welt',()=>{const has=(a,b,f)=>ALL.filter(n=>n>=a&&n<=b).some(n=>f(gen(n)));
  assert.ok(!has(1,5,L=>L.grid.some(v=>v===4)),'Schlünde vor Level 6');assert.ok(has(6,14,L=>L.grid.some(v=>v===4)));assert.ok(!has(1,20,L=>L.guards.length),'Krähen vor Level 21');assert.ok(has(21,29,L=>L.guards.length));
  assert.ok(!has(1,30,L=>L.ports.length),'Portale vor dem Bauernhof');assert.ok(has(31,44,L=>L.ports.length));assert.ok(!has(1,45,L=>L.bmp.some(v=>v)),'Prellböcke vor der Stadt');assert.ok(!has(1,60,L=>L.locks.length),'Schlösser vor dem Hafen');
  assert.ok(has(91,104,L=>L.locks.some(q=>q.bomb)),'Bomben im Schloss');assert.ok(has(106,119,L=>L.arr.some(v=>v>=0)),'Eisrinnen im Eis')});
