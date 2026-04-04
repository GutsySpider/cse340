const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the item view HTML
* ************************************ */
Util.buildItemGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<div class="vehicle-list">'

    data.forEach(vehicle => {
      grid += `
        <div class="vehicle-card">
          <img src="${vehicle.inv_image}" 
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" 
               class="vehicle-image">

          <div class="vehicle-info">
            <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

            <h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>

            <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>

            <p><strong>Description:</strong> ${vehicle.inv_description}</p>

            <p><strong>Color:</strong> ${vehicle.inv_color}</p>

            <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</p>

            <a href="../../inv/detail/${vehicle.inv_id}" 
               class="details-link">
               View Details
            </a>
          </div>
        </div>
      `
    })

    grid += '</div>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const { body, validationResult } = require("express-validator")

function classificationRules() {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed.")
  ]
}

function inventoryRules() {
  return [
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Enter a valid year."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required.")
  ]
}

async function checkInventoryData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    let classificationList = await Util.buildClassificationList(req.body.classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body   
    })
  }
  next()
}

Util.inventoryRules = inventoryRules
Util.checkInventoryData = checkInventoryData

async function checkData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await Util.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array()
    })
  }
  next()
}

Util.classificationRules = classificationRules
Util.checkData = checkData


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })

  classificationList += "</select>"
  return classificationList
}

Util.buildClassificationList = Util.buildClassificationList

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("error", "Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check for Employee or Admin Access
 **************************************** */
Util.checkEmployeeOrAdmin = function (req, res, next) {
  // If no account data, user is not logged in
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to access this page.")
    return res.status(401).render("account/login", {
      title: "Login",
      nav: res.locals.nav,
      errors: null
    })
  }

  const type = res.locals.accountData.account_type

  // Only allow Employee or Admin
  if (type === "Employee" || type === "Admin") {
    return next()
  }

  // Otherwise deny access
  req.flash("notice", "You do not have permission to access this area.")
  return res.status(403).render("account/login", {
    title: "Login",
    nav: res.locals.nav,
    errors: null
  })
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  console.log("loggedin:", res.locals.loggedin)

  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("error", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util