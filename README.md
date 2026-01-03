# Business Diary - JustDial Clone

A full-stack business directory web application similar to JustDial with role-based authentication and authorization.

## Features

- **Multi-Role Authentication System**
  - Super Admin
  - Admin
  - Area Manager
  - Store Owner
  - Employee

- **Business Management**
  - Browse and search businesses
  - Filter by category and area
  - View detailed business information
  - Rate and review businesses

- **User Management** (Admin/Super Admin)
  - Create and manage users
  - Assign roles
  - Activate/deactivate accounts

- **Area Management**
  - Define geographical areas
  - Assign area managers
  - Manage businesses by area

- **Category Management**
  - Create business categories
  - Organize businesses

## Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Flask-CORS** - Cross-origin support

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Project Structure

```
BusinessDiary/
├── backend/
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── users.py         # User management
│   │   ├── businesses.py    # Business operations
│   │   ├── areas.py         # Area management
│   │   └── categories.py    # Category management
│   ├── app.py               # Flask application
│   ├── models.py            # Database models
│   ├── config.py            # Configuration
│   ├── auth_middleware.py   # JWT middleware
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   └── package.json         # Node dependencies
│
└── README.md
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate
   ```

3. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Copy environment file and configure (optional):
   ```powershell
   copy .env.example .env
   ```

5. Run the Flask application:
   ```powershell
   python app.py
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install Node dependencies:
   ```powershell
   npm install
   ```

3. Start the React development server:
   ```powershell
   npm start
   ```

The frontend application will open at `http://localhost:3000`

## Default Credentials

The application creates a default Super Admin account on first run:

- **Email:** superadmin@businessdiary.com
- **Password:** Admin@123

## User Roles & Permissions

### Super Admin
- Full system access
- Manage all users, businesses, areas, and categories
- Assign roles to other users

### Admin
- Manage users and businesses
- Create and manage areas and categories
- Approve business listings

### Area Manager
- Manage businesses in assigned geographical areas
- View and moderate listings in their area

### Store Owner
- Create and manage own business listings
- Update business information
- Respond to reviews

### Employee
- Limited access to assigned tasks
- View businesses
- Basic operations as assigned

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)

### Businesses
- `GET /api/businesses` - Get all businesses (with filters)
- `GET /api/businesses/:id` - Get business details
- `POST /api/businesses` - Create new business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business (Admin only)
- `POST /api/businesses/:id/reviews` - Add review

### Areas
- `GET /api/areas` - Get all areas
- `GET /api/areas/:id` - Get area details
- `POST /api/areas` - Create area (Admin only)
- `PUT /api/areas/:id` - Update area (Admin only)
- `DELETE /api/areas/:id` - Delete area (Admin only)
- `POST /api/areas/:id/managers` - Assign manager (Admin only)
- `DELETE /api/areas/:id/managers/:userId` - Remove manager (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

## Database Schema

### Users
- id, email, username, password (hashed)
- full_name, phone, role
- is_active, created_at, updated_at

### Businesses
- id, name, description
- category_id, area_id, owner_id
- address, phone, email, website
- opening_hours, rating, total_reviews
- is_verified, is_active
- created_at, updated_at

### Areas
- id, name, city, state, pincode
- description, is_active, created_at

### Categories
- id, name, description, icon
- is_active, created_at

### Reviews
- id, business_id, user_id
- rating, comment, created_at

### AreaManager
- id, user_id, area_id, assigned_at

### EmployeeAssignment
- id, employee_id, business_id
- role_description, assigned_at

## Development

### Running Tests
```powershell
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

#### Backend
The Flask app can be deployed using:
- Gunicorn
- uWSGI
- Docker

#### Frontend
```powershell
cd frontend
npm run build
```

## Security Features

- JWT-based authentication
- Password hashing using Werkzeug
- Role-based access control
- Protected API endpoints
- CORS configuration
- Input validation

## Future Enhancements

- [ ] Image upload for businesses
- [ ] Advanced search with filters
- [ ] Email notifications
- [ ] SMS integration
- [ ] Payment integration
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Export reports
- [ ] Social media integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue on the GitHub repository.

## Authors

- Your Name - Initial work

## Acknowledgments

- Inspired by JustDial
- Built with React and Flask
- Uses SQLite for easy local development
