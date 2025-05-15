const Joi = require("joi");

const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required()
        .max(14)
        .messages({
            "string.pattern.base": "Password is weak",
        }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'any.only': 'passwords do not match'
        })


}).messages({
    "object.unknown": "unknown field",
});


module.exports = signupSchema;
