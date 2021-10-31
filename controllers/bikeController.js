var Bike = require("../models/bike");
var Manufacturer = require("../models/manufacturer");
var Type = require("../models/type");
const { body, validationResult } = require("express-validator");
var async = require("async");
//index page, couts bikes, manufacturers and types
exports.index = function (req, res) {
  async.parallel(
    {
      bike_count: function (callback) {
        Bike.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      manufacturer_count: function (callback) {
        Manufacturer.countDocuments({}, callback);
      },
      type_count: function (callback) {
        Type.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};

// display list of all bikes
exports.bike_list = function (req, res, next) {
  Bike.find({}, "name manufacturer")
    .sort({ name: 1 })
    .populate("manufacturer")
    .exec(function (err, list_bikes) {
      if (err) {
        return next(err);
      }
      //succesful, so render
      res.render("bike_list", { title: "Bike list", bike_list: list_bikes });
    });
};

// Display detail page for a specific bike.
exports.bike_detail = function (req, res, next) {
  async.parallel(
    {
      bike: function (callback) {
        Bike.findById(req.params.id)
          .populate("manufacturer")
          .populate("type")
          .exec(callback);
      },
      bike_instance: function (callback) {
        BikeInstance.find({ bike: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bike == null) {
        // No results.
        var err = new Error("Bike not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("bike_detail", {
        title: results.bike.title,
        bike: results.bike,
        bike_instances: results.bike_instance,
      });
    }
  );
};

// Display bikes create form on GET.
exports.bike_create_get = function (req, res, next) {
  // Get all manufacturers and types, which we can use for adding to our bike.
  async.parallel(
    {
      manufactrers: function (callback) {
        Manufacturer.find(callback);
      },
      types: function (callback) {
        Type.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("bike_form", {
        title: "Create Bike",
        manufacturers: results.manufacturers,
        types: results.types,
      });
    }
  );
};

// Handle bike create on POST.
exports.bike_create_post = [
  // Convert the type to an array.
  (req, res, next) => {
    if (!(req.body.type instanceof Array)) {
      if (typeof req.body.type === "undefined") req.body.type = [];
      else req.body.type = new Array(req.body.type);
    }
    next();
  },

  // Validate and sanitise fields.
  body("model", "Model must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type.*").escape(),
  body("size").escape(),
  body("price", "Price must not be empty.").isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Bike object with escaped and trimmed data.
    var bike = new Bike({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      type: req.body.type,
      size: req.body.size,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all manufacturers and types for form.
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          types: function (callback) {
            Type.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected types as checked.
          for (let i = 0; i < results.types.length; i++) {
            if (bike.type.indexOf(results.types[i]._id) > -1) {
              results.types[i].checked = "true";
            }
          }
          res.render("bike_form", {
            title: "Create Bike",
            manufacturers: results.manufacturers,
            types: results.types,
            bike: bike,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save Bike.
      bike.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new book record.
        res.redirect(bike.url);
      });
    }
  },
];

// Display bike delete form on GET.
exports.bike_delete_get = function (req, res, next) {
  async.parallel(
    {
      bike: function (callback) {
        Bike.findById(req.params.id)
          .populate("manufacturer")
          .populate("type")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bike == null) {
        // No results.
        res.redirect("/bikes");
      }
      // Successful, so render.
      res.render("bike_delete", {
        title: "Delete Bike",
        bike: results.bike,
      });
    }
  );
};

// Handle Bike delete on POST.
exports.bike_delete_post = function (req, res, next) {
  // Assume valid Bike id in field.
  Bike.findByIdAndRemove(req.body.id, function delete_bike(err) {
    if (err) {
      return next(err);
    }
    // Success, so redirect to list of Bikes items.
    res.redirect("/bikes");
  });
};

// Display book update form on GET.
exports.bike_update_get = function (req, res, next) {
  // Get bike, manufacturer and type for form.
  async.parallel(
    {
      bike: function (callback) {
        Bike.findById(req.params.id)
          .populate("manufacturer")
          .populate("type")
          .exec(callback);
      },
      manufacturers: function (callback) {
        Manufacturer.find(callback);
      },
      types: function (callback) {
        Type.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.bike == null) {
        // No results.
        var err = new Error("Bike not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (
        var all_g_iter = 0;
        all_g_iter < results.types.length;
        all_g_iter++
      ) {
        for (
          var bike_g_iter = 0;
          bike_g_iter < results.bike.type.length;
          bike_g_iter++
        ) {
          if (
            results.types[all_g_iter]._id.toString() ===
            results.bike.type[book_g_iter]._id.toString()
          ) {
            results.types[all_g_iter].checked = "true";
          }
        }
      }
      res.render("bike_form", {
        title: "Update Bike",
        manufacturers: results.manufacturers,
        types: results.types,
        bike: results.bike,
      });
    }
  );
};

// Handle bike update on POST.
exports.bike_update_post = [
  // Convert the type to an array
  (req, res, next) => {
    if (!(req.body.type instanceof Array)) {
      if (typeof req.body.type === "undefined") req.body.type = [];
      else req.body.type = new Array(req.body.type);
    }
    next();
  },

  // Validate and sanitise fields.
  body("model", "Model must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("manufacturer", "Manufacturer must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("type.*").escape(),
  body("size").escape(),
  body("price", "Price must not be empty.").isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Bike object with escaped and trimmed data.
    var bike = new Bike({
      model: req.body.model,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      type: req.body.type,
      size: req.body.size,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all manufacturers and types for form.
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          types: function (callback) {
            Type.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected types as checked.
          for (let i = 0; i < results.types.length; i++) {
            if (book.type.indexOf(results.types[i]._id) > -1) {
              results.types[i].checked = "true";
            }
          }
          res.render("bike_form", {
            title: "Update Bike",
            manufacturers: results.manufacturers,
            types: results.types,
            bike: bike,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      Bike.findByIdAndUpdate(req.params.id, bike, {}, function (err, thebike) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to bike detail page.
        res.redirect(thebike.url);
      });
    }
  },
];
