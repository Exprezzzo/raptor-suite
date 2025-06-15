# C:\Users\Owner\Projects\raptor-suite\launch-raptor.ps1

# RAPTOR SUITE - AUTOMATED LAUNCH SCRIPT
# This script performs a clean install, fixes critical issues, and deploys your platform.

Write-Host "" # New line for clarity
Write-Host "🦅 RAPTOR SUITE - AUTOMATED LAUNCH SEQUENCE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "" # New line for clarity

# Function to check if command succeeded
function Check-Status {
    param([string]$Message)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Message completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message failed. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Get the root directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "📍 Working directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "" # New line for clarity

# STEP 1: Deep Clean All node_modules and package-lock.json
Write-Host "🔧 STEP 1: Performing Deep Clean of all Dependencies" -ForegroundColor Yellow
Write-Host "====================================================="
Write-Host "" # New line for clarity

Write-Host "1.1 Deleting all node_modules folders..."
Get-ChildItem -Path . -Recurse -Directory -Include "node_modules" -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Check-Status "All node_modules deleted"

Write-Host "1.2 Deleting all package-lock.json files..."
Get-ChildItem -Path . -Recurse -Include "package-lock.json" -Force -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Check-Status "All package-lock.json files deleted"

Write-Host "" # New line for clarity
Write-Host "✨ Deep clean complete!" -ForegroundColor Green
Write-Host "" # New line for clarity

# STEP 2: Install Dependencies Manually in Each Sub-Project
Write-Host "📦 STEP 2: Installing Dependencies in Each Project Directory" -ForegroundColor Yellow
Write-Host "=========================================================="
Write-Host "" # New line for clarity

Write-Host "2.1 Installing web dependencies..."
Set-Location web
npm install --legacy-peer-deps
Check-Status "Web dependencies installed"
Set-Location ..

Write-Host "2.2 Installing mobile dependencies..."
Set-Location mobile
npm install --legacy-peer-deps
Check-Status "Mobile dependencies installed"
Set-Location ..

Write-Host "2.3 Installing functions dependencies..."
Set-Location functions
npm install --legacy-peer-deps
Check-Status "Functions dependencies installed"
Set-Location ..

Write-Host "" # New line for clarity
Write-Host "✨ All project dependencies installed!" -ForegroundColor Green
Write-Host "" # New line for clarity

# STEP 3: Apply Critical Code Fixes
Write-Host "🔧 STEP 3: Applying Critical Code Fixes" -ForegroundColor Yellow
Write-Host "========================================"
Write-Host "" # New line for clarity

# Fix 1: Uncomment universalAI export in functions/src/index.ts
Write-Host "3.1 Fixing universalAI export..."
$filePath = "functions/src/index.ts"
if (Test-Path $filePath) {
    (Get-Content $filePath) -replace '// export { universalAI }', 'export { universalAI }' | Set-Content $filePath
    Check-Status "universalAI export uncommented"
} else {
    Write-Host "⚠️ File not found: $filePath - skipping fix." -ForegroundColor Yellow
}

# Fix 2: Rename voiceMode.tst to voiceMode.ts
Write-Host "3.2 Fixing voiceMode file extension..."
$tstPath = "functions/src/voiceMode.tst"
$tsPath = "functions/src/voiceMode.ts"
if (Test-Path $tstPath) {
    if (Test-Path $tsPath) { # If .ts exists, remove it first to avoid "device name" conflict
        Remove-Item $tsPath -Force -ErrorAction SilentlyContinue
        Write-Host "   Existing voiceMode.ts removed before rename." -ForegroundColor Yellow
    }
    Rename-Item $tstPath $tsPath # Now rename
    Check-Status "voiceMode.tst renamed to voiceMode.ts"
} elseif (Test-Path $tsPath) {
    Write-Host "✅ voiceMode.ts already has correct extension." -ForegroundColor Green
} else {
    Write-Host "⚠️ Neither voiceMode.tst nor voiceMode.ts found. Skipping fix." -ForegroundColor Yellow
}

# Fix 3: Fix Buffer polyfill in web/src/hooks/useVoiceMode.js
Write-Host "3.3 Fixing Buffer polyfill in browser..."
$filePath = "web/src/hooks/useVoiceMode.js"
if (Test-Path $filePath) {
    (Get-Content $filePath) -replace "Buffer\.from\(arrayBuffer\)\.toString\('base64'\)", "btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))" | Set-Content $filePath
    Check-Status "Buffer polyfill fixed"
} else {
    Write-Host "⚠️ File not found: $filePath - skipping fix." -ForegroundColor Yellow
}

# Fix 4: Add missing speech request object in functions/src/voiceMode.ts
Write-Host "3.4 Adding speech request object..."
$filePath = "functions/src/voiceMode.ts"
if (Test-Path $filePath) {
    $content = Get-Content $filePath -Raw
    if ($content -notmatch 'const request = { audio, config };') { # Only add if not already present
        $pattern = '(const \[response\] = await speechClient\.recognize)'
        $replacement = "const request = { audio, config };`n    " + '$1' # Insert new line + indentation + original line
        $content = $content -replace $pattern, $replacement
        Set-Content $filePath -Value $content
        Check-Status "Speech request object added"
    } else {
        Write-Host "✅ Speech request object already exists." -ForegroundColor Green
    }
} else {
    Write-Host "⚠️ File not found: $filePath - skipping fix." -ForegroundColor Yellow
}

# Fix 5: Delete misplaced HTML from functions/
Write-Host "3.5 Removing misplaced index.html from functions folder..."
$filePath = "functions/index.html"
if (Test-Path $filePath) { 
    Remove-Item $filePath -Force
    Check-Status "Misplaced index.html removed"
} else {
    Write-Host "✅ No misplaced index.html found." -ForegroundColor Green
}

Write-Host "" # New line for clarity
Write-Host "✨ All critical issues fixed!" -ForegroundColor Green
Write-Host "" # New line for clarity

# STEP 4: Set up Firebase Secrets
Write-Host "🔐 STEP 4: Setting up Firebase Secrets" -ForegroundColor Yellow
Write-Host "====================================="
Write-Host "" # New line for clarity
Write-Host "You will be prompted to enter your actual API keys for OpenAI, Anthropic, and Gemini." -ForegroundColor White
Write-Host "These are saved securely in Google Cloud Secret Manager for your Firebase Functions." -ForegroundColor White
Write-Host "DO NOT share these keys publicly!" -ForegroundColor Red
Write-Host "" # New line for clarity
Write-Host "Press Enter to continue..." -ForegroundColor White
Read-Host

Write-Host "" # New line for clarity
Write-Host "Setting OPENAI_API_KEY..." -ForegroundColor Yellow
firebase functions:secrets:set OPENAI_API_KEY
Check-Status "OpenAI API key set"

Write-Host "" # New line for clarity
Write-Host "Setting ANTHROPIC_API_KEY..." -ForegroundColor Yellow
firebase functions:secrets:set ANTHROPIC_API_KEY
Check-Status "Anthropic API key set"

Write-Host "" # New line for clarity
Write-Host "Setting GEMINI_API_KEY..." -ForegroundColor Yellow
firebase functions:secrets:set GEMINI_API_KEY
Check-Status "Gemini API key set"

Write-Host "" # New line for clarity
Write-Host "✨ Firebase secrets configured!" -ForegroundColor Green
Write-Host "" # New line for clarity

# STEP 5: Build and Deploy Functions
Write-Host "🚀 STEP 5: Building and Deploying Functions" -ForegroundColor Yellow
Write-Host "==========================================="
Write-Host "" # New line for clarity

Set-Location functions
npm run build
Check-Status "Functions built"

firebase deploy --only functions
Check-Status "Functions deployed"
Set-Location ..

Write-Host "" # New line for clarity
Write-Host "✨ Functions deployed!" -ForegroundColor Green
Write-Host "" # New line for clarity

# STEP 6: Build and Deploy Web App
Write-Host "🌐 STEP 6: Building and Deploying Web App" -ForegroundColor Yellow
Write-Host "========================================"
Write-Host "" # New line for clarity

Set-Location web
npm run build
Check-Status "Web app built"

firebase deploy --only hosting
Check-Status "Web app deployed"
Set-Location ..

Write-Host "" # New line for clarity
Write-Host "✨ Web app deployed!" -ForegroundColor Green
Write-Host "" # New line for clarity

# FINAL STEP: Manual Firestore Enablement
Write-Host "📋 FINAL STEP: MANUAL ACTION REQUIRED - ENABLE FIRESTORE" -ForegroundColor Yellow
Write-Host "=========================================================="
Write-Host "" # New line for clarity
Write-Host "Your application is now deployed, but you MUST manually enable Firestore." -ForegroundColor White
Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/project/raptor-suite/firestore" -ForegroundColor Cyan
Write-Host "2. Click 'Create Database'" -ForegroundColor White
Write-Host "3. Choose 'Start in production mode'" -ForegroundColor White
Write-Host "4. Select location (e.g., us-central1)" -ForegroundColor White
Write-Host "5. Click 'Enable'" -ForegroundColor White
Write-Host "" # New line for clarity
Write-Host "🌟 Your platform should be LIVE at: https://raptor-suite.web.app" -ForegroundColor Cyan
Write-Host "" # New line for clarity

Write-Host "🦅 RAPTOR SUITE LAUNCH SEQUENCE COMPLETE!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green