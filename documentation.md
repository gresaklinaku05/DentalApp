# ClinicApp - Comprehensive Technical Documentation

## 1. Project Overview

### 1.1 What the App Does
ClinicApp is a full-stack dental clinic management system designed to streamline patient records, appointment scheduling, doctor management, and audit logging. The application enables clinic staff to manage patient information, schedule appointments with doctors, track patient medical history, and maintain a comprehensive audit trail of all system activities.

**Target Users:**
- **Admin**: Full system access including user management, doctor management, and audit log viewing
- **Doctor**: Can view and manage patient history records for their own appointments
- **Staff**: Can manage patients and appointments but cannot access audit logs or manage doctors

### 1.2 Main Technologies

**Frontend:**
- **React 18.3.1** - UI framework
- **Vite 5.4.8** - Build tool and dev server
- **React Router DOM 6.26.2** - Client-side routing
- **Axios 1.7.7** - HTTP client with JWT token management
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **React Hook Form 7.53.0** - Form state management
- **Yup 1.4.0** - Schema validation
- **Recharts 2.12.7** - Data visualization for analytics
- **React Toastify 10.0.6** - Toast notifications

**Backend:**
- **Node.js / Express 4.19.2** - REST API framework
- **Sequelize 6.37.3** - ORM for database operations
- **MySQL 8.0** - Relational database
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **Joi 17.13.3** - Input validation
- **CORS 2.8.5** - Cross-origin request handling
- **Dotenv 16.4.5** - Environment variables

---

## 2. Architecture

### 2.1 System Design Overview

ClinicApp follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────┐
│         Frontend (React + Vite)                 │
│  - Components, Pages, Context API, Routing      │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST
                     │ (Axios with JWT)
