// Parse.initialize("nfztteVV7MIntRi6XTYfXwmQsBiArdW0enG5XRon", "igoQVxiiZYfbXDJ0luXN7vFOhXVthLPB9i9VpBnm");
// var temp;
// function getAllDishes(finalResult, successCB) {
//   var query = new Parse.Query("Dish");
//   query.find({
//     success: function(results) {
//       // alert("Successfully retrieved " + results.length + " scores.");
//       // Do something with the returned Parse.Object values
//       //  _allDishes = results
//       console.log("Dishes Successfully parsed");
//       console.log(results);
//       temp = results;
//       finalResult = results;
//       try{
//         successCB(finalResult);
//       }
//       catch(e){

//       }
//     },
//     error: function(error) {
//       console.log(error);
//       // alert("Error: " + error.code + " " + error.message);
//     }
//   });
//   return ;
// }

// function startFunction(cb){
//   var _allDishes;
//   getAllDishes(_allDishes, function(_allDishes){
//     availableDishes = document.getElementById('availableDishes');
//     tableBody = availableDishes.getElementsByTagName('tbody')[0];
//     var content = "";
//     for (var i = 0; i < _allDishes.length; i++) {
//       name = _allDishes[i].get('name');
//       content += '<tr>\n<td>\n' + name + '\n</td>\n</tr>';
//     }
//     tableBody.innerHTML = content;
//     try{
//       cb();
//     }
//     catch(e){
//       console.log("Some error occured.!");
//     }
//   });
// }
Parse.initialize("nfztteVV7MIntRi6XTYfXwmQsBiArdW0enG5XRon", "igoQVxiiZYfbXDJ0luXN7vFOhXVthLPB9i9VpBnm");
var gUnit;
var mlUnit;
var _allIngredients;
var _allIngredientTypes;
var _allDishes;
var _allQuantities;
var dishesByName = {};

function startFunction(mainCallBack) {
  //Flow is ->   getAllDishes -> getAllQuantities -> getAllIngredients -> getAllIngredientsTypes -> addOnFrontEnd -> mainCallBack
  console.log("Start Function");
  Parse.User.logOut();
  getUnitFor("g");
  getUnitFor("ml");
  // mlUnit = getUnitFor("ml");
  getAllDishes(mainCallBack);
  // getAllIngredients(getAllQuantities(getAllIngredientsTypes(getAllDishes(mainCallBack))));
  // getAllQuantities();
  // getAllIngredientsTypes();
  // getAllDishes();
}

function setAvailableDishes(){
  availableDishes = document.getElementById('availableDishes');
  tableBody = availableDishes.getElementsByTagName('tbody')[0];
  var content = "";
  for (var i = 0; i < _allDishes.length; i++) {
    name = _allDishes[i].get('name');
    dishesByName[name] = _allDishes[i];
    content += '\n<tr>\n<td>\n' + name + '\n</td>\n</tr>';
  }
  tableBody.innerHTML = content
  return ;
}

function addOnFrontEnd(successCB){
  console.log("addOnFrontEnd");;
  setAvailableDishes();
  try{
    console.log("Success")
    successCB();
  }
  catch(e){
    console.log("Some error occured.!");
  }
}

function getAllDishes(successCB, errorCB) {
  console.log("getAllDishes");
  var query = new Parse.Query("Dish");
  query.find({
    success: function(results) {
        // alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        _allDishes = results;
        try{
          getAllQuantities(successCB);
        }
        catch(e){

        }
      },
      error: function(error) {
        console.log(error);
        // alert("Error: " + error.code + " " + error.message);
      }
    });
}

