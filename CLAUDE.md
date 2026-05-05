# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

Zero build step. Open `index.html` directly in a browser, or serve it with any static file server:

```
npx serve .
python -m http.server
```

No dependencies, no package.json, no bundler.

## Architecture

Four files, loaded in order by `index.html`:

- `screens.js` — all game content: `SCREENS` object, `SCROLL_POOL`, `CLARITY_POOL`
- `game.js` — all runtime logic: router, renderer, clock, effects
- `style.css` — all styling including glitch keyframe animations
- `index.html` — static shell, never changes

### Core loop

`scrolling` screen → player clicks → `_next_clarity` → random clarity screen → player clicks → `_glitch_return` → glitch animation → back to `scrolling`. All paths return to scrolling intentionally.

### Router tokens (game.js `goTo`)

- `_next_clarity` — picks from `CLARITY_POOL` (weighted, no repeats)
- `_glitch_return` — triggers glitch effect, increments `loopCount`, renders next scroll

### Image tokens (screen `image` field)

- `_time_of_day` — scrolling screens: resolves to `art/{period} phone.png`
- `_time_of_day_clarity` — clarity screens: resolves to `art/{period}.png`
- Static path string — used as-is

Time-of-day periods: morning (6–12), afternoon (12–17), evening (17–20), night (otherwise). The base image swaps live as the game clock crosses period boundaries — no re-render needed.

### Game clock

Starts at real system time. Ticks via recursive `setTimeout` using `clockDelay()` — starts at 450ms/tick and drops 15ms per `clickCount`, flooring at 5ms (~30 clicks to max speed). Each choice click also jumps the clock forward 1–90 random minutes.

### Progressive effects (unlocked after `eyesThreshold` clicks)

`eyesThreshold` is randomised to 10–20 at page load. Once `clickCount` reaches it, `eyesActive = true` and subsequent renders add two overlay layers above the base image: `body.png` (static) and `eyes.png` (assigned to `eyesEl`).

- **Blink loop** (`scheduleNextBlink`) — fires every 3–5s, 1–3 consecutive blinks, always guards `if (eyesEl)`
- **Eyes shudder loop** (`scheduleNextShudder`) — fires every 5–8s via `shudderEl(eyesEl)`
- **Time shudder loop** (`scheduleTimeShudder`) — fires every 5–12s, only runs `if (eyesActive)`
- **Hour-mark flash** (`flashHour`) — triggers on every `:00`, grows time font 3× for 200ms and shudders it

`shudderEl(el)` is the shared helper that adds/removes the `.eyes-shuddering` CSS class. It requires the target to be `display: inline-block` or a block element — inline elements ignore CSS `transform`.

### Adding content

- New scrolling screens go in `SCREENS` + `SCROLL_POOL` in `screens.js`. Use `image: "_time_of_day"`.
- New clarity screens go in `SCREENS` + `CLARITY_POOL`. Use `image: "_time_of_day_clarity"`. All choices must route to `_glitch_return`.
- New time-of-day art: add `art/{period}.png` and `art/{period} phone.png`, update `getTimeOfDayImage` and `getTimeOfDayClarityImage` in `game.js`.
