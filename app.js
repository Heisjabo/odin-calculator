(function () {
  let screen = document.querySelector(".screen");
  let buttons = document.querySelectorAll(".btn");
  let clear = document.querySelector(".btn-clear");
  let equal = document.querySelector(".btn-equal");
  let backspace = document.querySelector(".btn-backspace");

  let expression = "";
  let previousAnswer = null;

  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      let value = e.target.dataset.num;
      appendToDisplay(value);
    });
  });

  equal.addEventListener("click", function (e) {
    operate();
  });

  clear.addEventListener("click", function (e) {
    clearDisplay();
  });

  backspace.addEventListener("click", function (e) {
    removeLastCharacter();
  });

  
function appendToDisplay(value) {
  if (screen.value === "Error") {
    screen.value = "";
  }
  if (expression.endsWith("/") && value === "0") {
    screen.value = "Error: Cannot divide by zero!";
    return;
  }

  if (value === "=") {
    calculate();
  } else if (value === ".") {
    if (
      expression === "" ||
      expression.endsWith("+") ||
      expression.endsWith("-") ||
      expression.endsWith("*") ||
      expression.endsWith("/")
    ) {
      expression += "0" + value;
    } else if (!expression.endsWith(".") && countDecimals(expression) < 3) {
      expression += value;
    }
    screen.value = expression;
  } else {
    expression += value;
    screen.value = expression;
  }
}

function operate() {
  try {
    let result;
    if (previousAnswer !== null) {
      result = calculateExpression(previousAnswer + expression);
    } else {
      result = calculateExpression(expression);
    }

    screen.value = result;
    previousAnswer = result;
    expression = "";
  } catch (error) {
    screen.value = "Error";
    console.log(error);
  }
}


function calculateExpression(expr) {
  expr = expr.replace(/^[-+*/]|[.](?=[-+*/])|[.](?=$)/g, "");

  const tokens = expr.split(/([-+*/])/);

  const numbers = [];
  const operators = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      operators.push(token);
    } else {
      numbers.push(parseFloat(token));
    }
  }

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

  if (!Number.isFinite(result)) {
    throw new Error("Invalid calculation");
  }
  result = Math.round(result * 1000) / 1000;

  return result;
}

  function clearDisplay() {
    expression = "";
    previousAnswer = null;
    screen.value = "";
  }

   function removeLastCharacter() {
     if (expression.length > 0) {
       expression = expression.slice(0, -1);
       screen.value = expression;
     } else if (previousAnswer !== null) {
       previousAnswer = null;
       screen.value = "";
     }
   }

   function countDecimals(value) {
  if (typeof value === "number") {
    if (Math.floor(value) !== value) {
      return value.toString().split(".")[1]?.length || 0;
    }
    return 0;
  }
  const decimalRegex = /\.\d*$/;
  const decimalMatch = value.match(decimalRegex);
  if (decimalMatch) {
    return decimalMatch[0].length - 1;
  }
  return 0;
}

})();
