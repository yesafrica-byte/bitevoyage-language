BiteVoyage V6.3 STEP 2 → STEP 3 → STEP 4 최소 패치

[기존 기능 보존]
- Github 파일명 유지: bvq62-engine.js
- 데이터 파일(bvq62-data.js), 1,920개 표현, 발음, KEY VOCAB, 음성, 퀴즈, XP, 오답 기록, 공유, PWA 파일은 변경하지 않음
- 마지막 위치로 이어서 학습, 오답 복습 버튼은 이전처럼 STEP 04에 직접 이동
- 움직임 줄이기(prefers-reduced-motion) 설정 존중
- 데이터 버전/빌드 ID(6.3.0 / bvq63-20261122-quality-r1) 유지

[변경 후 동선]
STEP 02 여행 상황 선택 -> STEP 03 난이도 선택 화면으로 부드럽게 이동
STEP 03 초급/중급/고급 클릭 -> STEP 04 학습 카드로 부드럽게 이동

[권장 GitHub 적용]
1. 현재 저장소의 bvq62-engine.js 와 index.html 을 백업
2. bvq62-engine.js 를 같은 파일명으로 덮어쓰기 후 Commit
3. GitHub Pages 자체 테스트 화면의 캐시도 피하려면 index.html 도 같은 이름으로 덮어쓰기
   (index.html 내용은 동일하며, 엔진 쿼리 문자열 한 곳만 변경함)
4. bvq62-data.js 및 나머지 설치 파일은 건드리지 않음

[Blogger 본문 — 전체 교체 필요 없음]
HTML 보기에서 다음 엔진 스크립트 주소를 검색합니다.
기존: https://yesafrica-byte.github.io/bitevoyage-language/bvq62-engine.js?v=bvq63-20261122-quality-r1
변경: https://yesafrica-byte.github.io/bitevoyage-language/bvq62-engine.js?v=bvq63-stepflow-20261122-r2
수정 대상은 엔진 JS URL의 ?v= 뒷부분만! 데이터 JS URL은 그대로 유지.
현재 본문이 다른 ?v= 값이라면 'bvq62-engine.js?v='로 검색해 그 주소 한 곳만 새 값으로 변경.

본 전체 HTML을 교체하고 싶은 경우에만 BLOGGER_FULL_REPLACE_OPTIONAL.html 을 사용하세요.
이 파일은 기준 V6.3 Blogger HTML에서 '엔진 URL 한 곳'만 변경한 선택 옵션이며
최근에 사용자가 본문에 직접 추가한 다른 커스텀 수정은 반영되지 않을 수 있습니다.
따라서 한 줄 수정이 권장됩니다.

[배포 검증]
- STEP 02에서 '호텔·숙소' 누르면 STEP 03 난이도 영역 표시
- STEP 03에서 '고급' 누르면 STEP 04, 호텔·해당언어·고급 / LESSON 01/08
- '이어서 학습', '오답 복습'은 이전처럼 STEP 04 직접 이동
- 시크릿 창/강력 새로고침으로 확인
- 페이지가 로딩 안 되면 Blogger의 data.js 와 engine.js 쿼리 버전 및 GitHub 업로드 커밋 확인
