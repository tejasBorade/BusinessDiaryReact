# Business Directory Project - Copilot Instructions

## Project Overview
Full-stack JustDial-like business directory website with multi-role authentication.

## Technology Stack
- **Frontend**: React with React Router, Axios, Context API
- **Backend**: Python Flask with JWT authentication
- **Database**: SQLite (local)
- **Authentication**: JWT with role-based access control

## User Roles
1. **Super Admin** - Full system access, manage all users and businesses
2. **Admin** - Manage users and businesses
3. **Area Manager** - Manage businesses in specific geographical areas
4. **Store Owner** - Manage own store listing and details
5. **Employee** - Limited access to assigned tasks

## Project Structure
- `/backend` - Python Flask API server
- `/frontend` - React application

## Development Guidelines
- Use proper password hashing (bcrypt)
- Implement JWT token-based authentication
- Role-based route protection on both frontend and backend
- RESTful API design patterns
- Proper error handling and validation

## Setup Status
✓ Created workspace structure
- Next: Scaffold backend and frontend applications
