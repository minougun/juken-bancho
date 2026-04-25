# Event CG Prompts

Date: 2026-04-25

Mode: built-in image generation tool.

Shared constraints:

- Visual novel event CG for a browser game, 16:9 landscape.
- Japanese high school setting with a spirited exam-prep comedy tone.
- Include the delinquent exam candidate in black gakuran and white headband and the honor-student gyaru with blonde-brown wavy hair, cardigan, decorated study goods, and warm expressions.
- No readable text, no logo, no watermark, no gore, no weapons, no realistic violence.
- Bright anime-style illustration, polished but readable behind a novel game dialogue box.

## Generated Event CGs

| Event | Prompt summary | Generated source | Local file |
| --- | --- | --- | --- |
| `桜の自習室` | Spring classroom with cherry blossoms outside, both protagonists and classmates studying together after school. | `/home/minougun/.codex-wsl/generated_images/019dc099-3099-7753-9c28-0b7765b5c4f6/ig_02bcdcaad889b0710169ebf71634908191aa0bd2516f8c6b0f.png` | `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/spring-study-room.png` |
| `夏祭りの単語帳` | Summer festival night with lanterns, shaved ice, vocabulary cards, and the group balancing fun with study. | `/home/minougun/.codex-wsl/generated_images/019dc099-3099-7753-9c28-0b7765b5c4f6/ig_02bcdcaad889b0710169ebf75029548191a23078402de17734.png` | `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/summer-study-festival.png` |
| `文化祭後の作戦会議` | Autumn classroom after the culture festival, decorations still up, both protagonists reviewing study plans with friends. | `/home/minougun/.codex-wsl/generated_images/019dc099-3099-7753-9c28-0b7765b5c4f6/ig_02bcdcaad889b0710169ebf7caa8288191bf98141772718872.png` | `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/autumn-festival-study.png` |
| `雪夜の最終演習` | Winter night classroom with snow outside, final exam drills, classmates quietly supporting the protagonists. | `/home/minougun/.codex-wsl/generated_images/019dc099-3099-7753-9c28-0b7765b5c4f6/ig_02bcdcaad889b0710169ebf849ecfc8191b314ddb392a1569a.png` | `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/winter-final-study.png` |

## Implementation Notes

- Event data lives in `/mnt/c/Users/minou/juken-bancho/web/data/game-data.js` as `seasonalEvents`.
- Character-specific event CGs were added on 2026-04-25. Each event now has separate `bancho` and `gyaru` route artwork under `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/bancho/` and `/mnt/c/Users/minou/juken-bancho/web/assets/images/events/gyaru/`.
- The browser stores unlocked event CG IDs in `localStorage` key `jukenBancho.unlockedEventCgs.v1` as `eventId:profileId`.
- The `回想帳` button is hidden until at least one ending has been unlocked, then displays collected route-specific seasonal CGs and locked placeholders.
