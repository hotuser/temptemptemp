var pencilIcon = '<span class=" text-right editButton">\
<button data-original-title="Edit" type="button" rel="tooltip" class="btn btn-warning btn-simple btn-xs">\
<i class="fa fa-pencil"></i>\
</button>\
</span>';


var removeIcon = '<tr>\n<td class="td-actions removeButton">\n<button data-original-title="" \
type="button" rel="tooltip" class="btn btn-success btn-simple btn-xs">\n<i class="fa fa-minus"></i>\
</button>\n</td>\n<td>';


function display(obj){
	console.log(JSON.stringify(obj));
}
function addMyDish(dishName,change){
	//Set the default value of change
	if(typeof(change) == undefined){
		change=1;
	}

	// display(dishesByName);
	myDish = dishesByName[dishName];
	quantities = myDish.get('quantities');
	for (var i = 0; i < quantities.length; i++) {
		var ingredient = quantities[i].get('ingredient');
		var amount = quantities[i].get('amount');
		var ingredientName = ingredient.get('name');
		var unitDisplayString = ingredient.get('unit').get('displayString');
		var id = ingredient.id;
		var ingredientType = ingredient.get('ingredientType').get('name');
		var dishObj = {'ingredientName': ingredientName, 'amount': amount, 'unitDisplayString': unitDisplayString, 'id': id};
		ingredientType = ingredientType.toUpperCase();
		display(dishObj);
		switch(ingredientType){
			case 'VEGETABLE':
			addIngredient(dishObj, vegetablesItems, 'vegetablesTable',change);
			break;
			case 'CEREAL':
			case 'OIL':
			addIngredient(dishObj, groceryItems, 'groceryTable',change);
			break;
			case 'SPICE':
			addIngredient(dishObj, spicesItems, 'spicesTable',change);
			break;
		}
	};
}


function addIngredient(dishObj, listOfItems, tableId, change){
	//If the vegetable does not exist, then create a new row and insert
	if(listOfItems[dishObj['ingredientName']] == undefined && change!=-1){
		if(tableId == 'vegetablesTable'){
			appendString = removeIcon + '\n<div class="item" id="' + dishObj['id'] + '" style="display: inline">' + 
			dishObj['ingredientName'] + '</div>' + '</td>\n<td>\n<div class="quantity" style="display: inline">' +
			'<div class="amount" style="display: inline">' + dishObj['amount'] + '</div>'  + ' ' +
			dishObj['unitDisplayString'] + '</div>\n</div>' +
			pencilIcon + '\n</td>\n</tr>';
			$('#' + tableId+ ' tbody').append(appendString);
			listOfItems[dishObj['ingredientName']] = true;
		}
		else{
			appendString = removeIcon + '\n<div class="item" id="' + dishObj['id'] + '" style="display: inline">' + 
			dishObj['ingredientName'] + '</div>' + '</td>\n<td class="noDisplay">\n<div class="quantity" style="display: inline">' +
			'<div class="amount" style="display: inline">' + dishObj['amount'] + '</div>'  + ' ' +
			dishObj['unitDisplayString'] + '</div>\n</div>' +
			pencilIcon + '\n</td>\n</tr>';
			$('#' + tableId+ ' tbody').append(appendString);
			listOfItems[dishObj['ingredientName']] = true;
		}
	}
	else{
		//Else, add in the previous row
		$("#" + tableId + " table tr td:nth-child(2) .item").each(function (i) {
			var item = $(this).html().trim();
			if (item == dishObj['ingredientName']){
				var $node = $(this).closest('tr').find('.amount');
				console.log($node.html());
				var currentVal = parseInt($node.html());
				var text = currentVal + change * parseInt(dishObj['amount']);
				console.log(text);
				if(text > 0){
					$node.html(text);
				}
				else{
					//Else delete the node
					$node.closest('tr').find('.removeButton').click();
					listOfItems[dishObj['ingredientName']] = undefined;
					// selectedItems[dishName] = false;
					// return ;
				}
				return ;
			}
		});
	}
	return ;
}

function dataClick(e) {
	console.log(e);
	if (e.currentTarget.innerHTML != "") return;
	if(e.currentTarget.contentEditable != null){
		$(e.currentTarget).attr("contentEditable",true);
	}
	else{
		$(e.currentTarget).append("<input type='text'>");
	}    
}

function notifySend(text, type, cb){
	$(".alert").remove();

	$.notify({
		// icon: 'pe-7s-gift',
		message: text

	},{
		type: type,
		timer: 1000
	});
	if(cb){
		cb();
	}

}


function addInSelectedDishes(trElement){
	
}

function getItemName(obj){
	//Returns the item name from the tr object
	var $name = obj.children('td:nth-child(2)').html().trim();
	return $name;
}

function getDishName(obj){
	//Returns the dish name from the tr object
	var $name = obj.children('td:nth-child(1)').html().trim();
	return $name;
}

function removeFromArray(obj){
	divId = obj.closest('div').attr('id');
	switch(divId){
		case('selectedDishes'):
		selectedItems[getDishName(obj)] = undefined;
		break;
		case('vegetablesTable'):
		vegetablesItems[getItemName(obj)] = undefined;
		break;

		case('groceryTable'):
		groceryItems[getItemName(obj)] = undefined;
		break;

		case('spicesTable'):
		spicesItems[getItemName(obj)] = undefined;
		break;
	}
}