┌────────────────────▼────────────────────────────┐
│      Backend (Express.js)                       │
│  - Routes, Controllers, Middleware, Validators  │
└────────────────────┬────────────────────────────┘
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────┐
│      MySQL Database                             │
│  - Users, Patients, Doctors, Appointments, etc. │
└─────────────────────────────────────────────────┘
```

### 2.2 Frontend-Backend Communication

**HTTP Methods & Endpoints:**

| Resource | Method | Endpoint | Auth | Role |
|----------|--------|----------|------|------|
| **Auth** |
| Register | POST | `/api/auth/register` | No | Public |
| Login | POST | `/api/auth/login` | No | Public |
| Refresh Token | POST | `/api/auth/refresh-token` | No | Public |
| Logout | POST | `/api/auth/logout` | Yes | Authenticated |
| **Patients** |
| List | GET | `/api/patients` | Yes | All |
| Create | POST | `/api/patients` | Yes | Admin |
| Update | PUT | `/api/patients/:id` | Yes | Admin |
| Delete | DELETE | `/api/patients/:id` | Yes | Admin |
| **Appointments** |
| List | GET | `/api/appointments` | Yes | Admin/Staff |
| Create | POST | `/api/appointments` | Yes | Admin/Staff |
| Update | PUT | `/api/appointments/:id` | Yes | Admin/Staff |
| Delete | DELETE | `/api/appointments/:id` | Yes | Admin/Staff |
| **Doctors** |
| List | GET | `/api/doctors` | Yes | Admin/Staff/Doctor |
| Create | POST | `/api/doctors` | Yes | Admin |
| Update | PUT | `/api/doctors/:id` | Yes | Admin |
| Delete | DELETE | `/api/doctors/:id` | Yes | Admin |
| **Patient History** |
| List | GET | `/api/patient-history` | Yes | Admin/Doctor |
| Create | POST | `/api/patient-history` | Yes | Admin/Doctor |
| Update | PUT | `/api/patient-history/:id` | Yes | Admin/Doctor |
| Delete | DELETE | `/api/patient-history/:id` | Yes | Admin/Doctor |
| **Dashboard** |
| Overview | GET | `/api/dashboard/overview` | Yes | All |
| Analytics | GET | `/api/dashboard/analytics` | Yes | All |
| **Audit Logs** |
| List | GET | `/api/audit-logs` | Yes | Admin |

### 2.3 Folder Structure

**Backend Structure:**
```
backend/
├── config/
│   └── config.js                 # Database configuration for migrations
├── migrations/
│   ├── 20260324170000-init-clinic-schema.js    # Initial schema creation
│   └── 20260324173000-alter-user-role-enum.js  # Add doctor role
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   └── database.js           # Sequelize database instance
│   ├── models/
│   │   ├── index.js              # Model initialization & relationships
│   │   ├── User.js               # User model (admin/doctor/staff)
│   │   ├── Patient.js            # Patient data model
│   │   ├── Doctor.js             # Doctor information model
│   │   ├── Appointment.js        # Appointment scheduling model
│   │   ├── PatientHistory.js     # Medical history records
│   │   ├── RefreshToken.js       # Token management
│   │   └── AuditLog.js           # Audit trail model
│   ├── controllers/
│   │   ├── authController.js     # Login, register, token refresh
│   │   ├── patientController.js  # Patient CRUD operations
│   │   ├── appointmentController.js  # Appointment management
│   │   ├── doctorController.js   # Doctor management
│   │   ├── patientHistoryController.js  # Medical history management
│   │   ├── dashboardController.js      # Analytics data
│   │   └── auditLogController.js       # Audit log retrieval
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── patientRoutes.js      # Patient endpoints
│   │   ├── appointmentRoutes.js  # Appointment endpoints
│   │   ├── doctorRoutes.js       # Doctor endpoints
│   │   ├── patientHistoryRoutes.js  # Medical history endpoints
│   │   ├── dashboardRoutes.js    # Dashboard endpoints
│   │   └── auditLogRoutes.js     # Audit log endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── authorizeMiddleware.js # Role-based access control
│   │   ├── validateMiddleware.js # Input validation (Joi)
│   │   └── errorMiddleware.js    # Error handling
│   ├── utils/
│   │   ├── tokens.js             # JWT signing & hashing
│   │   └── audit.js              # Audit logging helper
│   ├── validators/
│   │   └── schemas.js            # Joi validation schemas
│   └── seeders/
│       └── seed.js               # Database seeding
└── package.json
```

**Frontend Structure:**
```
frontend/
├── public/                       # Static assets
├── src/
│   ├── App.jsx                   # Main app routing
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles
│   ├── api/
│   │   └── api.js                # Axios instance with interceptors
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.jsx    # Route protection wrapper
│   │   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   │   └── StatCard.jsx          # Dashboard stat display
│   │   └── layout/
│   │       ├── DashboardLayout.jsx   # Main dashboard layout
│   │       └── Sidebar.jsx           # Navigation sidebar
│   ├── context/
│   │   ├── AuthContext.jsx       # Auth state management
│   │   └── useAuth.js            # Auth context hook
│   ├── pages/
│   │   ├── LoginPage.jsx         # Login/authentication
│   │   ├── RegisterPage.jsx      # User registration
│   │   ├── DashboardPage.jsx     # Dashboard overview
│   │   ├── PatientsPage.jsx      # Patient management
│   │   ├── AppointmentsPage.jsx  # Appointment management
│   │   ├── DoctorsPage.jsx       # Doctor management
│   │   ├── PatientHistoryPage.jsx    # Medical history
│   │   └── AuditLogsPage.jsx     # Audit log viewer
│   └── utils/
│       └── formatDate.js         # Date formatting utilities
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── package.json
```

---

## 3. Authentication & Token Management

### 3.1 JWT & Refresh Token Architecture

ClinicApp uses a **dual-token system**:

**Access Token (Short-lived):**
- **Type**: JWT (JSON Web Token)
- **Expiration**: 15 minutes (default)
- **Storage**: Memory (in-app variable)
- **Usage**: Attached to `Authorization` header as `Bearer <token>`
- **Payload**: `{ id, email, role, name }`

**Refresh Token (Long-lived):**
- **Type**: JWT  
- **Expiration**: 7 days (default)
- **Storage**: HttpOnly cookie (`refreshToken`)
- **Database Storage**: Hashed in `refresh_tokens` table
- **Payload**: `{ id }`
- **Security**: Token hash stored, not plain token

### 3.2 Token Generation

**File:** [backend/src/utils/tokens.js](backend/src/utils/tokens.js)

```javascript
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
```

### 3.3 Login Flow

**File:** [backend/src/controllers/authController.js](backend/src/controllers/authController.js)

**Step-by-step process:**

1. **Validation**: Email and password required
2. **User Lookup**: Find user by email
3. **Password Verification**: Compare with bcryptjs
4. **Token Generation**: 
   - Create access token with user payload
   - Create refresh token with user ID
   - Hash refresh token for DB storage
5. **DB Storage**: Save token hash with expiration
6. **Cookie Setting**: Set `refreshToken` as HttpOnly cookie
7. **Response**: Return access token & user info

**Example Login Request:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@clinic.com",
  "password": "securePassword123"
}

// Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@clinic.com",
    "role": "admin"
  }
}
```

