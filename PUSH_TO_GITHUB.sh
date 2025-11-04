#!/bin/bash

# InTrades - Push to GitHub Repository
# Repository: https://github.com/bdatkinson/intrades-app

echo "🚀 InTrades - Push to GitHub"
echo "============================"
echo ""
echo "Repository: https://github.com/bdatkinson/intrades-app"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📝 Initializing Git repository..."
    git init
fi

# Configure Git user
echo "👤 Configuring Git user..."
git config user.name "Benjamin Atkinson"
git config user.email "benjamin@intrades.com"

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/bdatkinson/intrades-app.git
else
    echo "🔗 Updating GitHub remote..."
    git remote set-url origin https://github.com/bdatkinson/intrades-app.git
fi

# Show remote
echo ""
echo "📍 Remote repository:"
git remote -v
echo ""

# Check status
echo "📊 Git status:"
git status --short
echo ""

# Add all files if needed
echo "📁 Adding all files to Git..."
git add -A

# Commit if there are changes
if ! git diff --cached --quiet; then
    echo "💾 Committing changes..."
    git commit -m "feat: Complete InTrades backend implementation

- User authentication with JWT and refresh tokens
- Challenge system with 4 types (quiz, real-world, mini-game, boss-battle)  
- XP & Badge system (30+ badges, 5 tiers)
- File upload with AWS S3 integration
- 35+ API endpoints
- Comprehensive documentation

Built by transforming Habitica framework for skilled trades education"
fi

# Rename branch to main
echo "🌿 Setting branch to main..."
git branch -M main

echo ""
echo "========================================="
echo "🎯 Ready to push to GitHub!"
echo "========================================="
echo ""
echo "The code is ready. To push to GitHub, you'll need to:"
echo ""
echo "Option 1: Using HTTPS with token (Recommended)"
echo "-----------------------------------------------"
echo "1. Create a Personal Access Token on GitHub:"
echo "   - Go to: https://github.com/settings/tokens"
echo "   - Click 'Generate new token (classic)'"
echo "   - Select scope: 'repo' (full control)"
echo "   - Copy the token"
echo ""
echo "2. Push using the token as password:"
echo "   git push -u origin main"
echo "   Username: bdatkinson"
echo "   Password: [paste your token]"
echo ""
echo "Option 2: Using GitHub CLI"
echo "---------------------------"
echo "1. Install GitHub CLI: https://cli.github.com/"
echo "2. Authenticate: gh auth login"
echo "3. Push: git push -u origin main"
echo ""
echo "Option 3: Using SSH"
echo "--------------------"
echo "1. Set up SSH key: https://github.com/settings/keys"
echo "2. Change remote to SSH:"
echo "   git remote set-url origin git@github.com:bdatkinson/intrades-app.git"
echo "3. Push: git push -u origin main"
echo ""
echo "========================================="
echo "📋 Manual push command:"
echo "   git push -u origin main"
echo "========================================="
echo ""
echo "After successful push, your code will be at:"
echo "🔗 https://github.com/bdatkinson/intrades-app"
echo ""