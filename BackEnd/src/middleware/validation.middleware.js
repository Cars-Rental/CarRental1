export const validation = (schema) => {
  return (req, res, next) => {
    const inputdata = { ...req.body, ...req.params, ...req.query };

    const { error } = schema.validate(inputdata, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => ({
          field: err.path[0],
          message: err.message.replace(/['"]/g, ""),
        })),
      });
    }

    return next();
  };
};

export default validation;
