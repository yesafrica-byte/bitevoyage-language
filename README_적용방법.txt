BiteVoyage Premium V6.3 · STEP 01~04 상단 착지 위치 최적화 r4

필수 수정 파일: bvq62-engine.js (기존 GitHub 파일명 그대로 덮어쓰기)
선택 수정 파일: index.html (GitHub Pages 자체 테스트 페이지의 캐시만 갱신)
Blogger 본문 전체 교체: 불필요. 엔진 JS URL의 캐시값만 r4로 교체.

1) GitHub main 루트에서 bvq62-engine.js 덮어쓰기 후 Commit.
2) GitHub Pages의 직접 테스트 페이지를 이용한다면 index.html도 덮어쓰기.
3) Blogger 게시글 HTML 보기에서 bvq62-engine.js?v= URL만 찾아 다음 값을 교체:
   기존: bvq63-stepflow-20261122-r3
   변경: bvq63-stepoffset-20261122-r4
4) bvq62-data.js 파일, 1920개 데이터, Manifest, PWA, Service Worker, 아이콘 등 변경 금지.

적용된 이동:
- 첫 화면 '무료 학습 시작하기' → STEP 01
- 언어 선택 → STEP 02
- 여행 상황 선택 → STEP 03
- 난이도 선택 → STEP 04
- 이어서 학습 / 오답 복습(오답 있을 때만) → STEP 04

착지 상단 간격: 모바일 14px / 태블릿 18px / PC 22px + 실제 고정/스티키 메뉴의 화면 상단 가림 높이.
예전 76~86px 고정 여백을 제거하고 모바일 Safari/Chrome 등의 레이아웃 차이에 대응합니다.
움직임 줄이기 설정 시 즉시 이동. 상황 검색 중 버튼을 누르면 키보드 닫기.

기존 V6.3 데이터와 엔진 검사 식별자 6.3.0 / bvq63-20261122-quality-r1 유지.
기존 학습 기록 localStorage 키, 1920개 표현, TTS, KEY VOCAB, 퀴즈, XP, 오답 복습, 공유, PWA 설치 로직 유지.

운영 주의: 사용자 휴대전화의 브라우저 주소창은 웹페이지가 위치를 제어할 수 없습니다.
고정 메뉴가 200px를 초과하는 비정상 테마 구성은 수동 조정이 필요할 수 있습니다.

반영 후 단계별 클릭 시 STEP 문구와 제목이 가려지지 않는지 모바일 시크릿 창에서 확인하세요.
