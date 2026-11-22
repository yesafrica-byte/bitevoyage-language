/* BiteVoyage Language Quest Premium V6.0 | 1792 expressions | preserve 896 beginner IDs | PWA intact */
(function(){
'use strict';
function boot(){
 const root=document.getElementById('bvq-v3');
 if(!root || root.dataset.bvqV60Ready==='1')return;
 const cfg=window.BVQ_V60_DATA;
 const $=name=>document.getElementById('bvq3-'+name);
 const warn=$('runtime-warning');
 function status(message){if(warn)warn.textContent=message;}
 if(!cfg||!cfg.langs||!cfg.scenes||!cfg.data){status('V6.0 데이터 로드 실패: GitHub Pages에 bvq60-data.js가 있는지 확인해 주세요.');return;}
 const supported=['en','ja','zh','ko'];
 const LEVELS=['beginner','intermediate','advanced'];
 const LEVEL_LABELS={'beginner':'초급','intermediate':'중급','advanced':'고급'};
 const EXPECTED={'beginner':16,'intermediate':8,'advanced':8};
 let total=0,readings=0,aligned=0,integrityError='';
 if(cfg.version!=='6.0.0'||cfg.build_id!=='bvq60-premium-20261122-r1') integrityError='데이터·엔진 버전 불일치';
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
 if(integrityError||total!==1792||readings!==1792||aligned!==448){
  status('V6.0 데이터 검증 실패: '+(integrityError||('발음 '+readings+'/'+total+', 초급 정렬 '+aligned+'/448'))+' · 최신 JS 두 개를 확인해 주세요.');return;
 }
 const required=['share-notice','languages','scenes','search','lesson-title','counter','foreign','roman','roman-label','roman-box','roman-toggle','meaning','position','prev','next','bar','answers','xp','done','status','feedback','speak','slow','repeat','stop','check','reset','segment-box','segment-line','segment-toggle','sound-toggle','aligned-chips','share-native','share-copy','share-facebook','share-x','shortcut-open','levels','vocab-box','vocab-list','level-progress','continue','review'];
 const missing=required.filter(id=>!$(id));
 if(missing.length){status('페이지 구성 요소가 누락되었습니다: '+missing.join(', '));return;}
 root.dataset.bvqV56Ready='1';
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
 function stop(){audioSeq++;if('speechSynthesis' in window){try{speechSynthesis.cancel();}catch(e){}}}
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
 function renderVocab(){
  const list=$('vocab-list');list.replaceChildren();
  const phrase=decode(current()[0]);const chosen=[];const vocab=cfg.vocab?.[lang]||[];
  for(const entry of vocab){if((lang==='en'?new RegExp('(^|[^a-z])'+entry[0].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z])','i').test(phrase):phrase.toLowerCase().includes(entry[0].toLowerCase()))&&!chosen.some(x=>x[0]===entry[0]))chosen.push(entry);if(chosen.length===4)break;}
  for(const [term,pron,description] of chosen){
    const chip=make('div','bv-word-note');chip.append(make('strong','',term),make('small','',pron),make('span','',description));list.append(chip);
  }
  $('vocab-box').hidden=chosen.length===0;
 }
 
 function mix(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function selectState(){
  $('languages').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===lang)));
  $('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===scene)));levelState();
 }
 function filterScenes(){const q=decode($('search').value).trim().toLowerCase();$('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>{const label=decode(b.textContent).toLowerCase();b.hidden=!!q&&!label.includes(q);});}
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
  for(const [script,sound] of pairs){const c=make('span','bv-match-chip');c.append(make('strong','bv-match-script',script),make('small','bv-match-sound',sound));$('aligned-chips').append(c);}
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
  put('status','발음 버튼을 눌러 들어보세요.');feedback('','info');renderQuiz();renderVocab();stats();remember();
  const completed=rows().filter((_,i)=>progress.done[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]).length;
  put('level-progress',LEVEL_LABELS[level]+' 완료 '+completed+' / '+rows().length);
  $('continue').textContent='↗ 이어서 학습';
 }
 $('languages').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!$('languages').contains(b))return;const next=b.dataset.bvqChoice;if(!LANGS[next])return;stop();lang=next;idx=0;reviewOnly=false;render();});
 $('scenes').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!DATA[lang][b.dataset.bvqChoice])return;stop();scene=b.dataset.bvqChoice;idx=0;reviewOnly=false;render();$('lesson').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
 $('levels').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-level]');if(!b)return;const next=b.dataset.bvqLevel;if(!LEVELS.includes(next))return;stop();level=next;idx=0;reviewOnly=false;render();});
 $('continue').addEventListener('click',()=>{restore();reviewOnly=false;stop();render();$('lesson').scrollIntoView({behavior:'smooth',block:'start'});});
 $('review').addEventListener('click',()=>{
  const indices=rows().map((_,i)=>i).filter(i=>progress.wrong[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]&&!progress.done[lang+'|'+scene+'|'+(level==='beginner'?i:level+'|'+i)]);
  if(!indices.length){feedback('이 언어·상황·난이도에 복습할 오답이 없습니다.','info');return;}
  reviewOnly=true;idx=indices[0];stop();render();feedback('틀렸던 표현 복습 중 · 정답을 맞히면 오답 목록에서 사라집니다.','info');
 });
 $('roman-toggle').addEventListener('click',()=>{showReading=!showReading;$('roman-box').hidden=!showReading;$('roman-toggle').textContent=showReading?'발음 표기 숨기기':'발음 표기 보기';$('roman-toggle').setAttribute('aria-expanded',String(showReading));});
 $('segment-toggle').addEventListener('click',()=>{settings.segments=!settings.segments;saveSettings();syncSegment();});
 $('sound-toggle').addEventListener('click',()=>{settings.sounds=!settings.sounds;saveSettings();syncSound();if(settings.sounds)cue(true);});
 $('search').addEventListener('input',filterScenes);
 function speak(speed){
  rate=speed;if(!('speechSynthesis' in window)){put('status','음성 재생을 지원하지 않는 브라우저입니다.');return;}
  stop();const seq=audioSeq,u=new SpeechSynthesisUtterance(decode(current()[0]));u.lang=LANGS[lang][3];u.rate=speed;u.pitch=1;u.volume=1;
  const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang.toLowerCase()===u.lang.toLowerCase())||voices.find(x=>x.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));if(v)u.voice=v;
  u.onstart=()=>{if(seq===audioSeq)put('status',speed<1?'천천히 재생 중…':'발음 재생 중…');};
  u.onend=()=>{if(seq===audioSeq)put('status','재생 완료');};
  u.onerror=e=>{if(seq===audioSeq&&e.error!=='canceled'&&e.error!=='interrupted')put('status','음성 엔진 또는 언어팩을 확인해 주세요.');};
  put('status',speed<1?'느린 발음 준비 중…':'발음 준비 중…');try{speechSynthesis.speak(u);}catch(e){put('status','음성 재생 실패');}
 }
 $('speak').addEventListener('click',()=>speak(1));$('slow').addEventListener('click',()=>speak(.55));$('repeat').addEventListener('click',()=>speak(rate));$('stop').addEventListener('click',()=>{stop();put('status','정지했습니다.');});
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
   quizErrors++;progress.wrong[phraseKey()]=true;save();choice.dataset.result='wrong';
   choice.classList.remove('bv-wobble');void choice.offsetWidth;choice.classList.add('bv-wobble');
   feedback('아쉬워요! 다른 답을 선택해 다시 도전해 보세요.','wrong');cue(false);return;
  }
  answered=true;choice.dataset.result='correct';answers.forEach(b=>b.disabled=true);
  $('check').disabled=true;$('check').textContent='정답 완료 ✓';
  const key=phraseKey();if(progress.wrong[key]){delete progress.wrong[key];save();}
  if(!progress.done[key]){progress.done[key]=true;progress.xp+=10;save();feedback('✓ 정답입니다! +10 XP · '+(quizErrors?'재도전 성공!':'잘하셨어요!'),'correct');}
  else feedback('✓ 정답입니다! 이미 완료한 문제여서 XP는 추가되지 않습니다.','correct');
  cue(true);stats();
 });
 $('reset').addEventListener('click',()=>{if(confirm('학습 기록을 초기화하시겠습니까?')){progress={xp:0,done:{},wrong:{}};save();stats();feedback('학습 기록을 초기화했습니다.','info');}});
 // AdSense initialized only after page load and once per ad container (unchanged from V5.3).
 function initAds(){if(!document.querySelector('script[src*="adsbygoogle.js"]')){const s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9524179834302691';s.crossOrigin='anonymous';document.head.append(s);}root.querySelectorAll('ins.adsbygoogle').forEach(ad=>{if(ad.dataset.adsbygoogleStatus||ad.dataset.bvqRequested)return;ad.dataset.bvqRequested='1';try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){ad.dataset.bvqRequested='';}});}
 // Share the canonical Blogger post, not the GitHub asset preview URL.
 const PUBLIC_URL='https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html';
 const SHARE_TEXT='BiteVoyage 여행 회화 무료 학습 · 4개 국어 1,792개 표현';
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
 restore();syncSound();render();filterScenes();status('✓ V6.0 연결 완료 · 총 '+total+'개 표현 · 발음 표기 '+readings+'/'+total+'개 · 3단계 학습');
 if(document.readyState==='complete')initAds();else window.addEventListener('load',initAds,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
