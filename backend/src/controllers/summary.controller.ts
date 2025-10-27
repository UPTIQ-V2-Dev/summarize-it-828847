import { summaryService } from '../services/index.ts';
import catchAsync from '../utils/catchAsync.ts';
import httpStatus from 'http-status';

const generateSummary = catchAsync((req, res) => {
    const { text, options } = req.body;
    const length = options?.length || 'medium';
    const result = summaryService.generateSummary(text, length);
    res.status(httpStatus.OK).send(result);
});

const getHealth = catchAsync((req, res) => {
    const result = summaryService.getHealthStatus();
    res.status(httpStatus.OK).send(result);
});

export default {
    generateSummary,
    getHealth
};
