// Using IIFE to create a MODULE: Budget Controller, which will return an object. It will not be visible to outside

// BUDGET CONTROLLER - MODULE to control the background of the budget application:
var budgetController = (function(){
   
    // Some code
    
})();


//UI CONTROLLER - MODULE to control the User Interface:
var UIController = (function(){
    

})();



// GLOBAL APP CONTROLLER - MODULE to control budgetController and UIController, to pass data between those two modules. The budgetController and UIController controllers are passed as parameters:
var controller = (function(budgetCtrl, UICtrl){
    
})(budgetController, UIController);