### 3.4 Token Refresh & Validation

**File:** [backend/src/controllers/authController.js](backend/src/controllers/authController.js)

**Automatic Token Refresh:**
1. Client receives 401 on expired access token
2. Frontend intercepts 401 and calls `/api/auth/refresh-token`
3. Backend validates refresh token cookie
4. Verifies token hash in DB and expiration
5. Issues new access token
6. Rotates refresh token (old one destroyed, new one issued)
7. Returns new access token

**File:** [backend/src/middleware/authMiddleware.js](backend/src/middleware/authMiddleware.js)

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
```

### 3.5 Frontend Token Management

**File:** [frontend/src/api/api.js](frontend/src/api/api.js)

**Request Interceptor:**
- Attaches access token to every request header

**Response Interceptor:**
- Detects 401 responses
- Automatically calls refresh endpoint
- Updates token and retries request
- On refresh failure, logs user out

**Implementation:**
```javascript
// Request interceptor
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token call (with credentials for cookie)
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        setAccessToken(refreshResponse.data.accessToken);
        originalRequest.headers.Authorization = 
          `Bearer ${refreshResponse.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        onRefreshFailed(); // Logout
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

### 3.6 RefreshToken Model

**File:** [backend/src/models/RefreshToken.js](backend/src/models/RefreshToken.js)

```javascript
const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tokenHash: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false,
      references: { model: "users", key: "id" }, onDelete: "CASCADE" }
  },
  { tableName: "refresh_tokens", timestamps: true }
);
```

---

## 4. Backend-Frontend Integration

### 4.1 Authentication Context

**File:** [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)

The `AuthContext` manages global authentication state:

**State Management:**
- `user`: Current authenticated user object
- `loading`: Initial auth check in progress
- `isAuthenticated`: Boolean for login status
- `isAdmin`, `isDoctor`, `isStaff`: Role checks

**Methods:**
- `login(email, password)`: Authenticate user
- `register(name, email, password)`: Create new account
- `logout()`: Terminate session

**LocalStorage Persistence:**
- User data saved as `clinicUser`
- Restored on page reload
- Auto-refresh token on app initialization

```javascript
const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  setAccessToken(response.data.accessToken);
  setUser(response.data.user);
  localStorage.setItem("clinicUser", JSON.stringify(response.data.user));
};
```

### 4.2 API Data Flow Examples

**Example 1: Fetching Patients**
```javascript
// Frontend (PatientsPage.jsx)
const fetchPatients = async () => {
  const response = await api.get("/patients");
  setPatients(response.data);
};

// Request flow:
// 1. GET /api/patients
// 2. Interceptor adds: Authorization: Bearer <accessToken>
// 3. Backend authenticates & authorizes
// 4. Database query returns patient list
// 5. Response sent to frontend

// Backend (patientController.js)
const getPatients = async (req, res, next) => {
  const patients = await Patient.findAll();
  return res.json(patients);
};
```

**Example 2: Creating an Appointment**
```javascript
// Frontend request
const createAppointment = async (appointmentData) => {
  return api.post("/appointments", {
    patientId: 5,
    doctorId: 2,
    appointmentDate: "2026-04-15T10:00:00Z",
    reason: "Dental cleaning",
    status: "scheduled"
  });
};

