var Type = require("../models/type");
var Bike = require("../models/bike");
var async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Types.
exports.type_list = function (req, res, next) {
  Type.find()
    .sort([["type", "ascending"]])
    .exec(function (err, list_types) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("type_list", {
        title: "Type List",
        type_list: list_types,
      });
    });
};

// Display detail page for a specific type.
exports.type_detail = function (req, res, next) {
  async.parallel(
    {
      type: function (callback) {
        Type.findById(req.params.id).exec(callback);
      },

      type_bikes: function (callback) {
        Bike.find({ type: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.type == null) {
        // No results.
        var err = new Error("Type not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("type_detail", {
        title: "Type Detail",
        type: results.type,
        type_bikes: results.type_bikes,
      });
    }
  );
};

// Display type create form on GET.
exports.type_create_get = function (req, res, next) {
  res.render("type_form", { title: "Create Type" });
};

// Handle type create on POST.
exports.type_create_post = [
  // Validate and santize the name field.
  body("name", "type name required").trim().isLength({ min: 1 }).escape(),
  body("description", "type description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var type = new Type({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("type_form", {
        title: "Create Type",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if type with same name already exists.
      Type.findOne({ name: req.body.name }).exec(function (err, found_type) {
        if (err) {
          return next(err);
        }

        if (found_type) {
          // type exists, redirect to its detail page.
          res.redirect(found_type.url);
        } else {
          type.save(function (err) {
            if (err) {
              return next(err);
            }
            // type saved. Redirect to type detail page.
            res.redirect(type.url);
          });
        }
      });
    }
  },
];

// Display type delete form on GET.
exports.type_delete_get = function (req, res, next) {
  async.parallel(
    {
      type: function (callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_bikes: function (callback) {
        Bike.find({ type: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.type == null) {
        // No results.
        res.redirect("/types");
      }
      // Successful, so render.
      res.render("type_delete", {
        title: "Delete Type",
        type: results.type,
        type_bikes: results.type_bikes,
      });
    }
  );
};

// Handle type delete on POST.
exports.type_delete_post = function (req, res, next) {
  async.parallel(
    {
      type: function (callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_bikes: function (callback) {
        Bike.find({ type: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.type_bikes.length > 0) {
        // type has bikes. Render in same way as for GET route.
        res.render("type_delete", {
          title: "Delete Type",
          type: results.type,
          type_bikes: results.type_bikes,
        });
        return;
      } else {
        // type has no bikes. Delete object and redirect to the list of types.
        Type.findByIdAndRemove(req.body.id, function deleteType(err) {
          if (err) {
            return next(err);
          }
          // Success - go to types list.
          res.redirect("/types");
        });
      }
    }
  );
};

// Display type update form on GET.
exports.type_update_get = function (req, res, next) {
  Type.findById(req.params.id, function (err, type) {
    if (err) {
      return next(err);
    }
    if (type == null) {
      // No results.
      var err = new Error("Type not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("type_form", { title: "Update Type", type: type });
  });
};

// Handle type update on POST.
exports.type_update_post = [
  // Validate and santize the name field.
  body("name", "type name required").trim().isLength({ min: 1 }).escape(),
  body("description", "type description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a type object with escaped and trimmed data (and the old id!)
    var type = new Type({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("type_form", {
        title: "Update Type",
        type: type,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Type.findByIdAndUpdate(req.params.id, type, {}, function (err, thetype) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to type detail page.
        res.redirect(thetype.url);
      });
    }
  },
];
