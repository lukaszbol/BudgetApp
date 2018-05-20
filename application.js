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
        },
        budget: 0,
        percentage: -1        
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(currentElement){
            sum += currentElement.value;
        })
        data.totals[type] = sum;
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
            data.totals[type] += value;
            
            // Return the new element
            return newItem;
        },
        
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }     
            else{
                data.percentage = -1;             }
        },
        
        getBudget: function(){
          return {
              budget: data.budget,
              totalIncome: data.totals.inc,
              totalExpenses: data.totals.exp,
              percentage: data.percentage              
          }  
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
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeValue: '.budget__income--value',
        expensesValue: '.budget__expenses--value',
        expensesPercentage: '.budget__expenses--percentage'        
    };
    
    // returning PUBLIC object:
   return {
       getInput: function(){
           return {
               type: document.querySelector(DOMstrings.inputType).value,                   // returns inc or exp
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
       },
       
       clearFields: function(){
           var fields, fieldsArray;
           fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);           // this returns a LIST instead of ARRAY, so we need to convert it to ARRAY
           
           fieldsArray = Array.prototype.slice.call(fields);  // will use SLICE to return an ARRAY, which returns copy of the array, BUT we need to use SLICE method by using CALL method, and passing the fields variable into it, so then it become the THIS variable and it will work fine
           
           // current - current element of the Array being processed 
           // indexNumber - current index of the Array being processed
           // array - the actual array, to which we have access
           
           fieldsArray.forEach(function(current, indexNumber, array){
               current.value = "";  // current's element VALUE
               
           });
           
           fieldsArray[0].focus();
       },
       
       displayBudget: function(obj){
           document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
           document.querySelector(DOMstrings.incomeValue).textContent = obj.totalIncome;
           document.querySelector(DOMstrings.expensesValue).textContent = obj.totalExpenses;
           
           
           if(obj.percentage > 0){
               document.querySelector(DOMstrings.expensesPercentage).textContent = obj.percentage + '%';
           }
           else{
               document.querySelector(DOMstrings.expensesPercentage).textContent = '--';
           }
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
    
    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI  
        UICtrl.displayBudget(budget);
    };
    
    var controlAddItem = function(){
        var input, newItem;
        
        // 1. Get the field input data (from the UI Controller and its public method 'getInput')
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
                    
    };

    return {
        init: function(){
            console.log('Application has started...');
            UICtrl.displayBudget({
              budget: 0,
              totalIncome: 0,
              totalExpenses: 0,
              percentage: -1             
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();         // Application starts