// Backend processing (appointmentController.js)
const createAppointment = async (req, res, next) => {
  // Validate patient & doctor exist
  const patient = await Patient.findByPk(req.body.patientId);
  const doctor = await Doctor.findByPk(req.body.doctorId);
  
  // Create appointment
  const appointment = await Appointment.create(req.body);
  
  // Log audit trail
  await logAudit({
    userId: req.user.id,
    action: "CREATE",
    entity: "Appointment",
    entityId: appointment.id
  });
  
  return res.status(201).json(appointment);
};

// Response includes created appointment with timestamps
```

**Example 3: Medical History Access Control**

```javascript
// Backend (patientHistoryController.js)
const doctorFilter = async (req) => {
  // Non-doctor users see all records
  if (req.user.role !== "doctor") return {};
  
  // Doctors only see their own records
  const doctor = await Doctor.findOne({ where: { email: req.user.email } });
  return { doctorId: doctor.id };
};

const getHistory = async (req, res, next) => {
  const where = await doctorFilter(req);
  const records = await PatientHistory.findAll({ where });
  res.json(records);
};
```

### 4.3 Error Handling

**Backend Error Flow:**
```javascript
// Error middleware catches all errors
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error"
  });
};

// Controllers pass errors to middleware
const createPatient = async (req, res, next) => {
  try {
    if (!fullName || !phone) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    // ... create patient
  } catch (error) {
    next(error); // Passed to error middleware
  }
};
```

**Frontend Error Handling:**
```javascript
// Axios interceptors handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token refresh or logout
    } else if (error.response?.status === 403) {
      // Permission denied
    } else if (error.response?.status === 404) {
      // Not found
    }
    return Promise.reject(error);
  }
);

// Component error handling
try {
  await createAppointment(data);
  showSuccessToast("Appointment created");
} catch (error) {
  showErrorToast(error.response?.data?.message || "Failed to create");
}
```

---

## 5. Security Architecture

### 5.1 Authentication Mechanisms

**JWT-Based Authentication:**
- Access tokens validated on every protected route
- Refresh tokens rotated on use (old deleted, new issued)
- Token hashes stored in DB, not plain tokens

**Password Security:**
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never transmitted in plain text (HTTPS in production)
- Strong password validation (minimum 6 characters)

**Session Management:**
- Refresh tokens stored as HttpOnly cookies (cannot be accessed via JavaScript)
- `sameSite: "lax"` prevents CSRF attacks
- Cookies scoped to `/api/auth/refresh-token` path

### 5.2 Authorization (Role-Based Access Control)

**File:** [backend/src/middleware/authorizeMiddleware.js](backend/src/middleware/authorizeMiddleware.js)

Three roles with different permissions:

**Admin:**
- Create/update/delete patients
- Create/update/delete doctors
- Create/update/delete appointments
- View audit logs
- All staff permissions

**Doctor:**
- View doctors list
- Create/update/delete own medical records
- View patient history (own records only)
- View appointments
- Dashboard access

**Staff:**
- View all patients & appointments
- Create/update/delete appointments
- View dashboard
- No doctor management
- No audit log access

**Route Protection Example:**
```javascript
// Only admin can delete patients
router.delete("/:id", authorize("admin"), deletePatient);

// Admin and staff can manage appointments
router.post("/", authorize("admin", "staff"), createAppointment);

