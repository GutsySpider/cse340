const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ****************************************
*  Deliver Inventory Management View
**************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Deliver Add Classification View
**************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Deliver compare form view
 * ************************** */
invCont.buildCompareView = async function (req, res) {
  const nav = await utilities.getNav();
  const vehicles = await invModel.getAllInventory();

  res.render("inventory/compare-select", {
    title: "Compare Vehicles",
    nav,
    vehicles,
    errors: null,
    message: req.flash("notice")
  });
};

/* ***************************
 *  Deliver results of form view
 * ************************** */
invCont.compareVehicles = async function (req, res) {
  const nav = await utilities.getNav();
  const { vehicle1, vehicle2 } = req.body;

  try {
    const results = await invModel.getTwoVehicles(vehicle1, vehicle2);

    if (results.length < 2) {
      req.flash("notice", "Please select two different vehicles.");
      return res.redirect("/inv/compare");
    }

    res.render("inventory/compare-results", {
      title: "Vehicle Comparison",
      nav,
      vehicles: results,
      message: null
    });

  } catch (error) {
    req.flash("notice", "Comparison failed. Try again.");
    res.redirect("/inv/compare");
  }
};

/* ****************************************
*  Insert New Classification
**************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

  if (result) {
  req.flash("notice", `${classification_name} successfully added.`)
  let classificationList = await utilities.buildClassificationList()

  return res.status(201).render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null
  })
} else {
    req.flash("notice", "Failed to add classification.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ****************************************
*  Deliver Add Inventory View
**************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: ""
  })
}

/* ****************************************
*  Insert New Inventory Item
**************************************** */
invCont.addInventory = async function (req, res, next) {
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

  const result = await invModel.addInventory(
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
  )

  let nav = await utilities.getNav()

  if (result) {
  req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
  let classificationList = await utilities.buildClassificationList()

  return res.status(201).render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null
  })
} else {
    req.flash("notice", "Failed to add inventory item.")
    let classificationList = await utilities.buildClassificationList(classification_id)

    return res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
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
}

/* ***************************
 *  Update Inventory Data
 ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      itemData: {
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      }
    })
  }
}

/* ***************************
 *  Build Edit Inventory View
 ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  if (!itemData) {
    req.flash("notice", "Inventory item not found.")
    return res.redirect("/inv/")
  }

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemData.inv_make + " " + itemData.inv_model,
    nav,
    errors: null,
    classificationList,
    itemData
  })
}

/* ***************************
 *  Return Inventory as JSON
 ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  return res.json(invData)
}

/* ***************************
 *  Build Delete Inventory View
 ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)

  if (!itemData) {
    req.flash("notice", "Inventory item not found.")
    return res.redirect("/inv/")
  }

  res.render("inventory/delete-inventory", {
    title: "Delete " + itemData.inv_make + " " + itemData.inv_model,
    nav,
    errors: null,
    itemData
  })
}

/* ***************************
 *  Delete Inventory Data
 ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", "The item was successfully deleted.")
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inv/delete/${inv_id}`)
  }
}


module.exports = invCont