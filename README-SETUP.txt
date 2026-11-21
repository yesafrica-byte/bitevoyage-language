BiteVoyage Language Quest V5.2.0 — Pronunciation restoration

ROOT CAUSE (verified from source files)
Original content: 896 phrases = 4 languages x 14 scenes x 16.
Missing reading strings: EN 224, JA 224, ZH 56, KO 224 = 728.
The V3/V4 source versions had the same missing fields, so this was not a V5-only display regression.

FIX
- EN: phrase-level US-English IPA generated locally by eSpeak's grapheme-to-phoneme engine.
- JA: 224 written Hepburn romanizations, based on the exact existing Japanese text and shared templates.
- ZH: retain 168 pre-existing pinyin readings; add tone-marked ICU pinyin for the other 56.
- KO: 224 automatically transliterated Korean romanizations, for learner reference (not all connected-speech effects captured).
- No original source phrases or meanings were replaced. All 896 readings are now nonempty.
- Interface shows a language-specific phonetic label and a hide/show toggle.
- Existing mobile two-column grids, buttons, quiz XP, ads and related article links remain.

DEPLOY (Blogger + GitHub Pages)
1. Open https://github.com/yesafrica-byte/bitevoyage-language
2. Replace repository root data.js and engine.js with the new ones from this pack.
3. Replace index.html (optional, but recommended for testing at the GitHub Pages URL).
4. Publish/commit; confirm the Pages site works and the JS files respond publicly.
5. Open the existing BiteVoyage Blogger post in HTML view, DELETE its old post-body code,
   and paste the FULL contents of blogger-embed.html. Save/publish without switching to Compose mode.
6. Refresh with a cache-busting query or private browser window and test all 4 languages.

Important: Old progress uses the same localStorage key 'bvq-v5-progress' and should be retained for users who access with the same browser storage.
The code was verified offline for 896/896 nonempty readings and content parity. Live Blogger deployment and browser TTS have NOT been tested.
Pronunciation is for learning/reference and should receive native-speaker editorial review before claims of linguistic certification.
