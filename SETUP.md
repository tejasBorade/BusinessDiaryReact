# Business Diary - Quick Setup Guide

## ⚠️ Prerequisites Required

You need to install the following software before building the app:

### 1. Install Python (Backend)
- Download: https://www.python.org/downloads/
- **Important**: During installation, check "Add Python to PATH"
- Recommended version: Python 3.11 or later

### 2. Install Node.js (Frontend)
- Download: https://nodejs.org/
- Choose LTS (Long Term Support) version
- This includes npm (Node Package Manager)

---

## 🚀 Setup Instructions (After Installing Prerequisites)

### Step 1: Install Backend Dependencies

Open PowerShell in the project root and run:

```powershell
cd backend
python -m pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies

In a new PowerShell terminal:

```powershell
cd frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend Server (Terminal 1)

```powershell
cd backend
python app.py
```

The backend will run on: http://localhost:5000

### Start Frontend Server (Terminal 2)

```powershell
cd frontend
npm start
```

The frontend will open automatically at: http://localhost:3000

---

## 🔑 Default Login Credentials

- **Email:** superadmin@businessdiary.com
- **Password:** Admin@123

---

## 🆘 Troubleshooting

### Python not found?
- Reinstall Python with "Add to PATH" option checked
- Or manually add Python to system PATH
- Restart your terminal after installation

### Node/npm not found?
- Restart your terminal after installing Node.js
- Verify installation: `node --version` and `npm --version`

### Port already in use?
- Backend: Change port in `backend/app.py` (line with `app.run()`)
- Frontend: React will prompt to use a different port

### Database errors?
- Delete `backend/businessdiary.db` file
- Restart backend server (database will be recreated)

---

## 📝 Quick Command Reference

```powershell
# Check Python installation
python --version

# Check Node.js installation
node --version
npm --version

# Navigate to project
cd "c:\Users\tejas\OneDrive\Documents\BusinessDiary"

# Install backend dependencies
cd backend
python -m pip install -r requirements.txt

# Run backend
python app.py

# Install frontend dependencies (new terminal)
cd frontend
npm install

# Run frontend
npm start
```

---

## 🔗 What You'll Get

After setup, you'll have:
- ✅ Backend API running on port 5000
- ✅ React frontend on port 3000
- ✅ SQLite database automatically created
- ✅ Default Super Admin account
- ✅ Role-based authentication system
- ✅ Business directory with search/filter
- ✅ User, Area, and Category management

---

## Next Steps After Installation

1. Install Python from https://www.python.org/downloads/
2. Install Node.js from https://nodejs.org/
3. **Restart your terminal**
4. Run the setup commands above
5. Open http://localhost:3000 in your browser
6. Login with the default credentials
