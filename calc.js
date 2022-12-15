/* 
Current Problems
1 - After you've done an operation with two numbers, it doesn't clear out the screen when you press the next number.
2 - It also doesn't properly clear out the memory, meaning weird numbers appear when doing calculations.
3 - After you've done an operation with two numbers, it doesn't continue with operations on the previous answer when you press an operator.
    The same answer is still there. The mini text does reflect the buttons pressed alongside the previous answer though (in this case).
4 - Calc doesn't work with more than two numbers.
5 - Calc doesn't respect the rules of BIDMAS.

 */

const calculator = {
  currentAns: null,
  previousAns: null,
  buttonsPressed: [],
  mainTextContainer: document.querySelector('#main-text'),
  miniTextContainer: document.querySelector('#mini-text'),

  displayButtons: function () {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((item) => {
      item.addEventListener('click', () => { 
        console.log("I've been clicked!");
        if (item.id == "del") {
          this.delButton()
        } else if (item.id == "ac") {
          this.acButton()
        } else if (item.id == "equals") {
          this.equals()
        } else {
          this.buttonsPressed.push(item);
          this.mainTextContainer.textContent = this.mainTextContainer.textContent + item.textContent;
        }
        
      });
    });
    
  },

  displayAns: function () {
    // put calculation expression in mini text div. get this from function above
    this.miniTextContainer.textContent = this.mainTextContainer.textContent;
    this.mainTextContainer.textContent = this.currentAns;
  },

  acButton: function () {
    this.currentAns = null;
    this.buttonsPressed = [];
    this.mainTextContainer.textContent = "";
    this.miniTextContainer.textContent = "";

  },

  delButton: function () {
    this.buttonsPressed.pop();
    if (this.miniTextContainer.textContent != "") {
      this.mainTextContainer.textContent = this.miniTextContainer.textContent;
      this.miniTextContainer.textContent = "";
    };
    this.mainTextContainer.textContent = this.mainTextContainer.textContent.slice(0, this.mainTextContainer.textContent.length - 1);

  },

  operatorMapping: new Map([
    ["+", function (num1, num2) {return num1 + num2;}],
    ["-", function (num1, num2) {return num1 - num2;}],
    ["×", function (num1, num2) {return num1 * num2;}],
    ["÷", function (num1, num2) {return num1 / num2;}]
  ]),

  equals: function () {
    let num;
    let nums = [];
    let operators = [];
   
    this.buttonsPressed.forEach (function (button) {
      if (button.className == "num" || button.id == "decimal") {
          if (num == undefined) {
            num = button.textContent
          } else {
            num = num + button.textContent;
          };
        
      } else if (button.className == "operator") {
        num = Number(num);
        nums.push(num);
        num = undefined;
        operators.push(button.textContent)
      }
      
    });
    
    // this is to put any numbers in the nums stack after pressing equals. They may not get evaluated otherwise.
    nums.push(Number(num));

    // This assumes only 2 numbers are entered. Need to generalise it so it works with n numbers and n-1 operators.
    operator = operators[0];
    this.currentAns = this.operatorMapping.get(operator)(nums[0], nums[1]);

    this.displayAns();
  }
}

calculator.displayButtons();
