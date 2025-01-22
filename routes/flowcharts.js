// routes/flowcharts.js

const express = require('express');
const router = express.Router();
const Flowchart = require('../models/Flowchart');
const validateGraph = require('../utils/validateGraph'); // Ensure this utility exists and functions correctly

/**
 * @swagger
 * components:
 *   schemas:
 *     Node:
 *       type: object
 *       required:
 *         - id
 *         - label
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the node
 *         label:
 *           type: string
 *           description: Label of the node
 *       example:
 *         id: "1"
 *         label: "Start"
 * 
 *     Edge:
 *       type: object
 *       required:
 *         - source
 *         - target
 *       properties:
 *         source:
 *           type: string
 *           description: Source node ID
 *         target:
 *           type: string
 *           description: Target node ID
 *       example:
 *         source: "1"
 *         target: "2"
 * 
 *     Flowchart:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - nodes
 *         - edges
 *       properties:
 *         _id:
 *           type: integer
 *           description: Unique numerical identifier for the flowchart (user-provided)
 *           example: 1
 *         name:
 *           type: string
 *           description: Name of the flowchart
 *         nodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Node'
 *           description: List of nodes in the flowchart
 *         edges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Edge'
 *           description: List of edges connecting the nodes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the flowchart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the flowchart was last updated
 *       example:
 *         _id: 1
 *         name: "Sample Flowchart"
 *         nodes:
 *           - id: "1"
 *             label: "Start"
 *           - id: "2"
 *             label: "Process"
 *           - id: "3"
 *             label: "End"
 *         edges:
 *           - source: "1"
 *             target: "2"
 *           - source: "2"
 *             target: "3"
 *         createdAt: "2023-08-10T10:00:00.000Z"
 *         updatedAt: "2023-08-10T10:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Flowcharts
 *   description: API for managing flowcharts
 */

/**
 * @swagger
 * /api/flowcharts:
 *   post:
 *     summary: Create a new flowchart
 *     tags: [Flowcharts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flowchart'
 *     responses:
 *       201:
 *         description: Flowchart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flowchart'
 *       400:
 *         description: Bad request (e.g., duplicate _id or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Duplicate _id. A flowchart with this _id already exists."
 */
