# ShieldAuth - Modern Secure Authentication System

A comprehensive, production-ready authentication application built with cutting-edge web technologies. ShieldAuth provides secure user authentication, role-based access control, and a beautiful modern interface with advanced admin capabilities.

## 🚀 Technology Stack

- **Frontend**: SvelteKit with Svelte 5
- **Authentication**: Auth.js with PostgreSQL Database Sessions (No JWT)
- **Styling**: TailwindCSS with custom dark theme
- **Database**: PostgreSQL with Drizzle ORM
- **Security**: CSRF protection, bcrypt hashing, secure sessions
- **Deployment**: Docker-ready with comprehensive configuration

## ✨ Core Features

### 🔐 **Authentication System**

#### **Multi-Method Authentication**

- **Email/Password Registration** - Secure account creation with email verification
- **Google OAuth Integration** - One-click sign-in with Google accounts
- **GitHub OAuth Integration** - Seamless GitHub authentication
- **Email Verification** - 6-digit verification codes with spam folder alerts
- **Password Reset** - Secure password recovery with email codes

#### **Security Features**

- **Database Sessions Only** - No JWT tokens, secure server-side sessions
- **Bcrypt Password Hashing** - Industry-standard password encryption
- **CSRF Protection** - Built-in cross-site request forgery protection
- **Input Validation** - Comprehensive server-side validation
- **Secure Headers** - Security-focused HTTP headers

### 👑 **Role-Based Access Control (RBAC)**

#### **Admin Dashboard**

- **User Analytics** - Real-time user statistics and metrics
- **System Overview** - Complete system health and activity monitoring
- **Quick Actions** - Fast access to common admin tasks
- **Modern UI** - Beautiful gradient-based interface with dark theme

#### **Advanced User Management**

- **Search & Filter** - Real-time search by name/email with role filtering
- **User Statistics** - Dynamic user counts by role (Admin/Regular users)
- **Role Management** - Promote/demote users between user and admin roles
- **Account Control** - Delete user accounts with comprehensive data removal
- **Self-Protection** - Admins cannot modify their own accounts
- **Activity Tracking** - User registration and update timestamps

### 🎨 **Modern User Interface**

#### **Dark Theme Design**

- **Consistent Dark Mode** - Beautiful black theme with blue accents throughout
- **Gradient Backgrounds** - Modern gradient overlays and textures
- **Responsive Design** - Perfect display on all devices and screen sizes
- **Professional Navigation** - Role-based navigation with smooth transitions

#### **Enhanced UX Features**

- **Slide-up Animations** - Smooth text animations on About and Contact pages
- **Interactive Elements** - Hover effects, scale transforms, and smooth transitions
- **Form Validation** - Real-time validation with user-friendly error messages
- **Loading States** - Visual feedback during form submissions and API calls
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support

### 📱 **Page-Specific Features**

#### **Homepage**

- **Hero Section** - Engaging landing page with feature showcase
- **Feature Cards** - Interactive cards highlighting system capabilities
- **ShieldBot Integration** - AI chatbot card (currently disabled but UI ready)
- **Call-to-Action** - Beautiful gradient buttons for user engagement
- **Professional Footer** - Complete site navigation and social links

#### **Authentication Pages**

- **Modern Login/Register** - Purple-blue gradient themes with pattern backgrounds
- **Email Verification** - 6-digit code input with individual digit fields
- **Password Management** - Secure password change and reset workflows
- **Forgot Password** - Email-based password recovery system
- **Alert Messages** - "Check Spam Section" alerts for email verification

#### **User Dashboard**

- **Profile Management** - Complete user profile with picture upload
- **Settings Panel** - User preferences and account settings
- **Activity Overview** - User activity and account information
- **Change Password** - Secure password update functionality

#### **Admin Interface**

- **Dashboard Analytics** - User statistics and system metrics
- **User Management** - Advanced search, filtering, and user control
- **Role Administration** - User role management and permissions
- **System Monitoring** - Real-time system health and activity

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Configuration (Required)
DATABASE_URL="postgresql://postgres:password@localhost:5433/authapp"

# Authentication Secret (Required)
AUTH_SECRET="your-super-secret-auth-key-here"

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Environment
NODE_ENV="development"
```

**Important Notes:**

- Uses **PostgreSQL only** - no SQLite fallback
- Custom port `5433` to avoid conflicts
- Generate secure AUTH_SECRET: `openssl rand -base64 32`
- OAuth credentials are optional

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── Button.svelte
│   │   ├── Card.svelte
│   │   ├── Input.svelte
│   │   └── Notification.svelte
│   ├── server/              # Server-side utilities
│   │   ├── auth.ts          # Auth.js configuration
│   │   ├── db/              # Database schema and connection
│   │   ├── email.ts         # Email service
│   │   └── security.ts      # Security utilities
│   └── stores/              # Svelte stores
├── routes/                  # Application routes
│   ├── api/                 # API endpoints
│   ├── admin/               # Admin-only pages
│   ├── auth/                # Authentication pages
│   └── (pages)/             # Public and protected pages
└── static/                  # Static assets
```

