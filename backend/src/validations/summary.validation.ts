import Joi from 'joi';

const summarize = {
    body: Joi.object().keys({
        text: Joi.string().required().max(10000),
        options: Joi.object()
            .keys({
                length: Joi.string().valid('short', 'medium', 'long').default('medium')
            })
            .optional()
    })
};

const health = {
    // No validation needed for health endpoint
};

export default {
    summarize,
    health
};
