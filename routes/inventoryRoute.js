const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const {
  classificationRules,
  checkData,
  inventoryRules,
  checkInventoryData
} = utilities
const invController = require("../controllers/invController")
const itemController = require("../controllers/itemController")
const invValidate = require("../utilities/inventory-validation")

// Management view
router.get("/", utilities.checkEmployeeOrAdmin
,utilities.handleErrors(invController.buildManagement))

// Classification route
router.get("/type/:classificationId", invController.buildByClassificationId)

// Inventory.js Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Deliver add classification view
router.get("/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process classification insert
router.post(
  "/add-classification",
  classificationRules(),
  checkData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.addClassification)
)

// Item detail route
router.get("/detail/:inv_id",
utilities.handleErrors(itemController.buildByInventoryId))

// Intentional 500 error route
router.get("/cause-error", itemController.throwError)

// Deliver add inventory view
router.get("/add-inventory",utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.buildAddInventory)
)

// Deliver edit inventory view
router.get(
  "/edit/:inv_id", utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.buildEditInventory)
);

// Deliver delete inventory confirmation view
router.get(
  "/delete/:inv_id", utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Process inventory delete
router.post(
  "/delete", utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.deleteInventory)
);

// Process inventory insert
router.post(
  "/add-inventory",
  inventoryRules(),
  checkInventoryData, utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.addInventory)
)

// Process inventory update
router.post(
  "/update",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData, utilities.checkEmployeeOrAdmin
,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router