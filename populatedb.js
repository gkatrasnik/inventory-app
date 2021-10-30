#! /usr/bin/env node

console.log(
  "This script populates some test bikes, manufacturers, bike types to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Bike = require("./models/bike");
var Manufacturer = require("./models/manufacturer");
var Type = require("./models/type");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var bikes = [];
var manufacturers = [];
var types = [];

function manufacturerCreate(name, description, cb) {
  manufacturerdetail = { name: name, description: description };

  var manufacturer = new Manufacturer(manufacturerdetail);

  manufacturer.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Manufacturer: " + manufacturer);
    manufacturers.push(manufacturer);
    cb(null, manufacturer);
  });
}

function typeCreate(name, description, cb) {
  var type = new Type({ name: name, description: description });

  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Type: " + type);
    types.push(type);
    cb(null, type);
  });
}

function bikeCreate(model, manufacturer, description, type, size, price, cb) {
  bikedetail = {
    model: model,
    manufacturer: manufacturer,
    description: description,
    type: type,
    size: size,
    price: price,
  };

  var bike = new Bike(bikedetail);
  bike.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Bike: " + bike);
    bikes.push(bike);
    cb(null, bike);
  });
}

function createManufacturersTypes(cb) {
  async.series(
    [
      function (callback) {
        manufacturerCreate(
          "Scott",
          "Multi sport company based in Switzerland, founded in 1958",
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Specialized",
          "Bicycle company from California. Founded in 1974",
          callback
        );
      },

      function (callback) {
        manufacturerCreate(
          "Canyon",
          "German bicyclie company from Koblenz, since 2002",
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Pinarello",
          "Italian company, based in Treviso, since 1952",
          callback
        );
      },

      function (callback) {
        typeCreate("Road", "Road bikes", callback);
      },
      function (callback) {
        typeCreate("MTB", "Moutain bikes", callback);
      },
      function (callback) {
        typeCreate("Gravel", "Gravel bikes for all terrains", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createBikes(cb) {
  async.parallel(
    [
      function (callback) {
        bikeCreate(
          "Tarmac SL6 sworks",
          manufacturers[1],
          "Real race machine, light and aerodynamic.",
          types[0],
          "m",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Tarmac SL6 sworks",
          manufacturers[1],
          "Real race machine, light and aerodynamic.",
          types[0],
          "l",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Tarmac SL6 sworks",
          manufacturers[1],
          "Real race machine, light and aerodynamic.",
          types[0],
          "xl",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Addict",
          manufacturers[0],
          "Light, stiff, aerodynamic. perfect for road racing",
          types[0],
          "m",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Addict",
          manufacturers[0],
          "Light, stiff, aerodynamic. perfect for road racing",
          types[0],
          "l",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Addict",
          manufacturers[0],
          "Light, stiff, aerodynamic. perfect for road racing",
          types[0],
          "xl",
          12000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Dogma 12",
          manufacturers[3],
          "Team Ineos's weapon of choice. It can do all, except win the Tour",
          types[0],
          "xl",
          13000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Dogma 12",
          manufacturers[3],
          "Team Ineos's weapon of choice. It can do all, except win the Tour",
          types[0],
          "l",
          13000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Dogma 12",
          manufacturers[3],
          "Team Ineos's weapon of choice. It can do all, except win the Tour",
          types[0],
          "s",
          13000,
          callback
        );
      },

      function (callback) {
        bikeCreate(
          "Spark RC",
          manufacturers[0],
          "Best XC bike, ready to tackle all terrains.",
          types[1],
          "l",
          10000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Spark RC",
          manufacturers[0],
          "Best XC bike, ready to tackle all terrains.",
          types[1],
          "s",
          10000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Spark RC",
          manufacturers[0],
          "Best XC bike, ready to tackle all terrains.",
          types[1],
          "m",
          10000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Epic sworks",
          manufacturers[1],
          "Uses Brain suspension system. Best in its category.",
          types[1],
          "xs",
          11000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Epic sworks",
          manufacturers[1],
          "Uses Brain suspension system. Best in its category.",
          types[1],
          "s",
          11000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Grail",
          manufacturers[2],
          "Grail is the new gravel gold standard",
          types[2],
          "s",
          6000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Grail",
          manufacturers[2],
          "Grail is the new gravel gold standard",
          types[2],
          "xl",
          6000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Grail",
          manufacturers[2],
          "Grail is the new gravel gold standard",
          types[2],
          "l",
          6000,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Crux",
          manufacturers[1],
          "Jump on the Crux and conquer every gravel road there is",
          types[2],
          "l",
          6500,
          callback
        );
      },
      function (callback) {
        bikeCreate(
          "Crux",
          manufacturers[1],
          "Jump on the Crux and conquer every gravel road there is",
          types[2],
          "xs",
          6500,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createManufacturersTypes, createBikes],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("bikes: " + bikes);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
