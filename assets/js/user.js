var pencilIcon = '<span class=" text-right editButton">\
<button data-original-title="Edit" type="button" rel="tooltip" class="btn btn-warning btn-simple btn-xs">\
<i class="fa fa-pencil"></i>\
</button>\
</span>';

var incrementDecrement = '<td><i class="fa fa-chevron-left 	decrementServings changeServings btn btn-simple" style="color: grey; padding: 0"></i> 		<span class="servings">' 
var incrementDecrement2 = '</span> <i class="fa fa-chevron-right incrementServings changeServings 	btn btn-simple" style="color: grey; padding: 0 !important"></i></td>'

function newRowAtLast(id, text){
	$("#" + id).find('tbody').append('<tr><td><span class="' + text.replace(' ', '') + '">' + text + '<span class="btn btn-xs btn-simple">\
		(<i class="fa fa-plus appendInTable"></i>)</td><td></td>');
}


function addDishesInTable(content,contentId,tableId, people, index, successCB ){
	var tbody = $("#" + tableId + " tbody");
	if(tableId == 'suggestionsTable'){
		var row = '<tr class="tableRow"><td class="tableCell"> <span id="' + contentId + /*'" index="' + index +*/ '"  >' + content + 
		'</span></td><td>' + incrementDecrement + people + incrementDecrement2 + '</td></tr>'
		currentSuggestedDishes[contentId] = true;
		currentDishByName[content] = true;
	}
	else if(tableId == 'ordersTable'){
		var row = '<tr class="tableRow"><td class="tableCell"> <span id="' + contentId + /*'" index="' + index +*/ '"  >' + content + 
		'</span></td><td>' +  '</td></tr>'
		currentOrders[content] = true;
	}

	tbody.append(row);
	if(successCB){
		successCB();
	}
}

function resetTable(id){
	$("#" + id + " tbody").html('');
}

function showSuggestiosForUser(username, userId, successCB){
	currentSuggestedDishes = {};
	currentDishByName = {};
	//===================== This is remaining
	//Put the code here to get all the suggestions for the user and store them in var suggestedDishes
	var user = searchItemById(_allUsers, userId);
	// alert(user);
	var tableId = 'suggestionsTable';
	resetTable(tableId);
	var suggestedDishes = user.get('suggestion');
	if(suggestedDishes){
		for (var i = 0; i < suggestedDishes.length; i++) {
			var dishId = suggestedDishes[i].id;
			try{
				//If it is already preloaded, then do not load it again from parse
				var dish = suggestedDishes[i].get('dish');
				var people = suggestedDishes[i].get('people');
				var dishName = dish.get('name');
				addDishesInTable(dishName, dishId, tableId, people);
			}
			catch(e){
				//If it's for the first time, then just load the complete object
				getCompleteSelectDishObject(dishId, function(quantity){
					var dish = quantity.get('dish');
					var dishName = dish.get('name');
					var people = quantity.get('people');
					addDishesInTable(dishName, dish.id, tableId, people);
				}, function(){
					console.log("Not found");	
				})
			}

		};
	}

	if(successCB){
		successCB();
	}
}


function showOrdersForUser(username, userId, successCB){
	currentOrders = {};
	//===================== This is remaining
	//Put the code here to get all the suggestions for the user and store them in var suggestedDishes
	var user = searchItemById(_allUsers, userId);
	// alert(user);
	var tableId = 'ordersTable';
	resetTable(tableId);
	console.log(user.get('username'));
	var orders = user.get('orders');
	console.log("Order is this");
	console.log(JSON.stringify(orders));
	if(orders !=undefined){
		for (var i = 0; i < orders.length; i++) {
			var orderId = orders[i].id;
			try{
				//If it is already preloaded, then do not load it again from parse
				var orderDate = orders[i].get('createdAt').toDateString();
				console.log(orderDate);
				addDishesInTable(orderDate, orderId, tableId);
			}
			catch(e){
				//If it's for the first time, then just load the complete object
				getCompleteOrderObject(orderId, function(orders){
					var orderDate = orders.get('createdAt').toDateString();
					addDishesInTable(orderDate,orderId,tableId);
				}, function(){	
					console.log("Not found");	
				})
			}

		};
	}

	if(successCB){
		successCB();
	}
}

function addSuggestionsForUser(dishName, id, tableId, people, successCB, errorCB){
	if(currentDishByName[dishName] != undefined){
		return ;
	}
	else{
		addDishesInTable(dishName, id, tableId, people);
		currentSuggestedDishes[id] = true;
		currentDishByName[dishName] = true;
	}
}


// function createSelectDish(dish, servings) {
// 	var SelectDishClass = Parse.Object.extend("SelectDish");
// 	var selectDish = new SelectDishClass();
// 	selectDish.set('dish', dish);
// 	selectDish.set('people', servings);
// 	return selectDish;
// }



function saveSuggestionForUser(successCB, errorCB, mainCB){
	var suggestionArray = [];
	for (var key in currentSuggestedDishes) {
		getCompleteSelectDishObject(key, function(quantity){
			suggestionArray.push(quantity);
			console.log("Pushing");
		}, function(obj, error){
			if(errorCB)
				errorCB(obj,error);
		});
	}
	mainCB(suggestionArray);
	console.log("Pushing should be finished by now");
	console.log(JSON.stringify(suggestionArray));
	var currentUserId = currentUser.id;
	var user = searchItemById(_allUsers, currentUserId);
	user.set('suggesion', suggestionArray);
	updateUser(user, function(user){
		if(successCB)
			successCB(user);
	}, function(user, error){
		if(errorCB)
			errorCB();
	});
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