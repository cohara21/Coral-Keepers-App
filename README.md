# Coral Keepers Teacher App

A mobile-first web app for teachers to quickly monitor coral tank health and follow up with students at a glance.

## Features

✅ **Tank Vitals Dashboard** - Real-time health monitoring with visual health meter  
✅ **AI-Powered Recap** - Automated insights about tank conditions and trends  
✅ **Core Vitals Tracking** - Temperature, pH, Salinity, and Redox at a glance  
✅ **Live Camera Feed** - Real-time tank visualization  
✅ **Persistent Navigation** - Quick access to Lab, Messages, and Account  

## Design Language

- **Colors**: Ocean Blue (#2B66E4), Coral Green (#00B746), Dark greys
- **Typography**: Plus Jakarta Sans for clarity and speed
- **Layout**: Mobile-optimized (402px × 874px) with safe areas
- **Interactions**: Lightweight, low-friction interactions for quick checks

## Project Structure

```
├── index.html           # Main app markup
├── styles.css          # Design tokens and component styles
├── script.js           # App initialization and interactions
├── package.json        # Project metadata
├── vercel.json         # Vercel deployment config
└── assets/
    ├── icons/          # SVG icons (thermometer, ph, etc.)
    ├── illustrations/  # Coral mascot and graphics
    └── images/         # Placeholder images
```

## Local Development

### Requirements
- Python 3 (for local server) or any HTTP server
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd "Coral Keepers App"

# Start local server
python3 -m http.server 3000

# Open in browser
open http://localhost:3000
```

### Alternative Servers
```bash
# Using Node.js (if available)
npx http-server -p 3000

# Using Ruby
ruby -run -ehttpd . -p3000
```

## Deployment to Vercel

### Prerequisites
- GitHub account with the repo pushed
- Vercel account (free tier available)

### Steps

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and import your repository

2. **Configure**
   - Framework: None (static site)
   - Build Command: (leave empty)
   - Output Directory: `.` (root)

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

4. **Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Ocean Blue | #2B66E4 | Primary brand, accent elements, active nav |
| Coral Green | #00B746 | Health status, positive indicators |
| Text Black | #171717 | Main text |
| Secondary Text | #6F7C8C | Labels, secondary info |
| Accent Grey | #EDF3FC | Card backgrounds, borders |
| Dark BG | #28303F | Alternative backgrounds |

## Typography

- **Headlines**: Plus Jakarta Sans Bold, 24-28px
- **Body**: Plus Jakarta Sans Regular, 14px
- **Labels**: Plus Jakarta Sans Bold, 12px uppercase
- **Mono**: SF Mono (metrics, timestamps)

## Key Files

### index.html
- Mobile-first structure with semantic HTML
- Status bar, header, content sections, bottom navigation
- Responsive grid for vital cards

### styles.css
- Design tokens for colors, spacing, typography
- Component styles (cards, vitals, health meter, etc.)
- Mobile-first responsive design
- Accessibility features (reduced motion, high contrast)

### script.js
- Navigation handling
- Real-time clock updates
- Card interactions
- Event logging (ready for analytics)

## Mobile Specifications

- **Frame Width**: 402px (mobile safe area)
- **Frame Height**: 874px (typical iOS screen)
- **Safe Areas**: 
  - Top: 44px (status bar)
  - Bottom: 34px (home indicator)
- **Navigation Height**: 99px

## Browser Support

- iOS Safari 13+
- Chrome Android 90+
- Firefox Android 88+
- Samsung Internet 14+
- Desktop browsers (Chrome, Firefox, Safari, Edge - latest versions)

## Performance

- **Load Time**: < 2 seconds
- **Assets**: All icons are SVG (scalable, lightweight)
- **No External Dependencies**: Pure HTML/CSS/JS
- **Mobile-First**: Optimized for touch interactions

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Focus states for keyboard navigation
- Reduced motion support
- Color contrast meets WCAG AA standards

## Future Enhancements

- [ ] Real-time data integration with tank sensors
- [ ] Student follow-up messaging interface
- [ ] Historical trend graphs
- [ ] Notification system for critical alerts
- [ ] Dark mode support
- [ ] Multi-language support

## Git & Version Control

```bash
# Initialize git
git init

# Stage and commit
git add .
git commit -m "Initial commit: Tank Vitals home screen"

# Push to GitHub
git push origin main
```

## Support & Issues

For issues or feature requests, please open an issue on GitHub or contact the Coral Keepers team.

## License

Proprietary - Coral Keepers Educational App

---

**Built with HTML5, CSS3, and Vanilla JavaScript**  
**Designed for clarity, speed, and mobile-first usability**
