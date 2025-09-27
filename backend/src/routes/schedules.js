'use strict';
const express = require('express');
const ctrl = require('../controllers/schedules');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Surgical schedule management
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: List schedules
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: List of schedules
 */
router.get('/api/schedules', ctrl.list.bind(ctrl));

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: allowConflicts
 *         schema: { type: boolean }
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflicts detected
 */
router.post('/api/schedules', ctrl.create.bind(ctrl));

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get schedule by id
 *     tags: [Schedules]
 */
router.get('/api/schedules/:id', ctrl.get.bind(ctrl));

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: allowConflicts
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *       409:
 *         description: Conflicts detected
 */
router.put('/api/schedules/:id', ctrl.update.bind(ctrl));

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete schedule
 *     tags: [Schedules]
 */
router.delete('/api/schedules/:id', ctrl.delete.bind(ctrl));

/**
 * @swagger
 * /api/schedules/conflicts:
 *   post:
 *     summary: Check conflicts for a candidate schedule
 *     tags: [Schedules]
 */
router.post('/api/schedules/conflicts', ctrl.conflicts.bind(ctrl));

/**
 * @swagger
 * /api/schedules/suggest:
 *   post:
 *     summary: Suggest next available time slot
 *     tags: [Schedules]
 */
router.post('/api/schedules/suggest', ctrl.suggest.bind(ctrl));

module.exports = router;
