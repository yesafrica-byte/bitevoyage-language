BiteVoyage Language Quest Premium V5.3.0 | FULL FRESH REPLACEMENT
=============================================================

WHY A FRESH VERSION?
- Live GitHub main shows V5.2 source but the user's Blogger screenshot still said "발음 표기 없음" on a phrase whose V5.2 data file contains a reading.
- This suggests an inconsistent cached/delivered JS file, although live Pages response could not be inspected directly.
- V5.3 therefore uses NEW FILENAMES (bvq53-data.js, bvq53-engine.js), a NEW GLOBAL (BVQ_V53_DATA), and strict runtime integrity validation.

CONTENTS (7 files)
- bvq53-data.js       -> NEW uniquely named data file loaded by Blogger (required)
- bvq53-engine.js     -> NEW uniquely named engine loaded by Blogger (required)
- data.js             -> same V5.3 data as a compatibility/replacement file
- engine.js           -> same V5.3 engine as a compatibility/replacement file
- index.html          -> GitHub Pages test page, uses the new filenames locally
- blogger-embed.html  -> COMPLETE Blogger body HTML; replace the entire old Blogger post HTML
- README-SETUP.txt    -> this document

GITHUB INSTALL (RECOMMENDED: DO NOT DELETE REPOSITORY)
1) Open https://github.com/yesafrica-byte/bitevoyage-language
2) In the ROOT of the existing main branch, upload ALL FIVE: bvq53-data.js, bvq53-engine.js,
   data.js, engine.js, index.html . Overwrite data.js/engine.js/index.html if GitHub asks.
3) Click Commit changes and confirm the new files are publicly visible.
4) Open these TWO exact URLs IN YOUR MOBILE BROWSER (expect JS text, not 404):
   https://yesafrica-byte.github.io/bitevoyage-language/bvq53-data.js?v=v53-20261121-fresh
   https://yesafrica-byte.github.io/bitevoyage-language/bvq53-engine.js?v=v53-20261121-fresh
5) Test https://yesafrica-byte.github.io/bitevoyage-language/ and confirm
   `✓ V5.3 연결 확인 · 학습 표현 896개 · 발음 표기 896/896개` appears in STEP 01.

BLOGGER INSTALL (AFTER GITHUB)
6) Open the EXISTING BiteVoyage article, use HTML view, select ALL old ARTICLE-BODY HTML
   and paste the ENTIRE contents of blogger-embed.html. Do not leave old V5 scripts below it.
7) Update/Publish and use an incognito tab (or hard reload) for the live article.
8) Verify 4 languages x 14 situations, pronunciation box, toggle, TTS playback,
   slow speed, stop/repeat, back/next, 4-answer quiz, XP, mobile grids, and article links.

DEBUGGING
- If you see V5.3 data load failure: GitHub Pages did not serve the NEW data filename;
  check the URL/Pages deployment; avoid modifying Blogger HTML until the URL works.
- If you see V5.3 data check failure: upload BOTH matching V5.3 JS files together.
- If you still see `발음 표기 없음`: the old Blogger HTML or old JS is running;
  search the HTML for the exact fresh filenames above and remove old script tags.
- After updating GitHub Pages, page publishing/caches can take time. Do not claim
  the live Blogger site has been fixed until independently checked.

DATA INTEGRITY: 4 languages x 14 scenes x 16 phrases = 896. Each has nonempty reading.
All original visible expressions and translations are retained.
NOTE: IPA/romanization are study aids, partly automatically generated, not professionally verified.
XP key unchanged: 'bvq-v5-progress'; previous same-browser learning progress is preserved.
No removal of original features, ads or related-link destinations.
