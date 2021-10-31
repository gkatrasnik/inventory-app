var express = require("express");
var router = express.Router();

// Require controller modules.
var bike_controller = require("../controllers/bikeController");
var manufacturer_controller = require("../controllers/manufacturerController");
var type_controller = require("../controllers/typeController");

/// BIKE ROUTES ///

// GET catalog home page.
router.get("/", bike_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/bike/create", bike_controller.book_create_get);

// POST request for creating Book.
router.post("/bike/create", bike_controller.book_create_post);

// GET request to delete Book.
router.get("/bike/:id/delete", bike_controller.book_delete_get);

// POST request to delete Book.
router.post("/bike/:id/delete", bike_controller.book_delete_post);

// GET request to update Book.
router.get("/bike/:id/update", bike_controller.book_update_get);

// POST request to update Book.
router.post("/bike/:id/update", bike_controller.book_update_post);

// GET request for one Book.
router.get("/bike/:id", bike_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", bike_controller.book_list);

/// MANUFACTURER ROUTES ///

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_get
);

// POST request for creating manufacturer.
router.post(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_post
);

// GET request to delete manufacturer.
router.get(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_get
);

// POST request to delete manufacturer.
router.post(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_post
);

// GET request to update manufacturer.
router.get(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_get
);

// POST request to update manufacturer.
router.post(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_post
);

// GET request for one manufacturer.
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

/// TYPE ROUTES ///

// GET request for creating a Type. NOTE This must come before route that displays Type (uses id).
router.get("/type/create", type_controller.type_create_get);

//POST request for creating type.
router.post("/type/create", type_controller.type_create_post);

// GET request to delete type.
router.get("/type/:id/delete", type_controller.type_delete_get);

// POST request to delete type.
router.post("/type/:id/delete", type_controller.type_delete_post);

// GET request to update type.
router.get("/type/:id/update", type_controller.type_update_get);

// POST request to update type.
router.post("/type/:id/update", type_controller.type_update_post);

// GET request for one type.
router.get("/type/:id", type_controller.type_detail);

// GET request for list of all type.
router.get("/types", type_controller.type_list);

module.exports = router;
