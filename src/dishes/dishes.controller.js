// Add middleware and handlers for dishes to this file, then export the functions for use by the router.

const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass


// CREATE
function create(req, res) {
  const { data: { id, name, despcription, price, image_url } } = req.body;
  
  const newId = nextId();
  const newName = req.body.data.name;
  const newDescription = req.body.data.description;
  const newPrice = req.body.data.price;
  const newImageUrl = req.body.data.image_url;
  
  const newDish = {
    id: newId,
    name: newName,
    description: newDescription,
    price: newPrice,
    image_url: newImageUrl
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
  //console.log(urls);
}


function dataIdMatchesDishId(req, res, next) {
  const { data: { id } = {} } = req.body;
  //const id = req.body.data.id;
  const dishId = req.params.dishId;
  if (id !== undefined && id !== null && id !== "" && id !== dishId) {
    next({
      status: 400,
      message: `id ${id} must match dataId provided in parameters`,
    });
  }
   return next();
};



// DOES EXIST VALIDATION
function dishExists(req, res, next) {
  const  dishId  = req.params.dishId;
  const foundDish = dishes.filter((dish) => dish.id === dishId);
  if (foundDish.length > 0) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({ status: 404, message: `Dish ${dishId} not found.` });
  }
}

// READ
function read(req, res) {
   const foundDish = res.locals.dish;
  if (foundDish) {
    res.json({ data: foundDish[0] });
  }
}

// IS NAME VALID - VALIDATION
function isNameValid(req, res, next) {
  const { data: name } = req.body;
  if (
    req.body.data.name === null ||
    req.body.data.name === "" ||
    req.body.data.name === undefined
  ) {
    next({ status: 400, message: "Dish must include a name." });
  }
  next();
}

// IS DESCRIPTION VALID - VALIDATION
function isDescriptionValid(req, res, next) {
  const { data: { description } = {} } = req.body;
  if (
      req.body.data.description === null ||
      req.body.data.description === "" ||
      req.body.data.description === undefined
    ) {
      next({ status: 400, message: "Dish must include a description." });
    }
    next();
  }

// IS PRICE VALID - VALIDATION
function isPriceValid(req, res, next) {
  const { data: { price } = {} } = req.body;
   if (
        req.body.data.price === null ||
        req.body.data.price === "" ||
        req.body.data.price === undefined
      ) {
        next({ status: 400, message: "Dish must include a price." });
      }
    if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
    return next();
  } else {
    next({
      status: 400,
      message: `The price must be a number greater than 0.`,
    });
  }
}

// IS IMAGEURL VALID - VALIDATION
function isImageUrlValid(req, res, next) {
  const { data: { image_url } = {} } = req.body;
 if (
    req.body.data.image_url === null ||
    req.body.data.image_url === undefined ||
    req.body.data.image_url === ""
  ) {
    next({ status: 400, message: "Dish must include an image_url." });
  }
  next();
}

// UPDATE
function update(req, res) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => (dish.id === dishId));
  const { data: { name, description, price, image_url } = {} } = req.body;
  foundDish.name = name;
  foundDish.description = description;
  foundDish.price = price;
  foundDish.image_url = image_url;
  res.json({ data: foundDish });
};



// CANNOT DELETE DISHES


// list
  function list(req, res) {
  res.json({ data: dishes });
}


module.exports = {
  list,
  create: [
    isNameValid,
    isDescriptionValid,
    isPriceValid,
    isImageUrlValid, 
    create
  ],
  read: [dishExists, read],
  update: [
    dishExists,  
    dataIdMatchesDishId,
    isNameValid, 
    isDescriptionValid, 
    isPriceValid, 
    isImageUrlValid, 
    update
  ],
  
};