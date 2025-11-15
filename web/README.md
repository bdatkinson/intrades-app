# InTrades Frontend

Modern, gamified learning platform for skilled trades education.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run E2E tests
npm run e2e
```

## 📁 Project Structure

```
web/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── instructor/   # Instructor-specific components
│   │   └── __tests__/    # Component tests
│   ├── lib/              # Utilities and helpers
│   │   └── __tests__/    # Utility tests
│   └── tests/            # Integration tests
├── public/               # Static assets
├── .github/              # CI/CD workflows
└── next.config.js        # Next.js configuration
```

## 🎨 Features

### Student Features
- ✅ Interactive dashboard with XP tracking
- ✅ Challenge system with quizzes and submissions
- ✅ Gamification (badges, tiers, streaks, leaderboard)
- ✅ Business milestone tracking
- ✅ Activity feed
- ✅ Achievement notifications

### Instructor Features
- ✅ Student roster and cohort management
- ✅ Challenge creation and scheduling
- ✅ Grading workflow with rubrics
- ✅ Analytics dashboard
- ✅ Report generation

### Technical Features
- ✅ Code splitting and lazy loading
- ✅ PWA support with offline capability
- ✅ Responsive design
- ✅ Dark mode
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Performance optimized
- ✅ TypeScript throughout

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run e2e

# Coverage
npm run test:coverage
```

## 📦 Build & Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Next.js Config

Optimizations are configured in `next.config.js`:
- Code splitting
- Image optimization
- Bundle optimization
- Security headers

## 📱 PWA Features

- Installable on mobile devices
- Offline support
- Service worker caching
- App-like experience

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels

## 🚀 Performance

- Code splitting by route
- Lazy loading of heavy components
- Image optimization
- Bundle size optimization
- Performance monitoring

## 📚 Documentation

- [Frontend Development Plan](../docs/FRONTEND_DEVELOPMENT_PLAN.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write/update tests
4. Submit PR

## 📄 License

See LICENSE file
