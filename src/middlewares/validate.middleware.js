// Runs a Joi/express-validator schema and returns 400 on failure
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    res.status(400);
    throw new Error(messages);
  }

  next();
};

module.exports = { validate };