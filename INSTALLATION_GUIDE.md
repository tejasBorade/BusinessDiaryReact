# 🚫 Unable to Build? Here's Why and How to Fix It

## Current Status: Missing Prerequisites ❌

Your system is missing the required software to build and run this application.

---

## ✅ Required Software (Must Install First)

### 1. **Python 3.8+** (Backend)
- **Why?** The backend server runs on Python with Flask
- **Download:** https://www.python.org/downloads/
- **⚠️ IMPORTANT:** During installation, **CHECK** the box that says:
  - ✅ "Add Python to PATH" or "Add Python to environment variables"
- **Recommended Version:** Python 3.11 or 3.12

### 2. **Node.js 14+** (Frontend)
- **Why?** The React frontend needs Node.js and npm
- **Download:** https://nodejs.org/
- **Choose:** LTS (Long Term Support) version (currently v20.x)
- **Includes:** npm (Node Package Manager) automatically

---

## 📋 Installation Steps

### Step 1: Install Python
1. Go to https://www.python.org/downloads/
2. Download the latest version for Windows
3. Run the installer
4. ✅ **CHECK "Add Python to PATH"** (very important!)
5. Click "Install Now"

### Step 2: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (left button)
3. Run the installer
4. Accept all default settings
5. Complete the installation

### Step 3: Restart Your Terminal
- Close all PowerShell/CMD windows
- Open a new PowerShell window
- This ensures the PATH updates take effect

### Step 4: Verify Installation
Open PowerShell and run:
```powershell
python --version
node --version
npm --version
```

You should see version numbers for all three.

### Step 5: Run Setup Script
Navigate to the project folder and run:
```powershell
cd "c:\Users\tejas\OneDrive\Documents\BusinessDiary"
.\setup.bat
```

Or use PowerShell script:
```powershell
cd "c:\Users\tejas\OneDrive\Documents\BusinessDiary"
.\setup.ps1
```

---

## 🎯 Manual Installation (Alternative)

If the setup script doesn't work, install dependencies manually:

### Backend:
```powershell
cd backend
python -m pip install Flask==3.0.0
python -m pip install Flask-CORS==4.0.0
python -m pip install Flask-SQLAlchemy==3.1.1
python -m pip install PyJWT==2.8.0
python -m pip install Werkzeug==3.0.1
```

### Frontend:
```powershell
cd frontend
npm install
```

---

## ▶️ Running the Application

Once dependencies are installed:

### Terminal 1 - Backend:
```powershell
cd backend
python app.py
```
Should show: `Running on http://127.0.0.1:5000`

### Terminal 2 - Frontend:
```powershell
cd frontend
npm start
```
Browser should automatically open to: http://localhost:3000

---

## 🔍 Troubleshooting

### "Python not found" even after installation?
1. Restart your computer (sometimes needed for PATH updates)
2. Verify Python is in PATH:
   ```powershell
   $env:PATH -split ';' | Select-String Python
   ```
3. Try using `py` instead of `python`:
   ```powershell
   py --version
   py app.py
   ```

### "node not found" even after installation?
1. Restart your terminal
2. Verify Node.js installation location:
   ```powershell
   where.exe node
   ```
3. If not found, manually add to PATH or reinstall

### Port 3000 already in use?
React will automatically offer to use port 3001. Type 'Y' to accept.

### Port 5000 already in use?
Edit `backend/app.py`, find the last line and change:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed to 5001
```

---

## 📦 What Gets Installed?

### Backend (Python packages):
- Flask - Web framework
- Flask-CORS - Cross-origin support
- Flask-SQLAlchemy - Database ORM
- PyJWT - JWT authentication
- Werkzeug - Security utilities

### Frontend (Node packages):
- React - UI library
- React Router - Navigation
- Axios - HTTP client
- React Scripts - Build tools

**Total installation size:** ~500MB (includes all dependencies)
**Installation time:** 5-10 minutes (depends on internet speed)

---

## 🎓 Quick Start After Setup

1. **Login at:** http://localhost:3000/login
2. **Credentials:**
   - Email: `superadmin@businessdiary.com`
   - Password: `Admin@123`
3. **Explore:**
   - Dashboard
   - Business listings
   - User management (as Super Admin)

---

## 📞 Still Having Issues?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Python/Node not in PATH | Reinstall with PATH option or add manually |
| Permission denied | Run PowerShell as Administrator |
| SSL certificate errors | Update pip: `python -m pip install --upgrade pip` |
| npm ERR! | Delete `node_modules` and run `npm install` again |
| Database locked | Delete `businessdiary.db` and restart backend |

---

## ✨ What You'll Have After Setup

✅ Full-stack business directory application
✅ Role-based authentication (5 user roles)
✅ Business search and filtering
✅ Reviews and ratings system
✅ Admin dashboard
✅ User management system
✅ Area and category management

Ready to build amazing business directory! 🚀
