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
function addMyDish(dishName){
	// display(dishesByName);
	myDish = dishesByName[dishName];
	quantities = myDish.get('quantities');
	for (var i = 0; i < quantities.length; i++) {
		var ingredient = quantities[i].get('ingredient');
		var amount = quantities[i].get('amount');
		var ingredientName = ingredient.get('name');
		var unitDisplayString = ingredient.get('unit').get('displayString');
		var ingredientType = ingredient.get('ingredientType').get('name');
		var dishObj = {'ingredientName': ingredientName, 'amount': amount, 'unitDisplayString': unitDisplayString};
		ingredientType = ingredientType.toUpperCase();
		display(dishObj);
		switch(ingredientType){
			case 'VEGETABLE':
			case 'CEREAL':
			case 'OIL':
				if(ingredientType == 'VEGETABLE'){
					addVegetableOrGrocery(dishObj, vegetablesItems, 'vegetablesTable');
				}
				else{
					addVegetableOrGrocery(dishObj, groceryItems, 'groceryTable');
				}
			break;
			
			case 'SPICE':
			addSpices(dishObj);
			break;
		}
	};
}


function addVegetableOrGrocery(dishObj, listOfItems, tableId){
	//If the vegetable does not exist, then create a new row and insert
	if(listOfItems[dishObj['ingredientName']] == undefined){
		appendString = removeIcon +
		dishObj['ingredientName'] + '</td>\n<td>\n<div class="quantity" style="display: inline">' +
		 '<div class="amount" style="display: inline">' + dishObj['amount'] + '</div>'  + ' ' +
		  dishObj['unitDisplayString'] + '</div>\n</div>' +
		  pencilIcon + '\n</td>\n</tr>'; 
		$('#' + tableId+ ' tbody').append(appendString);
		listOfItems[dishObj['ingredientName']] = true;
	}
	else{
		$("#" + tableId + " table tr td:nth-child(2)").each(function (i) {
			var item = $(this).html().trim();
			if (item == dishObj['ingredientName']){
				var $node = $(this).parent().find('.amount');
				var currentVal = parseInt($node.html());
				$node.html(currentVal + parseInt(dishObj['amount']));
				return ;
			}
		});
	}
	return ;
	//Else, add in the previous row
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