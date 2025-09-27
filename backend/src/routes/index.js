const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * tags:
 *   name: Meta
 *   description: Service health and meta
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /welcome:
 *   get:
 *     summary: Welcome message
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: Welcome and pointers
 */
router.get('/welcome', (req, res) => {
  res.json({
    message: 'Surgical Schedule Management Backend',
    docs: '/docs',
    graphql: '/graphql',
    websocket: '/ws-info',
  });
});

module.exports = router;
