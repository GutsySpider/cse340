const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Registration Validation Rules
 ****************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isAlpha()
      .withMessage("First name must contain only letters."),

    body("account_lastname")
      .trim()
      .isAlpha()
      .withMessage("Last name must contain only letters."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isStrongPassword()
      .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check Registration Data
 ****************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

/* ******************************
 * Login Validation Rules
 ****************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* ******************************
 * Check Login Data
 ****************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

module.exports = validate