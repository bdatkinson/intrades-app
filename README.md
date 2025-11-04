# 🎮 InTrades - Gamified Learning Platform for Skilled Trades

Transform skilled trades education through gamification! InTrades helps students become successful entrepreneurs by turning business education into an engaging, game-like experience.

## 🚀 Overview

InTrades is a comprehensive web application that gamifies the journey from trades student to business owner. Built by transforming the proven Habitica gamification framework, it's specifically designed for skilled trades education programs.

### Key Features

- **🏆 5-Tier Progression System**: Advance from Apprentice → Journeyman → Master → Contractor → Boss
- **📚 Weekly Challenge System**: Complete quizzes, real-world tasks, mini-games, and boss battles
- **🥇 30+ Achievement Badges**: Earn badges across 9 categories including foundation, legal, finance, marketing, and operations
- **📈 XP & Leveling**: Dynamic point system with multipliers, bonuses, and tier progression
- **📁 File Upload System**: Submit screenshots and documents for real-world task verification
- **🔐 Secure Authentication**: JWT-based auth with refresh tokens and role-based access control
- **👥 Social Features**: Study buddy matching, peer reviews, and team challenges
- **📊 Progress Tracking**: Visual checklists for business milestones (LLC, website, insurance, etc.)

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** for data persistence
- **Mongoose** ODM for data modeling
- **JWT** for authentication
- **AWS S3** for file storage
- **bcrypt** for password hashing

### Frontend (Coming Soon)
- **React** for UI components
- **Redux** for state management
- **Material-UI** for design system
- **Chart.js** for progress visualization

## 📁 Project Structure

```
intrades-app/
├── server/
│   ├── models/          # Data models (User, Challenge, Submission, Badge, etc.)
│   ├── controllers/     # Business logic for API endpoints
│   ├── routes/          # API route definitions
│   ├── services/        # XP calculation, file upload services
│   └── middleware/      # Authentication, authorization, validation
├── test/                # Unit and integration tests
├── docs/                # Documentation and guides
│   └── AWS_S3_SETUP_GUIDE.md
└── package.json         # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 5+
- AWS Account (for S3 file storage)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/intrades-app.git
   cd intrades-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure MongoDB**
   ```bash
   # Ensure MongoDB is running locally or update MONGODB_URI in .env
   mongod
   ```

5. **Set up AWS S3** (Optional for development)
   - Follow the comprehensive guide in `docs/AWS_S3_SETUP_GUIDE.md`
   - Or use local storage by setting `NODE_ENV=development`

6. **Run the application**
   ```bash
   npm run dev
   ```

7. **Run tests**
   ```bash
   npm test
   ```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/intrades

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3 (Optional for development)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET=intrades-submissions
```

## 🔗 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/profile` | Get current user profile |
| PATCH | `/api/auth/profile` | Update user profile |

### Challenge Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | List all challenges |
| GET | `/api/challenges/:id` | Get challenge details |
| POST | `/api/challenges` | Create challenge (instructor/admin) |
| PUT | `/api/challenges/:id` | Update challenge |
| POST | `/api/challenges/:id/submit` | Submit challenge |
| POST | `/api/challenges/:challengeId/submissions/:id/grade` | Grade submission |

### Badge & XP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges` | List all badges |
| GET | `/api/badges/users/:userId` | Get user badges |
| POST | `/api/badges/users/:userId/award/:badgeId` | Award badge |
| GET | `/api/xp/leaderboard` | Get XP leaderboard |
| GET | `/api/xp/users/:userId` | Get user XP details |

### File Upload Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploads/challenges/:id/submissions/:id/files` | Upload submission files |
| GET | `/api/uploads/submissions/:id/files` | Get submission files |
| POST | `/api/uploads/users/:userId/avatar` | Upload user avatar |

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📊 Development Progress

### ✅ Completed Features
- User model with trades-specific fields
- Challenge system with multiple types
- XP & Badge system (30+ badges)
- File upload system with AWS S3
- JWT authentication with refresh tokens
- Role-based access control
- Password reset functionality

### 🚧 In Development
- React frontend UI
- Weekly challenge interface
- Instructor dashboard
- Real-world progress tracker
- Mobile app (React Native)

### 📋 Planned Features
- Video tutorials integration
- AI-powered study recommendations
- Business plan generator
- Networking features
- Job board integration

## 👥 User Roles

1. **Student** - Complete challenges, earn XP, track business progress
2. **Instructor** - Create challenges, grade submissions, monitor student progress
3. **Admin** - Manage system, users, and content

## 🏆 Progression System

### XP Tiers
- **Apprentice** (0-149 XP) - Starting level
- **Journeyman** (150-399 XP) - Basic competency
- **Master** (400-699 XP) - Advanced skills
- **Contractor** (700-1199 XP) - Business ready
- **Boss** (1200+ XP) - Master entrepreneur

### Badge Categories
- Foundation - Entrepreneurship basics
- Legal - Business structure, permits
- Finance - Banking, pricing, budgeting
- Marketing - Branding, website, social media
- Operations - Day-to-day management
- HR - Hiring, safety, insurance
- Scaling - Growth strategies
- Achievement - Performance milestones
- Social - Community engagement

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built by transforming the [Habitica](https://habitica.com) open-source framework
- Inspired by successful trades education programs
- Designed with input from skilled trades instructors and students

## 📞 Support

For support, email support@intrades.com or open an issue in this repository.

## 🚀 Deployment

### Heroku Deployment

```bash
# Create Heroku app
heroku create intrades-app

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

### Docker Deployment

```bash
# Build image
docker build -t intrades-app .

# Run container
docker run -p 3000:3000 --env-file .env intrades-app
```

---

**Built with ❤️ for the next generation of skilled trades entrepreneurs**