// Doctors can view but not create records
router.get("/", authorize("admin", "doctor"), getDoctors);
```

### 5.3 Data Protection

**Input Validation:**
- Joi schemas validate all incoming data
- Type checking, required fields, format validation
- Protection against injection attacks

**File:** [backend/src/validators/schemas.js](backend/src/validators/schemas.js)

```javascript
const patientSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow("", null),
  dateOfBirth: Joi.date().iso().allow(null, "")
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(d => d.message)
    });
  }
  req.body = value;
  return next();
};
```

### 5.4 HTTPS & CORS Configuration

**CORS Setup:**
```javascript
// app.js
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true  // Allow cookies in cross-origin requests
}));
```

**In Production:**
- Set `process.env.CLIENT_URL` to frontend domain
- Set `secure: true` for refresh token cookies
- Use HTTPS only

**Cookie Security:**
```javascript
const refreshCookieOptions = {
  httpOnly: true,           // Prevent XSS access
  secure: process.env.NODE_ENV === "production",  // HTTPS only
  sameSite: "lax"          // CSRF protection
};
```

### 5.5 Attack Prevention Strategies

| Attack | Prevention |
|--------|-----------|
| **XSS (Cross-Site Scripting)** | HttpOnly cookies, React escaping, input validation |
| **CSRF (Cross-Site Request Forgery)** | SameSite cookie, CORS policy |
| **SQL Injection** | Sequelize ORM parameterized queries |
| **Brute Force** | Token expiration, refresh token rotation |
| **Token Theft** | HttpOnly storage, short expiration, rotation |
| **Unauthorized Access** | JWT validation, role-based authorization |
| **Data Tampering** | Token signature verification, input validation |

### 5.6 Audit Logging

**File:** [backend/src/utils/audit.js](backend/src/utils/audit.js)

Every data modification logged:
```javascript
const logAudit = async ({ userId, action, entity, entityId = null }) => {
  await AuditLog.create({ userId, action, entity, entityId, timestamp: now });
};
```

**Tracked Actions:**
- REGISTER, LOGIN, LOGOUT
- CREATE, UPDATE, DELETE (for patients, doctors, appointments, etc.)

**Audit Log Retrieval:**
- Filtered by entity type, action, user, date range
- Pagination support (20 records per page)
- Admin-only access

**File:** [backend/src/controllers/auditLogController.js](backend/src/controllers/auditLogController.js)

---

## 6. Features & Functionality

### 6.1 User Management

**Registration & Login:**
- New users register with name, email, password
- Default role: admin
- Passwords hashed with bcryptjs
- JWT-based session management

**Roles & Permissions:**
| Feature | Admin | Doctor | Staff |
|---------|-------|--------|-------|
| Register/Login | ✓ | ✓ | ✓ |
| View Patients | ✓ | ✓ | ✓ |
| Manage Patients | ✓ | - | - |
| View Doctors | ✓ | ✓ | ✓ |
| Manage Doctors | ✓ | - | - |
| Manage Appointments | ✓ | - | ✓ |
| View Own History | - | ✓ | - |
| Manage Patient History | ✓ | ✓ | - |
| View Audit Logs | ✓ | - | - |
| Dashboard | ✓ | ✓ | ✓ |

### 6.2 Patient Management

**Patient Information Tracked:**
- Full name
- Phone number
- Email (optional)
- Address
- Date of birth
- Medical notes

**Operations:**
- **Create**: Admin only, validates required fields
- **Read**: All authenticated users
- **Update**: Admin only
- **Delete**: Admin only, cascades to appointments/history

**File:** [backend/src/models/Patient.js](backend/src/models/Patient.js)

### 6.3 Doctor Management

**Doctor Information:**
- Full name
- Email (unique)
- Phone number
- Specialty

**Operations:**
- **Create/Update/Delete**: Admin only
- **View**: All authenticated users
- Used for appointment assignment
- Restricts patient history to assigned records

**File:** [backend/src/models/Doctor.js](backend/src/models/Doctor.js)

### 6.4 Appointment Scheduling

**Appointment Data:**
- Patient reference
- Doctor assignment
- Appointment date & time
- Reason for visit
- Status: scheduled / completed / cancelled
- Additional notes

**Operations:**
- **Create/Update/Delete**: Admin & Staff
- **View**: All authenticated users
- Validates patient & doctor existence
- Prevents orphaned records

**File:** [backend/src/models/Appointment.js](backend/src/models/Appointment.js)

### 6.5 Patient Medical History

**History Record:**
- Patient & Doctor
- Visit date
- Diagnosis
- Treatment provided
- Medical notes

**Role-Based Access:**
- **Admin**: Full CRUD
- **Doctor**: Can only manage own records
- **Staff**: No access

**Authorization Check:**
```javascript
if (req.user.role === "doctor" && record.doctor?.email !== req.user.email) {
  return res.status(403).json({ message: "Cannot modify other doctors' history" });
}
```

**File:** [backend/src/models/PatientHistory.js](backend/src/models/PatientHistory.js)

### 6.6 Dashboard & Analytics

**Overview Section:**
- Total patients count
- Total appointments count

**Analytics:**
- **Patients per Doctor**: Distinct patient count per doctor
- **Appointments per Month**: Trend over time
- **Appointments by Status**: Breakdown of scheduled/completed/cancelled

**Database Queries:**
```javascript
// Patients per doctor with aggregation
const patientsPerDoctor = await Doctor.findAll({
  attributes: [
    "id", "fullName",
    [fn("COUNT", literal("DISTINCT appointments.patientId")), "totalPatients"]
  ],
  include: [{ model: Appointment, as: "appointments" }],
  group: ["Doctor.id"]
});
```

**File:** [backend/src/controllers/dashboardController.js](backend/src/controllers/dashboardController.js)

### 6.7 Audit Logging

**Logged Information:**
- User performing action
- Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
- Entity type (Patient, Doctor, Appointment, etc.)
- Entity ID (which record was modified)
- Timestamp

**Query Capabilities:**
- Filter by entity type
- Filter by action
- Filter by user
- Date range filtering
- Pagination support

**Access**: Admin only

**File:** [backend/src/controllers/auditLogController.js](backend/src/controllers/auditLogController.js)

---

## 7. Setup & Running Instructions

### 7.1 Prerequisites

- **Node.js** 16+ and npm
- **MySQL** 8.0+
- **Git** for version control

### 7.2 Environment Variables

**Backend (.env file in `/backend`):**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clinic_db
DB_USER=root
DB_PASSWORD=yourPassword

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Token Expiration
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend (.env file in `/frontend`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 7.3 Installation Steps

**1. Clone Repository:**
```bash
git clone <repository-url>
cd ClinicApp
```

**2. Create MySQL Database:**
```bash
mysql -u root -p
CREATE DATABASE clinic_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**3. Backend Setup:**
```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# (Optional) Seed sample data
npm run seed
```

