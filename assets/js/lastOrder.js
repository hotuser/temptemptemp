function getOrderById(id, successCB, errorCB ) {
  //The role of the nextCallBackBool is that, call the function getAllQuantities when it is not true, else just call the successCB
  if(id.length!=10){
  	return ;
  }
  console.log("getOrderById");
  var orderClass = Parse.Object.extend("Order");
  var query = new Parse.Query(orderClass);

  query.get(id, {
    success: function(results) {
        // alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        currentOrder = results;
        // try{
          var quantities = currentOrder.get('quantities');
          var selectedDishes = currentOrder.get('selectedDishes');
          showLastOrder(quantities, selectedDishes);
        // }
        // catch(e){

        // }
      },
      error: function(obj, error) {
        console.log(error);
        // alert("Error: " + error.code + " " + error.message);
      }
    });
}

function showLastOrder(quantites, selectedDishes){
  showSelectedDishes(selectedDishes);
  showQuantities(quantites);
  var date = currentOrder.get('createdAt').toDateString();
  console.log(date);
  $(".lastOrderTopLeft").html("<b>Order: " + finalOrderId + ", " + date + "</b>")
}


function showQuantities(quantities){
  for (var i = quantities.length - 1; i >= 0; i--) {
    var q = quantities[i];
    var ingredient = q.get('ingredient');
    var amount =q.get('amount');
    var unit = ingredient.get('unit').id;
    if(unit == 'Lu2C8gwuMU'){
      unit = 'grams'
    }
    else{
      unit = 'ml';
    }
    var name = ingredient.get('name');
    var type = ingredient.get('ingredientType').get('name');
    console.log(type);
    console.log(name);
    console.log(amount);
    var tableId;
    if(type == 'Vegetable')
      tableId = 'vegetablesTable';
    else if(type == 'Cereal'  || type == 'oil'){
      tableId = 'groceryTable';
    }
    else{
      tableId = 'spicesTable';
    }
    $("#" + tableId).find('tbody').append('<tr><td>' + name + '</td><td>' + amount  + " " + unit + '</td></tr>')
  };
}

function showSelectedDishes(selectedDishes){
  for (var i = 0; i < selectedDishes.length; i++) {
    var s = selectedDishes[i];
    var dishName = s.get('dish').get('name');
    var people = s.get('people');
    $("#selectedDishes tbody").append('<tr><td>' +dishName+ '</td><td>' +people + '</td></tr>')
  };
}


function getFinalSelectDish(successCB,errorCB,onlySuccessCB) {
  console.log("getAllSelectDish");
  var query = new Parse.Query("SelectDish");
  query.limit(1000);

  query.find({
    success: function(results) {
      _allSelectDish = results;
      try{
        getOrderById(finalOrderId);
        // successCB(results);
      }
      catch(e){

      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}