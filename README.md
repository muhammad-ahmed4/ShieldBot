# ShieldAuth - Secure Authentication Application

A modern, secure authentication application built with the latest web technologies and optimized for performance.

## 🔧 Port Configuration

This application uses custom ports to avoid conflicts with other applications:

- **PostgreSQL Database**: Port `5433` (instead of default 5432)
- **pgAdmin**: Port `8081` (instead of default 8080)
- **Application**: Port `5173` (default)

Make sure to update your `.env` file with the correct database URL:

```
DATABASE_URL="postgresql://postgres:ahmed123@localhost:5433/Authapp"
```

## 🚀 Technology Stack

- **Frontend Framework**: SvelteKit with Svelte 5
- **Authentication**: Auth.js (NextAuth.js for SvelteKit) with **PostgreSQL Database Sessions**
- **Styling**: TailwindCSS
- **Database**: **PostgreSQL Only** (No SQLite fallback)
- **ORM**: Drizzle ORM

## ✨ Features

### 🔐 **Core Authentication**

- **Secure Authentication** - Database sessions with bcrypt password hashing
- **User Registration & Login** - Email and password-based authentication
- **OAuth Integration** - Google and GitHub sign-in/registration
- **Protected Routes** - Secure access control for authenticated users
- **Profile Management** - Users can view and update their profile
- **Profile Pictures** - Upload and manage custom profile pictures (email users only)
- **Password Change** - Secure password update functionality (email users only)
- **Session Management** - 30-day database sessions with automatic cleanup

### 👑 **Role-Based Access Control (RBAC)**

- **Admin Dashboard** - Comprehensive admin interface with user analytics
- **User Management** - Advanced user administration with search and filtering
- **Role Management** - Promote/demote users between user and admin roles
- **Account Control** - Activate/deactivate user accounts
- **User Analytics** - Statistics dashboard with user counts and activity metrics
- **Security Controls** - Self-protection mechanisms for admin accounts

### 🎨 **User Interface**

- **Modern Dark UI** - Beautiful dark mode interface with consistent theming
- **Responsive Design** - Works perfectly on all devices and screen sizes
- **Component Library** - Reusable UI components with TailwindCSS
- **Real-time Updates** - Live form validation and error handling
- **Professional Navigation** - Role-based navigation with admin access
- **Balanced Layout** - Perfectly spaced navbar with equal margins
- **Hero Section** - Engaging home page with background image and feature showcase
- **Professional Footer** - Complete site navigation and information
- **Custom Branding** - Custom favicon and app icons for professional appearance

### 🛡️ **Security & Performance**

- **Security First** - CSRF protection, input validation, and secure sessions
- **Performance Optimized** - Fast loading and smooth interactions
- **PostgreSQL Sessions** - Secure server-side session management
- **Type Safety** - Full TypeScript implementation with Drizzle ORM
- **Production Ready** - Docker deployment with comprehensive configuration

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/authapp"

# Authentication Secret (Required - generate a strong random string)
AUTH_SECRET="your-super-secret-auth-key-here"

# OAuth Configuration (Optional - for Google and GitHub login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Environment (Optional)
NODE_ENV="development"
```

**Important Notes:**

- The app **only supports PostgreSQL** - no SQLite fallback
- `DATABASE_URL` must be a valid PostgreSQL connection string
- `AUTH_SECRET` should be a strong, random string (32+ characters recommended)
- Generate a secure secret: `openssl rand -base64 32`
- OAuth credentials are optional - app works with email/password only
- See [OAuth Setup Guide](./OAUTH_SETUP.md) for detailed OAuth configuration

## 🏗️ Architecture

The application follows modern web development best practices:

- **Server-side Rendering** with SvelteKit
- **Type-safe Database** operations with Drizzle ORM
- **Component-based** architecture for maintainability
- **Utility-first** CSS with TailwindCSS
- **Secure API** endpoints with proper authentication

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd auth-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL database**

   ```bash
   npm run db:up
   ```

5. **Push database schema**

   ```bash
   npm run db:push
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:5173](http://localhost:5173) to see your app!

## 👑 **Admin Features**

### **Getting Admin Access**

To test admin features, promote a user to admin role:

```bash
npm run promote-admin your-email@example.com
```

### **Admin Dashboard**

- **URL**: `/admin` (admin users only)
- **Features**:
  - User statistics and analytics
  - Recent user registrations
  - Quick user management actions
  - System overview dashboard

### **User Management**

- **URL**: `/admin/users` (admin users only)
- **Features**:
  - View all registered users
  - Search users by name or email
  - Filter by role (user/admin) and status (active/inactive)
  - Change user roles (promote/demote)
  - Activate/deactivate user accounts
  - User activity tracking

### **Security Features**

- **Role-based Access Control** - Only admin users can access admin routes
- **Self-protection** - Admins cannot modify their own account
- **API Security** - All admin endpoints require admin authentication
- **Audit Trail** - User management actions are logged

## 🔗 OAuth Integration

### **Supported Providers**

- **Google OAuth** - Sign in with Google account
- **GitHub OAuth** - Sign in with GitHub account
- **Email/Password** - Traditional authentication method

### **OAuth Features**

- **Seamless Integration** - Users can sign in with social accounts
- **Account Linking** - OAuth accounts are linked to existing email accounts
- **Profile Sync** - Automatically syncs name and profile picture from OAuth providers
- **Flexible Authentication** - Users can use any combination of authentication methods

### **Profile Picture Management**

- **OAuth Users** - Keep their social media profile pictures (Google/GitHub)
- **Email Users** - Can upload custom profile pictures from their device
- **File Validation** - Supports PNG, JPG, GIF up to 5MB
- **Secure Storage** - Images stored in `static/uploads/profiles/` directory
- **Delete Functionality** - Users can remove their uploaded profile pictures

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [OAuth Setup Guide](./OAUTH_SETUP.md) - Google and GitHub OAuth configuration
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Component Library](./docs/components.md) - Reusable UI components
- [Database Schema](./docs/schema.md) - Database structure and relationships

