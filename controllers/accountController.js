const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Process login (placeholder)
* *************************************** */
async function accountLogin(req, res, next) {
  req.flash("notice", "Login processing not implemented yet.")
  res.redirect("/account")
}

module.exports = { buildLogin, accountLogin }