function getAllQuantities(successCB) {
  console.log("getAllQuantities");
  var query = new Parse.Query("Quantity");
  query.find({
    success: function(results) {
      _allQuantities = results;
      try{
        getAllIngredients(successCB);
      }
      catch(e){

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}


function getAllIngredients(successCB) {
  console.log("getAllIngredients");
  var query = new Parse.Query("Ingredient");
  query.find({
    success: function(results) {
      _allIngredients = results;
      try{
        getAllIngredientsTypes(successCB);
      }
      catch(e){

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function getAllIngredientsTypes(successCB, errorCB) {
  console.log("getAllIngredientsTypes");
  var query = new Parse.Query("IngredientType");
  query.find({
    success: function(results) {
      _allIngredientTypes = results;
      try{
        addOnFrontEnd(successCB);
      }
      catch(e){

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function addDal() {
  var quantities = [];
  quantities.push(createQuantityObject(_allIngredients[0], "15"));
  quantities.push(createQuantityObject(_allIngredients[2], "25"));
  quantities.push(createQuantityObject(_allIngredients[6], "100"));
  quantities.push(createQuantityObject(_allIngredients[9], "7"));
  createDish("Sample Dal1", quantities, function(){
    console.log('Created Dal!');
  }, function(error){
    console.log('error in creating dal');
  });
}

function addRajma() {
  var quantities = [];
  quantities.push(createQuantityObject(_allIngredients[0], "15"));
  quantities.push(createQuantityObject(_allIngredients[4], "25"));
  quantities.push(createQuantityObject(_allIngredients[6], "100"));
  quantities.push(createQuantityObject(_allIngredients[9], "7"));
  createDish("Sample Rajma", quantities, function(){
    console.log('Rajma!');
  }, function(error){
    console.log('error in creating RAjma');
  });
}


function getUnitFor(unitId) {
  var query = new Parse.Query("Unit");
  query.equalTo("unit", unitId);
  query.find().then(function(units) {
    console.log('unit = ' + units[0].get("displayString") + units[0].get('unit'));
    if(unitId == 'g'){
      gUnit = units[0];
    }else{
      mlUnit = units[0];
    }
  });
}


// create ingredient
function createIngredient(name, type, unit) {
  var IngredientClass = Parse.Object.extend("Ingredient");
  var ingredient = new IngredientClass();
  ingredient.set("name", name);
  if(unit == "g"){
    ingredient.set("unit", gUnit);
  } else if (unit == "ml"){
    ingredient.set("unit", mlUnit);
  }
  

  var query = new Parse.Query("IngredientType");
  query.equalTo("name", type);
  query.find().then(function(types) {
    if(types.length == 0 || types.length > 1){
      return Parse.Promise.error("wrong type of ingredient.");
    }else{
      ingredient.set("ingredientType", types[0]);
      ingredient.save();
    }
  }).then(function(ingredient){
    console.log('ingredient saved Successfully');
  }, function(error) {
    console.log(error);
  });
}

/**
* Create dish
* Parameters:
*   successCB called on success
*   errorCB called on error with errorCB(error)
*   name, name of the dish
*   quantities, array of Quantity objects
*/
function createDish(name, quantities, successCB, errorCB) {
  var DishClass = Parse.Object.extend("Dish");
  var dish = new DishClass();
  dish.set("name", name);
  dish.set("quantities", quantities);
  dish.save({
    success: function(dish) {
      // The object was saved successfully.
      successCB();
    },
    error: function(dish, error) {
      // The save failed.
      // error is a Parse.Error with an error code and message.
      errorCB(error);
    }
  });
}

/**
 *  Create Quantity Object
 *  Returns quantity object
 */
 function createQuantityObject(ingredient, amount) {
  var Quantity = Parse.Object.extend("Quantity");
  var quantity = new Quantity();
  quantity.set("ingredient", ingredient);
  quantity.set("amount", amount);
  return quantity;
}

// save dish
// function getAllDishes(successCB, errorCB) {
//   var query = new Parse.Query("Dish");
//   query.find({
//     success: function(results) {
//         // alert("Successfully retrieved " + results.length + " scores.");
//         // Do something with the returned Parse.Object values
//         _allDishes = results;
//         console.log('_allDishes = ' + _allDishes);
//         try{
//           successCB(_allDishes);
//         }
//         catch(e){

//         }
//       },
//       error: function(error) {
//         console.log(error);
//         // alert("Error: " + error.code + " " + error.message);
//       }
//     });
// }

function checkAndAddUser(emailId, successCB, errorCB) {
  findUserForEmail(emailId, function(user) {
    if(user.length == 0){
      addUserForEmail(emailId, successCB, errorCB);
    } else {
      if(successCB){
        successCB(user[0]);
      }
    }
  }, function(error) {
    if(errorCB){
      errorCB(error);
    }
    console.log('error in adding user');
  });
}

function addUserForEmail(emailId, successCB, errorCB) {
  var user = new Parse.User();
  user.set("email", emailId);
  user.set("username", emailId);
  user.set("password", 'password');
  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      if(successCB){
        successCB(user);
      }
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
      if(errorCB){
        errorCB(error);
      }     
    }
  });
}

function findUserForEmail(emailId, successCB, errorCB) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("email", emailId);  // find all the women
  query.find({
    success: function(user) {
      // Do stuff
      successCB(user);
    },
    error: function(error) {
      errorCB(error);
    }
  });
}

function getAllSuggestions() {
  var currentUser = Parse.User.current();
  return currentUser.suggestion;
}

function prepareOrder(selectedDishes) {
  var OrderClass = Parse.Object.extend("Order");
  var QuantityClass = Parse.Object.extend("Quantity");
  var order = new OrderClass();
  var dishRelation = order.relation("selectedDishes");
  var quantityRelation = order.relation("selectedDishes");
  for (var i = 0; i < selectedDishes.length; i++) {
    dishRelation.add(selectedDishes[i]);

    // dish for this selectedDish object
    var dish = selectedDishes[i].get('dish');

    // for each ingredient of this dish, find out quantity
    for (var j = 0; i < dish.get('quantities').length; j++) {
      var quantity = dish.get('quantities')[j];
      var ingredient = quantity.get('ingredient');
      var amount = quantity.get('amount');

      var found = false;
      // search existing quantities, if this ingredient exists
      var orderQuantities = order.get('quantities');
      for (var k = 0; k < orderQuantities.length; k++) {
        if(orderQuantities[k].get('ingredient') == ingredient) {
          orderQuantities[k].get('amount') = (orderQuantities[k].get('amount')*1.0 + amount*1.0).toString();
          found = true;
          break;
        }
      };

      if(found == false){
        quantityRelation.add(quantity);
      }
    };    
  };

  return order;
}

function getLastOrderOfUser(user) {
  if(user.orders){
    return user.orders[user.orders.length-1];
  }
  return null;
}

function getAllUsers(successCB, errorCB) {
  var query = new Parse.Query(Parse.User);
  query.find({
    success: function(users) {
      // Do stuff
      successCB(users);
    },
    error: function(error) {
      errorCB(error);
    }
  });
}

// defaultStuff();