**4. Frontend Setup:**
```bash
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env
```

**5. Start Development Servers:**

**Option A - Individual terminals:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Option B - Concurrent (from root):**
```bash
npm run start:all
# Starts backend & frontend together
```

**Stop Ports:**
```bash
npm run stop:ports
# Kills processes on ports 5000, 5173
```

### 7.4 Default Test Credentials

After seeding, test with:
```
Email: admin@clinic.com
Password: password123
Role: admin
```

### 7.5 Building for Production

**Frontend Build:**
```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder
npm run preview  # Preview production build locally
```

**Backend Production:**
```bash
cd backend
npm run migrate  # Ensure latest migrations
NODE_ENV=production npm start
```

---

## 8. Database Schema

### 8.1 Entity Relationship Diagram

```
users (1) ──→ (many) refresh_tokens
  │
  └──→ (many) audit_logs

patients (1) ──→ (many) appointments
patients (1) ──→ (many) patient_history

doctors (1) ──→ (many) appointments
doctors (1) ──→ (many) patient_history

appointments
  - Links patients to doctors
  - Tracks visit scheduling

patient_history
  - Medical records per patient
  - Linked to treating doctor
```

### 8.2 Database Tables

**users**
- `id` (PK, INT, AUTO_INCREMENT)
- `name` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - hashed
- `role` (ENUM: 'admin', 'doctor', 'staff', DEFAULT 'admin')
- `createdAt`, `updatedAt` (DATETIME)

**patients**
- `id` (PK, INT, AUTO_INCREMENT)
- `fullName` (VARCHAR(255), NOT NULL)
- `phone` (VARCHAR(20), NOT NULL)
- `email` (VARCHAR(255), NULL)
- `address` (TEXT, NULL)
- `dateOfBirth` (DATE, NULL)
- `medicalNotes` (TEXT, NULL)
- `createdAt`, `updatedAt` (DATETIME)

