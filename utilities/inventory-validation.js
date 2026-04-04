const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ******************************
 * Inventory Data Validation Rules (Add + Update)
 ****************************** */
validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    body("inv_year")
      .isInt({ min: 1900, max: 9999 })
      .withMessage("Year must be a valid 4‑digit year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat()
      .withMessage("Price must be a number."),

    body("inv_miles")
      .isInt()
      .withMessage("Miles must be a whole number."),

    body("inv_color")
      .trim()
      .isAlpha()
      .withMessage("Color must contain only letters.")
  ]
}

/* ******************************
 * Check Add Inventory Data
 ****************************** */
validate.checkInventoryData = async function (req, res, next) {
  const errors = validationResult(req)

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }

  next()
}


/* ******************************
 * Check Update Data and Return Errors to Edit View
 ****************************** */
validate.checkUpdateData = async function (req, res, next) {
  const errors = validationResult(req)

  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      errors: errors.array(),
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }

  next()
}

module.exports = validate