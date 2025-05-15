const validator = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: true });
  
      console.log("error", error);
  
      const message = error?.details?.map((err) => err.message).join(", ");
  
      if (error) {
        return res.status(400).json({
          message: message,
          status: "failed",
        });
      }
  
      next();
    };
  };
  
  module.exports = validator;
  