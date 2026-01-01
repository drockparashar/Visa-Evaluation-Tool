import Joi from "joi";

/**
 * Validation schemas
 */
export const evaluationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().optional().allow(""),
  countryCode: Joi.string().length(2).uppercase().required().messages({
    "string.empty": "Country code is required",
    "string.length": "Country code must be 2 characters",
  }),
  visaTypeId: Joi.string().required().messages({
    "string.empty": "Visa type is required",
  }),
});

/**
 * Middleware to validate request body
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};
