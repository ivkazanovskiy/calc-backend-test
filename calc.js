/* eslint-disable max-classes-per-file */
class Num {
  constructor(value = 0, operator = null) {
    switch (operator) {
      case '+':
        this.operator = null;
        this.value = value;
        break;
      case '-':
        this.operator = null;
        this.value = (-1) * value;
        break;
      default:
        this.operator = operator;
        this.value = value;
        break;
    }
  }
}

class Parser {
  static #isMathOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  static findCloseBracketIndex(expression, startIndex) {
    let counter = 1;
    let pointer = startIndex + 1;
    while (counter > 0 && pointer < expression.length) {
      if (expression[pointer] === '(') counter += 1;
      if (expression[pointer] === ')') counter -= 1;
      pointer += 1;
    }
    return counter === 0 && pointer - 1;
  }

  static splitNums(expression) {
    const pack = [];
    let firstCharIndex = 1;
    let lastCharIndex = 0;
    while (firstCharIndex <= expression.length) {
      const firstChar = expression[firstCharIndex];
      const lastChar = expression[lastCharIndex];
      if (this.#isMathOperator(firstChar) || !firstChar) {
        const operator = this.#isMathOperator(lastChar) ? lastChar : null;
        const value = operator
          ? Number(expression.slice(lastCharIndex + 1, firstCharIndex))
          : Number(expression.slice(lastCharIndex, firstCharIndex));
        pack.push(new Num(value, operator));
        lastCharIndex = firstCharIndex;
      }
      firstCharIndex += 1;
    }
    return pack;
  }

  static splitBrackets(expression) {
    let firstCharIndex = 0;
    let lastCharIndex = 0;
    const pack = [];
    while (firstCharIndex < expression.length) {
      if (expression[firstCharIndex] === '(') {
        if (firstCharIndex !== lastCharIndex) {
          pack.push(expression.slice(lastCharIndex, firstCharIndex));
        }
        const closeBracketIndex = this.findCloseBracketIndex(expression, firstCharIndex);
        const subString = expression.slice(firstCharIndex + 1, closeBracketIndex);
        pack.push(this.splitBrackets(subString));
        firstCharIndex = closeBracketIndex + 1;
        lastCharIndex = firstCharIndex;
      } else {
        firstCharIndex += 1;
      }
    }

    if (firstCharIndex !== lastCharIndex) {
      pack.push(expression.slice(lastCharIndex, firstCharIndex));
    }
    return pack;
  }

  static packArray(arrayOfNums) {
    const pack = [arrayOfNums[0]];
    for (let i = 1; i < arrayOfNums.length; i += 1) {
      const currentNum = arrayOfNums[i];
      const lasPackElement = pack[pack.length - 1];

      if (currentNum.operator) {
        if (lasPackElement instanceof Num) {
          const cashedLastElement = pack.pop();
          pack.push([cashedLastElement, currentNum]);
        } else {
          lasPackElement.push(currentNum);
        }
      } else {
        pack.push(currentNum);
      }
    }
    return pack;
  }
}

class ArrayMathExpression {
  static #multiplyNums(num1, num2) {
    const value = num1.value * num2.value;
    const newNum = new Num(value, null);
    return newNum;
  }

  static #divideNums(num1, num2) {
    const value = num1.value / num2.value;
    const newNum = new Num(value, null);
    return newNum;
  }

  static multiply(arrayOfNums) {
    let memo = arrayOfNums[0];
    for (let i = 1; i < arrayOfNums.length; i += 1) {
      const currentNum = arrayOfNums[i];
      const newMemo = (currentNum.operator === '*') ? this.#multiplyNums(memo, currentNum) : this.#divideNums(memo, currentNum);
      memo = newMemo;
    }
    return memo;
  }

  static summ(arrayOfNums) {
    return arrayOfNums.reduce((acc, el) => new Num(acc.value + el.value), new Num());
  }
}

class Validator {
  static isCorrectBrackets(expression) {
    let counter = 0;
    for (let i = 0; i < expression.length; i += 1) {
      const char = expression[i];
      if (char === '(') {
        counter += 1;
        const closeBracketIndex = Parser.findCloseBracketIndex(expression, i);
        if (!closeBracketIndex) return false;
      }
      if (char === ')') counter -= 1;
    }
    return counter === 0;
  }

  static isCorrectSymbols(expression) {
    return expression.match(/^[()+\-*/.\d]+$/);
  }

  static isValid(expression) {
    return (
      this.isCorrectBrackets(expression)
      && this.isCorrectSymbols(expression)
    );
  }
}
class Calculator {
  static #isMathOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  static #countSimpleExpression(expression) {
    const baseArray = typeof expression === 'string'
      ? Parser.splitNums(expression)
      : expression;

    const packedNums = Parser.packArray(baseArray);
    const arrayOfNums = packedNums.map((numOrArray) => (
      numOrArray instanceof Num
        ? numOrArray
        : ArrayMathExpression.multiply(numOrArray)
    ));

    const num = ArrayMathExpression.summ(arrayOfNums);
    return num;
  }

  static #countComplexExpression(expression) {
    const baseArray = (typeof expression === 'string')
      ? Parser.splitBrackets(expression)
      : expression;

    if (baseArray.length === 1) {
      const content = baseArray[0];

      if (typeof content === 'string') {
        return this.#countSimpleExpression(content);
      }
      return this.#countComplexExpression(content);
    }

    let pack = [];
    let operatorCash = null;
    for (let i = 0; i < baseArray.length; i += 1) {
      const element = baseArray[i];

      if (typeof element === 'object') {
        const { value } = this.#countComplexExpression(element);
        const newNum = new Num(value, operatorCash);
        operatorCash = null;
        pack.push(newNum);
      } else {
        const lastChar = element[element.length - 1];
        if (this.#isMathOperator(lastChar)) {
          operatorCash = lastChar;
          pack = [...pack, ...Parser.splitNums(element.slice(0, -1))];
        } else {
          pack = [...pack, ...Parser.splitNums(element)];
        }
      }
    }
    return this.#countSimpleExpression(pack);
  }

  static count(expression) {
    if (!Validator.isValid(expression)) return 'Не корректный синтаксис';
    const num = this.#countComplexExpression(expression);
    return num.value;
  }
}

module.exports = {
  Num,
  Calculator,
  Validator,
  Parser,
  ArrayMathExpression,
};
