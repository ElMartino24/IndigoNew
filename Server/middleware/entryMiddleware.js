import { check, validationResult } from "express-validator";

export const blogInput = [
  check("text")
    .trim()
    .isLength({ min: 10, max: 255 })
    .isString()
    .withMessage("Text nix gut"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Text should have at least 10 maximum 255 characters ",
        content: errors,
        isSuccess: false,
      });
    }
    next();
  },
];

export const updateInput = [
  check("text")
    .trim()
    .isLength({ min: 10, max: 255 })
    .isString()
    .withMessage("Text nix gut"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Text should have at least 10 maximum 255 characters",
        content: errors,
        isSuccess: false,
      });
    }
    next();
  },
];