**doctors**
- `id` (PK, INT, AUTO_INCREMENT)
- `fullName` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `phone` (VARCHAR(20), NOT NULL)
- `specialty` (VARCHAR(255), NULL)
- `createdAt`, `updatedAt` (DATETIME)

**appointments**
- `id` (PK, INT, AUTO_INCREMENT)
- `patientId` (FK → patients.id, CASCADE)
- `doctorId` (FK → doctors.id, CASCADE)
- `appointmentDate` (DATETIME, NOT NULL)
- `reason` (VARCHAR(500), NULL)
- `status` (ENUM: 'scheduled', 'completed', 'cancelled', DEFAULT 'scheduled')
- `notes` (TEXT, NULL)
- `createdAt`, `updatedAt` (DATETIME)

**patient_history**
- `id` (PK, INT, AUTO_INCREMENT)
- `patientId` (FK → patients.id, CASCADE)
- `doctorId` (FK → doctors.id, CASCADE)
- `visitDate` (DATE, NOT NULL)
- `diagnosis` (TEXT, NULL)
- `treatment` (TEXT, NULL)
- `notes` (TEXT, NULL)
- `createdAt`, `updatedAt` (DATETIME)

**refresh_tokens**
- `id` (PK, INT, AUTO_INCREMENT)
- `tokenHash` (VARCHAR(255), UNIQUE, NOT NULL) - SHA256 hash
- `expiresAt` (DATETIME, NOT NULL)
- `userId` (FK → users.id, CASCADE)
- `createdAt`, `updatedAt` (DATETIME)

**audit_logs**
- `id` (PK, INT, AUTO_INCREMENT)
- `userId` (FK → users.id, CASCADE)
- `action` (ENUM: 'REGISTER', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE')
- `entity` (VARCHAR(50), NOT NULL) - e.g., 'Patient', 'Appointment'
- `entityId` (INT, NULL) - ID of affected record
- `timestamp` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

---

## 9. Additional Notes

### 9.1 Design Decisions

**Dual Token System:**
- Short-lived access tokens for API calls
- Long-lived refresh tokens for session persistence
- Refresh tokens stored as HttpOnly cookies for security
- Automatic token rotation prevents replay attacks

**Role-Based Access Control:**
- Three distinct roles with clear separation of concerns
- Doctors can only access their own patient records
- Audit logs restricted to administrators only

**Database Design:**
- Foreign key constraints ensure data integrity
- Cascade deletes prevent orphaned records
- Indexes on frequently queried columns (email, dates)
- Audit logging for compliance and debugging

**Frontend Architecture:**
- React Context for global state management
- Axios interceptors for automatic token handling
- Protected routes with role-based rendering
- Responsive design with Tailwind CSS

### 9.2 Known Limitations

**Current Limitations:**
- No email notifications for appointments
- No real-time updates (polling-based instead)
- No backup/restore functionality
- No multi-language support
- No advanced search/filtering beyond basic queries

**Performance Considerations:**
- No database query optimization for large datasets
- No caching layer implemented
- Frontend loads all data at once (no pagination for some lists)

### 9.3 Future Improvements

**Security Enhancements:**
- Implement rate limiting for API endpoints
- Add two-factor authentication (2FA)
- Implement password reset functionality
- Add session timeout warnings

**Feature Additions:**
- Email/SMS notifications for appointments
- Calendar view for appointments
- Patient portal for self-scheduling
- Medical imaging/document upload
- Advanced reporting and analytics
- Mobile app companion

**Technical Improvements:**
- Implement Redis for session caching
- Add comprehensive API testing with Jest/Supertest
- Database connection pooling
- Implement WebSocket for real-time updates
- Add comprehensive logging and monitoring
- Containerization with Docker

**Scalability:**
- Database sharding for large clinics
- CDN for static assets
- Load balancing for multiple servers
- Database read replicas

This documentation provides a comprehensive overview of the ClinicApp system. The application is well-architected with strong security practices, clear separation of concerns, and a user-friendly interface suitable for dental clinic operations.