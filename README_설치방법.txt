BiteVoyage Language Quest Premium V6.0 — 전체 교체 안내
발행 기준: 2026-11-22 · build: bvq60-premium-20261122-r1
대상 Blogger 게시글:
https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html
GitHub 저장소:
https://github.com/yesafrica-byte/bitevoyage-language

[먼저 확인할 사항]
- 기존 V5.6 게시글 및 GitHub 원본을 반드시 복사·백업해 두세요.
- 서비스 운영 중에는 GitHub 저장소를 삭제하거나 비우지 마세요. 새 JS 및 파일을 먼저 업로드하고 시험하는 것이 안전합니다.
- GitHub 01_GITHUB_UPLOAD 폴더 내 11개 파일을 모두 저장소 최상위에 올리세요(폴더째 올리지 마세요).
- Commit 후 https://yesafrica-byte.github.io/bitevoyage-language/ 에서 새 V6.0이 작동하는지 점검하세요.
- GitHub 정상 배포를 확인한 뒤 Blogger 글을 HTML 보기 모드로 열고, 02_BLOGGER/BLOGGER_FULL_REPLACE_V6.html 내용으로 본문 전체를 교체하세요.
- 게시글 URL과 기존 태그/라벨은 그대로 유지할 수 있습니다.
- 방문자는 구버전 캐시를 볼 수 있으므로 모바일 Chrome에서 강력 새로고침 또는 시크릿 탭으로 확인하세요.

[GitHub 전체 업로드 11개]
.nojekyll
bvq60-data.js
bvq60-engine.js
favicon-192.png
favicon-512.png
favicon-maskable-512.png
index.html
install.html
launch.html
manifest.webmanifest
sw.js

[기존 파일]
- 구버전 bvq56-data.js / bvq56-engine.js는 새 Blogger 본문에서 더 이상 호출하지 않습니다.
- 정상 동작을 충분히 확인하기 전까지 삭제할 필요가 없습니다. 정리하려면 나중에 삭제하세요.
- 기존 PWA 아이콘 3개, 설치 페이지, Manifest, Service Worker 기능은 V6에 재포함되었습니다.
- V6 Github 미리보기의 robots=noindex 설정으로 Blogger 본문 중복 색인을 피하도록 했습니다.

[V6.0 구성]
영어/일본어/중국어/한국어 4개 언어 x 14개 상황 x (초급 16 + 중급 8 + 고급 8) = 1,792개 표현.
- 기존 초급 896개 원문·한국어/영어 뜻·순서 완전 보존. 기존 영어 IPA는 espeak 규칙 기반으로 재생성하였습니다.
- 새 중급 448개·고급 448개는 각각 상황별 8개씩 추가했습니다.
- 일본어 원문·Hepburn 표기, 중국어 원문·성조 병음, 영어 IPA(미국식 참고), 한국어 로마자(참고) 제공.
- 기존 초급 일본어·중국어 448개는 단어/발음 짝을 유지. 중고급에서는 확인 가능한 일본어 단위만 안전하게 나누고 중국어는 음절별 발음·전체 문장 중심으로 표시합니다.
- 문장에 매칭하는 핵심 단어 해설 추가. 어휘 매칭이 없는 문장은 단어 카드가 숨겨집니다.
- 마지막 언어/상황/단계/문장 번호 저장, 오답 복습, 단계별 학습량 확인.
- 기존 듣기/느리게 듣기/정지/반복, 퀴즈/XP, 효과음 On/Off, 공유, 광고, 아이콘 설치 연결 보존.

[기존 학습 기록 호환]
- 기존 localStorage 키 'bvq-v5-progress' 보존. 기존 초급 문제 키 lang|scene|index 유지.
- 중급/고급 문제 키는 lang|scene|level|index 로 분리되어 충돌하지 않습니다.
- 새 마지막 학습 위치는 'bvq-v6-last'에 저장됩니다.
- 사용자의 브라우저/기기 또는 Blogger 도메인을 변경하면 기록을 자동 이전할 수 없습니다.

[정확성·기술 검증 범위]
- 데이터: 총 1,792개, 발음 필드 1,792개, 14개 상황, 4개 언어 x 3개 단계 데이터 존재 확인.
- 기존 896개의 원문/뜻/순서 0건 변경, 동일 상황/언어 중복 원문 0건.
- 초급 448개 일·중 단어/발음 대응 매칭 검사, 신규 448개 일·중 데이터의 대응값 연결 검사.
- Chromium에서 전체 168개 언어/상황/단계 조합과 퀴즈 오답·정답 처리 테스트 통과.
- 브라우저용 저장소 모의 실험에서 V5 XP 50·완료 1건 유지 및 V6 마지막 위치 복원 확인.
- JS 문법 검사 통과. 실제 Blogger 글의 원격 배포·음성팩·OS별 PWA 설치를 수행하거나 보증한 것은 아닙니다.

[정확도 유의]
- 영어 IPA는 espeak 규칙 기반으로, 신규 중국어 병음과 한국어 로마자는 ICU 변환 기반으로 생성했습니다. 일부 다의어·연음·성조 변화가 실제 발음과 다를 수 있습니다.
- 일본어 신규 224개의 Hepburn 로마자는 초안 수기 작성 및 일관성 점검이지만, 전체에 대해 원어민 교차감수까지 진행된 것은 아닙니다.
- 의료·긴급 표현은 실제 의료진/현지 긴급서비스의 안내를 대신하지 않습니다.
- 광고 노출은 AdSense 계정 상태와 기기 환경에 따라 달라집니다.

[검수 팁]
- 공항: 초급 1/16 일본어 문장 원문/발음, 중급 1/8 출발시각, 고급 1/8 환승지원
- 식당: 알레르기·봉사료·영수증 등 고급 문장
- 중국어: 자동 병음의 다의어·성조/경성/1성 변화
- 한국어: 조사와 로마자 표기
- TTS: 실제 설치 음성팩에 따라 달라질 수 있으므로 언어별 2~3개씩 듣기

[V6.0 되돌리기]
1. Blogger 본문을 백업해 둔 V5.6 HTML로 복원.
2. V5.6 bvq56-data.js 및 bvq56-engine.js가 GitHub에 남아 있으면 기존 학습 페이지를 다시 이용 가능.
3. 데이터는 삭제하지 않았으므로 원래 XP는 기존 브라우저 저장소에서 유지됩니다.
