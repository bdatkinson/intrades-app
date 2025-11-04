# 🔧 InTrades - Skilled Trades Learning Platform

A gamified learning platform that transforms skilled trades professionals into successful entrepreneurs through challenge-based education.

## 🎯 Overview

InTrades is built from the Habitica codebase, transforming the habit-tracking RPG into a specialized 8-week entrepreneurship course for electricians, plumbers, HVAC techs, carpenters, and other skilled trades professionals.

## ✨ Key Features

- **Challenge-Based Learning**: Weekly challenges across Foundation, Legal, Finance, Marketing, Operations, and Scaling topics
- **XP & Badge System**: 5-tier progression (Apprentice → Boss) with 45+ badges
- **Real-World Integration**: Business milestone tracking (LLC formation, banking, insurance, website)
- **Social Learning**: Study buddies, peer reviews, team challenges
- **Instructor Tools**: Dashboard for progress tracking, grading, and feedback
- **Mobile-First**: Responsive design with planned iOS/Android apps

## 🏗️ Architecture

- **Backend**: Node.js/Express with MongoDB
- **Frontend**: React.js (web), React Native (mobile - planned)
- **File Storage**: AWS S3 for document uploads
- **Authentication**: JWT-based with role management
- **Caching**: Redis for performance optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB
- Redis (optional, for caching)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd intrades-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/intrades
JWT_SECRET=your-super-secure-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET=intrades-submissions
REDIS_URL=redis://localhost:6379
```

## 📚 API Documentation

### Core Endpoints
- `GET /api/challenges` - List challenges
- `POST /api/challenges/:id/submit` - Submit challenge
- `GET /api/users/:id/progress` - User progress
- `GET /api/leaderboard` - Leaderboard data

See [API Documentation](./docs/api.md) for complete endpoint reference.

## 🎮 Gamification System

### XP Tiers
1. **Apprentice** (0-100 XP) - Basic business concepts
2. **Journeyman** (101-300 XP) - Legal structure and finance
3. **Master** (301-600 XP) - Marketing and customer acquisition
4. **Contractor** (601-1000 XP) - Operations and scaling
5. **Boss** (1000+ XP) - Leadership and business strategy

### Challenge Types
- **Quizzes**: Knowledge assessment (5-15 XP)
- **Real-World Tasks**: Business actions (20-50 XP)
- **Mini-Games**: Interactive scenarios (10-25 XP)
- **Boss Battles**: Complex decision simulations (50-100 XP)

## 👥 User Roles

- **Students**: Complete challenges, track progress, participate in peer reviews
- **Instructors**: Create challenges, grade submissions, monitor progress
- **Admins**: Manage users, configure system, access analytics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run linting
npm run lint
```

## 📁 Project Structure

```
intrades-app/
├── server/
│   ├── models/           # Database models
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   └── routes/          # API routes
├── client/              # Frontend application (planned)
├── test/               # Test files
├── docs/               # Documentation
└── config/             # Configuration files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built from [Habitica](https://github.com/HabitRPG/habitica) - the open-source habit tracker RPG
- Inspired by the need to support skilled trades entrepreneurship education

## 📞 Contact

Benjamin Atkinson - Project Lead

---

**🎯 Mission**: Transforming skilled trades professionals into successful entrepreneurs through gamified, practical education.