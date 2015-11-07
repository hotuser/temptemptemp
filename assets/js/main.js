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
Parse.initialize("t3CyAQBdac2G0OeEl3bnR2tqj7Yd2OGwHQhxWkn7", "JYeb6NDSLlpUi6VnVCm6CrYbuI7USiQd9dl9Xxmf");
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
  if(availableDishes == undefined){
    console.log("Returned");
    return ;
  }
  tableBody = availableDishes.getElementsByTagName('tbody')[0];
  var content = "";
  for (var i = 0; i < _allDishes.length; i++) {
    var name = _allDishes[i].get('name');
    var id = _allDishes[i].id
    dishesByName[name] = _allDishes[i];
    content += '\n<tr>\n<td>\n<span value="' + i + '" id="' + id + '">' + name + '\n</td>\n</tr>';
  }
  tableBody.innerHTML = content
  return ;
}

function updateDish(dish, successCB, errorCB) {
  // dish.set("quantities", quantities);
  dish.save({
    success: function(dish) {
      // The object was saved successfully.
      try{
        successCB();
      }
      catch(e){

      }
    },
    error: function(dish, error) {
      // The save failed.
      // error is a Parse.Error with an error code and message.
      try{
        errorCB(error);
      }
      catch(e){

      }
    }
  });
}

function deleteObject(object, successCB, errorCB) {
  object.destroy({
    success: function(object) {
        // The object was deleted from the Parse Cloud.
        if(successCB) {
          successCB();
        }
      },
      error: function(object, error) {
        // The delete failed.
        // error is a Parse.Error with an error code and message.
        if(errorCB) {
          errorCB(error);
        }
      }
    });
}

function destroyDish(object, successCB, errorCB){
  object.destroy({
    success: function(object) {
      // The object was deleted from the Parse Cloud.
      if(successCB) {
        successCB();
      }
    },
    error: function(object, error) {
      // The delete failed.
      // error is a Parse.Error with an error code and message.
      if(errorCB) {
        errorCB(error);
      }
    }
  });
}

function addOnFrontEnd(successCB){
  console.log("addOnFrontEnd");;
  setAvailableDishes();
  // try{
    console.log("Success")
    successCB();
  // }
  // catch(e){
    // console.log("Some error occured.!");
  // }
}

function getAllDishes(successCB, errorCB ,onlySuccessCB ) {
  //The role of the nextCallBackBool is that, call the function getAllQuantities when it is not true, else just call the successCB
  console.log("getAllDishes");

  var query = new Parse.Query("Dish");
  query.limit(1000);
  query.find({
    success: function(results) {
        // alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        _allDishes = results;
        try{
          if(onlySuccessCB != true)
            getAllQuantities(successCB);
          else
            successCB()
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


function getAllQuantities(successCB, onlySuccessCB) {
  console.log("getAllQuantities");
  var query = new Parse.Query("Quantity");
  query.limit(1000);

  query.find({
    success: function(results) {
      _allQuantities = results;
      try{
        if(onlySuccessCB!=true)
          getAllIngredients(successCB);
        else
          successCB(results);
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
  query.limit(1000);

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
  query.limit(1000);

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

function createSelectDish(dish, servings) {
  var SelectDishClass = Parse.Object.extend("SelectDish");
  var selectDish = new SelectDishClass();
  selectDish.set('dish', dish);
  selectDish.set('people', servings);
  return selectDish;
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
  user.set("isActive", true);
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
      if(successCB)
        successCB(user);
    },
    error: function(error) {
      if(errorCB)
        errorCB(error);
    }
  });
}

function deleteUser(user, successCB, errorCB) {
  user.set('isActive', false);
  updateUser(user, successCB, errorCB);
}

function updateUser(user, successCB, errorCB) {
  user.save({
    success: function(user) {
          // The object was saved successfully.
          if(successCB){
            successCB();
          }
        },
        error: function(user, error) {
          // The save failed.
          // error is a Parse.Error with an error code and message.
          if(errorCB){
            errorCB(error);
          }
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
  query.equalTo('isActive', true);
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

function searchItemById(_allItems,key,successCB, errorCB){
  try{
    var item = $.grep(_allItems, function(e){ return e.id == key; })[0];
    return item;
    if(successCB){
      successCB();
    }
  }
  catch(e){
    if(errorCB){
      errorCB();
    }
  }
}


function addUniqueDish(quantityObject,successCB, errorCB){
  dish.addUnique("quantities", quantityObject);
  dish.save({
    success: function(dish) {
      // The object was saved successfully.
      try{
        successCB();
      }
      catch(e){

      }
    },
    error: function(dish, error) {
      // The save failed.
      // error is a Parse.Error with an error code and message.
      try{
        errorCB(error);
      }
      catch(e){

      }
    }
  });
}

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
// defaultStuff();


function loginUserForEmail(email, successCB, errorCB) {
  Parse.User.logOut();
  Parse.User.logIn(email, "password", {
    success: function(user) {
      // Do stuff after successful login.
      if(successCB){
        successCB(user);
      }
    },
    error: function(user, error) {
      // The login failed. Check error to see why.
      if(errorCB) {
        errorCB();
      }
    }
  });
}


function createAndSaveOrder(selectedDishes, quantities,comment, successCB, errorCB) {
  var OrderClass = Parse.Object.extend("Order");
  var order = new OrderClass();
  order.set('selectedDishes', selectedDishes);
  order.set('quantities', quantities);
  order.set('comment', comment)
  order.save({
    success: function(order) {
      // The object was saved successfully.
      successCB(order);
    },
    error: function(order, error) {
      // The save failed.
      // error is a Parse.Error with an error code and message.
      errorCB(error);
    }
  });
  return order;
}



function getCompleteSelectDishObject(id, successCB, errorCB){
  var SelectDishClass = Parse.Object.extend("SelectDish");
  var query = new Parse.Query(SelectDishClass);
  query.get(id, {
   success: function(quantity) {
     // The object was retrieved successfully.
     console.log(quantity);
     if(successCB){
       successCB(quantity);
     }
   },
   error: function(object, error) {
    console.log("Some error occured");
    if(errorCB){
      errorCB(object, error);
    }
     // The object was not retrieved successfully.
     // error is a Parse.Error with an error code and message.
   }
 });
}



function getCompleteOrderObject(id, successCB, errorCB){
  var OrderClass = Parse.Object.extend("Order");
  var query = new Parse.Query(OrderClass);
  query.get(id, {
   success: function(order) {
     // The object was retrieved successfully.
     console.log(order);
     if(successCB){
       successCB(order);
     }
   },
   error: function(object, error) {
    console.log("Some error occured");
    if(errorCB){
      errorCB(object, error);
    }
     // The object was not retrieved successfully.
     // error is a Parse.Error with an error code and message.
   }
 });
}


function getAllSelectDish(successCB,errorCB,onlySuccessCB) {
  console.log("getAllSelectDish");
  var query = new Parse.Query("SelectDish");
  query.limit(1000);

  query.find({
    success: function(results) {
      _allSelectDish = results;
      try{
        if(onlySuccessCB !=true){
          getAllIngredientsTypes(successCB);
        }
        else
          successCB(results);
      }
      catch(e){

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}