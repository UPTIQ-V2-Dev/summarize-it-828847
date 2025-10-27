import { summaryController } from "../controllers/index.js";
import validate from "../middlewares/validate.js";
import { summaryValidation } from "../validations/index.js";
import express from 'express';
const router = express.Router();
// Summary generation endpoint (no authentication required)
router.route('/summarize').post(validate(summaryValidation.summarize), summaryController.generateSummary);
// Health check endpoint (no authentication required)
router.route('/health').get(summaryController.getHealth);
export default router;
/**
 * @swagger
 * tags:
 *   name: Summary
 *   description: Text summarization and health check APIs
 */
/**
 * @swagger
 * /api/summarize:
 *   post:
 *     summary: Generate summary of provided text
 *     description: Generate a summary of the provided text with configurable length options.
 *     tags: [Summary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 10000
 *                 description: Text to summarize (max 10,000 characters)
 *               options:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: string
 *                     enum: [short, medium, long]
 *                     default: medium
 *                     description: Length of the generated summary
 *             example:
 *               text: "Climate change is one of the most pressing issues of our time. It affects every aspect of human life and the environment. We need immediate action to address this global challenge through renewable energy, conservation efforts, and international cooperation."
 *               options:
 *                 length: "medium"
 *     responses:
 *       "200":
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: Generated summary text
 *                 wordCount:
 *                   type: integer
 *                   description: Number of words in the summary
 *                 processingTime:
 *                   type: number
 *                   format: float
 *                   description: Time taken to process the request in seconds
 *               example:
 *                 summary: "This is a moderately detailed summary that captures the essential points of climate change impacts and solutions."
 *                 wordCount: 65
 *                 processingTime: 1.8
 *       "400":
 *         description: Invalid input - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "Invalid input - text is required"
 *       "422":
 *         description: Text too long or invalid length option
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 422
 *               message: "Text too long or invalid length option"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 500
 *               message: "Internal server error"
 */
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     description: Check the health status of the API service.
 *     tags: [Summary]
 *     responses:
 *       "200":
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Health status of the API
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Current timestamp in ISO format
 *               example:
 *                 status: "healthy"
 *                 timestamp: "2025-10-27T10:30:45Z"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 500
 *               message: "Internal server error"
 */
