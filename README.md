# RMS Backend (Node/Express + TypeScript)

This is the backend for the POS / Restaurant Management System (RMS), built with Node.js, Express, and TypeScript. It uses TypeORM as the Object-Relational Mapper (ORM) for PostgreSQL, Yup for request validation, and Cloudinary for media uploads.

## Tech Stack
- **Runtime**: Node.js (with TypeScript)
- **Framework**: Express
- **ORM**: TypeORM
- **Database**: PostgreSQL (`pg` driver)
- **Validation**: Yup
- **File Upload**: Multer + Cloudinary SDK
- **Security**: Bcrypt (Password Hashing) + JSON Web Tokens (Authentication)

---

## Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts           # TypeORM AppDataSource connection setup
│   │   └── cloudinary.ts   # Cloudinary configurations & upload helper
│   ├── constants/
│   │   └── httpStatus.ts   # HttpStatus code constants
│   ├── errors/
│   │   ├── AppError.ts     # Base custom error class
│   │   ├── BadRequestError.ts
│   │   ├── NotFoundError.ts
│   │   └── InternalServerError.ts
│   ├── middleware/
│   │   ├── errorHandler.ts # Centralized global error handling
│   │   ├── requestLogger.ts# Request logger middleware
│   │   ├── requireAuth.ts  # JWT session authentication middleware
│   │   ├── restrictTo.ts   # Role-Based Access Control middleware
│   │   ├── upload.ts       # Multer middleware for memory storage image uploads
│   │   └── validate.ts     # Yup request schema validator
│   ├── modules/            # Domain-driven feature directories
│   │   ├── item/
│   │   │   ├── item.entity.ts
│   │   │   ├── item.types.ts
│   │   │   ├── item.repository.ts
│   │   │   ├── item.service.ts
│   │   │   ├── item.controller.ts
│   │   │   └── item.route.ts
│   │   ├── user/
│   │   │   ├── user.entity.ts # TypeORM User entity schema (hashed passwords & roles)
│   │   │   ├── user.types.ts  # Filtered user responses
│   │   │   └── user.repository.ts # User database queries
│   │   └── auth/
│   │       ├── auth.validation.ts # Login and registration Yup schemas
│   │       ├── auth.service.ts # Encryption, decryption, and token logic
│   │       ├── auth.controller.ts # Login/register routes handling
│   │       └── auth.route.ts  # Express auth endpoint paths
│   ├── utils/
│   │   ├── catchAsync.ts   # Wraps async controller routes to forward errors
│   │   ├── logger.ts       # Custom console log formatter
│   │   └── response.ts     # Standardized JSON response formatting
│   ├── app.ts              # Express App setup (cors, middlewares, routes)
│   └── index.ts            # Entrypoint (TypeORM startup, server listener, graceful shutdown)
├── .env.example
├── .env                    # Active local environment variables
├── package.json
└── tsconfig.json
```

---

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure your environment**:
   Edit the `.env` file created in your backend folder:
   ```env
   PORT=5000

   # PostgreSQL Connection
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=rms_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/rms_db

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Auth Credentials
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1d
   BCRYPT_SALT_ROUNDS=10
   ```

3. **Database Synchronization**:
   Ensure you have PostgreSQL running, and that the database configured in `DB_DATABASE` exists.
   In development (`NODE_ENV` !== `production`), TypeORM will automatically synchronize your entity schemas (`synchronize: true`) and create/update tables (`items` and `users`) when starting the server.

---

## Scripts

- **`npm run dev`**: Run the server in development mode with live reload (`tsx`).
- **`npm run build`**: Compile TypeScript files to JavaScript inside the `dist` directory.
- **`npm run start`**: Run the compiled JavaScript production server.

---

## API Endpoints

### 1. Health Check
- **GET** `/health`
- Verifies server status and database connectivity.

### 2. Authentication API
- **POST** `/api/auth/register`
  - Body: `{ name, email, password }`
  - Action: Validates parameters, hashes password, saves User to database, and issues a JWT token.
- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Action: Compares credentials using bcrypt, generates a JWT token if matches.
- **GET** `/api/auth/me` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Action: Verifies the session token and returns the current user profile.

### 3. Items API
- **GET** `/api/items`
  - Retrieves all items sorted by creation date.
- **POST** `/api/items` (Protected, example of upload)
  - Request format: `multipart/form-data`
  - Fields:
    - `name` (string, required, min 2 chars)
    - `price` (number, required, positive)
    - `image` (file upload, optional)
  - Action: Validates body, uploads image to Cloudinary, and saves item properties in the database.
