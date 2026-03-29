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

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Classification route
router.get("/type/:classificationId", invController.buildByClassificationId)

// Deliver add classification view
router.get("/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process classification insert
router.post(
  "/add-classification",
  classificationRules(),
  checkData,
  utilities.handleErrors(invController.addClassification)
)

// Item detail route
router.get("/detail/:inv_id", itemController.buildByInventoryId)

// Intentional 500 error route
router.get("/cause-error", itemController.throwError)

// Deliver add inventory view
router.get("/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process inventory insert
router.post(
  "/add-inventory",
  inventoryRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router