## 🚀 Quick Start

### 1. **Clone and Install**

```bash
git clone <repository-url>
cd ShieldAuth
npm install
```

### 2. **Database Setup**

```bash
# Start PostgreSQL (custom port 5433)
npm run db:up

# Push database schema
npm run db:push
```

### 3. **Environment Configuration**

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. **Start Development**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your application!

## 👑 Admin Features

### **Getting Admin Access**

```bash
npm run promote-admin your-email@example.com
```

### **Admin Capabilities**

- **Dashboard**: `/admin` - System analytics and overview
- **User Management**: `/admin/users` - Advanced user administration
- **Search & Filter**: Real-time user search by name/email
- **Role Management**: Promote/demote users between roles
- **Account Control**: Delete user accounts with full data removal
- **Statistics**: Dynamic user counts and activity metrics

## 🔗 OAuth Integration

### **Supported Providers**

- **Google OAuth** - Sign in with Google account
- **GitHub OAuth** - Sign in with GitHub account
- **Email/Password** - Traditional authentication

### **OAuth Features**

- **Seamless Integration** - One-click social authentication
- **Account Linking** - OAuth accounts linked to email accounts
- **Profile Sync** - Automatic name and picture sync from providers
- **Flexible Authentication** - Multiple authentication methods per user

## 📱 Application Routes

### **Public Routes**

- `/` - Homepage with feature showcase
- `/about` - About page with slide-up animations
- `/contact` - Contact page with modern UI
- `/register` - User registration with email verification
- `/login` - User login with OAuth options

### **Authentication Routes**

- `/verify-code` - Email verification with 6-digit codes
- `/forgot-password` - Password recovery request
- `/reset-password-code` - Password reset code entry
- `/reset-password` - New password creation
- `/change-password-code` - Password change verification
- `/change-password` - Password update

### **Protected Routes**

- `/dashboard` - User dashboard with profile overview
- `/profile` - Profile management with picture upload
- `/change-password` - Secure password change

### **Admin Routes**

- `/admin` - Admin dashboard with analytics
- `/admin/users` - User management with search/filter

### **API Endpoints**

- `/api/auth/*` - Authentication endpoints
- `/api/profile/*` - Profile management
- `/api/admin/users/*` - Admin user management

## 🛠️ Development Scripts

### **Development**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type checking and linting
```

### **Database Management**

```bash
npm run db:up        # Start PostgreSQL database
npm run db:down      # Stop PostgreSQL database
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio
npm run seed         # Seed database with sample data
```

### **Admin Tools**

```bash
npm run promote-admin <email>  # Promote user to admin role
```

## 🎯 Key Features Breakdown

### **Authentication Flow**

1. **Registration** → Email verification → Account activation
2. **Login** → Database session creation → Protected access
3. **Password Reset** → Email code → New password creation
4. **OAuth Login** → Provider authentication → Account linking

### **Admin Workflow**

1. **User Search** → Real-time filtering → Role management
2. **Account Control** → User deletion → Complete data removal
3. **Analytics** → User statistics → System monitoring
4. **Security** → Self-protection → Audit trail

### **UI/UX Features**

1. **Dark Theme** → Consistent black theme with blue accents
2. **Animations** → Slide-up text animations and smooth transitions
3. **Responsive** → Perfect display on all devices
4. **Accessibility** → ARIA labels and keyboard navigation

## 🔒 Security Implementation

### **Session Management**

- **Database Sessions** - Server-side session storage
- **30-day Expiration** - Automatic session cleanup
- **Secure Cookies** - HttpOnly, Secure, SameSite attributes
- **CSRF Protection** - Built-in cross-site request forgery protection

### **Password Security**

- **Bcrypt Hashing** - Industry-standard password encryption
- **Salt Rounds** - Configurable encryption strength
- **Password Validation** - Strong password requirements
- **Secure Reset** - Email-based password recovery

### **Input Validation**

- **Server-side Validation** - All inputs validated on server
- **Type Safety** - TypeScript implementation throughout
- **SQL Injection Protection** - Drizzle ORM parameterized queries
- **XSS Protection** - Input sanitization and output encoding

## 🚀 Deployment

### **Production Checklist**

- ✅ Set `NODE_ENV=production`
- ✅ Configure production database URL
- ✅ Set secure `AUTH_SECRET`
- ✅ Enable SSL for database connections
- ✅ Configure reverse proxy
- ✅ Set up monitoring and logging

### **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.full.yml up -d
```

## 📊 Performance Optimizations

### **Frontend**

- **Code Splitting** - Automatic bundle optimization
- **Component Library** - Reusable, optimized components
- **TailwindCSS Purging** - Optimized CSS for production
- **Image Optimization** - Compressed and optimized assets

### **Backend**

- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Optimized database queries
- **Caching** - Strategic caching implementation
- **Error Handling** - Graceful error management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Auth.js](https://authjs.dev/) - Authentication for the web
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - Advanced open source database

---

**ShieldAuth** - Built with ❤️ using modern web technologies for secure, scalable authentication.
