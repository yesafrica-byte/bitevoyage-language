/* BiteVoyage Language Quest V5.6.0 Alignment Patch R1 | 448 curated pairs | 896 originals | PWA intact */
(function(){
'use strict';
function boot(){
 const root=document.getElementById('bvq-v3');
 if(!root || root.dataset.bvqV56Ready==='1')return;
 const cfg=window.BVQ_V56_DATA;
 const $=name=>document.getElementById('bvq3-'+name);
 const warn=$('runtime-warning');
 function status(message){if(warn)warn.textContent=message;}
 if(!cfg||!cfg.langs||!cfg.scenes||!cfg.data){status('V5.6 데이터 로드 실패: GitHub Pages에 bvq56-data.js가 있는지 확인해 주세요.');return;}
 const supported=['en','ja','zh','ko'];
 let total=0,readings=0,integrityError='';
 if(cfg.version!=='5.6.0'||cfg.build_id!=='v56-20261121-curated-448-r1'||cfg.alignment_revision!=='curated-pairs-v1')integrityError='데이터·엔진 버전 불일치';
 else for(const lng of supported){
  if(!cfg.data[lng]){integrityError='언어 데이터 누락: '+lng;break;}
  for(const sc of cfg.scenes.map(s=>s[0])){
   const set=cfg.data[lng][sc];
   if(!Array.isArray(set)||set.length!==16){integrityError='문장 수 오류: '+lng+'/'+sc;break;}
   for(const item of set){total++;if(item&&typeof item[1]==='string'&&item[1].trim())readings++;}
  }
  if(integrityError)break;
 }
 if(!integrityError){
  let aligned=0;
  for(const lng of ['ja','zh'])for(const sc of cfg.scenes.map(s=>s[0]))for(const item of cfg.data[lng][sc]){
   if(!Array.isArray(item[3])||!item[3].length||item[3].some(p=>!Array.isArray(p)||p.length!==2)||item[3].map(p=>p[0]).join('')!==item[0]||item[3].map(p=>p[1]).join(' ')!==item[1])integrityError='단어·발음 대응 데이터 누락 또는 불일치';
   else aligned++;
  }
  if(aligned!==448)integrityError='학습 단위 정렬 수량 불일치 '+aligned+'/448';
 }
 if(integrityError||total!==896||readings!==896){status('V5.6 파일 검증 실패: '+(integrityError||('발음 '+readings+'/'+total))+' · 새 JS 2개를 확인해 주세요.');return;}
 const required=['share-notice','languages','scenes','search','lesson-title','counter','foreign','roman','roman-label','roman-box','roman-toggle','meaning','position','prev','next','bar','answers','xp','done','status','feedback','speak','slow','repeat','stop','check','reset','segment-box','segment-line','segment-toggle','sound-toggle','aligned-chips','share-native','share-copy','share-facebook','share-x','shortcut-open'];
 const missing=required.filter(id=>!$(id));
 if(missing.length){status('페이지 구성 요소가 누락되었습니다: '+missing.join(', '));return;}
 root.dataset.bvqV56Ready='1';
 const LANGS=cfg.langs,SCENES=cfg.scenes,DATA=cfg.data;
 let lang='ja',scene='airport',idx=0,selected=-1,rate=1,options=[],audioSeq=0,showReading=true,answered=false,quizErrors=0;
 const STORE='bvq-v5-progress';let progress={xp:0,done:{}};
 try{const s=JSON.parse(localStorage.getItem(STORE)||'null');if(s&&typeof s==='object'){progress.xp=Number(s.xp)||0;progress.done=s.done||{}}}catch(e){}
 function save(){try{localStorage.setItem(STORE,JSON.stringify(progress));}catch(e){}}
 const PREF='bvq-v56-ui';let settings={sounds:false,segments:true};
 try{const saved=JSON.parse(localStorage.getItem(PREF)||localStorage.getItem('bvq-v55-ui')||localStorage.getItem('bvq-v54-ui')||'null');if(saved&&typeof saved==='object'){settings.sounds=saved.sounds===true;settings.segments=saved.segments!==false;}}catch(e){}
 function saveSettings(){try{localStorage.setItem(PREF,JSON.stringify(settings));}catch(e){}}
 function decode(v){let s=String(v==null?'':v);const t=document.createElement('textarea');for(let i=0;i<5;i++){t.innerHTML=s;const n=t.value;if(n===s)break;s=n;}return s;}
 function put(id,value){$(id).textContent=decode(value);}
 function make(tag,cl,value){const x=document.createElement(tag);if(cl)x.className=cl;if(value!==undefined)x.textContent=decode(value);return x;}
 function stop(){audioSeq++;if('speechSynthesis' in window){try{speechSynthesis.cancel();}catch(e){}}}
 const rows=()=>DATA[lang][scene],current=()=>rows()[idx];
 function mix(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function selectState(){
  $('languages').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===lang)));
  $('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===scene)));
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
  const available=lang==='ja'||lang==='zh';
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
  const pool=[...new Set(Object.values(DATA[lang]).flat().map(r=>decode(r[2])))].filter(x=>x!==answer);
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
  selectState();put('lesson-title',s[2]+' · '+LANGS[lang][1]+' · 초급 A1');
  put('counter','LESSON '+String(idx+1).padStart(2,'0')+' / '+String(rows().length).padStart(2,'0'));
  put('foreign',r[0]);put('roman',r[1]||'발음 표기 없음');put('roman-label',cfg.pronunciation?.[lang]||'발음 표기');
  $('roman-box').hidden=!showReading;$('roman-toggle').textContent=showReading?'발음 표기 숨기기':'발음 표기 보기';
  syncSegment();put('meaning',r[2]);put('position',(idx+1)+' / '+rows().length);
  $('prev').disabled=idx===0;$('next').disabled=idx===rows().length-1;$('bar').style.width=(100*(idx+1)/rows().length)+'%';
  put('status','발음 버튼을 눌러 들어보세요.');feedback('','info');renderQuiz();stats();
 }
 $('languages').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!$('languages').contains(b))return;const next=b.dataset.bvqChoice;if(!LANGS[next])return;stop();lang=next;idx=0;render();});
 $('scenes').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!DATA[lang][b.dataset.bvqChoice])return;stop();scene=b.dataset.bvqChoice;idx=0;render();$('lesson').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
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
 $('prev').addEventListener('click',()=>{if(idx>0){stop();idx--;render();}});$('next').addEventListener('click',()=>{if(idx<rows().length-1){stop();idx++;render();}});
 $('check').addEventListener('click',()=>{
  if(answered)return;
  if(selected<0){feedback('먼저 답을 하나 선택해 주세요.','info');return;}
  const answers=[...$('answers').children],choice=answers[selected];
  if(options[selected]!==decode(current()[2])){
   quizErrors++;choice.dataset.result='wrong';
   choice.classList.remove('bv-wobble');void choice.offsetWidth;choice.classList.add('bv-wobble');
   feedback('아쉬워요! 다른 답을 선택해 다시 도전해 보세요.','wrong');cue(false);return;
  }
  answered=true;choice.dataset.result='correct';answers.forEach(b=>b.disabled=true);
  $('check').disabled=true;$('check').textContent='정답 완료 ✓';
  const key=lang+'|'+scene+'|'+idx;
  if(!progress.done[key]){progress.done[key]=true;progress.xp+=10;save();feedback('✓ 정답입니다! +10 XP · '+(quizErrors?'재도전 성공!':'잘하셨어요!'),'correct');}
  else feedback('✓ 정답입니다! 이미 완료한 문제여서 XP는 추가되지 않습니다.','correct');
  cue(true);stats();
 });
 $('reset').addEventListener('click',()=>{if(confirm('학습 기록을 초기화하시겠습니까?')){progress={xp:0,done:{}};save();stats();feedback('학습 기록을 초기화했습니다.','info');}});
 // AdSense initialized only after page load and once per ad container (unchanged from V5.3).
 function initAds(){if(!document.querySelector('script[src*="adsbygoogle.js"]')){const s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9524179834302691';s.crossOrigin='anonymous';document.head.append(s);}root.querySelectorAll('ins.adsbygoogle').forEach(ad=>{if(ad.dataset.adsbygoogleStatus||ad.dataset.bvqRequested)return;ad.dataset.bvqRequested='1';try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){ad.dataset.bvqRequested='';}});}
 // Share the canonical Blogger post, not the GitHub asset preview URL.
 const PUBLIC_URL='https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html';
 const SHARE_TEXT='BiteVoyage 여행 회화 무료 학습 · 4개 국어 896개 표현';
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
 syncSound();render();filterScenes();status('✓ V5.6 보정판 연결 확인 · 학습 표현 '+total+'개 · 발음 표기 '+readings+'/'+total+'개 · 단어 대응표 448개');
 if(document.readyState==='complete')initAds();else window.addEventListener('load',initAds,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
