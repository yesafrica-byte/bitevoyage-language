/* BiteVoyage Language Quest V5.5.0 | full 896 | quiz UX + study spacing | no dependencies */
(function(){
'use strict';
function boot(){
 const root=document.getElementById('bvq-v3');
 if(!root || root.dataset.bvqV55Ready==='1')return;
 const cfg=window.BVQ_V55_DATA;
 const $=name=>document.getElementById('bvq3-'+name);
 const warn=$('runtime-warning');
 function status(message){if(warn)warn.textContent=message;}
 if(!cfg||!cfg.langs||!cfg.scenes||!cfg.data){status('V5.5 데이터 로드 실패: GitHub Pages에 bvq55-data.js가 있는지 확인해 주세요.');return;}
 const supported=['en','ja','zh','ko'];
 let total=0,readings=0,integrityError='';
 if(cfg.version!=='5.5.0'||cfg.build_id!=='v55-20261121-aligned-share-shortcut')integrityError='데이터·엔진 버전 불일치';
 else for(const lng of supported){
  if(!cfg.data[lng]){integrityError='언어 데이터 누락: '+lng;break;}
  for(const sc of cfg.scenes.map(s=>s[0])){
   const set=cfg.data[lng][sc];
   if(!Array.isArray(set)||set.length!==16){integrityError='문장 수 오류: '+lng+'/'+sc;break;}
   for(const item of set){total++;if(item&&typeof item[1]==='string'&&item[1].trim())readings++;}
  }
  if(integrityError)break;
 }
 if(integrityError||total!==896||readings!==896){status('V5.5 파일 검증 실패: '+(integrityError||('발음 '+readings+'/'+total))+' · 새 JS 2개를 확인해 주세요.');return;}
 const required=['share-notice','languages','scenes','search','lesson-title','counter','foreign','roman','roman-label','roman-box','roman-toggle','meaning','position','prev','next','bar','answers','xp','done','status','feedback','speak','slow','repeat','stop','check','reset','segment-box','segment-line','segment-toggle','sound-toggle','aligned-chips','share-native','share-copy','share-facebook','share-x','shortcut-open','shortcut-help','shortcut-close','shortcut-copy','shortcut-android','shortcut-ios','shortcut-desktop'];
 const missing=required.filter(id=>!$(id));
 if(missing.length){status('페이지 구성 요소가 누락되었습니다: '+missing.join(', '));return;}
 root.dataset.bvqV55Ready='1';
 const LANGS=cfg.langs,SCENES=cfg.scenes,DATA=cfg.data;
 let lang='ja',scene='airport',idx=0,selected=-1,rate=1,options=[],audioSeq=0,showReading=true,answered=false,quizErrors=0;
 const STORE='bvq-v5-progress';let progress={xp:0,done:{}};
 try{const s=JSON.parse(localStorage.getItem(STORE)||'null');if(s&&typeof s==='object'){progress.xp=Number(s.xp)||0;progress.done=s.done||{}}}catch(e){}
 function save(){try{localStorage.setItem(STORE,JSON.stringify(progress));}catch(e){}}
 const PREF='bvq-v55-ui';let settings={sounds:false,segments:true};
 try{const saved=JSON.parse(localStorage.getItem(PREF)||localStorage.getItem('bvq-v54-ui')||'null');if(saved&&typeof saved==='object'){settings.sounds=saved.sounds===true;settings.segments=saved.segments!==false;}}catch(e){}
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
 // V5.5: keep source and phonetic spans in the same indexed token pairs.
 // Segmentation is a teaching aid; original script and spoken text never change.
 const overridePairs={
  ja:{
   'チェックインカウンターはどこですか？':[['チェックイン','Chekkuin'],['カウンター','kauntā'],['は','wa'],['どこ','doko'],['です','desu'],['か？','ka?']],
   'チェックインをお願いします。':[['チェックイン','Chekkuin'],['を','o'],['お願い','onegai'],['します。','shimasu.']],
   '搭乗口はどこですか？':[['搭乗口','Tōjōguchi'],['は','wa'],['どこ','doko'],['です','desu'],['か？','ka?']],
   '警察を呼んでください。':[['警察','Keisatsu'],['を','o'],['呼んで','yonde'],['ください。','kudasai.']]
  },
  zh:{
   '我想办理值机。':[['我','wǒ'],['想','xiǎng'],['办理','bànlǐ'],['值机。','zhíjī.']]
  }
 };
 function removePunct(s){return s.replace(/[。！？!?,，．.\s]/g,'');}
 function sourceSegments(s,locale){
  const input=decode(s), words=[];
  if('Segmenter' in Intl){
   try{for(const x of new Intl.Segmenter(locale==='ja'?'ja-JP':'zh-CN',{granularity:'word'}).segment(input)){
    if(!x.segment.trim())continue;
    if(!x.isWordLike && words.length)words[words.length-1]+=x.segment;
    else words.push(x.segment);
   }}catch(e){}
  }
  if(!words.length){return [...input].filter(x=>x.trim()).map((x,i,a)=>x);}
  if(locale==='zh'){
   let arr=words.slice();
   const split=new Set(['我有','我在','请在','我想','请给','这里有','有没有']);
   arr=arr.flatMap(v=>split.has(v)?[v.slice(0,1),v.slice(1)]:[v]);
   const compounds=new Set(['值机','登机口','火车站','飞机场','地铁站','信用卡','行李','柜台','车票','门票','多少钱','请问']);
   for(let i=0;i<arr.length-1;i++){const whole=removePunct(arr[i])+removePunct(arr[i+1]);if(compounds.has(whole)){arr.splice(i,2,arr[i]+arr[i+1]);i=Math.max(-1,i-2);}}
   return arr;
  }
  return words;
 }
 // Romanization is split only after visible alignment; no independent fake spacing.
 function romaWords(s){return decode(s).trim().split(/\s+/u).filter(Boolean);}
 function normalizeRoma(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
 function kanaRomaji(s){
  const digraph={きゃ:'kya',きゅ:'kyu',きょ:'kyo',しゃ:'sha',しゅ:'shu',しょ:'sho',ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',みゃ:'mya',みゅ:'myu',みょ:'myo',りゃ:'rya',りゅ:'ryu',りょ:'ryo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',じゃ:'ja',じゅ:'ju',じょ:'jo',びゃ:'bya',びゅ:'byu',びょ:'byo',ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',てぃ:'ti',でぃ:'di',ふぁ:'fa',ふぃ:'fi',ふぇ:'fe',ふぉ:'fo',ちぇ:'che',しぇ:'she',じぇ:'je',うぃ:'wi',うぇ:'we',うぉ:'wo'};
  const basic=['あ:a','い:i','う:u','え:e','お:o','か:ka','き:ki','く:ku','け:ke','こ:ko','さ:sa','し:shi','す:su','せ:se','そ:so','た:ta','ち:chi','つ:tsu','て:te','と:to','な:na','に:ni','ぬ:nu','ね:ne','の:no','は:ha','ひ:hi','ふ:fu','へ:he','ほ:ho','ま:ma','み:mi','む:mu','め:me','も:mo','や:ya','ゆ:yu','よ:yo','ら:ra','り:ri','る:ru','れ:re','ろ:ro','わ:wa','を:o','ん:n','が:ga','ぎ:gi','ぐ:gu','げ:ge','ご:go','ざ:za','じ:ji','ず:zu','ぜ:ze','ぞ:zo','だ:da','ぢ:ji','づ:zu','で:de','ど:do','ば:ba','び:bi','ぶ:bu','べ:be','ぼ:bo','ぱ:pa','ぴ:pi','ぷ:pu','ぺ:pe','ぽ:po','ぁ:a','ぃ:i','ぅ:u','ぇ:e','ぉ:o'];
  const map=Object.fromEntries(basic.map(v=>v.split(':')));
  let clean=[...s].map(c=>c>='ァ'&&c<='ヶ'?String.fromCharCode(c.charCodeAt(0)-96):c).join('');
  let out=''; for(let i=0;i<clean.length;i++){
   const c=clean[i],p=clean.slice(i,i+2);if(c==='っ'){const nx=digraph[clean.slice(i+1,i+3)]||map[clean[i+1]]||'';out+=nx[0]||'';continue;}
   if(p in digraph){out+=digraph[p];i++;continue;}if(c==='ー'){out+=out.slice(-1);continue;}
   if(c==='は' && clean==='は'){out+='wa';continue;}if(c==='へ'&&clean==='へ'){out+='e';continue;}
   if(!map[c])return null;out+=map[c];
  }return out;
 }
 // A source token with readable kana can anchor a one-to-one roman word.
 function matchRomanWidth(source,roma,pos){
  const expected=kanaRomaji(removePunct(source));if(!expected)return 0;
  let target=normalizeRoma(expected);
  for(let n=1;n<=Math.min(3,roma.length-pos);n++){
   let piece=normalizeRoma(roma.slice(pos,pos+n).join(''));
   if(piece===target || (piece.replace(/aa/g,'a').replace(/uu/g,'u').replace(/ou/g,'o')===target.replace(/aa/g,'a').replace(/uu/g,'u').replace(/ou/g,'o')))return n;
  }return 0;
 }
 // Match by kana anchors; unmatched kanji spans are grouped, not mis-assigned per character.
 function alignJapanese(source,reading){
  const sw=sourceSegments(source,'ja'),rw=romaWords(reading);
  if(sw.length===1)return [[source,reading]];
  const anchors=[];
  for(let i=0;i<sw.length;i++){
   if(!kanaRomaji(removePunct(sw[i])))continue;
   for(let j=0;j<rw.length;j++){
    let n=matchRomanWidth(sw[i],rw,j);
    if(n>0){anchors.push({i,j,n});break;}
   }
  }
  // best increasing anchors; no forced mismatched per-character phonetics
  let lastI=-1,lastJ=-1,good=[];
  for(const a of anchors){if(a.i>lastI&&a.j>lastJ){good.push(a);lastI=a.i;lastJ=a.j+a.n-1;}}
  if(good.length===0){return [[source,reading]];}
  let pairs=[],si=0,ri=0;
  for(const a of good){
   if(a.i<si||a.j<ri)continue;
   if(a.i>si||a.j>ri){
    if(a.i>si&&a.j>ri)pairs.push([sw.slice(si,a.i).join(''),rw.slice(ri,a.j).join(' ')]);
    else return [[source,reading]];
   }
   pairs.push([sw[a.i],rw.slice(a.j,a.j+a.n).join(' ')]);
   si=a.i+1;ri=a.j+a.n;
  }
  if(si<sw.length||ri<rw.length){if(si<sw.length&&ri<rw.length)pairs.push([sw.slice(si).join(''),rw.slice(ri).join(' ')]);else return [[source,reading]];}
  if(pairs.some(x=>!x[0]||!x[1]))return [[source,reading]];
  return pairs;
 }
 // All Chinese characters are one spoken syllable; parse fused pinyin without changing source.
 const pinyinValid=new Set(('a ai an ang ao ba bai ban bang bao bei ben beng bi bian biao bie bin bing bo bu ca cai can cang cao ce cen ceng cha chai chan chang chao che chen cheng chi chong chou chu chua chuai chuan chuang chui chun chuo ci cong cou cu cuan cui cun cuo da dai dan dang dao de dei den deng di dia dian diao die ding diu dong dou du duan dui dun duo e ei en eng er fa fan fang fei fen feng fo fou fu ga gai gan gang gao ge gei gen geng gong gou gu gua guai guan guang gui gun guo ha hai han hang hao he hei hen heng hong hou hu hua huai huan huang hui hun huo ji jia jian jiang jiao jie jin jing jiong jiu ju juan jue jun ka kai kan kang kao ke ken keng kong kou ku kua kuai kuan kuang kui kun kuo la lai lan lang lao le lei leng li lia lian liang liao lie lin ling liu lo long lou lu luan lue lun luo lv lve ma mai man mang mao me mei men meng mi mian miao mie min ming miu mo mou mu na nai nan nang nao ne nei nen neng ni nian niang niao nie nin ning niu nong nou nu nuan nue nuo nv nve o ou pa pai pan pang pao pei pen peng pi pian piao pie pin ping po pou pu qi qia qian qiang qiao qie qin qing qiong qiu qu quan que qun ran rang rao re ren reng ri rong rou ru rua ruan rui run ruo sa sai san sang sao se sen seng sha shai shan shang shao she shen sheng shi shou shu shua shuai shuan shuang shui shun shuo si song sou su suan sui sun suo ta tai tan tang tao te teng ti tian tiao tie ting tong tou tu tuan tui tun tuo wa wai wan wang wei wen weng wo wu xi xia xian xiang xiao xie xin xing xiong xiu xu xuan xue xun ya yan yang yao ye yi yin ying yo yong you yu yuan yue yun za zai zan zang zao ze zei zen zeng zha zhai zhan zhang zhao zhe zhen zheng zhi zhong zhou zhu zhua zhuai zhuan zhuang zhui zhun zhuo zi zong zou zu zuan zui zun zuo').split(' '));
 function chineseSyllables(text,count){
  const input=decode(text).toLowerCase().replace(/[。，？！?!.,;；]/g,'').replace(/\s+/g,'');
  const src=[...input].filter(ch=>/[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹ]/i.test(ch));
  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ü/g,'v');
  const acc=s=>(s.match(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹ]/g)||[]).length;
  const memo=new Map();
  function walk(i,k){if(i===src.length)return k===count?{score:0,words:[]}:null;
   if(k>=count)return null;const key=i+'|'+k;if(memo.has(key))return memo.get(key);
   let best=null;
   for(let n=1;n<=7&&i+n<=src.length;n++){
    const word=src.slice(i,i+n).join('');if(!pinyinValid.has(norm(word)))continue;
    const accents=acc(word);if(accents>1)continue;
    const next=walk(i+n,k+1);if(!next)continue;
    // prefer one tone per syllable and natural syllable length
    const score=next.score+(accents===0?0.52:0)+(n===1?0.22:0);
    if(!best||score<best.score)best={score,words:[word,...next.words]};
   }memo.set(key,best);return best;
  }
  const result=walk(0,0);return result?result.words:null;
 }
 function alignChinese(source,reading){
  const chars=[...decode(source)].filter(c=>/\p{Script=Han}/u.test(c));
  const syl=chineseSyllables(reading,chars.length);
  if(!syl||syl.length!==chars.length)return [[source,reading]];
  const chunks=sourceSegments(source,'zh');let pairs=[],pos=0;
  for(let segment of chunks){const n=[...segment].filter(c=>/\p{Script=Han}/u.test(c)).length;
   if(n===0&&pairs.length){pairs[pairs.length-1][0]+=segment;continue;}
   if(n<1)continue;
   pairs.push([segment,syl.slice(pos,pos+n).join('')]);pos+=n;
  }
  if(pos!==syl.length||pairs.length===0)return [[source,reading]];
  // The groups are by Chinese lexical word; display pinyin with one space per paired word.
  const endpunct=(decode(reading).match(/[。！？?!.,，．]+\s*$/)||[])[0]||'';
  if(endpunct && pairs.length && !/[。！？?!.,，．]\s*$/.test(pairs[pairs.length-1][1]))pairs[pairs.length-1][1]+=endpunct;
  return pairs;
 }
 // Curated splits for repeated Japanese templates; both lines now share exact boundaries.
 const jaSplitMap={
  'ありますか？':['あります','か？'],
  '今開いています':['今','開いて','います'],
  '見せていただけます':['見せて','いただけます'],
  '探しています。':['探して','います。'],
  '書いていただけます':['書いて','いただけます'],
  '案内表示':['案内','表示'],
  'を手伝っていただけます':['を','手伝って','いただけます'],
  'を手伝ってくださって':['を','手伝って','くださって'],
  'Wi-Fi':['Wi-','Fi'],
  'チェックインカウンター':['チェックイン','カウンター'],
  'お願いします。':['お願い','します。'],
  '預ける荷物':['預ける','荷物'],
  '一つあります。':['一つ','あります。'],
  '遅れています。':['遅れて','います。'],
  '一枚お願いします。':['一枚','お願い','します。'],
  '止めてください。':['止めて','ください。'],
  '一枚いただけます':['一枚','いただけます'],
  '控えめにしてください。':['控えめ','に','して','ください。'],
  '一つください。':['一つ','ください。'],
  '持ち帰りできます':['持ち帰り','できます'],
  '割引していただけます':['割引','して','いただけます'],
  '今日予約できます':['今日','予約','できます'],
  '施術時間':['施術','時間'],
  '教えてください。':['教えて','ください。'],
  '歩いて行けます':['歩いて','行けます'],
  '変更したい':['変更','したい'],
  '両替できます':['両替','できます'],
  '為替レート':['為替','レート'],
  'ピーナッツアレルギー':['ピーナッツ','アレルギー'],
  '呼んでください。':['呼んで','ください。']
 };
 function refineJapanesePairs(pairs){
  let result=[];
  for(const [script,sound] of pairs){
   const split=jaSplitMap[script],pron=romaWords(sound);
   if(split && split.join('')===script && split.length===pron.length){
    split.forEach((part,i)=>result.push([part,pron[i]]));
   }else result.push([script,sound]);
  }
  return result;
 }
 function alignedPairs(source,reading,locale){
  const override=overridePairs[locale]&&overridePairs[locale][decode(source)];
  const pairs=override||(locale==='zh'?alignChinese(source,reading):alignJapanese(source,reading));
  if(!pairs||!pairs.length)return [[source,reading]];
  const joined=pairs.map(x=>x[0]).join('');
  if(joined!==decode(source))return [[source,reading]];
  return locale==='zh' && pairs.length>1 ? pairs.map(([a,b])=>[a,b.replace(/\s+/g,'')]) : (locale==='ja'?refineJapanesePairs(pairs):pairs);
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
 // Browser installation is user controlled. Do not pretend a page script can place an OS icon.
 const help=$('shortcut-help');
 let savedInstallEvent=null;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();savedInstallEvent=event;});
 function device(){const u=navigator.userAgent||'';if(/iphone|ipad|ipod/i.test(u))return 'ios';if(/android/i.test(u))return 'android';return 'desktop';}
 function showShortcut(){const platform=device();
  ['android','ios','desktop'].forEach(x=>{const el=$('shortcut-'+x);el.hidden=x!==platform;});
  help.hidden=false;$('shortcut-open').setAttribute('aria-expanded','true');
  $('shortcut-close').focus();
 }
 $('shortcut-open').addEventListener('click',async()=>{if(savedInstallEvent){
   try{savedInstallEvent.prompt();const result=await savedInstallEvent.userChoice;savedInstallEvent=null;
     if(result&&result.outcome==='accepted'){notice('브라우저 설치 요청을 확인했습니다.');return;}}
   catch(e){} }
  showShortcut();});
 $('shortcut-close').addEventListener('click',()=>{help.hidden=true;$('shortcut-open').setAttribute('aria-expanded','false');$('shortcut-open').focus();});
 $('shortcut-copy').addEventListener('click',copyLink);
 help.addEventListener('keydown',e=>{if(e.key==='Escape'){$('shortcut-close').click();}});
 syncSound();render();filterScenes();status('✓ V5.5 연결 확인 · 학습 표현 '+total+'개 · 발음 표기 '+readings+'/'+total+'개');
 if(document.readyState==='complete')initAds();else window.addEventListener('load',initAds,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
