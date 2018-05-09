// Using IIFE to create a MODULE: Budget Controller, which will return an object. It will not be visible to outside

// BUDGET CONTROLLER - MODULE to control the background of the budget application:
var budgetController = (function(){
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    
    // DATA STRUCTURE for keeping all expenses, incomes, etc.
    var data = {        // Object containing all data
        allItems: {     // Object containing expenses, incomes
            exp: [],
            inc: []
        },
        totals: {       // Object containing totals
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, description, value){
            var newItem, ID;
            
            // ID = last ID + 1
            // Create new ID
            if(data.allItems[type].length > 0){
                ID  = data.allItems[type][data.allItems[type].length -1].id + 1;        // the last ID + 1, which creates an ID for a new item
            } else{
                ID = 0;
            }
            
            
            // Create new item based on 'inc' or 'exp' type
            if(type === 'inc'){
                newItem = new Income(ID, description, value);                
            } else if(type === 'exp'){
                newItem = new Expense(ID, description, value);
            }
            
            // Push into the data structure 'allItems'
            data.allItems[type].push(newItem);                  // adds a new item at the END of an array
            
            // Return the new element
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        }
    };
})();


//UI CONTROLLER - MODULE to control the User Interface:
var UIController = (function(){
    
    // stores all DOM strings
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };
    
    // returning PUBLIC object:
   return {
       getInput: function(){
           return {
               type: document.querySelector(DOMstrings.inputType).value,                   // returns inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
           };
       },
       
       addListItem: function(object, type){
           var html, newHtml, element;
           
           // Create HTML string with placeholder text
           if(type === 'inc'){
               element = DOMstrings.incomeContainer;
               html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
           } else if(type === 'exp'){               element = DOMstrings.expenseContainer;
               html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
           }
           
           
           // Replace the placeholder text with some actual data
           newHtml = html.replace('%id%', object.id);
           newHtml = newHtml.replace('%description%', object.description);
           newHtml = newHtml.replace('%value%', object.value);
           
           // Insert the HTML into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },
       
       getDOMstrings: function(){
            return DOMstrings;
       }
   };
    
    
    
    
    

})();



// GLOBAL APP CONTROLLER - MODULE to control budgetController and UIController, to pass data between those two modules. The budgetController and UIController controllers are passed as parameters:
var controller = (function(budgetCtrl, UICtrl){
    
    // function for ALL event listeners
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        
        // Add item
        document.querySelector(DOM.inputBtn).addEventListener('click', controlAddItem);

        // Add keypress event listener
        document.addEventListener('keypress', function(event){
        // 'which' property for older browsers
          if(event.keyCode === 13 || event.which === 13){
              controlAddItem();
          }
        });
    }
    
    var controlAddItem = function(){
        var input, newItem;
        
        // 1. Get the field input data (from the UI Controller and its public method 'getInput')
        input = UICtrl.getInput();
        console.log(input);
        
        // 2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Calculate the budget
        
        // 5. Display the budget on the UI
}

    return {
        init: function(){
            console.log('Application has started...');
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();         // Application starts