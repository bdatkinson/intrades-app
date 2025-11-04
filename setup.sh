#!/bin/bash

# InTrades App Setup Script
# This script helps you quickly set up the InTrades app after cloning/downloading

echo "🚀 Welcome to InTrades Setup!"
echo "=============================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"

# Check for MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. You'll need MongoDB for the database."
    echo "   Visit: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Check for Git
if ! command -v git &> /dev/null; then
    echo "⚠️  Git is not installed. You'll need Git for version control."
    echo "   Visit: https://git-scm.com/"
    echo ""
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "   Please edit .env with your configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📁 Creating required directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p temp

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB: mongod"
echo "3. Run the development server: npm run dev"
echo "4. Visit http://localhost:3000/health to verify"
echo ""
echo "For production deployment:"
echo "- Set up AWS S3 (see docs/AWS_S3_SETUP_GUIDE.md)"
echo "- Configure MongoDB Atlas or production database"
echo "- Set secure JWT_SECRET in environment"
echo ""
echo "📚 Documentation: README.md"
echo "🐛 Issues? Check GITHUB_PUSH_INSTRUCTIONS.md"
echo ""
echo "Happy coding! 🎮"