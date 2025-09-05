# BizFundraiser - Investment Crowdfunding Platform

A full-stack investment crowdfunding platform built with React, NestJS, and PostgreSQL. This platform connects investors with promising businesses seeking funding, providing a secure and transparent investment experience.

## 🚀 Features

### For Investors
- **User Registration & KYC**: Complete profile setup with identity verification
- **Wallet Management**: Deposit, withdraw, and track funds
- **Project Discovery**: Browse and filter available investment opportunities
- **Investment Tracking**: Monitor active investments and expected returns
- **Dashboard**: Comprehensive overview of portfolio performance

### For Businesses
- **Business Profile**: Complete business information and document upload
- **Project Submission**: Create and submit funding requests
- **Project Management**: Track funding progress and investor engagement
- **Documentation**: Upload supporting documents and business plans

### For Administrators
- **Project Approval**: Review and approve/reject funding requests
- **User Management**: Monitor user activity and KYC status
- **Platform Analytics**: Track platform performance and metrics
- **Commission Management**: Control platform fees and revenue

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management

### Backend
- **NestJS** with TypeScript
- **Prisma ORM** for database management
- **PostgreSQL** as the primary database
- **JWT** for authentication
- **Swagger** for API documentation

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bizfundraiser
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Initialize the database**
   ```bash
   # Run database migrations
   docker-compose exec backend npx prisma migrate dev

   # Seed the database with sample data
   docker-compose exec backend npm run prisma:seed
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb bizfundraiser
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the backend server**
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Demo Accounts

The seeded database includes demo accounts for testing:

### Admin Account
- **Email**: admin@bizfundraiser.com
- **Password**: admin123
- **Role**: Administrator

### Investor Accounts
- **Email**: investor1@example.com
- **Password**: investor123
- **Role**: Investor

### Business Accounts
- **Email**: business1@example.com
- **Password**: business123
- **Role**: Business

## 📁 Project Structure

```
bizfundraiser/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── wallets/        # Wallet operations
│   │   ├── projects/       # Project management
│   │   ├── investments/    # Investment logic
│   │   ├── admin/          # Admin functions
│   │   └── prisma/         # Database service
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── hooks/          # Custom hooks
│   └── Dockerfile
├── docker-compose.yml      # Docker configuration
└── README.md
```

## 🗄 Database Schema

The application uses the following main entities:

- **Users**: Investors, businesses, and administrators
- **Wallets**: User balance and transaction history
- **Projects**: Business funding requests
- **Investments**: Investor commitments to projects
- **Transactions**: All financial operations
- **Commissions**: Platform revenue tracking

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Projects
- `GET /projects` - List all projects
- `GET /projects/:id` - Get project details
- `POST /projects` - Create new project (Business)
- `PUT /projects/:id` - Update project (Business)
- `DELETE /projects/:id` - Delete project (Business)

### Investments
- `GET /investments` - Get user investments
- `POST /investments` - Create new investment
- `GET /investments/:id` - Get investment details

### Wallets
- `GET /wallets` - Get wallet information
- `POST /wallets/deposit` - Deposit funds
- `POST /wallets/withdraw` - Withdraw funds
- `GET /wallets/transactions` - Get transaction history

### Admin
- `GET /admin/dashboard` - Admin dashboard stats
- `GET /admin/pending` - Pending projects
- `PUT /projects/:id/approve` - Approve/reject project

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and push Docker images** to your registry
3. **Deploy using Docker Compose** or orchestration platform
4. **Set up reverse proxy** (nginx) for SSL termination
5. **Configure database backups** and monitoring

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bizfundraiser
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 Development

### Adding New Features

1. **Backend**: Create new modules following NestJS patterns
2. **Frontend**: Add new pages/components with proper TypeScript types
3. **Database**: Update Prisma schema and run migrations
4. **API**: Document new endpoints with Swagger decorators

### Code Style

- **Backend**: Follow NestJS conventions and TypeScript best practices
- **Frontend**: Use React hooks, TypeScript, and TailwindCSS
- **Database**: Use Prisma for all database operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the code comments and documentation

## 🔮 Future Enhancements

- **Payment Integration**: Real payment gateway integration
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting and insights
- **Notification System**: Real-time notifications
- **Escrow Management**: Automated escrow handling
- **Compliance**: Enhanced regulatory compliance features