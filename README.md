# Stack & Dodge — M0 Scaffold

Modern Phaser 3.70 + TypeScript project with **Matter.js**, Tailwind, ESLint, and Vitest.
Includes scene skeletons (Boot → Menu → Game → GameOver), `StorageManager`, and `AudioManager`.

## Prereqs
- Node 18+
- npm 9+

## Local Run
```bash
npm ci
npm run dev
```
Open http://localhost:3000 if the browser doesn’t auto-open.

## Tests
```bash
npm test
```

## Assets
Place your assets under **public/assets** using this structure (adjust names in `BootScene` if yours differ):
```
public/assets/
  sprites/
    backgrounds/game_background_720x1280.png
    blocks/block_red_60x30.png
    blocks/block_blue_60x30.png
    blocks/block_green_60x30.png
    obstacles/bomb_40x40.png
    obstacles/spike_50x20.png
    ui/play_button_80x80.png
    ui/pause_button_60x60.png
    ui/score_bg.png
  sounds/
    button_click.wav
    block_drop.wav
    stack_success.wav
    obstacle_hit.wav
    game_over.wav
```

If your current files are in `stack-dodge/assets/...`, copy them to `public/assets/...`.

## Next Milestones
- **M1**: Hook input manager; build moving block; drop on tap
- **M2**: `Stack` class and landing logic with perfect-center scoring
- **M3**: Obstacles and progression
- **M4+**: Juice, storage surfacing in UI, PWA (Workbox), deploy
