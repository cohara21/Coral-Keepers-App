# Assets Manifest

All assets are sourced directly from Figma design: https://www.figma.com/design/M6Ex6RepjLUieKhwERYldF/Final-Deliverables-Q2?node-id=410-1473

## Asset Inventory

### Icons (`assets/icons/`) - 13 files
Navigation and interactive icons, all SVG format from Figma

| Icon | Size | Source Asset ID | Usage |
|------|------|-------------------|-------|
| signal.svg | 151 B | cdf8307e-46f3 | Cellular signal indicator in status bar |
| wifi.svg | 232 B | 93c5069f-c32b | WiFi indicator in status bar |
| battery.svg | 729 B | 29bd76b3-af63 | Battery indicator in status bar |
| lab-items.svg | 337 B | e97a69ad-393c | Lab navigation icon (active) |
| messages.svg | 228 B | ed8a5aab-7b55 | Messages navigation icon |
| account.svg | 219 B | aafb31f2-37f9 | Account navigation icon |
| thermometer.svg | 232 B | 224b0d89-4b24 | Temperature vital card icon |
| ph.svg | 287 B | 64f90f4a-33d5 | pH level vital card icon |
| droplet.svg | 248 B | 2acc1dc3-5d68 | Salinity vital card icon |
| redox.svg | 337 B | 40cc2dc2-70fe | Redox vital card icon |
| trend-up.svg | 151 B | 3ef857c0-ba94 | Trend up indicator in vital cards |
| trend-down.svg | 179 B | 7aff4ddb-10fb | Trend down indicator in vital cards |
| check-ok.svg | 159 B | 486a8a58-b0db | Status check indicator for vital cards |
| equals.svg | 179 B | 8c117f9f-c850 | Stable/unchanged indicator for vital cards |

### Illustrations (`assets/illustrations/`) - 4 files
Complex graphics and animations from Figma

| Illustration | Size | Source Asset ID | Usage |
|--------------|------|-------------------|-------|
| health-meter.svg | 354 B | ddde4476-341e | Animated health score meter (94%) |
| coral-character.svg | 538 B | 163563db-98af | Coral mascot character in health meter |
| trend-indicator.svg | 354 B | 0d905c59-fd5d | Trend up/down indicator with percentage |
| coral-mascot.svg | 354 B | ddde4476-341e | Backup coral illustration |

### Images (`assets/images/`) - 2 files
Raster and vector images

| Image | Size | Format | Source Asset ID | Usage |
|-------|------|--------|-------------------|-------|
| tank-feed.png | 4.2 KB | PNG | e5a631be-9f25 | Live tank camera feed placeholder |
| play-button.svg | 350 B | SVG | cc12110b-da7b | Overlay play button on video |
| tank-video-placeholder.svg | 418 B | SVG | n/a | Local fallback placeholder |

## Asset Mapping

### Navigation Bar (Bottom)
- Lab: `lab-items.svg` (active state = Ocean Blue #2B66E4)
- Messages: `messages.svg` (inactive = tertiary grey #94A3B8)
- Account: `account.svg` (inactive = tertiary grey #94A3B8)

### Status Bar (Top)
- Signal: `signal.svg`
- WiFi: `wifi.svg`
- Battery: `battery.svg`

### Tank Health Section
- Health Meter: `health-meter.svg` (animated background)
- Coral Character: `coral-character.svg` (centered mascot)
- Trend Indicator: `trend-indicator.svg` (shows +2.1% growth)

### Core Vitals Cards (2x2 Grid)
**Temperature Card**
- Icon: `thermometer.svg`
- Change: `trend-down.svg` (shows -0.2°)

**pH Level Card**
- Icon: `ph.svg`
- Status: `check-ok.svg` (shows "OK")

**Salinity Card**
- Icon: `droplet.svg`
- Status: `equals.svg` (shows "1 ppt")

**Redox Card**
- Icon: `redox.svg`
- Change: `trend-up.svg` (shows "NOM")

### Live Feed Section
- Background: `tank-feed.png` (real tank video placeholder)
- Play Button: `play-button.svg` (overlay)

## Download Timestamps

All assets downloaded: April 15, 2026 10:40 UTC
Figma Asset API URLs expire in 7 days - preserve local copies

## Total Assets

- **Icons**: 13 SVG files (~3.5 KB)
- **Illustrations**: 4 SVG files (~1.6 KB)
- **Images**: 2 files (1 PNG @ 4.2 KB + 1 SVG @ 350 B)

**Total Size**: ~10 KB (highly optimized, production-ready)

## Integration

All assets are referenced in:
- `index.html` - asset paths and image sources
- `styles.css` - icon sizing and styling
- `script.js` - no direct asset references (uses DOM)

All paths are **local relative paths only** - zero external dependencies or hotlinks.
