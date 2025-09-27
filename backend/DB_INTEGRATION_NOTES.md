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

Environment variables: see .env.example for MONGODB_URI/PORT/HOST.

Validation:
- Validators in src/models/availability.js can be replaced by Mongoose schemas or zod/yup schemas validated in controllers.

Migration Plan:
- Introduce adapters (repository pattern) to swap in DB without changing controllers/routes.
