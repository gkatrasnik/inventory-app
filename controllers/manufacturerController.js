var Manufacturer = require("../models/maufacturer");
var async = require("async");
var Bike = require("../models/bike");
const { body, validationResult } = require("express-validator");

// Display list of all Manufacturers.
exports.manufacturer_list = function (req, res, next) {
  Manufacturer.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_manufacturers) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("manufacturer_list", {
        title: "Manufacturer List",
        manufacturer_list: list_manufacturers,
      });
    });
};

// Display detail page for a specific manufacturer.
exports.manufacturer_detail = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturers_bikes: function (callback) {
        Bike.find({ author: req.params.id }, "model description").exec(
          callback
        );
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.manufacturer == null) {
        // No results.
        var err = new Error("Manufacturer not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("manufacturer_detail", {
        title: "Manufacturer Detail",
        manufacturer: results.manufacturer,
        manufacturer_bikes: results.manufacturers_bikes,
      });
    }
  );
};

// Display manufacturer create form on GET.
exports.manufacturer_create_get = function (req, res, next) {
  res.render("manufacturer_form", { title: "Create Manufacturer" });
};

// Handle manufacturer create on POST.
exports.manufacturer_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("manufacturer_form", {
        title: "Create Manufacturer",
        manufacturer: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create an manufacturer object with escaped and trimmed data.
      var manufacturer = new Manufacturer({
        name: req.body.name,
        description: req.body.description,
      });
      manufacturer.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(manufacturer.url);
      });
    }
  },
];

// Display manufacturer delete form on GET.
exports.manufacturer_delete_get = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturers_bikes: function (callback) {
        MManufacturer.find({ manufacturer: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturer == null) {
        // No results.
        res.redirect("/manufacturers");
      }
      // Successful, so render.
      res.render("manufacturer_delete", {
        title: "Delete Manufacturer",
        manufacturer: results.manufacturer,
        manufacturer_bikes: results.manufacturers_bikes,
      });
    }
  );
};

// Handle manufacturer delete on POST.
exports.manufacturer_delete_post = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.body.manufacturerid).exec(callback);
      },
      manufacturers_bikes: function (callback) {
        Manufacturer.find({ manufacturer: req.body.manufacturerid }).exec(
          callback
        );
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.manufacturers_bikes.length > 0) {
        // manufacturer has bikes. Render in same way as for GET route.
        res.render("manufacturer_delete", {
          title: "Delete Manufacturer",
          manufacturer: results.manufacturer,
          manufacturer_bikes: results.manufacturers_bikes,
        });
        return;
      } else {
        // manufacturer has no bikes. Delete object and redirect to the list of manufacturers.
        Manufacturer.findByIdAndRemove(
          req.body.manufacturerid,
          function deleteManufacturer(err) {
            if (err) {
              return next(err);
            }
            // Success - go to author list
            res.redirect("/manufacturers");
          }
        );
      }
    }
  );
};

// Display manufacturer update form on GET.
exports.manufacturer_update_get = function (req, res, next) {
  Manufacturer.findById(req.params.id, function (err, manufacturer) {
    if (err) {
      return next(err);
    }
    if (manufacturer == null) {
      // No results.
      var err = new Error("Manufacturer not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("manufacturer_form", {
      title: "Update Manufacturer",
      manufacturer: manufacturer,
    });
  });
};

// Handle manufacturer update on POST.
exports.manufacturer_update_post = [
  // Validate and santize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an manufacturer object with escaped and trimmed data.
    var manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("manufacturer_form", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Manufacturer.findByIdAndUpdate(
        req.params.id,
        manufacturer,
        {},
        function (err, themanufacturer) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to genre detail page.
          res.redirect(themanufacturer.url);
        }
      );
    }
  },
];
