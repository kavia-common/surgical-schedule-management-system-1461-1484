const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const resourcesRoutes = require('./routes/resources');
const schedulesRoutes = require('./routes/schedules');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    info: {
      ...swaggerSpec.info,
      title: 'Surgical Schedule Management API',
      description: 'REST and GraphQL endpoints for schedules, resources, conflicts, and device status',
      version: '1.0.0',
    },
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
    tags: [
      { name: 'Resources', description: 'Doctors, Nurses, Rooms, Devices' },
      { name: 'Schedules', description: 'Surgical schedules and conflicts' },
      { name: 'Meta', description: 'Health and documentation' },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Health route and base
app.use('/', routes);

// REST routes
app.use(resourcesRoutes);
app.use(schedulesRoutes);

// GraphQL endpoint (with GraphiQL enabled for exploration)
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(err.details ? { details: err.details } : {}),
  });
});

module.exports = app;
