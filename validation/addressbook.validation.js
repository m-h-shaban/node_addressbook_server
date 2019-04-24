const { body, validationResult } = require("express-validator/check");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return {
    type: "Error",
    name: "Address Book Operation Failure",
    message: msg,
    value: value,
    nestedErrors: nestedErrors
  };
};

validate = method => {
  switch (method) {
    case "addAddressBook": {
      return [
        body("name")
          .exists()
          .withMessage("Name is required")
          .isLength({ min: 2, max: 50})
          .withMessage("Name must be 2 to 50 characters long")
          .isAlpha()
          .withMessage('Name must be characters'),
        body("bio")
          .exists()
          .withMessage("Biography is required")
          .isLength({ min: 10, max: 150 })
          .withMessage("Biography must be 10 to 150 characters long")
      ];
    }
    case "updateAddressBook": {
      return [
        body("name")
          .exists()
          .withMessage("Name is required")
          .isLength({ min: 2, max: 50})
          .withMessage("Name must be 2 to 50 characters long")
          .isAlpha()
          .withMessage('Name must be characters'),
        body("bio")
          .exists()
          .withMessage("Biography is required")
          .isLength({ min: 10, max: 150 })
          .withMessage("Biography must be 10 to 150 characters long")
      ];
    }
  }
};

module.exports = {
  validate,
  errorFormatter,
  validationResult
};
