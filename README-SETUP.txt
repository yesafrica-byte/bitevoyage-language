BiteVoyage Language Quest Premium V5.6 — 전체 Fresh 설치/배포 안내
===================================================
2026-11-21 · 대상 저장소: https://github.com/yesafrica-byte/bitevoyage-language
원문 학습 게시글: https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html

[반드시 읽기] 모바일 설치 기능
- 아이콘은 만들 수 있습니다. 다만 웹페이지가 사용자 동의 없이 바탕화면에 아이콘을 강제로 만들 수는 없습니다.
- Blogger 버튼을 클릭하면: (1) 지원 브라우저에서 PWA 직접 설치 API 시도 -> (2) 미지원 브라우저는 GitHub의 'install.html' 전용 설치 페이지로 이동.
- 설치 페이지에서 'BV 아이콘 설치'를 누르면 지원되는 브라우저에서 OS 설치 승인창이 나타납니다. 설치 가능 신호가 없다면 간단한 Chrome/Safari 메뉴 경로가 나타납니다.
- GitHub Pages에서 설치된 BV 아이콘은 ./launch.html을 실행하여 Blogger 게시글 URL로 이동합니다. 도메인이 달라 페이지가 Chrome/Safari 화면에서 열릴 수 있습니다.
- 본문 URL로 바로 진입하는 표준 브라우저 '홈 화면에 추가'는 BV 아이콘으로 표시되도록 시도하지만, 기기/브라우저에 따라 Blogger 파비콘으로 표시될 수 있습니다.
- 설치 UI나 자동 팝업은 브라우저 버전/설치 이력/OS에 따라 달라지므로 Android Chrome·Samsung Internet·iOS에서 각각 확인하세요.
- 원래 게시글 주소 자체의 same-origin PWA 설치를 원한다면 Blogger 도메인 www.bitevoyage.com에서 manifest와 SW를 제공하도록 서버/프록시 설정까지 바꿔야 합니다. 이 패키지는 그런 서버 구성을 요구하지 않습니다.

[STEP 1] GitHub 전체 Fresh 교체 (중요)
1. 저장소 https://github.com/yesafrica-byte/bitevoyage-language 의 main 브랜치에서 기존 파일은 백업해 둔 후 정리하세요.
2. 압축 해제 후 01_GITHUB_UPLOAD_FILES 폴더 안의 파일을 '폴더째'가 아니라 파일 그대로 저장소 최상위(root)에 전부 업로드합니다.
3. 업로드해야 할 파일 (총 11개):
   - .nojekyll
   - bvq56-data.js
   - bvq56-engine.js
   - favicon-192.png
   - favicon-512.png
   - favicon-maskable-512.png
   - index.html
   - install.html
   - launch.html
   - manifest.webmanifest
   - sw.js
4. Commit changes. GitHub > Settings > Pages에서 Deploy from a branch / main / /(root)를 확인합니다.
5. 확인 URL:
   https://yesafrica-byte.github.io/bitevoyage-language/index.html
   https://yesafrica-byte.github.io/bitevoyage-language/install.html
   https://yesafrica-byte.github.io/bitevoyage-language/manifest.webmanifest
   https://yesafrica-byte.github.io/bitevoyage-language/favicon-192.png
   https://yesafrica-byte.github.io/bitevoyage-language/favicon-512.png
6. Github Pages에 신규 파일이 배포되고, 학습 896/896이 표시되는지 확인한 다음 STEP 2 진행.

[STEP 2] Blogger 기존 게시글 본문 교체
1. 기존 https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html 게시글 편집 > HTML 보기.
2. 02_BLOGGER_REPLACE/blogger-embed.html 파일 전체 복사 > 기존 본문 전체 교체 > 업데이트.
3. 게시글 URL은 바꾸지 마세요. V5.5 JS와 V5.6 JS를 섞으면 안 됩니다.
4. 광고 설정 및 스크립트가 Blogger에 의해 필터링되는 경우 테마/광고 설정을 따로 점검하세요.
5. 모바일의 기존 학습 기록은 같은 Blogger URL과 localStorage 키(bvq-v5-progress)를 계속 사용하므로 정상적으로 유지될 수 있습니다. (브라우저 데이터 삭제 시 제외.)

[STEP 3] 모바일 확인
1. 게시글에서 4개 언어, 14개 상황, 발음/듣기, 퀴즈/XP/효과음, 공유 작동 확인.
2. '📲 BV 아이콘 설치' 클릭 -> 기기 지원에 따라 직접 설치창 또는 전용 설치 화면.
3. 설치 승인 후 홈 화면에 BV 아이콘이 생기는지 확인합니다.
4. BV 아이콘 클릭 -> https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html 연결 확인.
5. Chrome 방문 기록이나 기존 설치 상태로 인해 설치 안내가 안 보일 수 있으니 새 프로필/다른 브라우저에서도 확인 가능합니다.

[자주 묻는 질문]
Q: Blogger 코드만 교체하면 될까요?
A: 아니요. PWA 설치에 필요한 GitHub의 manifest.webmanifest, install.html, launch.html, sw.js, PNG 아이콘 등이 반드시 배포되어야 합니다.
Q: GitHub 파일 모두 지워도 되나요?
A: 삭제 전 백업 권장. 패키지의 01_GITHUB_UPLOAD_FILES 파일이 전부 올라가면 이 버전은 독립 실행됩니다. GitHub Pages Settings는 유지하세요.
Q: 브라우저 설치창이 무조건 뜨나요?
A: 아닙니다. 설치 가능 여부와 정책은 기기별로 달라 브라우저 메뉴 안내로 대체될 수 있습니다.
Q: 로고 클릭하면 Blogger 게시글이 열리나요?
A: 설치된 GitHub PWA 아이콘은 launch.html을 거쳐 Blogger URL로 즉시 이동하도록 구성했습니다. 다른 도메인 이동 시 주소창이 나타날 수 있습니다.
Q: 아이콘을 클릭해도 완전 오프라인 학습이 되나요?
A: 아닙니다. 설치용 셸만 캐시하며 Blogger 게시글을 사용하려면 네트워크 연결이 필요합니다.
Q: Google 검색 SEO는?
A: 공식 검색 대상은 원래 Blogger 게시글입니다. GitHub의 설치/미리보기 페이지는 noindex이며 별도의 검색 중복을 만들지 않도록 했습니다.

[기존 기능] 4개 국어, 14개 상황, 언어별 224문장 총 896개, 모바일 2열 그리드, 원문/발음/정렬, 듣기/느리게/반복/정지, 퀴즈/오답 재도전/중복 XP 방지, 효과음 ON/OFF(기본 OFF), 진행률, 광고, 공유, 관련글, FAQ 유지.
