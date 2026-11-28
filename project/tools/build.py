#!/usr/bin/env python3
"""Baut aus Rahmen und Spielen eine einzige HTML-Datei: dist/index.html.
Der Rahmen (shell/index.tpl.html) enthält Platzhalter, in die jedes Spiel seinen Code bekommt."""
import os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'));os.chdir(ROOT)
rd=lambda p:open(p,encoding='utf-8').read()
REQ="if(typeof module!=='undefined'&&typeof mulberry32==='undefined'){const C=require('../pixaku/core.js');global.mulberry32=C.mulberry32;global.hashStr=C.hashStr}"
quest=rd('games/quest/labcore.js').split("if(typeof module!=='undefined')module.exports")[0].replace(REQ,"")
for f in('lab.js','boss.js','boss2.js','cine.js'):quest+=rd('games/quest/'+f)
t=rd('shell/index.tpl.html')
t=t.replace('/*__CORE__*/',rd('games/pixaku/core.js')).replace('/*__R3__*/',rd('games/pixaku/r3.js')).replace('__PIXNUM__',rd('shell/pixnum.b64')).replace('/*__GSAP__*/',rd('node_modules/gsap/dist/gsap.min.js')).replace('/*__LAB__*/',quest)
os.makedirs('dist',exist_ok=True);open('dist/index.html','w',encoding='utf-8').write(t);print('dist/index.html',len(t)//1024,'kB')
