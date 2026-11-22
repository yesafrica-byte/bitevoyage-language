BiteVoyage Premium V6.3 — STEP 01 상단 여백 보정 (r5)

현상
- STEP 01의 ‘무료 학습 시작하기’ 또는 공유된 #bvq-start 링크는 페이지가 처음 표시될 때도 이동합니다.
- Blogger 테마, 광고, 웹폰트 등의 레이아웃 로딩이 뒤늦게 끝나면 첫 이동 위치가 달라질 수 있습니다.
- STEP 02, 03, 04는 사용자 선택 후 이동하므로 상대적으로 정확합니다.
- 라이브 기기의 정확한 원인은 화면을 직접 측정할 수 없어 '유력한 원인'으로 판단합니다.

수정 내용
- STEP 01 이동 직후 페이지 레이아웃이 늦게 변경될 때만 실제 위치를 재측정해 상단 간격을 보정.
- STEP 02, 03, 04의 기존 상단 여백 계산식은 보존.
- 사용자가 직접 스크롤하거나 언어/상황/난이도를 선택하면 STEP 01의 지연 보정을 즉시 취소.
- 기존 1,920개 문장, 학습기록(localStorage), 발음, 퀴즈, PWA, 공유 기능 변경 없음.

GitHub 업로드
1) github.com/yesafrica-byte/bitevoyage-language 에서 현재 main 브랜치 파일 백업.
2) bvq62-engine.js 를 같은 이름으로 덮어쓰기(필수).
3) index.html 을 덮어쓰기(GitHub Pages 자체 테스트용, 권장).
4) Commit changes → Pages 배포 확인.
5) bvq62-data.js, install/launch/sw, manifest, 아이콘은 수정하지 않음.

Blogger 적용 — 전체 HTML 변경 불필요
기존 JS 줄:
<script defer src="https://yesafrica-byte.github.io/bitevoyage-language/bvq62-engine.js?v=bvq63-stepoffset-20261122-r4"></script>

변경 JS 줄:
<script defer src="https://yesafrica-byte.github.io/bitevoyage-language/bvq62-engine.js?v=bvq63-step1-gapfix-20261122-r5"></script>

주의
- ?v= 뒤 값만 변경합니다. bvq62-engine.js 파일명 유지.
- DATA 스크립트의 ?v=bvq63-20261122-quality-r1 은 수정하지 않습니다.
- 전체 본문 교체보다 위의 한 줄 변경을 권장합니다.
- 2~4단계 기존 화면 상단 간격 14/18/22px(+고정메뉴 높이) 유지.
- 적용 후 모바일 시크릿 모드에서 '무료 학습 시작하기', 공유 링크 #bvq-start, STEP 1→2→3→4 점검.
