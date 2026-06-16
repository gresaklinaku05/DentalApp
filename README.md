# DentalApp

Full-stack dental clinic management system (React + Node.js/Express + MySQL).

## Documentation

| Document | Description |
|----------|-------------|
| [documentation.md](documentation.md) | Technical architecture and setup |
| [TESTING_DOCUMENTATION.md](TESTING_DOCUMENTATION.md) | **Test Strategy & Test Plan**, **API Testing (Postman)**, **Bug Tracking (12+ defects)** |

## Quick Start

```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000/api  

## API Testing

Import `postman/DentalApp-API-Tests.postman_collection.json` into Postman and run the collection (8 automated test cases).

## Test Accounts (after seed)

- Admin: `admin@clinic.com` / `Admin@123`
- Doctor: `doctor@clinic.com` / `Doctor@123`
- Staff: `staff@clinic.com` / `Staff@123`
