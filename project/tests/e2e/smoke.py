#!/usr/bin/env python3
"""Spieltest im echten Browser. Prüft, dass beide Spiele starten und die Kernabläufe ohne Fehler laufen.
Aufruf: python3 tests/e2e/smoke.py [schnell|alles] [pfad/zur/index.html]
  schnell: Start, Pixaku, Level, Tor, Schild, alle Bosse starten, zwei Filme (etwa 3 Minuten)
  alles:   zusätzlich alle 13 Bosskämpfe per Bot und alle 16 Filme (etwa 15 Minuten)"""
import asyncio,sys,os,json
from playwright.async_api import async_playwright
sys.path.insert(0,os.path.dirname(__file__));import bots
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
MODE=sys.argv[1] if len(sys.argv)>1 else 'schnell'
PAGE=os.path.abspath(sys.argv[2]) if len(sys.argv)>2 else os.path.join(ROOT,'dist','index.html')
FONTS=os.path.join(ROOT,'dist','pwa','fonts');THREE=os.path.join(ROOT,'node_modules','three','build','three.min.js')
FILMS=['intro','schlund','felder','kraehen','hof','stadt','hafen','balduin','gero','eis','berge','mine','sumpf','schlacht','turm','finale']
results=[];errs=[]
def check(name,ok,info=''):
    results.append((name,bool(ok),info));print(('  ok   ' if ok else '  FEHLER ')+name+(' · '+str(info) if info!='' and not ok else ''),flush=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        ctx=await b.new_context(viewport={'width':300,'height':600},device_scale_factor=1,has_touch=True,is_mobile=True);pg=await ctx.new_page()
        pg.on('pageerror',lambda e: errs.append(str(e)));pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        css=os.path.join(ROOT,'shell','fontcss.css')
        await pg.route('**/fonts.googleapis.com/**',lambda r: r.fulfill(body=open(css).read() if os.path.exists(css) else '',content_type='text/css'))
        await pg.route('**/localfont/**',lambda r: r.fulfill(path=os.path.join(FONTS,r.request.url.split('/')[-1]),content_type='font/woff2'))
        await pg.route('**/three.min.js',lambda r: r.fulfill(path=THREE,content_type='text/javascript'))
        ev=pg.evaluate;wait=pg.wait_for_timeout
        async def fresh(game):
            await pg.goto('file://'+PAGE);await ev("localStorage.clear();const s=(k,v)=>localStorage.setItem('pixaku.'+k,typeof v==='string'?v:JSON.stringify(v));s('seen','1');s('tut','1');s('ltut','1');s('game','%d');s('lab',{max:200,st:{},seen3:[0,1,2,3,4,5,6,7,8,9,10,11,12]});s('lcs',%s);s('lbs',[])"%(game,json.dumps(FILMS)));await pg.reload();await wait(1500)
        def noerr(name):
            ok=not errs;check(name+': keine Programmfehler',ok,errs[:2]);errs.clear()
        # ---------- Rahmen ----------
        print('Rahmen');await fresh(0)
        check('Startseite von Pixaku ist sichtbar',await ev("$('#home').classList.contains('on')&&GAME===0"))
        check('Logo ist gezeichnet',await ev("$('#logo').width>50"))
        check('Ziffernschrift ist geladen',await ev("document.fonts.check('700 20px PixNum')"))
        await ev("setGame(1,true)");await wait(600);check('Wechsel zu Pias Quest',await ev("GAME===1&&$('#gLbl').textContent==='Pias Quest'"))
        await ev("setGame(0,true)");await wait(400);await pg.reload();await wait(1200);check('Spielauswahl bleibt nach Neuladen erhalten',await ev("GAME===0"))
        await ev("openSettings()");await wait(400);check('Einstellungen öffnen sich',await ev("sheetOpen"));await ev("closeSheet()");await wait(500);noerr('Rahmen')
        # ---------- Pixaku ----------
        print('Pixaku');await pg.click('#bArcade');await wait(700)
        check('Arcade startet mit Countdown und stehender Uhr',await ev("A&&A.hold===true&&A.time===75&&!$('#cdn').hidden"));await wait(3600)
        check('Nach dem Countdown läuft die Uhr',await ev("A&&A.hold===false&&A.time<75&&$('#cdn').hidden"))
        check('Arcade-Rätsel ist aufgebaut',await ev("G&&G.puz&&G.puz.rects.length>2"))
        solved=await ev("(async()=>{const lv=A.level,wait=ms=>new Promise(r=>setTimeout(r,ms));for(const r of G.puz.rects)commit(r.x,r.y,r.w,r.h);await wait(3000);return [A?A.level:null,lv,A?A.time:0]})()")
        check('Gelöstes Bild bringt die nächste Runde',solved[0] is not None and solved[0]>solved[1],solved)
        await ev("showBonus(14)");await wait(300);check('Bonustafel erscheint',await ev("!$('#bonus').hidden&&$('#bonus b').textContent.includes('14')"))
        await ev("endArcade(true)");await wait(1700)
        if await ev("!!document.querySelector('#aHome')"): await pg.click('#aHome')
        await wait(700);await pg.click('#bDaily');await wait(900)
        if await ev("sheetOpen"): await ev("document.querySelector('#tB').click()")
        await wait(2500);check('Tagesbild startet',await ev("$('#game').classList.contains('on')&&!!G&&!A"))
        box=await ev("(()=>{const r=bcv.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
        await pg.mouse.move(box[0]+box[2]*.3,box[1]+box[3]*.4);await pg.mouse.down();await pg.mouse.move(box[0]+box[2]*.4,box[1]+box[3]*.4,steps=4);await pg.mouse.up();await wait(400)
        await pg.click('#gBack');await wait(900);check('Angefangenes Bild wird gespeichert',await ev("saves().length===1&&!$('#bCont').hidden"))
        bb=await ev("(()=>{const r=$('#contCv').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()");await pg.mouse.click(bb[0],bb[1]);await wait(1200)
        check('Tipp auf das Vorschaubild setzt direkt fort',await ev("$('#game').classList.contains('on')&&!sheetOpen"));noerr('Pixaku')
        # ---------- Pias Quest ----------
        print('Pias Quest');await fresh(1)
        check('Startseite von Pias Quest mit eigenem Schriftzug',await ev("GAME===1&&$('#logo').width>50"))
        HINT="""(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms)),t0=performance.now();while(!LB.won&&performance.now()-t0<90000){if(LB.roll||LB.dead||LB.queue.length){await wait(25);continue}const L=LB.L,fk=LB.fz.findIndex(v=>v);if(fk>=0){if(labNear(L,fk,LB.pos)){for(let d=0;d<4;d++){const s=labSlide(L,LB.pos,d,LB.mask);if(s.cells.length&&!s.dead&&!labNear(L,fk,s.end)){labMove(d);break}}}await wait(80);continue}const p=labNextPath(L,LB.pos,LB.painted,LB.mask);if(!p||!p.length){await wait(60);continue}labMove(p[0]);await wait(40)}return [LB.won,LB.moves,LB.left]})()"""
        async def start(n):
            await ev("closeSheet()");await wait(600);await ev("labStart(%d)"%n);await wait(3500)
        await start(3);r=await ev(HINT);await wait(2200);check('Level 3 lässt sich bis zum Sieg spielen',r[0],r);check('Sterne werden gespeichert',await ev("(labData().st[3]||0)>=1"))
        await start(61);r=await ev("""(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms)),L=LB.L,idle=async()=>{let g=0;while((LB.roll||LB.queue.length||LB.dead)&&g++<400)await wait(20)};
          const bfs=goal=>{const seen=new Map([[LB.pos,[]]]),q=[LB.pos];while(q.length){const p=q.shift();for(let d=0;d<4;d++){const s=labSlide(L,p,d,LB.mask);if(!s.cells.length||s.dead)continue;const np=seen.get(p).concat(d);if(goal(s))return np;if(!seen.has(s.end)){seen.set(s.end,np);q.push(s.end)}}}return null};
          let p=bfs(s=>s.cells.includes(L.locks[0].k));for(const d of p){labMove(d);await wait(40);await idle()}const a=[LB.got,LB.dopen[0],$('#lInv').children.length,LB.doorK[0]];
          p=bfs(s=>s.cells.includes(L.locks[0].d));for(const d of p){labMove(d);await wait(40);await idle()}await wait(300);return [a,[LB.dopen[0],$('#lInv').children.length,LB.doorK[0]]]})()""")
        check('Schlüssel liegt im Inventar, das Tor bleibt zu',r[0]==[1,False,1,0],r[0]);check('Tor öffnet sich bei Ankunft, der Schlüssel ist verbraucht',r[1]==[True,0,1],r[1])
        n=await ev("(()=>{for(let n=31;n<120;n++){if(n%15===0)continue;const L=labGen(n);if(L.shields&&L.shields.length)return n}return 0})()");await start(n)
        r=await ev("""(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms)),L=LB.L,sc=LB.shields[0].c,idle=async()=>{let g=0;while((LB.roll||LB.queue.length||LB.dead)&&g++<400)await wait(20)};
          const bfs=goal=>{const seen=new Map([[LB.pos+'/'+LB.mask,[]]]),q=[[LB.pos,LB.mask]];while(q.length){const[p,m]=q.shift();for(let d=0;d<4;d++){const s=labSlide(L,p,d,m);if(!s.cells.length)continue;const np=seen.get(p+'/'+m).concat(d);if(goal(s))return np;if(s.dead)continue;const nm=m|(s.keys||0),k=s.end+'/'+nm;if(!seen.has(k)){seen.set(k,np);q.push([s.end,nm])}}}return null};
          let p=bfs(s=>!s.dead&&s.cells.includes(sc));for(const d of p){labMove(d);await wait(40);await idle()}const a=LB.shield,lit=LB.total-LB.left;p=bfs(s=>s.dead);for(const d of p){labMove(d);await wait(40);await idle()}await wait(1300);await idle();
          const b=[LB.shield,LB.lost,LB.pos===L.start,LB.total-LB.left>=lit];p=bfs(s=>s.dead);for(const d of p){labMove(d);await wait(40);await idle()}await wait(1600);await idle();return [a,b,[LB.lost,LB.total-LB.left,labRate().s]]})()""")
        check('Schutzschild wird eingesammelt',r[0]==True,r);check('Sturz mit Schild: zurück zum Start, Licht bleibt',r[1]==[False,False,True,True],r[1]);check('Sturz ohne Schild: Level von vorn und ein Stern weniger',r[2][0]==True and r[2][1]==1 and r[2][2]==1,r[2]);noerr('Pias Quest')
        # ---------- Bosse ----------
        print('Bosse')
        for nm,lv in bots.LEVEL.items():
            await ev("closeSheet()");await wait(700);await ev("store.set('lbs',[]);labPlay(%d)"%lv);await wait(800)
            intro=await ev("!!document.querySelector('#lbGo')")
            if intro: await pg.click('#lbGo')
            await wait(4200);st=await ev("[!!LB.boss,LB.boss&&LB.boss.hp,LB.boss&&LB.boss.type,!!LAB.bo]")
            check('%s: Vorstellung, Arena und drei Leben'%nm,intro and st==[True,3,nm,True],st)
            if MODE=='alles':
                await ev(bots.COMMON)
                try: r=await asyncio.wait_for(ev(bots.BOTS[nm]),190)
                except Exception as e: r=['Zeit abgelaufen',str(e)[:80]]
                await wait(3200);check('%s: Bot besiegt den Boss'%nm,await ev("(labData().st[%d]||0)>=1"%lv),r)
            noerr(nm)
        # ---------- Filme ----------
        print('Filme');await ev("closeSheet();show('home')");await wait(600)
        for f in (FILMS if MODE=='alles' else ['intro','hafen']):
            await ev("window.__d=0;cinePlay('%s',()=>{window.__d=1})"%f);ok=False
            for _ in range(260):
                await wait(100)
                if await ev("window.__d===1"): ok=True;break
            check('Film %s läuft bis zum Ende'%f,ok)
        noerr('Filme');await b.close()
    bad=[r for r in results if not r[1]];print('\n%d Prüfungen, %d fehlgeschlagen'%(len(results),len(bad)))
    for r in bad: print('  FEHLER',r[0],r[2])
    sys.exit(1 if bad else 0)
asyncio.run(main())
