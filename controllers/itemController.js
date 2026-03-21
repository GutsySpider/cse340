const itemModel = require("../models/item-model")
const utilities = require("../utilities/")

const itemCont = {}

/* ***************************
 *  Build item detail view
 *************************** */
itemCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id

  // Get ONE vehicle
  const item = await itemModel.getItemByInventoryId(inv_id)

  // If nothing found, show 404
  if (!item) {
    return next({ status: 404, message: "Vehicle not found" })
  }

  const nav = await utilities.getNav()

  res.render("inventory/item", {
    title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`,
    nav,
    inv: item
  })
}

itemCont.throwError = (req, res, next) => {
  throw new Error("Intentional 500 error triggered")
}


module.exports = itemCont