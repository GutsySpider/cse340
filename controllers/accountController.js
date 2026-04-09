const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver manager view
* *************************************** */
async function buildAccountManager(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver Update Account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "info",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    }

    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })

  } catch (error) {
    console.error("Registration error:", error)
    req.flash("error", "An error occurred during registration.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log("LOGIN CONTROLLER HIT")
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("error", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password)

    if (match) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000
      })

      return res.redirect("/account/")
    }

   
    req.flash("error", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })

  } catch (error) {
    console.error("error:", error)
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Process Account Info Update
 **************************************** */
async function updateAccount(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    // Reload updated account data
    const accountData = await accountModel.getAccountById(account_id);

    if (updateResult) {
      req.flash("info", "Account information updated successfully.");
    } else {
      req.flash("error", "Update failed. Please try again.");
    }

    return res.render("account/account-management", {
  title: "Account Management",
  nav,
  accountData
});

  } catch (error) {
    console.error("Update account error:", error);

    const accountData = await accountModel.getAccountById(account_id);

    req.flash("error", "An unexpected error occurred.");

    return res.render("account/account-management", {
  title: "Account Management",
  nav,
  accountData
});
  }
}

async function updatePassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    const accountData = await accountModel.getAccountById(account_id);

    if (updateResult) {
      req.flash("info", "Password updated successfully.");
    } else {
      req.flash("error", "Password update failed.");
    }

    return res.render("account/account-management", {
  title: "Account Management",
  nav,
  accountData
});

  } catch (error) {
    console.error("Password update error:", error);

    const accountData = await accountModel.getAccountById(account_id);

    req.flash("error", "An unexpected error occurred.");

    return res.render("account/account-management", {
  title: "Account Management",
  nav,
  accountData
});
  }
}

/* ****************************************
 *  Process Logout
 **************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")        
  req.flash("info", "You have been logged out.")
  return res.redirect("/")      
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManager,
  buildUpdateAccount,
  updatePassword,
  updateAccount,
  logout
}