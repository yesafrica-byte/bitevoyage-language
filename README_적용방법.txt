# BiteVoyage V6.2 · 다양한 휴대전화용 설치 호환성 패치

## 왜 어제 설치되고 오늘 다른 휴대전화에서는 안 될까요?
- PWA는 사용자가 동의해야만 설치됩니다. 자동/무단 설치는 불가능합니다.
- 직접 설치창은 Chrome이 설치 가능 상태를 판정하고 `beforeinstallprompt` 신호를 보낼 때에만 열 수 있습니다.
- 내장 브라우저(네이버·카카오·일부 앱), 삼성 인터넷, iOS 등에서는 설치창 호출 방식이 다릅니다.
- 이미 설치되었거나, 기기별 설치 자격 검사 및 이용 이력에 따라 설치창이 나타나지 않을 수 있습니다.
- 기존 launch.html은 로딩 즉시 다른 도메인(Blogger)으로 이동했습니다. 일부 환경에서 PWA 시작 주소 검사에 불리할 가능성이 있어 개선했습니다. 이 부분이 실제 원인이었는지는 미확정입니다.

## GitHub에서 바꿀 파일: 아래 3개 이름 그대로
1. install.html
2. launch.html
3. sw.js

- 저장소: https://github.com/yesafrica-byte/bitevoyage-language
- `main` 최상위 폴더에서 같은 이름으로 덮어쓰기(Commit)
- 다른 JS/데이터/아이콘/manifest 파일은 변경하지 마세요.
- Blogger 본문 전체와 해당 게시글 URL도 교체하지 마세요.

## 배포 확인
1. GitHub Actions의 Pages 배포가 성공했는지 확인합니다.
2. 휴대전화 Chrome에서 https://yesafrica-byte.github.io/bitevoyage-language/install.html 을 직접 엽니다.
3. `BV 아이콘 설치`를 누릅니다. 시스템 설치 승인창이 나타나면 승인하고 아이콘을 확인합니다.
4. 승인창이 안 뜨면 크롬 오른쪽 위 ⋮ 메뉴 → 앱 설치/홈 화면에 추가를 이용합니다.
5. 문제를 겪는 기기에서 https://yesafrica-byte.github.io/bitevoyage-language/install.html?debug=1 을 열면 브라우저 종류/설치 이벤트 수신/서비스 워커 상태를 자체 표시합니다. 진단 내용은 서버로 전송하지 않습니다.

## 중요한 제약
- 버튼 1회로 모든 기기에 설치창을 강제 표시할 방법은 없습니다.
- Blogger와 GitHub Pages는 다른 도메인이므로 설치한 BV 앱이 Blogger로 이동할 때 브라우저 창으로 열릴 수 있습니다.
- 이 패치는 1,920개 표현·음성·퀴즈·XP 및 데이터 구조를 건드리지 않습니다.
- 기존 설치자도 같은 manifest ID와 start_url로 기존 앱 정체성을 유지합니다.
- 로컬 파일 문법/정합성 테스트로 설치 성공을 보장할 수 없습니다. 여러 실제 기기에서 배포 후 시험해야 합니다.