router.post('/', async (req, res) => {
  try {
    const { _id, name, nodes, edges } = req.body;

    // Validate presence of _id
    if (_id === undefined || _id === null) {
      return res.status(400).json({ message: 'Flowchart _id is required.' });
    }

    // Validate the graph structure
    const validation = validateGraph(nodes, edges);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Create new flowchart with user-provided _id
    const flowchart = new Flowchart({ _id, name, nodes, edges });
    await flowchart.save();
    res.status(201).json(flowchart);
  } catch (err) {
    // Handle duplicate _id errors
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate _id. A flowchart with this _id already exists.' });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
});

/**
 * @swagger
 * /api/flowcharts:
 *   get:
 *     summary: Retrieve a list of all flowcharts
 *     tags: [Flowcharts]
 *     responses:
 *       200:
 *         description: A list of flowcharts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flowchart'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const flowcharts = await Flowchart.find();
    res.json(flowcharts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/flowcharts/{id}:
 *   get:
 *     summary: Get a flowchart by _id
 *     tags: [Flowcharts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numerical _id of the flowchart to retrieve
 *     responses:
 *       200:
 *         description: Flowchart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flowchart'
 *       400:
 *         description: Invalid _id format (should be a number)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid _id format. It should be a number."
 *       404:
 *         description: Flowchart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart not found"
 */
router.get('/:id', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    if (isNaN(_id)) {
      return res.status(400).json({ message: 'Invalid _id format. It should be a number.' });
    }

    const flowchart = await Flowchart.findById(_id);
    if (!flowchart) return res.status(404).json({ message: 'Flowchart not found' });
    res.json(flowchart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/flowcharts/{id}:
 *   put:
 *     summary: Update an existing flowchart by _id
 *     tags: [Flowcharts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numerical _id of the flowchart to update
 *     requestBody:
 *       description: Flowchart object with updated data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flowchart'
 *     responses:
 *       200:
 *         description: Flowchart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flowchart'
 *       400:
 *         description: Bad request (e.g., validation failed or duplicate _id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Graph contains a cycle"
 *       404:
 *         description: Flowchart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart not found"
 */
router.put('/:id', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    if (isNaN(_id)) {
      return res.status(400).json({ message: 'Invalid _id format. It should be a number.' });
    }

    const { name, nodes, edges } = req.body;
    const flowchart = await Flowchart.findById(_id);
    if (!flowchart) return res.status(404).json({ message: 'Flowchart not found' });

    if (name) flowchart.name = name;
    if (nodes && edges) {
      // Validate the updated graph
      const validation = validateGraph(nodes, edges);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      flowchart.nodes = nodes;
      flowchart.edges = edges;
    }

    await flowchart.save();
    res.json(flowchart);
  } catch (err) {
    // Handle duplicate _id errors, if any
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate _id. A flowchart with this _id already exists.' });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
});

/**
 * @swagger
 * /api/flowcharts/{id}:
 *   delete:
 *     summary: Delete a flowchart by _id
 *     tags: [Flowcharts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numerical _id of the flowchart to delete
 *     responses:
 *       200:
 *         description: Flowchart deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart deleted"
 *       400:
 *         description: Invalid _id format (should be a number)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid _id format. It should be a number."
 *       404:
 *         description: Flowchart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart not found"
 */
router.delete('/:id', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    if (isNaN(_id)) {
      return res.status(400).json({ message: 'Invalid _id format. It should be a number.' });
    }

    const flowchart = await Flowchart.findByIdAndDelete(_id);
    if (!flowchart) return res.status(404).json({ message: 'Flowchart not found' });
    res.json({ message: 'Flowchart deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/flowcharts/{id}/edges/{nodeId}/outgoing:
 *   get:
 *     summary: Get all outgoing edges for a given node
 *     tags: [Flowcharts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numerical _id of the flowchart
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the node to fetch outgoing edges for
 *     responses:
 *       200:
 *         description: List of outgoing edges for the specified node
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Edge'
 *       400:
 *         description: Invalid _id or nodeId format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid _id format. It should be a number."
 *       404:
 *         description: Flowchart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart not found"
 */
router.get('/:id/edges/:nodeId/outgoing', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    const { nodeId } = req.params;

    if (isNaN(_id)) {
      return res.status(400).json({ message: 'Invalid _id format. It should be a number.' });
    }

    const flowchart = await Flowchart.findById(_id);
    if (!flowchart) return res.status(404).json({ message: 'Flowchart not found' });

    const outgoingEdges = flowchart.edges.filter(edge => edge.source === nodeId);
    res.json(outgoingEdges);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/flowcharts/{id}/connected/{nodeId}:
 *   get:
 *     summary: Get all nodes connected to a specific node (directly or indirectly)
 *     tags: [Flowcharts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numerical _id of the flowchart
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the node to find connected nodes from
 *     responses:
 *       200:
 *         description: List of connected node IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connectedNodes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: IDs of nodes connected to the specified node
 *               example:
 *                 connectedNodes: ["2", "3"]
 *       400:
 *         description: Invalid _id or nodeId format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid _id format. It should be a number."
 *       404:
 *         description: Flowchart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flowchart not found"
 */
router.get('/:id/connected/:nodeId', async (req, res) => {
  try {
    const _id = Number(req.params.id);
    const { nodeId } = req.params;

    if (isNaN(_id)) {
      return res.status(400).json({ message: 'Invalid _id format. It should be a number.' });
    }

    const flowchart = await Flowchart.findById(_id);
    if (!flowchart) return res.status(404).json({ message: 'Flowchart not found' });

    const adjList = {};
    flowchart.nodes.forEach(node => { adjList[node.id] = []; });
    flowchart.edges.forEach(edge => { adjList[edge.source].push(edge.target); });

    const visited = new Set();
    const result = [];

    const dfs = (current) => {
      for (const neighbor of adjList[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          result.push(neighbor);
          dfs(neighbor);
        }
      }
    };

    dfs(nodeId);
    res.json({ connectedNodes: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;