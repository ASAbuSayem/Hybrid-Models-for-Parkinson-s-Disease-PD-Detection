# 🧠 PD Detection App — A to Z Setup Guide

**Parkinson's Disease Detection via Hand Drawing Analysis**

---

## 📁 Final Project Structure

```
PD-Detection/
├── backend/
│   ├── main.py              ← FastAPI server (FIXED - no SavedModel needed)
│   ├── requirements.txt     ← Updated pip packages
│   ├── save_model_colab.py  ← Run in Colab to export pkl files
│   └── models/
│       ├── M2_svm_rbf.pkl   ← Copy from Colab
│       ├── M2_scaler.pkl    ← Copy from Colab
│       ├── M2_pca.pkl       ← Copy from Colab
│       └── M2_metadata.json
│
└── frontend/
    ├── index.js             ← Entry point (REQUIRED)
    ├── App.js               ← Navigation setup
    ├── app.json             ← Expo config
    ├── package.json         ← FIXED versions
    ├── babel.config.js      ← Babel config
    ├── assets/              ← PNG icons (included)
    │   ├── icon.png
    │   ├── splash-icon.png
    │   ├── adaptive-icon.png
    │   └── favicon.png
    └── screens/
        ├── ScanScreen.js    ← Upload & analyze
        ├── ResultScreen.js  ← Results display
        ├── GuideScreen.js   ← Usage guide
        └── AboutScreen.js   ← Team info
```

---

## ═══ BACKEND SETUP ═══════════════════════════════════════════════

### Step 1 — Get pkl files from Colab

After running Model_2 notebook completely in Colab, add this cell at bottom:

```python
import joblib, shutil, zipfile

# Save pkl files
joblib.dump(trained_models['SVM (RBF)'], '/content/M2_svm_rbf.pkl')
joblib.dump(scaler, '/content/M2_scaler.pkl')
joblib.dump(pca,    '/content/M2_pca.pkl')

# Zip and download
with zipfile.ZipFile('/content/pkl_files.zip', 'w') as zf:
    zf.write('/content/M2_svm_rbf.pkl', 'M2_svm_rbf.pkl')
    zf.write('/content/M2_scaler.pkl',  'M2_scaler.pkl')
    zf.write('/content/M2_pca.pkl',     'M2_pca.pkl')

from google.colab import files
files.download('/content/pkl_files.zip')
```

Extract zip → copy 3 pkl files into `PD-Detection/backend/models/`

### Step 2 — Run Backend in VS Code

Open VS Code terminal:

```bash
# Go to backend folder
cd PD-Detection/backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# If PowerShell gives error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install packages
pip install -r requirements.txt

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ Server ready when you see: `🎉 All models ready! Server is accepting requests.`

### Step 3 — Find your PC IP address

In a new terminal (keep backend running):
```bash
ipconfig
```
Look for `IPv4 Address` under your WiFi adapter.
**Example:** `192.168.1.105`

Test in browser: `http://192.168.1.105:8000` → should show `"status": "ready"`

---

## ═══ FRONTEND SETUP ══════════════════════════════════════════════

### Step 4 — Update API URL

Open `frontend/screens/ScanScreen.js`
Find line 15:
```js
const API_URL = 'http://192.168.1.100:8000';
```
Replace `192.168.1.100` with **your actual PC IP**.

### Step 5 — Install Expo Go on Phone

- Android: Play Store → search **"Expo Go"** → Install
- iOS: App Store → search **"Expo Go"** → Install

> ⚠️ Phone and PC must be on the **SAME WiFi network**!

### Step 6 — Run Frontend

Open a **second terminal** in VS Code (keep backend running in first):

```bash
# Go to frontend folder
cd PD-Detection/frontend

# Install dependencies (wait ~2 minutes)
npm install

# Start Expo
npx expo start
```

You will see a QR code in the terminal.

### Step 7 — Open App on Phone

- **Android:** Open Expo Go app → Tap "Scan QR code" → Scan QR
- **iOS:** Open default Camera app → Point at QR → Tap notification

App loads on phone! 🎉

---

## ═══ HOW TO USE APP ══════════════════════════════════════════════

1. **Detect Tab** — Select Spiral or Wave toggle
2. Tap **Gallery** (upload from phone) or **Camera** (take photo)
3. Tap **Analyze Drawing** → wait 2-3 seconds
4. See result: Healthy ✅ or Parkinson ⚠️ with confidence %

---

## ═══ BUILD APK (Install on Phone) ══════════════════════════════

### Option A — EAS Build (Recommended, Free)

```bash
# Install EAS CLI
npm install -g eas-cli

# Create free account at https://expo.dev → Login
eas login

# Initialize (run once)
cd PD-Detection/frontend
eas build:configure
# Choose: Android → All

# Build APK (~15-20 minutes cloud build)
eas build --platform android --profile preview

# Download APK from the URL shown → Transfer to phone → Install
```

### Option B — Local Build

```bash
# Requires Android Studio + SDK installed
npx expo run:android
```

---

## ═══ TROUBLESHOOTING ════════════════════════════════════════════

| Error | Fix |
|-------|-----|
| `Cannot connect to server` | Update API_URL in ScanScreen.js with correct PC IP |
| `Network request failed` | Phone and PC must be on same WiFi |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again |
| `OSError: SavedModel file does not exist` | Use the FIXED main.py (already included) |
| `ConfigError: cannot resolve entry file` | Fixed — index.js now included |
| `assets not found` | Fixed — assets/ folder now included |
| Expo package version warnings | Fixed — package.json versions updated |
| `Set-ExecutionPolicy error` | Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Port 8000 already in use | Run: `netstat -ano \| findstr :8000` then kill the PID |

---

## ═══ TEAM ════════════════════════════════════════════════════════

| # | Name | Role |
|---|------|------|
| 01 | **Md. Abu Sayem** | AI Lead Researcher & Developer |

---

⚠️ **Disclaimer:** This application is developed for research and academic purposes only.
It is NOT a medical diagnosis tool. Always consult a qualified neurologist for proper evaluation.
