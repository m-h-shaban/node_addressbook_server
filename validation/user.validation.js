const { body, validationResult } = require("express-validator/check");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return {
    type: "Error",
    name: "User Operation Failure",
    message: msg,
    value: value,
    nestedErrors: nestedErrors
  };
};

validate = method => {
  switch (method) {
    case "registerWithEmailAndPassword": {
      return [
        body("email")
          .exists()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email format is not valid"),
        body("password")
          .exists()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long"),
        body("user_name")
          .exists()
          .withMessage("User Name is required")
          .isLength({ min: 8 })
          .withMessage("User Name must be at least 8 characters long")
      ];
    }
    case "loginWithEmailAndPassword": {
      return [
        body("email")
          .exists()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email format is not valid"),
        body("password")
          .exists()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long")
      ];
    }
    case "loginWithUserNameAndPassword": {
      return [
        body("password")
          .exists()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long"),
        body("user_name")
          .exists()
          .withMessage("User Name is required")
          .isLength({ min: 8 })
          .withMessage("User Name must be at least 8 characters long")
      ];
    }
  }
};

module.exports = {
  validate,
  errorFormatter,
  validationResult
};
