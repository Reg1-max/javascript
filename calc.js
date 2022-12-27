const calculator = {
    currentAns: null,
    previousAns: null,
    buttonsPressed: [], //should be implemented/treated as a queue
    mainTextContainer: document.querySelector('#main-text'),
    miniTextContainer: document.querySelector('#mini-text'),
    operatorMapping: new Map([
        ["+", function (num1, num2) {return num1 + num2;}],
        ["-", function (num1, num2) {return num1 - num2;}],
        ["×", function (num1, num2) {return num1 * num2;}],
        ["÷", function (num1, num2) {return num1 / num2;}]
      ]),

    syntaxErrors: function (buttonsPressed) {
        let syntaxError = false;
        i = 0;
        while (syntaxError == false && i < buttonsPressed.length) {
            if (i == 0) {
                if (buttonsPressed[i].className == 'operator' && this.previousAns == null) {
                    syntaxError = true;
                }
            } else {
                if (buttonsPressed[i].className == 'operator' && buttonsPressed[i-1].className != 'num' && buttonsPressed[i+1].className != 'num') {
                    syntaxError = true;
                } else if (buttonsPressed[i].id == 'decimal' && buttonsPressed[i+1].className != 'num') {
                    syntaxError = true;
                }
            };

            i++;
        }

        if (syntaxError == true) {
            return true;
        } else {
            return false;
        }
    },

    mathErrors: function (buttonsPressed) {
        mathError = false;
        for (let index = 0; index < buttonsPressed.length; index++) {
            if (buttonsPressed[index].id == 'divide' && buttonsPressed[index+1].id == '0') {
                mathError = true;
                break;
            }
        };

        if (mathError = true) {
            return true;
        } else {
            return false;
        }
    },

    calculate: function (nums, operators) {
        let intermediateAns;
        while (operators.length != 0) {
            intermediateAns = this.operatorMapping.get(operators[0])(nums[0], nums[1]);
            nums.shift();
            nums.shift();
            nums.unshift(intermediateAns);
            operators.shift();
        };

        return intermediateAns;
    },

    parser: function (buttonsPressed) {
        let num;
        let nums = [];
        let operators = [];

        if (this.previousAns != null) {
            nums.push(this.previousAns)
        };

        buttonsPressed.forEach ((button) => {
            if (button.className == "num") {
                if (num == undefined || num == '') {
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
        
        if (num != '' || num != undefined) {
            nums.push(Number(num));
        };

        this.currentAns = this.calculate(nums, operators)
    },

    addEventListeners: function () {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                if (button.className == 'num') {
                    this.numEventListener(button);
                } else if (button.className == 'operator') {
                    this.operatorEventListener(button);
                } else if (button.id == 'equals') {
                    this.equalsEventListener(this.buttonsPressed);
                } else if (button.id == 'del') {
                    this.delEventListener();
                } else {
                    this.acEventListener();
                }
            })
        })
    },

    numEventListener: function (button) {
      if (this.buttonsPressed == []) {
        this.mainTextContainer.textContent = button.textContent;
        this.buttonsPressed.push(button);
      } else {
        this.mainTextContainer.textContent = this.mainTextContainer.textContent + button.textContent;
        this.buttonsPressed.push(button);
      }
    },

    operatorEventListener: function (button) {
        if (this.currentAns != null) {
            // don't forget to check for previousAns in the relevant function when evaluating the calculation
            this.previousAns = this.currentAns;
            this.currentAns = null;
            this.mainTextContainer.textContent = this.mainTextContainer.textContent + button.textContent;
            this.buttonsPressed.push(button);
          } else {
            this.mainTextContainer.textContent = this.mainTextContainer.textContent + button.textContent;
            this.buttonsPressed.push(button);
          }
    },

    equalsEventListener: function (buttonsPressed) {
        if (buttonsPressed != []) {
            this.miniTextContainer.textContent = this.mainTextContainer.textContent;
            if (this.syntaxErrors == true || this.mathErrors == true) {
                // display syntax error on screen
                this.mainTextContainer.textContent = 'Error';
            } else {
                this.parser(buttonsPressed);
                this.mainTextContainer.textContent = this.currentAns;
            }
        }
    },

    delEventListener: function () {
        this.buttonsPressed.pop();
        if (this.miniTextContainer.textContent != '') {
            this.mainTextContainer.textContent = this.miniTextContainer.textContent;
            this.miniTextContainer.textContent = '';
        };
        this.mainTextContainer.textContent = this.mainTextContainer.textContent.slice(0, this.mainTextContainer.textContent.length - 1);

    },

    acEventListener: function () {
        this.currentAns = null;
        this.buttonsPressed = [];
        this.mainTextContainer.textContent = '';
        this.miniTextContainer.textContent = '';
    }

}

calculator.addEventListeners()