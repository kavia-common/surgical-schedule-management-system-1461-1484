# Backend Database Integration Notes

This backend currently uses an in-memory data store (src/data/store.js) with seed data. To integrate a real database:

1) MongoDB Option (Mongoose)
- Install: npm i mongoose
- Create connection in src/data/db.js using process.env.MONGODB_URI
- Replace maps in src/data/store.js with Mongoose models:
  - Doctor, Nurse, Room, Device, ScheduleEvent, and separate Availability collections or embed availability arrays.
- Services:
  - Update resourcesService, scheduleService, availabilityService to use async DB methods.
- WebSocket/eventBus remain unchanged.

2) PostgreSQL Option (Prisma)
- Install: npm i @prisma/client; dev: npm i -D prisma
- Define schema.prisma models for resources, schedules, and availability windows.
- Generate client and replace service methods with Prisma client calls.

3) Microsoft SQL Server Option (mssql)
- Install: npm i mssql
- Configure environment variables (see .env.example: MSSQL_SERVER, MSSQL_DATABASE, MSSQL_USER, MSSQL_PASSWORD, MSSQL_PORT, MSSQL_ENCRYPT, MSSQL_TRUST_SERVER_CERTIFICATE)
- Connection utility at src/data/db.js provides getPool() and testConnection().
- Start-up test logs success/failure; service continues with in-memory store if DB is not configured.
- Next steps: Create repository layer (e.g., src/repositories/*.js) that uses the MSSQL pool to implement CRUD for resources, schedules, and availability, then swap services to use repositories.

Environment variables: see .env.example for HOST/PORT and DB settings.

Validation:
- Validators in src/models/availability.js can be replaced by Mongoose schemas or zod/yup schemas validated in controllers.

Migration Plan:
- Introduce adapters (repository pattern) to swap in DB without changing controllers/routes.
