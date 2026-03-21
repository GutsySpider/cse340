const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const itemController = require("../controllers/itemController")

// Classification route
router.get("/type/:classificationId", invController.buildByClassificationId)

// Item detail route
router.get("/detail/:inv_id", itemController.buildByInventoryId)

// Intentional 500 error route
router.get("/cause-error", itemController.throwError)

module.exports = router