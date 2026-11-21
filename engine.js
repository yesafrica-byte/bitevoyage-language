/* BiteVoyage Language Quest V5.0 | external engine | no dependencies */
(function(){
'use strict';
function boot(){
 const root=document.getElementById('bvq-v3');
 if(!root || root.dataset.bvqV5Ready==='1')return;
 const cfg=window.BVQ_V5_DATA;
 const $=name=>document.getElementById('bvq3-'+name);
 const warn=$('runtime-warning');
 function status(message){if(warn)warn.textContent=message;}
 if(!cfg || !cfg.langs || !cfg.scenes || !cfg.data){status('학습 데이터를 불러오지 못했습니다. 데이터 파일 주소와 공개 설정을 확인해 주세요.');return;}
 const required=['languages','scenes','search','lesson-title','counter','foreign','roman','meaning','position','prev','next','bar','answers','xp','done','status','feedback','speak','slow','repeat','stop','check','reset'];
 const missing=required.filter(id=>!$(id));
 if(missing.length){status('페이지 구성 요소가 누락되었습니다: '+missing.join(', '));return;}
 root.dataset.bvqV5Ready='1';
 const LANGS=cfg.langs,SCENES=cfg.scenes,DATA=cfg.data;
 let lang='ja',scene='airport',idx=0,selected=-1,rate=1,options=[],audioSeq=0;
 const STORE='bvq-v5-progress';let progress={xp:0,done:{}};
 try{const s=JSON.parse(localStorage.getItem(STORE)||'null');if(s&&typeof s==='object'){progress.xp=Number(s.xp)||0;progress.done=s.done||{}}}catch(e){}
 function save(){try{localStorage.setItem(STORE,JSON.stringify(progress))}catch(e){}}
 function decode(v){let s=String(v==null?'':v);const t=document.createElement('textarea');for(let i=0;i<5;i++){t.innerHTML=s;const n=t.value;if(n===s)break;s=n;}return s;}
 function put(id,value){$(id).textContent=decode(value)}
 function make(tag,cl,value){const x=document.createElement(tag);if(cl)x.className=cl;if(value!==undefined)x.textContent=decode(value);return x}
 function stop(){audioSeq++;if('speechSynthesis' in window){try{speechSynthesis.cancel()}catch(e){}}}
 const rows=()=>DATA[lang][scene],current=()=>rows()[idx];
 function mix(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a}
 function selectState(){
  $('languages').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===lang)));
  $('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bvqChoice===scene)));
 }
 function filterScenes(){const q=decode($('search').value).trim().toLowerCase();$('scenes').querySelectorAll('[data-bvq-choice]').forEach(b=>{const label=decode(b.textContent).toLowerCase();b.hidden=!!q&&!label.includes(q);});}
 function renderQuiz(){
  selected=-1;const answer=decode(current()[2]);
  const pool=[...new Set(Object.values(DATA[lang]).flat().map(r=>decode(r[2])))].filter(x=>x!==answer);
  options=mix([answer,...mix(pool).slice(0,3)]);
  $('answers').replaceChildren();
  options.forEach((value,i)=>{const b=make('button','bv-answer',value);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{selected=i;[...$('answers').children].forEach((x,j)=>x.setAttribute('aria-pressed',String(i===j)));});$('answers').append(b);});
 }
 function stats(){put('xp',progress.xp);put('done',Object.keys(progress.done).length)}
 function render(){
  const s=SCENES.find(x=>x[0]===scene),r=current();if(!s||!r)return;
  selectState();put('lesson-title',s[2]+' · '+LANGS[lang][1]+' · 초급 A1');
  put('counter','LESSON '+String(idx+1).padStart(2,'0')+' / '+String(rows().length).padStart(2,'0'));
  put('foreign',r[0]);put('roman',r[1]||'');put('meaning',r[2]);put('position',(idx+1)+' / '+rows().length);
  $('prev').disabled=idx===0;$('next').disabled=idx===rows().length-1;$('bar').style.width=(100*(idx+1)/rows().length)+'%';
  put('status','발음 버튼을 눌러 들어보세요.');put('feedback','');renderQuiz();stats();
 }
 $('languages').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!$('languages').contains(b))return;const next=b.dataset.bvqChoice;if(!LANGS[next])return;stop();lang=next;idx=0;render();});
 $('scenes').addEventListener('click',e=>{const b=e.target.closest('button[data-bvq-choice]');if(!b||!$('scenes').contains(b))return;const next=b.dataset.bvqChoice;if(!DATA[lang][next])return;stop();scene=next;idx=0;render();$('lesson').scrollIntoView({behavior:'smooth',block:'start'});});
 $('search').addEventListener('input',filterScenes);
 function speak(speed){
  rate=speed;if(!('speechSynthesis' in window)){put('status','음성 재생을 지원하지 않는 브라우저입니다.');return;}
  stop();const seq=audioSeq,u=new SpeechSynthesisUtterance(decode(current()[0]));u.lang=LANGS[lang][3];u.rate=speed;u.pitch=1;u.volume=1;
  const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang.toLowerCase()===u.lang.toLowerCase())||voices.find(x=>x.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));if(v)u.voice=v;
  u.onstart=()=>{if(seq===audioSeq)put('status',speed<1?'천천히 재생 중…':'발음 재생 중…');};
  u.onend=()=>{if(seq===audioSeq)put('status','재생 완료');};
  u.onerror=e=>{if(seq===audioSeq&&e.error!=='canceled'&&e.error!=='interrupted')put('status','음성 엔진 또는 언어팩을 확인해 주세요.');};
  put('status',speed<1?'느린 발음 준비 중…':'발음 준비 중…');try{speechSynthesis.speak(u)}catch(e){put('status','음성 재생 실패');}
 }
 $('speak').addEventListener('click',()=>speak(1));$('slow').addEventListener('click',()=>speak(.55));$('repeat').addEventListener('click',()=>speak(rate));$('stop').addEventListener('click',()=>{stop();put('status','정지했습니다.');});
 $('prev').addEventListener('click',()=>{if(idx>0){stop();idx--;render();}});$('next').addEventListener('click',()=>{if(idx<rows().length-1){stop();idx++;render();}});
 $('check').addEventListener('click',()=>{if(selected<0){put('feedback','먼저 답을 선택해 주세요.');return;}if(options[selected]!==decode(current()[2])){put('feedback','다시 도전해 보세요. 정답: '+current()[2]);return;}const key=lang+'|'+scene+'|'+idx;if(!progress.done[key]){progress.done[key]=true;progress.xp+=10;save();put('feedback','정답입니다! +10 XP');}else put('feedback','정답입니다! 이미 완료한 문제입니다.');stats();});
 $('reset').addEventListener('click',()=>{if(confirm('학습 기록을 초기화하시겠습니까?')){progress={xp:0,done:{}};save();stats();put('feedback','기록이 초기화되었습니다.');}});
 // Ads: only initialize on page load, skip filled slots; never push while loader unavailable.
 function initAds(){if(!document.querySelector('script[src*="adsbygoogle.js"]')){const s=document.createElement('script');s.async=true;s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9524179834302691';s.crossOrigin='anonymous';document.head.append(s);}root.querySelectorAll('ins.adsbygoogle').forEach(ad=>{if(ad.dataset.adsbygoogleStatus||ad.dataset.bvqRequested)return;ad.dataset.bvqRequested='1';try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){ad.dataset.bvqRequested='';}});}
 render();filterScenes();status('✓ 학습 준비 완료 · 4개 국어 · 14개 상황 · 896개 표현');
 if(document.readyState==='complete')initAds();else window.addEventListener('load',initAds,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
