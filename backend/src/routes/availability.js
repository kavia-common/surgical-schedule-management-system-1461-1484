'use strict';
const express = require('express');
const ctrl = require('../controllers/availability');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Doctor and ICU room availability management and queries
 */

/**
 * @swagger
 * /api/availability/{type}/available:
 *   get:
 *     summary: List currently available doctors or rooms in the provided window
 *     description: Provide optional startISO and endISO. If omitted, uses current time (instant availability).
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [doctors, rooms]
 *       - in: query
 *         name: startISO
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endISO
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: List of available resources
 */
router.get('/api/availability/:type/available', ctrl.listAvailable.bind(ctrl));

/**
 * @swagger
 * /api/availability/{type}/{id}:
 *   get:
 *     summary: Get availability windows for a doctor or room
 *     tags: [Availability]
 */
router.get('/api/availability/:type/:id', ctrl.getAvailability.bind(ctrl));

/**
 * @swagger
 * /api/availability/{type}/{id}:
 *   put:
 *     summary: Replace availability windows for a doctor or room
 *     tags: [Availability]
 */
router.put('/api/availability/:type/:id', ctrl.setAvailability.bind(ctrl));

module.exports = router;
