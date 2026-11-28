/* ---------- Schnittstelle zwischen Rahmen und Spielen ----------
   Jedes Spiel meldet sich mit Shell.register({...}) an. Der Rahmen kennt keine Spielnamen.
   Pflichtfelder:
     id        eindeutige Kennung in Kleinbuchstaben, zum Beispiel 'quest'
     name      Anzeigename in der Spielauswahl
     tagline   Zeile unter dem Schriftzug
     logo(anim,run)  zeichnet den Schriftzug in die Fläche #logo. run ist die laufende Nummer aus logoRun, damit alte Animationen enden.
     hero()    startet die Vorschau in der Fläche #hero. Sie endet selbst, sobald heroRun weiterzählt.
   Wahlweise:
     init()            einmal beim Start, nachdem alle Spiele angemeldet sind
     onHome()          vor jedem Anzeigen der Startseite: eigene Knöpfe und Zähler auffrischen
     onShow(id)        nach jedem Wechsel des Bildschirms, id ist die Kennung des neuen Bildschirms
     onResize()        nach einer Größenänderung des Fensters
     onBack()          Zurück-Taste des Geräts: liefert true, wenn das Spiel sie selbst behandelt hat
     scrollScreens     Liste eigener Bildschirme mit scrollbarem Inhalt
     onWake()          nach einer längeren Pause der App: gezeichnete Flächen erneuern
     settingsRows()    liefert HTML für eigene Zeilen in den Einstellungen
     settingsBind(el)  verdrahtet diese Zeilen im geöffneten Blatt
   Das Menü eines Spiels liegt in games/<id>/html/menu.html und wird auf der Startseite in <div class="gmenu" data-game="<id>"> eingesetzt.
   Der Rahmen zeigt immer nur das Menü des gewählten Spiels. */
const Shell={games:[],cur:0,
  register(g){for(const k of['id','name','tagline','logo','hero'])if(!g[k])throw new Error('Spiel ohne Feld '+k);if(this.games.some(x=>x.id===g.id))throw new Error('Spiel doppelt angemeldet: '+g.id);this.games.push(g);return g},
  get game(){return this.games[this.cur]},
  is(id){return this.game&&this.game.id===id},
  each(hook,...a){for(const g of this.games)if(typeof g[hook]==='function')g[hook](...a)},
  /* Wählt ein Spiel nach Nummer oder Kennung. user: der Wechsel kommt von einer Eingabe und wird gespeichert und animiert. */
  select(which,user){let i=typeof which==='string'?this.games.findIndex(g=>g.id===which):which|0;const n=this.games.length;i=((i%n)+n)%n;this.cur=i;const g=this.game;if(user)store.set('game',i);
    for(const m of document.querySelectorAll('.gmenu'))m.classList.toggle('on',m.dataset.game===g.id);$('.hm').dataset.game=g.id;$('.tagline').textContent=g.tagline;$('#gLbl').textContent=g.name;
    $('#gDots').innerHTML=this.games.map((_,k)=>`<i${k===i?' class="on"':''}></i>`).join('');for(const b of[$('#gPrev'),$('#gNext')])b.hidden=n<2;$('#gDots').hidden=n<2;
    if(g.onHome)g.onHome();if(user){const h=$('#hero');h.classList.remove('sw');void h.offsetWidth;h.classList.add('sw');sfx.tick();layoutHome();drawLogo(false);heroStart()}},
  /* Einmal beim Start: Spielauswahl verdrahten, gespeichertes Spiel wählen */
  init(){const z=$('.z2'),ar=d=>`<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;let p=null;z.addEventListener('pointerdown',e=>{p={x:e.clientX,y:e.clientY}});
    z.addEventListener('pointerup',e=>{if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p=null;if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy)*1.3)this.select(this.cur+(dx<0?1:-1),true)});
    $('#gPrev').innerHTML=ar('M15 5l-7 7 7 7');$('#gNext').innerHTML=ar('M9 5l7 7-7 7');$('#gPrev').onclick=e=>{e.stopPropagation();this.select(this.cur-1,true)};$('#gNext').onclick=e=>{e.stopPropagation();this.select(this.cur+1,true)};
    this.each('init');this.select(Math.min(this.games.length-1,+store.get('game',0)||0))}};
