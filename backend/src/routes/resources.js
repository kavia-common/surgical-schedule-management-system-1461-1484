'use strict';
const express = require('express');
const ctrl = require('../controllers/resources');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Manage doctors, nurses, rooms, and devices
 */

/**
 * @swagger
 * /api/resources/{type}:
 *   get:
 *     summary: List resources by type
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [doctors, nurses, rooms, devices]
 *         required: true
 *         description: Resource type
 *     responses:
 *       200:
 *         description: List of resources
 */
router.get('/api/resources/:type', ctrl.list.bind(ctrl));

/**
 * @swagger
 * /api/resources/{type}/{id}:
 *   get:
 *     summary: Get a resource by id
 *     tags: [Resources]
 */
router.get('/api/resources/:type/:id', ctrl.get.bind(ctrl));

/**
 * @swagger
 * /api/resources/{type}:
 *   post:
 *     summary: Create a resource
 *     tags: [Resources]
 */
router.post('/api/resources/:type', ctrl.create.bind(ctrl));

/**
 * @swagger
 * /api/resources/{type}/{id}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
 */
router.put('/api/resources/:type/:id', ctrl.update.bind(ctrl));

/**
 * @swagger
 * /api/resources/{type}/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
 */
router.delete('/api/resources/:type/:id', ctrl.delete.bind(ctrl));

/**
 * @swagger
 * /api/devices/{id}/status:
 *   patch:
 *     summary: Update device status
 *     tags: [Resources]
 */
router.patch('/api/devices/:id/status', ctrl.updateDeviceStatus.bind(ctrl));

module.exports = router;
