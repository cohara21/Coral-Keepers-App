#!/bin/bash
# Quick setup script for Coral Keepers Teacher App

echo "🪸 Coral Keepers Teacher App - Setup Guide"
echo "==========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Tank Vitals home screen"
    echo "✅ Git repo initialized"
else
    echo "✅ Git repo already exists"
fi

echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin <your-github-url>"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   a) Go to https://vercel.com"
echo "   b) Click 'New Project'"
echo "   c) Import your GitHub repository"
echo "   d) Leave build settings as default"
echo "   e) Click 'Deploy'"
echo ""
echo "3. Local testing:"
echo "   python3 -m http.server 3000"
echo "   Open http://localhost:3000"
echo ""
echo "✨ Done! Your app is ready to deploy."
