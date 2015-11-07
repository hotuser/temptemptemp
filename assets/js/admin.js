var pencilIcon = '<span class=" text-right editButton">\
<button data-original-title="Edit" type="button" rel="tooltip" class="btn btn-warning btn-simple btn-xs">\
<i class="fa fa-pencil"></i>\
</button>\
</span>';

var removeIcon = '<tr>\n<td class="td-actions removeButton">\n<button data-original-title="" \
type="button" rel="tooltip" class="btn btn-success btn-simple btn-xs">\n<i class="fa fa-minus"></i>\
</button>\n</td>\n';


function display(obj){
	console.log(JSON.stringify(obj));
}

function editMyDish(dishName){
	// display(dishesByName);
	myDish = dishesByName[dishName];
	quantities = myDish.get('quantities');
	$('#vegetablesTable tbody').html('');
	$('#groceryTable tbody').html('');
	$('#spicesTable tbody').html('');

	for (var i = 0; i < quantities.length; i++) {
		var ingredient = quantities[i].get('ingredient');
		var amount = quantities[i].get('amount');
		var ingredientName = ingredient.get('name');
		var id = ingredient.id;
		var unitDisplayString = ingredient.get('unit').get('displayString');
		var ingredientType = ingredient.get('ingredientType').get('name');
		var dishObj = {'ingredientName': ingredientName, 'amount': amount, 'unitDisplayString': unitDisplayString, 'id': id};
		ingredientType = ingredientType.toUpperCase();
		display(dishObj);
		switch(ingredientType){
			case 'VEGETABLE':
			addIngredient(dishObj, vegetablesItems, 'vegetablesTable');
			break;
			case 'CEREAL':
			case 'OIL':
			addIngredient(dishObj, groceryItems, 'groceryTable');
			break;
			case 'SPICE':
			addIngredient(dishObj, spicesItems, 'spicesTable');

			break;
		}
	};
}

function deleteMyDish(dishName,successCB, errorCB){
	bootbox.confirm("Are you sure you want to delete " + dishName, function(decision){
		if(decision == false){
			return false;
		}
		myDish = dishesByName[dishName];
		if(myDish){
			destroyDish(myDish,function(){
				notifySend('Deleted Successfully', 'danger');
				setTimeout(function(){
					location.reload();
				}, 750)
			}, function(){
				notifySend('Some error occured', 'warning');
			});
			return true;
		}
	});
}


function addIngredient(dishObj, listOfItems, tableId, isQuantityAdd){
	appendString = removeIcon + '<td>\n<div class="item" id="' + dishObj['id'] + '" style="display: inline">' + 
	dishObj['ingredientName'] + '</div>' + '</td>\n<td>\n<div class="quantity" style="display: inline">' +
	'<div class="amount" style="display: inline">' + dishObj['amount'] + '</div>'  + ' ' +
	dishObj['unitDisplayString'] + '</div>\n</div>' +
	pencilIcon + '\n</td>\n</tr>';
	console.log(tableId);
	$('#' + tableId+ ' tbody').append(appendString);
	// alert(JSON.stringify(quantityToAdd));
	if(isQuantityAdd){
		if(currentDish){
			var quantityToAdd = createQuantityObject(searchItemById(_allIngredients, dishObj['id']), '1');
			quantityToAdd.save({
				success: function(dish) {
					currentDish.get('quantities').push(quantityToAdd);
					updateDish(currentDish);
				},
				error: function(dish, error) {
					errorCB(error);
				}
			});
		}
	}
}

function deleteQuantityById(id){
	for (var i = 0; i < currentDish.get('quantities').length; i++) {
		if(currentDish.get('quantities')[i].get('ingredient').id == id){
			currentDish.get('quantities').splice(i,1);
			updateDish(currentDish, function(){
				console.log("Deleted Successfully");
			}, function(){
				console.log("Error in deleting");
			});
		}
	}
}

function addQuantity(dishObj, listOfItems, tableId){
	if(currentDish){

	}
}


function addGrocery(){

}

function addSpices(){
	alert("spices");

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

function notifySend(text, type){
	$(".alert").remove();

	$.notify({
		// icon: 'pe-7s-gift',
		message: text

	},{
		type: type,
		timer: 1000
	});

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



// Where to put OIL
// Edit and save the content of dish
// Understanding the structure of spice

function editValue(obj){
	var className = obj.closest('td').find('div').attr('class').toString();
	console.log(className);
	switch(className.toUpperCase()){
		case 'ITEM':
		changeItem(obj);
		break;
		
		case 'QUANTITY':
		changeQuantity(obj);
		break;
	}
	// alert(className);
}



function getCurrentDishName(name){
	return currentDish.get('name');
}

function getItemName(obj){
	return obj.closest('tr').find('.item').html().trim().toString();
}

function changeItem(obj){
	bootbox.prompt("Enter new item", function(editedItem){
		// var editedItem = prompt("Enter new item");
		if(editedItem == null){
			console.log("Invalid input");
			return ;
		} else{
			editedItem = editedItem.toString();
			var itemName = getItemName(obj);
			var quantities = currentDish.get('quantities');
			for (var i = 0; i < quantities.length; i++) {
				if(quantities[i].get('ingredient').get('name').toString() == itemName){
					quantities[i].get('ingredient').set('name', editedItem);
					break;
				}
			};
			updateDish(currentDish, function(){
				notifySend("Updated Successfully", 'info');
			}, function(){
				notifySend("Error in Updating", 'danger');
			});
			obj.parent().find('.item').html(editedItem);
		}
	});
}	

function changeQuantity(obj){
	bootbox.prompt("Enter new value", function(editedVal){

		if(parseInt(editedVal)!=editedVal){
			console.log("Invalid input")
			// bootbox.alert("Please enter correct value", function(results){return ; });
			return ;
		}
		else{
			var itemName = getItemName(obj);
			var quantities = currentDish.get('quantities');
			for (var i = 0; i < quantities.length; i++) {
				if(quantities[i].get('ingredient').get('name').toString() == itemName){
					quantities[i].set('amount', editedVal.toString());
					break;
				}
			};
			updateDish(currentDish, function(){
				notifySend("Updated Succesfully", 'info');
			}, function(){
				notifySend("Error in Updating", 'warning');
			});
			obj.parent().find('.amount').html(editedVal);
		}
	});
}


function selectCurrentDish(obj){
	var value = obj.parents('tr:first').find('span').attr('value');
	currentDish = _allDishes[parseInt(value)];
	// alert(JSON.stringify(_allDishes[parseInt(value)]));
	return ;
}

function findUnit(unit){
	switch(unit.toUpperCase()){
		case 'GRAMS':
		return {unit: 'g', displayString: 'grams'};
		case 'ML':
		return {unit: 'ml', displayString: 'ml'}
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

function newRowAtLast(id, text){
	$("#" + id).find('tbody').append('<tr><td><span class="' + text.replace(' ', '') + '">' + text + '<span class="btn btn-xs btn-simple">\
		(<i class="fa fa-plus appendInTable"></i>)</td><td></td>');
}

$(".NewDish").click(function(e){
	var name = prompt("Enter the dish name");
	var amount = prompt("Enter amount");
	var unit = prompt("Enter unit");

});


function showNewlyAddedDish(){

}