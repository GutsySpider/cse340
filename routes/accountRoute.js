const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const accountValidation = require("../utilities/account-validation")


// Account Management 
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManager))

// Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Logout
// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

//Register
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Update Account Info
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//Process Account Update
router.post(
  "/update",
  utilities.checkLogin,
  accountValidation.updateRules(),
  accountValidation.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Update Account Password
router.post(
  "/update/password",
  utilities.checkLogin,
  accountValidation.passwordRules(),
  accountValidation.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)




module.exports = router