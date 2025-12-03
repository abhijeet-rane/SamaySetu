# 🎨 SamaySetu Frontend

Modern, responsive React frontend for SamaySetu Timetable Management System with MIT AOE theme.

## ✨ Features

- ✅ MIT AOE Color Scheme (Navy Blue & Cyan)
- ✅ Complete Authentication Flow (Login, Register, Email Verification, Password Reset)
- ✅ Teacher Dashboard with Stats & Schedule
- ✅ Admin Dashboard with CRUD Operations
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Smooth Animations with Framer Motion
- ✅ Toast Notifications
- ✅ Protected Routes with Role-Based Access
- ✅ Modern UI Components

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── assets/          # Images, logo
├── components/
│   ├── common/      # Reusable components (Button, Input, Card, Modal)
│   ├── auth/        # Authentication components
│   ├── dashboard/   # Dashboard components
│   ├── admin/       # Admin pages
│   └── layout/      # Layout components (Navbar, Sidebar)
├── pages/           # Page components
├── services/        # API services
├── store/           # State management (Zustand)
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## 🎨 MIT AOE Color Scheme

- **Primary Navy**: #1a237e (Headers, Buttons)
- **Primary Blue**: #283593 (Main Actions)
- **Secondary Cyan**: #00bcd4 (Accents)
- **Success Green**: #4caf50
- **Warning Orange**: #ff9800
- **Error Red**: #f44336

## 🔐 Authentication Flow

1. **Register** → Email Verification → Login
2. **Login** → Dashboard (Teacher/Admin based on role)
3. **Forgot Password** → Reset Link → New Password → Login

## 📱 Pages Implemented

### Public Pages:
- Login Page
- Registration Page
- Email Verification Page
- Forgot Password Page
- Reset Password Page

### Protected Pages:
- Teacher Dashboard
- Admin Dashboard
- Departments Management (CRUD)
- Teachers Management
- Courses Management
- Rooms Management
- Academic Years Management
- Divisions Management

## 🛠️ Technologies

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **React Icons** - Icons

## 🔧 Configuration

### API Base URL
Update in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8083';
```

### Proxy Configuration
Configured in `vite.config.ts` for development.

## 📝 Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:8083
```

## 🎯 Default Credentials

**Admin:**
- Email: admin@mitaoe.ac.in
- Password: admin123

**Teacher:**
- Register with college email (@mitaoe.ac.in)
- Verify email
- Login

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend is running on port 8083
- Check proxy configuration in vite.config.ts

### Module Not Found
```bash
npm install
```

### Port Already in Use
Change port in vite.config.ts:
```typescript
server: { port: 3000 }
```

## 📚 Documentation

- **Setup Guide**: `FRONTEND_SETUP_INSTRUCTIONS.md`
- **API Integration**: `src/services/api.ts`
- **Component Usage**: Check individual component files

## 🎉 Ready to Use!

Your complete frontend is ready with:
- ✅ MIT AOE theme
- ✅ All authentication features
- ✅ Dashboard layouts
- ✅ Admin CRUD operations
- ✅ Responsive design
- ✅ Modern UI/UX

Start the development server and enjoy! 🚀

## 📞 Support

For issues or questions, check the documentation files or backend API reference.

---

© 2024 MIT Academy of Engineering
