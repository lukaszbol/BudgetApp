// Using IIFE to create a MODULE: Budget Controller, which will return an object. It will not be visible to outside

// BUDGET CONTROLLER - MODULE to control the background of the budget application:
var budgetController = (function(){
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calculatePercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);    
        } else {
            this.percentage = -1;
        }
        
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
        
        deleteItem: function(type, ID){
            var IDs, index;
            
            // loop over all incomes/expense array to find correct item ID:
            IDs = data.allItems[type].map(function(element){         // map returns a NEW array of ALL elements
                return element.id;
            });
            
            index = IDs.indexOf(ID);
            console.log(index);
            console.log(ID);
            
            // delete item fromt the array:
            if(index !== -1){
                data.allItems[type].splice(index, 1);          // splice(startingIndex, numberOfElementsToDelete)
            }
            
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
        
                
        calculatePercentage: function(){
            data.allItems.exp.forEach(function(currentElem){
               currentElem.calculatePercentage(data.totals.inc);
            });
        },
        
        getBudget: function(){
          return {
              budget: data.budget,
              totalIncome: data.totals.inc,
              totalExpenses: data.totals.exp,
              percentage: data.percentage              
          }  
        },
        
        getPercentage: function(){
            var allPercentages = data.allItems.exp.map(function(currentElem){
               return currentElem.getPercentage(); 
            });
            return allPercentages;
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
        expensesPercentage: '.budget__expenses--percentage',
        container : '.container',
        expensesPercentageLabel: '.item__percentage'
    };
    
    // formats number to decimals - +/- before number, exactly 2 decimal points, comma separating the thousands (e.g. 1234,5678 to 1,234.57, 1000 to 1,000.00)
    var formatNumber = function(number, numberType){
           var numSplit, integerPart, decimalPart, sign;
           number = Math.abs(number); //absolute value (without +/-)
           number = number.toFixed(2);  // always put exactly 2 decimal numbers on the number called
           numSplit = number.split('.');
           integerPart = numSplit[0];
           decimalPart = numSplit[1];
           
           if(integerPart.length > 3){
               integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, integerPart.length);
           }
           
           numberType === 'exp' ? sign = '-' : sign = '+';
           console.log(sign + ' ' + integerPart + '.' + decimalPart);
           return sign + ' ' + integerPart + '.' + decimalPart;
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
               html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
           } else if(type === 'exp'){               element = DOMstrings.expenseContainer;
               html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
           }
           
           
           // Replace the placeholder text with some actual data
           newHtml = html.replace('%id%', object.id);
           newHtml = newHtml.replace('%description%', object.description);
           newHtml = newHtml.replace('%value%', formatNumber(object.value, type));
           
           // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },
       
       delListItem: function(selectedID){
           var childElement = document.getElementById(selectedID);
           childElement.parentNode.removeChild(childElement);
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
           var type;
           obj.budget > 0 ? type = 'inc' : type = 'exp';
           document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
           document.querySelector(DOMstrings.incomeValue).textContent = formatNumber(obj.totalIncome, 'inc');
           document.querySelector(DOMstrings.expensesValue).textContent = formatNumber(obj.totalExpenses, 'exp');
           
           
           if(obj.percentage > 0){
               document.querySelector(DOMstrings.expensesPercentage).textContent = obj.percentage + '%';
           }
           else{
               document.querySelector(DOMstrings.expensesPercentage).textContent = '--';
           }
       },
       
       displayPercentage: function(percentage){
           var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);  //returns a nodeList
           
           var nodeListForEach = function(list, callbackFunction){
               for (var i = 0; i < list.length; i++){
                   callbackFunction(list[i], i);
               }
           }
           nodeListForEach(fields, function(currentElement, index){
               if(percentage[index] > 0){
                   currentElement.textContent = percentage[index] + '%';
               } else {
                   currentElement.textContent = '--';
               }
           });
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

        // Delete item from incomes/expenses list
        document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);
        
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
    
    var updatePercentage = function(){
        // 1, Calculate percentage
        budgetCtrl.calculatePercentage();
        
        // 2. Read perc from the budget controller
        var percentages = budgetCtrl.getPercentage();
        
        // 3. Update the UI
        UICtrl.displayPercentage(percentages);
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
            
            // 6. Calculate and update percentage
            updatePercentage();
        } 
    };

    var ctrlDelItem = function(event){      // to find what the target element is
        var itemID, splitID, type, ID;
                
        itemID = event.target.parentNode.parentNode.parentNode.id;      //if we want to move up in the event tree, we use .parentNode
        console.log(event.target.parentNode.parentNode.parentNode.id);
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            
            
            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, id);
            
            //2. Delete the item from the UI
            UICtrl.deleteItem(itemID);
            
            //3. Update + show new budget
            updateBudget();
            
            // 4. Calculate and update percentage
            updatePercentage();
            
            
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