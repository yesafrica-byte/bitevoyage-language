/* BiteVoyage Language Quest Premium V6.3 r10 audio clarity | 1920 expressions | clickable word audio | PWA intact */
(function(){
'use strict';
function boot(){
 const root=document.getElementById('bvq-v3');
 if(!root || root.dataset.bvqV62Ready==='1')return;
 const cfg=window.BVQ_V62_DATA;
 const $=name=>document.getElementById('bvq3-'+name);
 const warn=$('runtime-warning');
 function status(message){if(warn)warn.textContent=message;}
 if(!cfg||!cfg.langs||!cfg.scenes||!cfg.data){status('V6.3 데이터 로드 실패: GitHub Pages에 bvq62-data.js가 있는지 확인해 주세요.');return;}
 const supported=['en','ja','zh','ko'];
 const LEVELS=['beginner','intermediate','advanced'];
 const LEVEL_LABELS={'beginner':'초급','intermediate':'중급','advanced':'고급'};
 const EXPECTED={'beginner':16,'intermediate':8,'advanced':8};
 let total=0,readings=0,aligned=0,integrityError='';
 if(cfg.version!=='6.3.0'||cfg.build_id!=='bvq63-20261123-pronunciation-r8'||cfg.audio_revision!=='r10-20261126') integrityError='데이터·엔진 버전 불일치';
 if(!integrityError) for(const lng of supported){
  if(!cfg.data[lng]){integrityError='언어 데이터 누락: '+lng;break;}
  for(const sc of cfg.scenes.map(s=>s[0])){
   for(const lv of LEVELS){
    const set=cfg.data[lng][sc]?.[lv];
    if(!Array.isArray(set)||set.length!==EXPECTED[lv]){integrityError='문장 수 오류: '+lng+'/'+sc+'/'+lv;break;}
    for(const item of set){
     total++; if(item&&typeof item[1]==='string'&&item[1].trim())readings++;
     if((lng==='ja'||lng==='zh')&&(!Array.isArray(item[3])||!item[3].length||item[3].some(p=>!Array.isArray(p)||p.length!==2)||item[3].map(p=>p[0]).join('')!==item[0]||item[3].map(p=>p[1]).join(' ')!==item[1]))
      integrityError='원문·발음 대응 오류: '+lng+'/'+sc+'/'+lv;
     if((lng==='ja'||lng==='zh')&&lv==='beginner') aligned++;
    }
    if(integrityError)break;
   }
   if(integrityError)break;
  }
  if(integrityError)break;
 }
 if(integrityError||total!==1920||readings!==1920||aligned!==480){
  status('V6.3 데이터 검증 실패: '+(integrityError||('발음 '+readings+'/'+total+', 초급 정렬 '+aligned+'/480'))+' · 최신 JS 두 개를 확인해 주세요.');return;
 }
 const required=['share-notice','languages','scenes','search','lesson-title','counter','foreign','roman','roman-label','roman-box','roman-toggle','meaning','position','prev','next','bar','answers','xp','done','status','feedback','speak','slow','repeat','stop','check','reset','segment-box','segment-line','segment-toggle','sound-toggle','aligned-chips','share-native','share-copy','share-facebook','share-x','shortcut-open','levels','vocab-box','vocab-list','level-progress','continue','review','review-note'];
 const missing=required.filter(id=>!$(id));
 if(missing.length){status('페이지 구성 요소가 누락되었습니다: '+missing.join(', '));return;}
 root.dataset.bvqV62Ready='1';
 const LANGS=cfg.langs,SCENES=cfg.scenes,DATA=cfg.data;
 let lang='ja',scene='airport',level='beginner',idx=0,selected=-1,rate=1,options=[],audioSeq=0,showReading=true,answered=false,quizErrors=0,reviewOnly=false;
 const STORE='bvq-v5-progress';let progress={xp:0,done:{},wrong:{}};
 try{const s=JSON.parse(localStorage.getItem(STORE)||'null');if(s&&typeof s==='object'){progress.xp=Number(s.xp)||0;progress.done=s.done||{};progress.wrong=s.wrong||{}}}catch(e){}
 function save(){try{localStorage.setItem(STORE,JSON.stringify(progress));}catch(e){}}
 const PREF='bvq-v56-ui';let settings={sounds:false,segments:true};
 try{const saved=JSON.parse(localStorage.getItem(PREF)||localStorage.getItem('bvq-v55-ui')||localStorage.getItem('bvq-v54-ui')||'null');if(saved&&typeof saved==='object'){settings.sounds=saved.sounds===true;settings.segments=saved.segments!==false;}}catch(e){}
 function saveSettings(){try{localStorage.setItem(PREF,JSON.stringify(settings));}catch(e){}}
 function decode(v){let s=String(v==null?'':v);const t=document.createElement('textarea');for(let i=0;i<5;i++){t.innerHTML=s;const n=t.value;if(n===s)break;s=n;}return s;}
 function put(id,value){$(id).textContent=decode(value);}
 function make(tag,cl,value){const x=document.createElement(tag);if(cl)x.className=cl;if(value!==undefined)x.textContent=decode(value);return x;}
 let activeAudioButton=null, activeUtterance=null, audioTimer=null;
 function clearWordAudio(){if(activeAudioButton){activeAudioButton.classList.remove('bv-word-playing');activeAudioButton.setAttribute('aria-pressed','false');activeAudioButton=null;}}
 function stop(){audioSeq++; if(audioTimer!==null){clearTimeout(audioTimer);audioTimer=null;}
  const wasActive=!!activeUtterance;activeUtterance=null;clearWordAudio();
  if('speechSynthesis' in window){try{const s=window.speechSynthesis;if(wasActive||s.speaking||s.pending)s.cancel();}catch(e){}}
 }
 const rows=()=>DATA[lang][scene][level],current=()=>rows()[idx];
 const phraseKey=()=>lang+'|'+scene+'|'+(level==='beginner'?idx:level+'|'+idx);
 const LAST='bvq-v6-last';
 function remember(){try{localStorage.setItem(LAST,JSON.stringify({lang,scene,level,idx}));}catch(e){}}
 function restore(){try{const p=JSON.parse(localStorage.getItem(LAST)||'null');if(!p)return;
  if(LANGS[p.lang]&&DATA[p.lang]?.[p.scene]&&LEVELS.includes(p.level)&&Number.isInteger(p.idx)&&p.idx>=0&&p.idx<DATA[p.lang][p.scene][p.level].length){lang=p.lang;scene=p.scene;level=p.level;idx=p.idx;}
 }catch(e){}}
 function levelState(){
  $('levels').querySelectorAll('[data-bvq-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqLevel===level)));
 }
 // KEY VOCAB V6.3: longest non-overlapping lexical units; use authored CJK segment boundaries.
 // No changes to phrase lists, localStorage keys, TTS controller, quiz, SEO or PWA.
 const EXTRA_VOCAB={
  ja:[['風邪薬','kazegusuri','감기약'],['高速道路','kōsoku dōro','고속도로']],
  zh:[['我们','wǒmen','우리(들)'],['感冒药','gǎnmàoyào','감기약']]
 };
 function vocabBoundaries(parts){
  const b=new Set([0]);let offset=0;
  for(const pair of parts){
   const s=String(pair[0]||'');
   const prefix=s.match(/^[^\p{L}\p{N}]+/u),suffix=s.match(/[^\p{L}\p{N}]+$/u);
   b.add(offset+(prefix?prefix[0].length:0));
   b.add(offset+s.length-(suffix?suffix[0].length:0));
   offset+=s.length;b.add(offset);
  }
  return b;
 }
 function vocabMatches(phrase,term,locale,bounds){
  if(!term)return [];
  const full=phrase.toLowerCase(),needle=term.toLowerCase(),results=[];
  const isWord=c=>!!c&&/[\p{L}\p{N}]/u.test(c);
  let pos=0;
  while((pos=full.indexOf(needle,pos))!==-1){
   const finish=pos+term.length;
   let valid=false;
   if(locale==='ja'||locale==='zh'){
    const fullWord=bounds.has(pos)&&bounds.has(finish);
    // For longer components, tolerate compound nouns / inflected stems anchored at
    // an authored segment edge. Never allow a lone kanji inside a longer word:
    // e.g. 今 inside 今日, 风 inside 风邪薬, 我 inside 我们.
    valid=fullWord||(term.length>=2&&(bounds.has(pos)||bounds.has(finish)));
   }else if(locale==='en'){
    valid=(!pos||!isWord(phrase[pos-1]))&&
          (finish===phrase.length||!isWord(phrase[finish]));
   }else{
    // Hangul is agglutinative. A root at an eojeol start may have particles
    // attached (e.g. 날씨 + 가). Internal substrings are not accepted by default.
    valid=(!pos||!isWord(phrase[pos-1]))&&
          (finish===phrase.length||!isWord(phrase[finish])||term.length>=2);
   }
   if(valid)results.push({start:pos,end:finish});
   pos+=Math.max(1,term.length);
  }
  return results;
 }
 function selectVocab(phrase,locale,parts){
  const vocab=[...(EXTRA_VOCAB[locale]||[]),...(cfg.vocab?.[locale]||[])];
  const bounds=(locale==='ja'||locale==='zh')?vocabBoundaries(parts||[]):null;
  function getCandidates(allowKoreanFallback){
   const a=[];
   for(let rank=0;rank<vocab.length;rank++){
    const entry=vocab[rank];if(!Array.isArray(entry)||!entry[0])continue;
    let matches=vocabMatches(phrase,String(entry[0]),locale,bounds);
    if(!matches.length&&locale==='ko'&&allowKoreanFallback){
     // Preserve legacy valid Korean suffix/compound vocabulary coverage when no
     // whole-word entries exist; longest-overlap still suppresses duplicates.
     const p=phrase.toLowerCase().indexOf(String(entry[0]).toLowerCase());
     if(p>=0)matches=[{start:p,end:p+String(entry[0]).length}];
    }
    if(matches.length)a.push({entry,rank,...matches[0]});
   }
   return a;
  }
  let candidates=getCandidates(false);
  if(!candidates.length&&locale==='ko')candidates=getCandidates(true);
  // Prefer the longest meaningful expression in overlapping spans;
  // short nested fragments cannot crowd out the whole word.
  candidates.sort((a,b)=>(b.end-b.start)-(a.end-a.start)||a.rank-b.rank||a.start-b.start);
  const chosen=[];
  for(const c of candidates){
   if(chosen.some(x=>!(x.end<=c.start||c.end<=x.start)))continue;
   chosen.push(c);if(chosen.length>=4)break;
  }
  chosen.sort((a,b)=>a.start-b.start);
  return chosen.map(c=>c.entry);
 }
 function renderVocab(){
  const list=$('vocab-list');list.replaceChildren();
  const chosen=selectVocab(decode(current()[0]),lang,current()[3]);
  for(const [term,pron,description] of chosen){
   const chip=make('button','bv-word-note bv-word-audio');chip.type='button';
   chip.dataset.bvqWord=term;chip.dataset.bvqReading=pron;chip.setAttribute('aria-label',term+' 단어 발음 듣기');chip.setAttribute('aria-pressed','false');
   chip.title=term+' · 눌러서 해당 단어 발음 듣기';
   chip.append(make('strong','',term),make('small','',pron),make('span','',description),make('em','bv-word-play-hint','🔊 터치하여 단어 듣기'));
   list.append(chip);
  }
  $('vocab-box').hidden=chosen.length===0;
 }

 function mix(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function selectState(){
  $('languages').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===lang)));
  $('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===scene)));levelState();
 }
 function filterScenes(){const q=decode($('search').value).trim().toLowerCase();$('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>{const label=decode(b.textContent).toLowerCase();b.hidden=!!q&&!label.includes(q);});}
 // V6.3 step-alignment r4: consistent, responsive landing for STEP 01–04.
 // Use the measured TOP obstruction, not a blanket 76/86px blank space.
 // The embedded learning area is NOT itself a fixed header.
 function targetPanel(el){return el?(el.closest('.bv-panel')||el):null;}
 function topInset(panel){
  const w=window.innerWidth||document.documentElement.clientWidth;
  const gap=w<=600?14:w<=1024?18:22;
  let occluded=0;
  const selectors='#navbar-iframe,header,[role="banner"],.header-outer,.header-wrapper,.centered-top-container,.tabs-outer,.sticky-header,.fixed-header';
  const seen=new Set();
  // Blogger themes can wrap the visible top bar in an unnamed sticky/fixed node.
  // Inspect nodes actually occupying the top of the layout viewport as well.
  const candidates=[...document.querySelectorAll(selectors)];
  if(typeof document.elementFromPoint==='function'){
   const mid=Math.max(0,Math.floor((window.innerWidth||document.documentElement.clientWidth)/2));
   for(const y of [3,24,48]){
    let node=document.elementFromPoint(mid,y);
    while(node&&node!==document.documentElement&&node!==document.body){
     if(!root.contains(node))candidates.push(node);
     node=node.parentElement;
    }
   }
  }
  candidates.forEach(node=>{
   if(seen.has(node)||root.contains(node))return;
   seen.add(node);
   const style=window.getComputedStyle(node);
   if(style.position!=='fixed'&&style.position!=='sticky')return;
   const rect=node.getBoundingClientRect();
   if(rect.width<24||rect.height<8)return;
   const max=Math.min(200,Math.round(window.innerHeight*.34));
   const atTop=rect.top<=20&&rect.bottom>0;
   // A sticky nav that has not yet reached the top may still cover the target.
   const stickyLater=style.position==='sticky'&&rect.top>20&&rect.top<panel.getBoundingClientRect().top&&parseFloat(style.top||'0')<=24;
   if(!atTop&&!stickyLater)return;
   const expected=stickyLater?Math.max(0,parseFloat(style.top)||0)+rect.height:rect.bottom;
   if(expected>0&&expected<=max)occluded=Math.max(occluded,expected);
  });
  return Math.round(Math.max(0,occluded)+gap);
 }
 // V6.3 r6: Chrome's collapsing toolbar and Blogger's sliding header may change
 // *while* smooth scroll is running. Measure again after landing, but never fight
 // an actual user scroll. The base STEP 01-04 spacing remains 14/18/22px.
 let landingGeneration=0,landingCleanup=null;
 function cancelLandingCorrection(){
  landingGeneration++;
  if(landingCleanup){landingCleanup();landingCleanup=null;}
 }
 function scrollToSection(el,instant=false){
  const panel=targetPanel(el);
  if(!panel)return;
  cancelLandingCorrection();
  const generation=landingGeneration;
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=[];
  const setTimer=(fn,ms)=>{const h=window.setTimeout(fn,ms);timers.push(h);};
  let corrections=0;
  const begun=Date.now();
  function alignAfterLanding(){
   if(generation!==landingGeneration||!panel.isConnected)return;
   const inset=topInset(panel);
   panel.style.scrollMarginTop=inset+'px';
   const drift=panel.getBoundingClientRect().top-inset;
   if(Math.abs(drift)<=7||corrections>=3)return;
   // This is an instant *small correction* after the original smooth movement,
   // not another animation that can repeatedly show/hide the mobile chrome.
   corrections++;
   const y=Math.max(0,window.scrollY+drift);
   try{window.scrollTo({top:y,behavior:'instant'});}catch(e){window.scrollTo(0,y);}
  }
  function scheduleAfterChange(){
   if(generation!==landingGeneration)return;
   const delay=Math.max(140,750-(Date.now()-begun));
   setTimer(alignAfterLanding,delay);
  }
  const onViewportChange=()=>scheduleAfterChange();
  const onScrollEnd=()=>scheduleAfterChange();
  const vv=window.visualViewport;
  window.addEventListener('resize',onViewportChange,{passive:true});
  if(vv)vv.addEventListener('resize',onViewportChange,{passive:true});
  // `scrollend` reports completion of Chrome smooth scroll where supported.
  window.addEventListener('scrollend',onScrollEnd,{passive:true});
  landingCleanup=()=>{
   timers.forEach(h=>window.clearTimeout(h));
   window.removeEventListener('resize',onViewportChange);
   if(vv)vv.removeEventListener('resize',onViewportChange);
   window.removeEventListener('scrollend',onScrollEnd);
  };
  // The first pass uses the currently visible Blogger header. Subsequent
  // passes catch its slide-in/out transition and Android browser chrome resize.
  const run=()=>{
   if(generation!==landingGeneration)return;
   panel.style.scrollMarginTop=topInset(panel)+'px';
   panel.scrollIntoView({behavior:(instant||reduce)?'auto':'smooth',block:'start'});
  };
  if(typeof window.requestAnimationFrame==='function')window.requestAnimationFrame(run);else run();
  [860,1320,1920,2530].forEach(ms=>setTimer(alignAfterLanding,ms));
  setTimer(()=>{if(generation===landingGeneration)cancelLandingCorrection();},2850);
 }
 // Cancel a pending automatic correction when the learner manually interacts.
 ['wheel','touchstart','pointerdown','keydown'].forEach(type=>
  window.addEventListener(type,cancelLandingCorrection,{passive:true}));
 // V6.3 r5: STEP 01 alone also supports the #bvq-start URL anchor.
 // Blogger may insert ads/resize its surrounding layout AFTER that initial anchor jump.
 // STEP 02-04 already scroll after user selection, so their approved offsets stay unchanged.
 let startAlignToken=0;
 function cancelStartAlignment(){startAlignToken++;}
 function scrollToScenes(){cancelStartAlignment();scrollToSection($('scenes'));}
 function scrollToLevels(){cancelStartAlignment();scrollToSection($('levels'));}
 function scrollToLesson(){cancelStartAlignment();scrollToSection($('lesson'));}
 const startSection=document.getElementById('bvq-start');
 function scrollToStart(instant=false){
  if(!startSection)return;
  const token=++startAlignToken;
  scrollToSection(startSection,instant);
  function verifyStartPosition(){
   if(token!==startAlignToken||window.location.hash!=='#bvq-start')return;
   const panel=targetPanel(startSection);
   if(!panel||!panel.isConnected)return;
   const gap=topInset(panel);
   const difference=panel.getBoundingClientRect().top-gap;
   // Re-align only when Blogger's delayed layout causes a visible discrepancy.
   if(Math.abs(difference)>5){
    panel.style.scrollMarginTop=gap+'px';
    try{window.scrollTo({top:Math.max(0,window.scrollY+difference),behavior:'instant'});}
    catch(e){window.scrollTo(0,Math.max(0,window.scrollY+difference));}
   }
  }
  // Wait until normal smooth scrolling is complete before verifying; also handle
  // delayed ads, image sizing and the native fragment jump on direct URL visits.
  [750,1550,2900].forEach(ms=>window.setTimeout(verifyStartPosition,ms));
  if(document.readyState!=='complete')window.addEventListener('load',()=>window.setTimeout(verifyStartPosition,110),{once:true});
 }
 // Any manual scroll/tap cancels delayed correction to avoid surprising jumps.
 ['wheel','touchstart','pointerdown','keydown'].forEach(type=>
  window.addEventListener(type,cancelStartAlignment,{passive:true}));
 root.querySelectorAll('a[href="#bvq-start"]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  if(window.history&&history.replaceState)history.replaceState(null,'','#bvq-start');
  scrollToStart();
 }));
 // Apply the same landing margin for any native in-page anchor navigation.
 if(startSection)startSection.style.scrollMarginTop=topInset(startSection)+'px';
 function reviewCandidates(){return rows().map((_,i)=>i).filter(i=>{
  const key=lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i);
  return !!progress.wrong[key]&&!progress.done[key];
 });}

 // V5.6 alignment patch: No heuristic word splitting or fake phonetic alignment at runtime.
 // Every Japanese/Chinese phrase has exact data-authored segments [script, pronunciation].
 // Validate both joins, then either render all tokens or use the whole phrase as a safe fallback.
 // This safeguards against old/cached data and never fabricates mappings for unknown words.
 function alignedPairs(source,reading,locale){
  const segments=current()[3];
  if(locale!=='ja'&&locale!=='zh')return [[source,reading]];
  if(!Array.isArray(segments)||!segments.length)return [[source,reading]];
  if(segments.some(p=>!Array.isArray(p)||p.length!==2||typeof p[0]!=='string'||typeof p[1]!=='string'||!p[0]||!p[1]))return [[source,reading]];
  if(segments.map(p=>p[0]).join('')!==decode(source))return [[source,reading]];
  if(segments.map(p=>p[1]).join(' ')!==decode(reading))return [[source,reading]];
  return segments;
 }
 function syncSegment(){
  const available=(lang==='ja'||lang==='zh')&&Array.isArray(current()[3])&&current()[3].length>1;
  $('segment-toggle').hidden=!available;
  $('segment-box').hidden=!available||!settings.segments;
  $('segment-toggle').setAttribute('aria-pressed',String(settings.segments));
  $('segment-toggle').textContent=settings.segments?'단어 구분 숨기기':'단어 구분 보기';
  if(!available)return;
  const pairs=alignedPairs(current()[0],current()[1],lang);
  put('segment-line',pairs.map(x=>x[0]).join(' '));
  put('roman',pairs.map(x=>x[1]).join(' '));
  $('aligned-chips').replaceChildren();
  for(const [script,sound] of pairs){
   const c=make('button','bv-match-chip bv-word-audio');c.type='button';c.dataset.bvqWord=script;c.dataset.bvqReading=sound;c.setAttribute('aria-label',script+' 단어 발음 듣기');c.setAttribute('aria-pressed','false');c.title=script+' · 단어 듣기';
   c.append(make('strong','bv-match-script',script),make('small','bv-match-sound',sound));$('aligned-chips').append(c);
  }
  $('segment-box').dataset.alignment=pairs.length>1?'grouped':'phrase';
 }
 function syncSound(){
  $('sound-toggle').setAttribute('aria-pressed',String(settings.sounds));
  $('sound-toggle').textContent=settings.sounds?'🔔 퀴즈 효과음 켬':'🔕 퀴즈 효과음 끔';
 }
 let ctx=null;
 function cue(correct){
  if(!settings.sounds)return;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
   if(!ctx)ctx=new AC();if(ctx.state==='suspended')ctx.resume();
   const now=ctx.currentTime;const notes=correct?[[659,0,0.09],[880,.105,.13]]:[[260,0,.11]];
   for(const [pitch,start,duration] of notes){
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();
    oscillator.type='sine';oscillator.frequency.value=pitch;
    gain.gain.setValueAtTime(.0001,now+start);
    gain.gain.exponentialRampToValueAtTime(.055,now+start+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,now+start+duration);
    oscillator.connect(gain);gain.connect(ctx.destination);
    oscillator.start(now+start);oscillator.stop(now+start+duration+.025);
   }
  }catch(e){}
 }
 function feedback(message,type){
  $('feedback').textContent=message;
  $('feedback').dataset.kind=type||'info';
 }
 function renderQuiz(){
  selected=-1;answered=false;quizErrors=0;const answer=decode(current()[2]);
  const local=rows().map(r=>decode(r[2]));
  const rest=Object.values(DATA[lang]).flatMap(x=>Object.values(x).flat().map(r=>decode(r[2])));
  const pool=[...new Set(local.concat(rest))].filter(x=>x!==answer);
  options=mix([answer,...mix(pool).slice(0,3)]);
  $('answers').replaceChildren();
  options.forEach((value,i)=>{
   const b=make('button','bv-answer',value);b.type='button';b.setAttribute('aria-pressed','false');
   b.addEventListener('click',()=>{
    if(answered)return;
    selected=i;
    [...$('answers').children].forEach((x,j)=>{x.setAttribute('aria-pressed',String(i===j));x.removeAttribute('data-result');x.classList.remove('bv-wobble');});
    if($('feedback').dataset.kind==='wrong')feedback('다시 선택하고 정답을 확인해 보세요.','info');
   });
   $('answers').append(b);
  });
  $('check').disabled=false;
  $('check').textContent='정답 확인';
 }
 function stats(){put('xp',progress.xp);put('done',Object.keys(progress.done).length);}
 function render(){
  const s=SCENES.find(x=>x[0]===scene),r=current();if(!s||!r)return;
  selectState();put('lesson-title',s[2]+' · '+LANGS[lang][1]+' · '+LEVEL_LABELS[level]);
  put('counter','LESSON '+String(idx+1).padStart(2,'0')+' / '+String(rows().length).padStart(2,'0'));
  put('foreign',r[0]);put('roman',r[1]||'발음 표기 없음');put('roman-label',cfg.pronunciation?.[lang]||'발음 표기');
  $('roman-box').hidden=!showReading;$('roman-toggle').textContent=showReading?'발음 표기 숨기기':'발음 표기 보기';
  syncSegment();put('meaning',r[2]);put('position',(idx+1)+' / '+rows().length);
  $('prev').disabled=idx===0;$('next').disabled=idx===rows().length-1;$('bar').style.width=(100*(idx+1)/rows().length)+'%';
  refreshVoices();put('status','발음 버튼을 눌러 들어보세요.');feedback('','info');renderQuiz();renderVocab();stats();remember();
  const completed=rows().filter((_,i)=>progress.done[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]).length;
  put('level-progress',LEVEL_LABELS[level]+' 완료 '+completed+' / '+rows().length);
  $('continue').textContent='↗ 이어서 학습';
  const pending=reviewCandidates().length;$('review').textContent=pending?'↺ 오답 복습 ('+pending+')':'↺ 오답 복습';
 }
 $('languages').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!$('languages').contains(b))return;const next=b.dataset.bvqChoice;if(!LANGS[next])return;stop();lang=next;idx=0;reviewOnly=false;$('review-note').textContent='';render();scrollToScenes();});
 $('scenes').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!DATA[lang][b.dataset.bvqChoice])return;if(document.activeElement===$('search'))$('search').blur();stop();scene=b.dataset.bvqChoice;idx=0;reviewOnly=false;$('review-note').textContent='';render();scrollToLevels();});
 $('levels').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-level]');if(!b)return;const next=b.dataset.bvqLevel;if(!LEVELS.includes(next))return;stop();level=next;idx=0;reviewOnly=false;$('review-note').textContent='';render();scrollToLesson();});
 $('continue').addEventListener('click',()=>{restore();reviewOnly=false;stop();$('review-note').textContent='';render();scrollToLesson();});
 $('review').addEventListener('click',()=>{
  const indices=reviewCandidates();
  if(!indices.length){
   const message='현재 선택한 '+LANGS[lang][1]+' · '+LEVEL_LABELS[level]+' · '+SCENES.find(s=>s[0]===scene)[2]+'에는 복습할 오답이 없습니다.';
   $('review-note').textContent=message;
   feedback('복습할 오답이 없습니다. 다른 상황이나 단계를 선택해 보세요.','info');
   return; // No scroll or forced navigation when there are no pending mistakes.
  }
  $('review-note').textContent='오답 '+indices.length+'개를 복습합니다. 아래 학습 카드로 이동합니다.';
  reviewOnly=true;idx=indices[0];stop();render();
  feedback('틀렸던 표현 복습 중 · 정답을 맞히면 오답 목록에서 사라집니다.','info');
  scrollToLesson();
 });
 $('roman-toggle').addEventListener('click',()=>{showReading=!showReading;$('roman-box').hidden=!showReading;$('roman-toggle').textContent=showReading?'발음 표기 숨기기':'발음 표기 보기';$('roman-toggle').setAttribute('aria-expanded',String(showReading));});
 $('segment-toggle').addEventListener('click',()=>{settings.segments=!settings.segments;saveSettings();syncSegment();});
 $('sound-toggle').addEventListener('click',()=>{settings.sounds=!settings.sounds;saveSettings();syncSound();if(settings.sounds)cue(true);});
 $('search').addEventListener('input',filterScenes);
 // R9: language-safe voice selection, user override, and targeted Japanese readings.
 const synth=window.speechSynthesis;
 const voicePrefKey='bvq-r9-voice';
 let voicePrefs={};try{voicePrefs=JSON.parse(localStorage.getItem(voicePrefKey)||'{}')||{};}catch(e){}
 const voiceBox=make('div','');voiceBox.style.cssText='margin:8px 0 12px;font-size:13px;line-height:1.5';
 const voiceLabel=make('label','','음성 선택 · ');voiceLabel.htmlFor='bvq3-voice-choice';
 const voiceSelect=make('select','');voiceSelect.id='bvq3-voice-choice';voiceSelect.style.cssText='max-width:100%;width:100%;padding:8px;border:1px solid #c6d8e7;border-radius:12px;background:#fff;color:#17344e;font-size:13px';
 voiceBox.append(voiceLabel,voiceSelect);$('status').before(voiceBox);
 const modeKey='bvq-r10-audio-mode';let jaMode='clear';try{const v=localStorage.getItem(modeKey);if(['clear','native','segments'].includes(v))jaMode=v;}catch(e){}
 const modeBox=make('div','bv-audio-mode');const modeLabel=make('label','','일본어 문장 발음 방식');modeLabel.htmlFor='bvq3-audio-mode';
 const modeSelect=make('select','');modeSelect.id='bvq3-audio-mode';
 for(const [v,t] of [['clear','명료하게 · 읽기 보정 (권장)'],['native','원문 그대로 · 자연스러운 회화'],['segments','구절별 · 끊어 듣기']]){const o=make('option','',t);o.value=v;modeSelect.append(o);}
 modeSelect.value=jaMode;modeBox.append(modeLabel,modeSelect);voiceBox.append(modeBox);
 modeSelect.addEventListener('change',()=>{stop();jaMode=modeSelect.value;try{localStorage.setItem(modeKey,jaMode);}catch(e){}put('status','발음 방식을 변경했습니다. 다시 들어보세요.');updateAudioInfo();});
 const info=make('details','bv-audio-info');info.append(make('summary','','음성 진단 · 실제 재생 입력 / 버전'));const infoText=make('p','');info.append(infoText);voiceBox.append(info);
 function updateAudioInfo(last){const voices=languageVoices(lang);const v=voices.find(x=>x.voiceURI===voicePrefs[lang])||voices[0];
  modeBox.hidden=lang!=='ja';infoText.textContent='R10 · '+(v?v.name+' ('+v.lang+')':'음성 없음')+' · '+(last|| (lang==='ja'&&jaMode==='segments'?jaSegments(current()).join(' / '):phraseSpeech(current(),lang)))+' · 실제 음성은 기기 TTS에서 생성됩니다.';
 }

 function eligibleVoice(v,lng){
  const tag=String(v.lang||'').toLowerCase().replace(/_/g,'-');
  if(lng==='zh')return /^(zh|cmn)(?:-hans)?(?:-cn)?$/.test(tag)||tag==='zh-hans-cn'||tag==='cmn-hans-cn';
  if(lng==='en')return tag==='en-us'||tag==='en';
  if(lng==='ja')return tag==='ja-jp'||tag==='ja';
  if(lng==='ko')return tag==='ko-kr'||tag==='ko';
  return false;
 }
 function voiceScore(v,lng){
  const tag=String(v.lang||'').toLowerCase().replace(/_/g,'-');
  let score=tag===LANGS[lng][3].toLowerCase()?100:0;
  if(/natural|neural|premium|enhanced|wavenet/i.test(v.name||''))score+=30;
  if(/google/i.test(v.name||''))score+=15;
  if(v.localService)score+=5;
  if(v.default)score+=2;
  return score;
 }
 function languageVoices(lng){
  try{return (synth?synth.getVoices():[]).filter(v=>eligibleVoice(v,lng)).sort((a,b)=>voiceScore(b,lng)-voiceScore(a,lng));}catch(e){return [];}
 }
 function refreshVoices(){
  const voices=languageVoices(lang);voiceSelect.replaceChildren();
  const auto=make('option','',voices.length?'자동 선택 · '+voices[0].name:'사용 가능한 해당 언어 음성 없음');auto.value='';voiceSelect.append(auto);
  for(const v of voices){const o=make('option','',v.name+' ('+v.lang+')');o.value=v.voiceURI;voiceSelect.append(o);}
  voiceSelect.value=voices.some(v=>v.voiceURI===voicePrefs[lang])?voicePrefs[lang]:'';
  voiceSelect.disabled=!voices.length;updateAudioInfo();
 }
 voiceSelect.addEventListener('change',()=>{stop();voicePrefs[lang]=voiceSelect.value;try{localStorage.setItem(voicePrefKey,JSON.stringify(voicePrefs));}catch(e){}put('status','음성을 선택했습니다. 발음 버튼을 눌러 보세요.');updateAudioInfo();});
 if(synth&&typeof synth.addEventListener==='function')synth.addEventListener('voiceschanged',refreshVoices);
 function speakText(text,speed,kind,sourceButton){
  if(!synth||typeof SpeechSynthesisUtterance==='undefined'){put('status','이 브라우저에서는 음성 재생을 지원하지 않습니다.');return;}
  const parts=(Array.isArray(text)?text:[text]).map(t=>decode(t).trim()).filter(Boolean);if(!parts.length)return;
  if(sourceButton&&activeAudioButton===sourceButton){stop();put('status','단어 듣기를 정지했습니다.');return;}
  const interrupted=!!activeUtterance||synth.speaking||synth.pending;stop();const seq=audioSeq;const lng=lang;const voices=languageVoices(lng);
  if(!voices.length){refreshVoices();put('status',LANGS[lng][1]+' 음성이 준비되지 않았습니다. 기기 TTS 언어팩을 확인해 주세요.');return;}
  const voice=voices.find(v=>v.voiceURI===voicePrefs[lng])||voices[0];
  if(sourceButton){activeAudioButton=sourceButton;sourceButton.classList.add('bv-word-playing');sourceButton.setAttribute('aria-pressed','true');}
  updateAudioInfo(parts.join(' / '));
  const playing=kind==='word'?'단어 발음':parts.length>1?'구절별 재생':speed<.8?'천천히 재생':'발음 재생';
  function finish(message){if(seq!==audioSeq)return;activeUtterance=null;clearWordAudio();put('status',message);}
  function play(i){
   audioTimer=null;if(seq!==audioSeq||lng!==lang)return;
   const u=new SpeechSynthesisUtterance(parts[i]);activeUtterance=u;u.lang=LANGS[lng][3];u.voice=voice;u.rate=speed;u.pitch=1;u.volume=1;
   u.onstart=()=>{if(seq===audioSeq)put('status',playing+' 중… '+(parts.length>1?(i+1)+'/'+parts.length+' · ':'')+voice.name);};
   u.onend=()=>{if(seq!==audioSeq)return;activeUtterance=null;if(i+1<parts.length){audioTimer=setTimeout(()=>play(i+1),180);}else finish('재생 완료 · '+voice.name);};
   u.onerror=ev=>{if(seq!==audioSeq)return;finish('음성 재생 실패 · '+(ev.error||'unknown')+' · 다른 음성 또는 Chrome에서 다시 시도해 주세요.');};
   try{if(synth.paused)synth.resume();synth.speak(u);}catch(err){finish('음성 재생에 실패했습니다.');}
  }
  put('status',playing+' 준비 중… · '+voice.name);
  // Do not cancel an idle synthesizer; allow a short reset only after interrupted playback.
  if(interrupted)audioTimer=setTimeout(()=>play(0),160);else play(0);
 }
 function splitJapanese(script){const m=script.match(/^(.*?)([。！？、!?.,…]*)$/u);return [m[1],m[2]];}
 function jaPartSpeech(script,reading){
  const [word,punct]=splitJapanese(script);
  // Leave native kana, grammatical particles and katakana loanwords intact in sentences.
  if(!/[\u3400-\u9fff々〆ヶ]/u.test(word))return script;
  const r=String(reading||'').toLowerCase().replace(/[.?!。、！？]/g,'').trim();
  const fixed={'大通り':'おおどおり','大きい':'おおきい','大雨':'おおあめ','大幅':'おおはば','通り':'とおり','通って':'とおって','通れます':'とおれます','横断':'おうだん'};
  // Preserve mixed katakana/kanji lexical spelling to avoid ambiguous reverse long-vowels.
  if(/[ァ-ヺー]/u.test(word))return script;
  const kana=fixed[word]||jaKanaReading(r);
  return kana?kana.replace(/\s+/g,'')+punct:script;
 }
 function phraseSpeech(row,lng){
  if(lng!=='ja'||jaMode==='native')return row[0];
  return row[4]||jaPhraseSpeech(row);
 }
 function jaPhraseSpeech(row){return (row[3]||[]).length?row[3].map(([s,r])=>jaPartSpeech(s,r)).join(''):row[0];}
 function jaSegments(row){
  // Group lexical words with particles and polite endings, avoiding isolated particle readings.
  const parts=row[3]||[];const groups=[];let chunk='';let count=0;
  const attach=/^(は|へ|を|が|に|で|と|の|も|か|ね|よ|です|ます|でした|ません|ください|ございます|います|いません|いたします|します|なさい|たい)$/u;
  for(let i=0;i<parts.length;i++){
   const [s,r]=parts[i];const [bare,punct]=splitJapanese(s);chunk+=jaPartSpeech(s,r);count++;
   const next=parts[i+1]?splitJapanese(parts[i+1][0])[0]:'';
   // Avoid separating ありがとう and ございます; retain grammatical reading in context.
   if(punct||!next||(count>=2&&!attach.test(next)&&!(bare==='ありがとう'&&next==='ございます'))){if(chunk.trim())groups.push(chunk);chunk='';count=0;}
  }
  if(chunk.trim())groups.push(chunk);return groups.length?groups:[row[0]];
 }
 function speak(speed){rate=speed;speakText(lang==='ja'&&jaMode==='segments'?jaSegments(current()):phraseSpeech(current(),lang),speed,'phrase',null);}
 function jaKanaReading(romaji){
  if(typeof romaji!=='string')return null;
  let s=romaji.toLowerCase().trim()
    .replace(/[āâ]/g,'aa').replace(/[īî]/g,'ii').replace(/[ūû]/g,'uu')
    .replace(/[ēê]/g,'ee').replace(/[ōô]/g,'ou')
    .replace(/[’‘]/g,"'").replace(/([bcdfghjklmpqrstvwxyz])-\1/g,'$1$1').replace(/[.,!?。！？、…]/g,' ');
  if(!s||/[^a-z\s'\-]/.test(s))return null;
  const row={k:'かきくけこ',s:'さしすせそ',t:'たちつてと',n:'なにぬねの',h:'はひふへほ',m:'まみむめも',r:'らりるれろ',g:'がぎぐげご',z:'ざじずぜぞ',d:'だぢづでど',b:'ばびぶべぼ',p:'ぱぴぷぺぽ'};
  const base={a:'あ',i:'い',u:'う',e:'え',o:'お',ya:'や',yu:'ゆ',yo:'よ',wa:'わ',wo:'を',wi:'うぃ',we:'うぇ',ye:'いぇ',
    shi:'し',chi:'ち',tsu:'つ',fu:'ふ',ji:'じ',si:'すぃ',ti:'てぃ',tu:'とぅ',di:'でぃ',du:'どぅ',
    she:'しぇ',che:'ちぇ',je:'じぇ',ja:'じゃ',ju:'じゅ',jo:'じょ',sha:'しゃ',shu:'しゅ',sho:'しょ',cha:'ちゃ',chu:'ちゅ',cho:'ちょ',
    fa:'ふぁ',fi:'ふぃ',fe:'ふぇ',fo:'ふぉ',fyu:'ふゅ',tsa:'つぁ',tsi:'つぃ',tse:'つぇ',tso:'つぉ',
    va:'ゔぁ',vi:'ゔぃ',vu:'ゔ',ve:'ゔぇ',vo:'ゔぉ'};
  for(const [cons,letters] of Object.entries(row)){
   ['a','i','u','e','o'].forEach((v,i)=>{if(!base[cons+v])base[cons+v]=letters[i];});
  }
  for(const [cons,stem] of Object.entries({ky:'き',sh:'し',ch:'ち',ny:'に',hy:'ひ',my:'み',ry:'り',gy:'ぎ',j:'じ',by:'び',py:'ぴ',dy:'ぢ',ty:'ち',sy:'し',zy:'じ'})){
   ['a','u','o'].forEach((v,i)=>{if(!base[cons+v])base[cons+v]=stem+['ゃ','ゅ','ょ'][i];});
  }
  const chunks=[];
  for(let i=0;i<s.length;){
   const c=s[i],next=s[i+1]||'';
   if(c===' '||c==='-'){if(chunks.length&&chunks[chunks.length-1]!==' ')chunks.push(' ');i++;continue;}
   if(c==="'"){i++;continue;}
   if(c==='n'&&(next==="'"||next==='n'||!next||(!/[aiueoy]/.test(next)))){
    chunks.push('ん');i+=next==='n'?1:(next==="'"?2:1);continue;
   }
   if(c===next&&/[bcdfghjklmpqrstvwxyz]/.test(c)&&c!=='n'){
    chunks.push('っ');i++;continue;
   }
   if(c==='t'&&s.slice(i+1,i+3)==='ch'){chunks.push('っ');i++;continue;}
   let kana=null,advance=0;
   for(let span=3;span>=1;span--){if(base[s.slice(i,i+span)]){kana=base[s.slice(i,i+span)];advance=span;break;}}
   if(!kana)return null;
   chunks.push(kana);i+=advance;
  }
  return chunks.join('').trim()||null;
 }
 function jaWordSpeech(script,reading){
  if(lang!=='ja')return script;
  const [word,punct]=splitJapanese(script);const r=String(reading||'').toLowerCase().replace(/[.?!。、！？]/g,'').trim();
  if(word==='は'&&r==='wa')return 'わ'+punct;
  if(word==='へ'&&r==='e')return 'え'+punct;
  if(word==='を'&&r==='o')return 'お'+punct;
  return jaPartSpeech(script,reading);
 }

 function zhWordSpeech(script,reading){
  if(lang!=='zh')return script;
  const text=current()[0];
  const r=reading.toLowerCase().replace(/[.,!?。！？、\s]/g,'');
  if(script==='地'&&r==='de'&&text.includes('一步一步地'))return '一步一步地';
  if(script==='得'&&r==='de'){
   if(text.includes('上得'))return '上得';
   if(text.includes('解释得'))return '解释得';
  }
  if(script==='着'&&r==='zhe'){
   if(text.includes('留着'))return '留着';
   if(text.includes('陪着'))return '陪着';
  }
  if(script==='行'&&r==='xíng'&&text.includes('人行横道'))return '人行横道';
  if(script==='还'&&r==='hái'){
   for(const phrase of ['还咳嗽','还能','还没','还要'])if(text.includes(phrase))return phrase;
  }
  return script;
 }

 function wordClick(event,container){
  const button=event.target.closest('button[data-bvq-word]');if(!button||!container.contains(button))return;
  const original=button.dataset.bvqWord;
  const speech=lang==='zh'?zhWordSpeech(original,button.dataset.bvqReading||''):jaWordSpeech(original,button.dataset.bvqReading||'');
  speakText(speech,0.86,'word',button);
 }
 $('vocab-list').addEventListener('click',e=>wordClick(e,$('vocab-list')));
 $('aligned-chips').addEventListener('click',e=>wordClick(e,$('aligned-chips')));
 $('speak').addEventListener('click',()=>speak(lang==='ja'?.86:.95));$('slow').addEventListener('click',()=>speak(.72));$('repeat').addEventListener('click',()=>speak(rate));$('stop').addEventListener('click',()=>{stop();put('status','정지했습니다.');});
 function move(delta){
  if(!reviewOnly){const dest=idx+delta;if(dest>=0&&dest<rows().length){stop();idx=dest;render();}return;}
  const candidates=rows().map((_,i)=>i).filter(i=>progress.wrong[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]&&!progress.done[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]);
  if(!candidates.length){reviewOnly=false;feedback('오답 복습을 완료했습니다.','correct');return;}
  const next=candidates.find(i=>delta>0?i>idx:i<idx);
  if(next!==undefined){stop();idx=next;render();}else feedback('이 방향에 더 이상 오답이 없습니다.','info');
 }
 $('prev').addEventListener('click',()=>move(-1));$('next').addEventListener('click',()=>move(1));
 $('check').addEventListener('click',()=>{
  if(answered)return;
  if(selected<0){feedback('먼저 답을 하나 선택해 주세요.','info');return;}
  const answers=[...$('answers').children],choice=answers[selected];
  if(options[selected]!==decode(current()[2])){
   quizErrors++;progress.wrong[phraseKey()]=true;save();choice.dataset.result='wrong';const pending=reviewCandidates().length;$('review').textContent=pending?'↺ 오답 복습 ('+pending+')':'↺ 오답 복습';
   choice.classList.remove('bv-wobble');void choice.offsetWidth;choice.classList.add('bv-wobble');
   feedback('아쉬워요! 다른 답을 선택해 다시 도전해 보세요.','wrong');cue(false);return;
  }
  answered=true;choice.dataset.result='correct';answers.forEach(b=>b.disabled=true);
  $('check').disabled=true;$('check').textContent='정답 완료 ✓';
  const key=phraseKey();if(progress.wrong[key]){delete progress.wrong[key];save();}
  if(!progress.done[key]){progress.done[key]=true;progress.xp+=10;save();feedback('✓ 정답입니다! +10 XP · '+(quizErrors?'재도전 성공!':'잘하셨어요!'),'correct');}
  else feedback('✓ 정답입니다! 이미 완료한 문제여서 XP는 추가되지 않습니다.','correct');
  cue(true);stats();const pending=reviewCandidates().length;$('review').textContent=pending?'↺ 오답 복습 ('+pending+')':'↺ 오답 복습';
 });
 $('reset').addEventListener('click',()=>{if(confirm('학습 기록을 초기화하시겠습니까?')){progress={xp:0,done:{},wrong:{}};save();stats();$('review-note').textContent='';render();feedback('학습 기록을 초기화했습니다.','info');}});
 // AdSense initialized only after page load and once per ad container (unchanged from V5.3).
 function initAds(){if(!document.querySelector('script[src*="adsbygoogle.js"]')){const s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9524179834302691';s.crossOrigin='anonymous';document.head.append(s);}root.querySelectorAll('ins.adsbygoogle').forEach(ad=>{if(ad.dataset.adsbygoogleStatus||ad.dataset.bvqRequested)return;ad.dataset.bvqRequested='1';try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){ad.dataset.bvqRequested='';}});}
 // Share the canonical Blogger post, not the GitHub asset preview URL.
 const PUBLIC_URL='https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html';
 const SHARE_TEXT='BiteVoyage 여행 회화 무료 학습 · 4개 국어 1,920개 표현';
 function notice(message){const el=$('share-notice');if(el)el.textContent=message;}
 async function copyLink(){
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(PUBLIC_URL);notice('✓ 게시글 주소를 복사했습니다.');}
   else{const temp=document.createElement('textarea');temp.value=PUBLIC_URL;temp.style.position='fixed';temp.style.top='-999px';document.body.append(temp);temp.select();const ok=document.execCommand('copy');temp.remove();notice(ok?'✓ 게시글 주소를 복사했습니다.':'주소를 선택해 복사해 주세요: '+PUBLIC_URL);}}
  catch(e){notice('링크 복사가 차단되었습니다. 아래 링크를 길게 눌러 복사해 주세요.');}
 }
 $('share-copy').addEventListener('click',copyLink);
 $('share-native').addEventListener('click',async()=>{
  if(navigator.share){try{await navigator.share({title:SHARE_TEXT,text:'해외여행 필수 회화 · 무료 듣기 & 퀴즈',url:PUBLIC_URL});notice('공유창을 열었습니다.');}
   catch(e){if(e.name!=='AbortError')notice('공유창을 열 수 없습니다. 링크 복사를 이용해 주세요.');}}
  else{copyLink();}
 });
 $('share-facebook').addEventListener('click',()=>window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(PUBLIC_URL),'_blank','noopener,noreferrer'));
 $('share-x').addEventListener('click',()=>window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(PUBLIC_URL)+'&text='+encodeURIComponent(SHARE_TEXT),'_blank','noopener,noreferrer'));
 // Installation: direct system prompt on browsers supporting cross-origin Web Install API.
 // On other browsers navigate to our own same-origin installer. The OS icon requires consent.
 // Best-effort post-specific bookmark icons for mobile browser direct shortcuts.
 // Browsers may override with the Blogger site-wide favicon.
 if(location.hostname==='www.bitevoyage.com' || location.hostname==='bitevoyage.com'){
  const iconUrl='https://yesafrica-byte.github.io/bitevoyage-language/favicon-192.png';
  for(const rel of ['icon','apple-touch-icon']){
   let link=document.head.querySelector('link[rel="'+rel+'"]');
   if(!link){link=document.createElement('link');link.rel=rel;document.head.append(link);}
   link.href=iconUrl;
  }
 }
 const INSTALL_MANIFEST='https://yesafrica-byte.github.io/bitevoyage-language/manifest.webmanifest';
 const INSTALL_GATEWAY='https://yesafrica-byte.github.io/bitevoyage-language/install.html?from=blogger';
 function openInstallGateway(){window.location.assign(INSTALL_GATEWAY);}
 $('shortcut-open').addEventListener('click',()=>{
  if(typeof navigator.install === 'function' && window.isSecureContext){
   try{
    Promise.resolve(navigator.install({manifest:INSTALL_MANIFEST}))
     .then(()=>notice('✓ BV 아이콘 설치 요청이 처리되었습니다. 홈 화면을 확인해 주세요.'))
     .catch(e=>{
      if(e && (e.name==='AbortError'||e.name==='NotAllowedError'))notice('설치가 취소되었거나 허용되지 않았습니다. 다시 눌러 시도할 수 있습니다.');
      else openInstallGateway();
     });
   }catch(e){openInstallGateway();}
  }else openInstallGateway();
 });
 restore();syncSound();render();filterScenes();if(window.location.hash==='#bvq-start')scrollToStart(true);status('✓ V6.3 R10 음성 명료도 개선 연결 완료 · 총 '+total+'개 표현 · 발음 표기 '+readings+'/'+total+'개 · 3단계 학습');
 if(document.readyState==='complete')initAds();else window.addEventListener('load',initAds,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
