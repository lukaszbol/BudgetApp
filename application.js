// Using IIFE to create a MODULE: Budget Controller, which will return an object. It will not be visible to outside

//MODULE PATTERN returns an object containing all of the functions that we want to be public
var budgetController = (function(){
    var x = 23;
    
    var add = function(a){
        return x + a;
    }
    
    return {
        //this function will use other function 'add' but you will be able to use it outside the scope
        publicTest: function(b){        // this function will be accessible from outside
            return add(b);        // x + b
        }
    }
})();

//MODULE to take care of the User Interface:
var UIController = (function(){
    
    // Some code
    
})();



// MODULE to control budgetController and UIController, to pass data between those two modules. The budgetController and UIController controllers are passed as parameters to the controller:
var controller = (function(budgetCtrl, UICtrl){
    
    
    var z = budgetCtrl.publicTest(5);
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }
    
})(budgetController, UIController);