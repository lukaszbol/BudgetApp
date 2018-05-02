// Using IIFE to create a MODULE: Budget Controller, which will return an object. It will not be visible to outside

// BUDGET CONTROLLER - MODULE to control the background of the budget application:
var budgetController = (function(){
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    }
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    }
    
    // DATA STRUCTURE for keeping all expenses, incomes, etc.
    var data = {        // Object containing all data
        allItems: {     // Object containing expenses, incomes
            exp: [],
            inc: []
        },
        totals: {       // Object containing totals
            exp: 0;
            inc: 0
        }
    }
})();


//UI CONTROLLER - MODULE to control the User Interface:
var UIController = (function(){
    
    // stores all DOM strings
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    // returning PUBLIC object:
   return {
       getInput: function(){
           return {
               type: document.querySelector(DOMstrings.inputValue).value,            // returns inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
           };
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
    
        // 1. Get the field input data (from the UI Controller and its public method 'getInput')
        var input = UICtrl.getInput();
        console.log(input);
        
        // 2. Add item to the budget controller
        
        // 3. Add item to the UI
        
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