## 🛠️ Development

### Available Scripts

**Development:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking and linting

**Database Management:**

- `npm run db:up` - Start PostgreSQL database
- `npm run db:down` - Stop PostgreSQL database
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run seed` - Seed database with sample data

**Admin Tools:**

- `npm run promote-admin <email>` - Promote user to admin role

### Database Management

The app includes Docker Compose configuration for easy database setup:

```bash
# Start database
npm run db:up

# View logs
npm run db:logs

# Stop database
npm run db:down
```

## 🎯 Performance Optimizations

### Database

- **Connection Pooling** - Configurable connection limits
- **Health Checks** - Automatic connection monitoring
- **Graceful Shutdown** - Proper cleanup on app termination
- **Query Optimization** - Efficient database queries with Drizzle ORM

### Frontend

- **Code Splitting** - Automatic bundle optimization
- **Component Library** - Reusable, optimized components
- **Utility Functions** - Performance-focused helper functions
- **TailwindCSS Optimization** - Purged CSS for production

### Build

- **Vite Configuration** - Fast development and optimized builds
- **Modern ES Target** - Latest JavaScript features
- **Asset Optimization** - Optimized images and static files

## 🛣️ **Application Routes**

### **Public Routes**

- `/` - Home page with authentication status
- `/register` - User registration
- `/login` - User login

### **Protected Routes (Authentication Required)**

- `/dashboard` - User dashboard
- `/profile` - User profile management with picture upload
- `/auth/change-password` - Change password functionality (email users only)

### **Admin Routes (Admin Users Only)**

- `/admin` - Admin dashboard with user analytics
- `/admin/users` - User management with search and filtering

### **API Endpoints**

- `/api/auth/register` - User registration API
- `/api/auth/change-password` - Password change API
- `/api/profile` - Profile management API
- `/api/profile/upload-image` - Upload profile picture API
- `/api/profile/delete-image` - Delete profile picture API
- `/api/admin/users/[userId]/toggle-status` - Toggle user status
- `/api/admin/users/[userId]/change-role` - Change user role

## 🔒 Security Features

- **CSRF Protection** - Built-in cross-site request forgery protection
- **Secure Sessions** - Database-backed session management
- **Password Hashing** - Bcrypt with configurable salt rounds
- **Input Validation** - Server-side validation for all inputs
- **Protected Routes** - Authentication-required endpoints
- **Secure Headers** - Security-focused HTTP headers

## 🌟 Component Library

The app includes a comprehensive set of reusable components:

- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **Input** - Form inputs with validation and error handling
- **Card** - Content containers with customizable themes
- **Form Components** - Complete form building blocks

## 📊 Monitoring & Debugging

- **Database Health Checks** - Monitor database connectivity
- **Query Logging** - Development-time query inspection
- **Error Boundaries** - Graceful error handling
- **Performance Metrics** - Built-in performance monitoring

## 🚀 Deployment

### Production Checklist

1. ✅ Set `NODE_ENV=production`
2. ✅ Configure production database URL
3. ✅ Set secure `AUTH_SECRET`
4. ✅ Enable SSL for database connections
5. ✅ Configure reverse proxy (nginx/Apache)
6. ✅ Set up monitoring and logging

### Deployment Options

- **Vercel** - Zero-config deployment
- **Netlify** - Easy static hosting
- **Docker** - Containerized deployment
- **Traditional Hosting** - VPS or dedicated server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Auth.js](https://authjs.dev/) - Authentication for the web
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - The world's most advanced open source database

---

Built with ❤️ using modern web technologies
