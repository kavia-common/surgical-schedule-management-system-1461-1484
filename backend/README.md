# Surgical Schedule Management Backend

Express backend providing:
- REST endpoints for resources (doctors, nurses, rooms, devices)
- REST endpoints for schedules (CRUD), conflicts, and suggestions
- GraphQL endpoint for unified querying/mutations
- WebSocket server for real-time updates
- Swagger docs at /docs

Start:
- npm install
- npm run dev (development with hot reload) or npm start

Key Endpoints:
- GET / -> health
- GET /welcome -> meta info
- REST:
  - GET /api/resources/:type (doctors|nurses|rooms|devices)
  - GET /api/resources/:type/:id
  - POST /api/resources/:type
  - PUT /api/resources/:type/:id
  - DELETE /api/resources/:type/:id
  - PATCH /api/devices/:id/status
  - GET /api/schedules?status=&from=&to=
  - POST /api/schedules[?allowConflicts=true]
  - GET /api/schedules/:id
  - PUT /api/schedules/:id[?allowConflicts=true]
  - DELETE /api/schedules/:id
  - POST /api/schedules/conflicts
  - POST /api/schedules/suggest
- GraphQL:
  - POST /graphql (GraphiQL enabled)
- WebSocket:
  - ws://<host>/ws
  - /ws-info provides usage notes

Data:
- In-memory store with seed data. Replace with DB layer when integrating persistence.

Notes:
- Conflict detection checks time overlaps for rooms, doctor, nurses, and devices; validates device status.
- Suggestions iterate forward in 15-min steps within horizon for first conflict-free slot.
