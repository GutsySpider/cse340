// const itemModel = require("../models/item-model")
// const utilities = require("../utilities/")

// const itemCont = {}


// /* ***************************
//  *  Build details by item view
//  * ************************** */
// invCont.buildByInventoryId = async function (req, res, next) {
//   const inv_id = req.params.inv_id
//   const data = await itemModel.getItemByInventoryId(inv_id)
//   const grid = await utilities.buildItemGrid(data)
//   let nav = await utilities.getNav()
//   const itemName = data[0].inv_make
//   res.render("./inventory", {
//     title: className + " vehicles",
//     nav,
//     grid,
//   })
// }

// module.exports = invCont
