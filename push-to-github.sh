#!/bin/bash

# Replace YOUR_GITHUB_USERNAME with your actual GitHub username
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"

echo "Setting up GitHub remote for InTrades app..."

# Add GitHub remote
git remote add origin https://github.com/${GITHUB_USERNAME}/intrades-app.git

# Verify remote was added
echo "Remote configured:"
git remote -v

# Push all branches and tags
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🔗 Your repository is now available at: https://github.com/${GITHUB_USERNAME}/intrades-app"
