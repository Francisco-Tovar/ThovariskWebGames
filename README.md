# Thovarisk Arcade (GitHub Pages)

Simplified Kenney-like catalog layout for showcasing HTML games on GitHub Pages.

## What changed in this version
- Removed extra navigation items (Tools/Assets/Donate).
- Added a dedicated **Play** button on every card.

## Add games
Edit `games.js`.

Optional fields:
- `cover`: image URL shown in the thumbnail.
- `priceTag`: small chip on the thumbnail (e.g., "NEW", "$3.99").
- `platform`: short string under the title.
- `stores`: array of `{label,url}` links shown under the Play button.

## Deploy
GitHub repo -> Settings -> Pages -> Deploy from branch -> main / (root).
