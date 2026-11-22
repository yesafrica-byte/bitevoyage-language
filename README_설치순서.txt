BiteVoyage Language Quest Premium V6.1 — 전체 교체판 / 2026-11-22

[변경사항]
- 기존 4개 국어 / 14개 상황 / 총 1,792개 표현과 뜻/발음·학습 기록 키 유지.
- 일본어·중국어 모든 896개 표현의 원문-발음 분리 데이터 적용(일부 단어는 의미상 한 칩으로 유지).
- KEY VOCAB 단어 카드 터치 시 해당 단어만 원어 TTS로 재생.
- 일본어·중국어 단어 구분 칩 터치도 개별 TTS 재생 가능.
- 한 번에 하나의 발음만 재생되며 정지/다시 듣기와 충돌하지 않음.
- 모바일 문장·이동 6개 알약 최소 48px 높이, 간격 8px로 밀도 개선.
- 퀴즈·XP·오답 복습·마지막 위치 저장·공유·PWA 설치·광고 영역 유지.

[GitHub 업로드 순서]
1) GitHub 저장소 yesafrica-byte/bitevoyage-language 의 main 브랜치에서 현재 파일을 다운로드/백업.
2) ZIP에서 01_GITHUB_UPLOAD 안의 파일 11개를 저장소 루트에 같은 경로로 올리고 Commit.
   - 기존 저장소 자체 삭제 금지. 01_GITHUB_UPLOAD 폴더를 통째로 올리지 말고 안의 내용만 업로드.
   - 새 파일 bvq61-data.js / bvq61-engine.js는 기존 V6 파일과 이름이 다르므로 캐시 충돌 위험이 줄어듦.
   - .nojekyll은 숨김 파일. GitHub Pages 경로 확인.
3) https://yesafrica-byte.github.io/bitevoyage-language/ 에서 4개 국어 / 3개 단계 / 단어 듣기 확인.
4) Blogger 기존 게시글을 HTML 모드로 열고 02_BLOGGER/BLOGGER_FULL_REPLACE_V6_1.html 내용으로 전체 교체.
5) 게시 후 ?m=1 모바일 페이지를 시크릿 창에서 테스트. 최신 배포가 반영된 다음 구버전 bvq60 파일 삭제 가능.

[주의]
- Blogger 본문을 먼저 교체하면 GitHub 새 JS가 배포되기 전까지 일시적으로 화면이 실행되지 않을 수 있음. 반드시 GitHub 먼저.
- URL 변경 없음: https://www.bitevoyage.com/2026/11/travel-language-quest-free-english-japanese-chinese-korean.html
- TTS 실제 음성은 휴대전화/브라우저에 설치된 언어팩에 따라 차이. 문장 원문 그대로 재생; 로마자/병음 직접 음성 변환 X.
- 1,792개 발음에 대한 전수 '데이터 구조 검사'는 통과했으나, 4개 언어 원어민이 음가·성조·표현 자연스러움을 전수 감수한 것으로 주장하지 않음.
- 설치 기능은 사용자 승인 및 브라우저 지원에 따라 달라지며, Blogger와 GitHub Pages는 다른 도메인.
- 기존 로컬스토리지 키를 유지하므로 동일 브라우저 저장기록은 대체로 유지되지만, 사이트 데이터가 삭제되었거나 도메인이 다르면 기록이 연동되지 않음.

[코드 품질 검사]
03_QA/integrity.json: 1792개 기본 항목/필수 문자열, ja/zh 896개 segmentation 문자열 재합성 일치 확인.
배포 전 모바일에서 실제 TTS 및 PWA 설치 테스트 권장.
