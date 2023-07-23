(function () {
  let screen = document.querySelector(".screen");
  let buttons = document.querySelectorAll(".btn");
  let clear = document.querySelector(".btn-clear");
  let equal = document.querySelector(".btn-equal");

  let expression = "";
  let previousAnswer = null;

  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      let value = e.target.dataset.num;
      appendToDisplay(value);
    });
  });

  equal.addEventListener("click", function (e) {
    calculate();
  });

  clear.addEventListener("click", function (e) {
    clearDisplay();
  });

  function appendToDisplay(value) {
    if (screen.value === "Error") {
      screen.value = "";
    }

    if (expression.endsWith("/") && value === "0") {
      screen.value = "Cannot divide by 0";
      return;
    }

    if (value === "=") {
      calculate();
    } else {
      expression += value;
      screen.value = expression;
    }
  }

function calculate() {
  try {
    let result;
    if (previousAnswer !== null) {
      result = calculateExpression(previousAnswer + expression);
    } else {
      result = calculateExpression(expression);
    }

    result = Math.round((result + Number.EPSILON) * 10000) / 10000;
    screen.value = result;
    previousAnswer = result;
    expression = "";
  } catch (error) {
    screen.value = "Error";
  }
}

function calculateExpression(expr) {
  let numbers = expr.split(/[-+*/]/).map(Number);
  let operators = expr.split(/\d/).filter((op) => op !== "");

  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextNumber = numbers[i + 1];

    switch (operator) {
      case "+":
        result += nextNumber;
        break;
      case "-":
        result -= nextNumber;
        break;
      case "*":
        result *= nextNumber;
        break;
      case "/":
        if (nextNumber === 0) {
          throw new Error("Cannot divide by 0");
        }
        result /= nextNumber;
        break;
      default:
        break;
    }
  }
  return result;
}


  function clearDisplay() {
    expression = "";
    previousAnswer = null;
    screen.value = "";
  }
})();