function getAllIngredientsArray(name){
	
	var ingredients = [];
	var selectors = {
		//IngredientTypeName : name
		'Vegetable' : 'Vegetables' ,
		'Spice' : 'Spices',
		'Oil' : 'Grocery',
		'Cereal' : 'Grocery'
	};

	for (var i = 0; i < _allIngredients.length; i++) {
		if( selectors[_allIngredients[i].get('ingredientType').get('name').toString()] == name){
			ingredients.push({'name': _allIngredients[i].get('name'), 'id':_allIngredients[i].id, 'unit': _allIngredients[i].get('unit').get('displayString')});
		}
	};

	return ingredients;
}



function appendInSelectedDishes(text, value, id){
	$('#selectedDishes tr:last').after('<tr>\n<td value="' +  value  + '" id="' + id + '" >'+text+'</td>\n<td><i class="fa fa-chevron-left \
		decrementServings changeServings btn btn-simple" style="color: grey; padding: 0"></i> \
		<span class="servings">1</span> <i class="fa fa-chevron-right incrementServings changeServings \
		btn btn-simple" style="color: grey; padding: 0 !important"></i></td>\n' + removeText + '</tr>');
}

function showSuggestedDishes(){
	var currentLoggedInUser = Parse.User.current();
	var suggestions = currentLoggedInUser.get('suggestion');
	if(suggestions){
		for (var i = 0; i < suggestions.length; i++) {
			var id = suggestions[i].id;
			getCompleteSelectDishObject(id, function(quantity){
				var id = quantity.get('dish').id;
				var people = quantity.get('people');
				var mainDish = searchItemById(_allDishes, id)
				var $node = $("#" + id);
				$node.closest('tr').find('.addDishesButton').click();
				$node.closest('tr').css({"display": "none"});
				var $node2 = $("#selectedDishes table").find("#" + id).closest("tr").find('.incrementServings');
				setTimeout(function(){
					for (var i = 0; i < parseInt(people)-1; i++) {
						$node2.click();
					};
				}, 750);
			}, function(obj, err){
				console.log("Some error occured");
			})
		};
	}
}

function retrieveQuantity(id, amount){
	//This id is ingredient id
	var tempIngredient  = searchItemById(_allIngredients, id);
	return createQuantityObject(tempIngredient, amount);
	// for (var i = 0; i < _allQuantities.length; i++) {
	// 	if(_allQuantities[i].get('ingredient').id == id){
	// 		return _allQuantities[i];
	// 	}
	// };
}


function saveFinalOrderFromUser(successCB){
	if(isOrderPlaced == true){
		return ;
	}
	//First get all the selectDishObject
	var FinalSelectDish = [];
	$("#selectedDishes table .removeButton").each(function(i){
		var $node = $(this).closest('tr');
		var dishId = $node.find('td:nth-child(1)').attr('id');
		console.log(dishId);
		var servings = $node.find('.servings').html().trim();
		var dish = searchItemById(_allDishes, dishId);
		if(dish!=null && (dishId.length == 10) ){
			console.log(parseInt(servings) == servings)
			if(parseInt(servings) == servings){
				tempSelectDish = createSelectDish(dish, parseInt(servings));
				// alert(JSON.stringify(tempSelectDish));
				FinalSelectDish.push(tempSelectDish);
			}
		}
	});

	//Now time for quantities
	var FinalQuantities = [];
	$(".table.table-bordered").find('td:nth-child(2) .item').each(function(){
		var tempId = $(this).attr('id');
		var amount = $(this).closest('tr').find('td:nth-child(3) .amount').html().trim();
		if(tempId.length == 10){
			var tempQuantity = retrieveQuantity(tempId, amount);
			console.log(tempQuantity);
			FinalQuantities.push(tempQuantity);
		}
	});
	var comment = $("#comment").val().trim();
	//Now just create And save order
	if(FinalSelectDish.length || FinalQuantities.length){ //Set this logic according to what is a valid order
		createAndSaveOrder(FinalSelectDish, FinalQuantities, comment,  function(order){
			Parse.User.current().add('orders', order);
			// Parse.User.current().set('')
			Parse.User.current().save({
				success: function(){
					notifySend("Your order has been succesfully placed, thanks for using Grocery 2.0");
					var orders = Parse.User.current().get('orders');
					var id = orders[orders.length-1].id
					window.location.href="lastOrder.html?orderId=" + id;
					
				}
			});
			// isOrderPlaced = true;
		}, function(error){
			console.log(JSON.stringify(error));
			notifySend("Some error occured while placing order, please try after sometime");
		});
	}
	else{
		console.log("Empty");
	}
	if(successCB){
		// successCB();
	}
	return ;
}

// function saveOrderInUserTable(order, cb){
// 	var id = order.id;
// 	var obj = {"__type": "Pointer", "className" : "Order", "objectId": id};
// 	Parse.User.current().get('orders').push(obj);
// 	Parse.User.current().save();
// 	cb();
// }