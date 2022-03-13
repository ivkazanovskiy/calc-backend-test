class Num {
  constructor(valueString = 0, action = null) {
    switch (action) {
      case '+':
        this.action = null;
        this.value = Number(valueString);
        break;
      case '-':
        this.action = null;
        this.value = (-1) * Number(valueString);
        break;
      default:
        this.action = action;
        this.value = Number(valueString);
        break;
    }
  }
}

function multyply(num1, num2) {
  const value = num1.value * num2.value;
  const newNum = new Num(value, null);
  return newNum;
}

function divide(num1, num2) {
  const value = num1.value / num2.value;
  const newNum = new Num(value, null);
  return newNum;
}

function splitString(string) {
  const pack = [];
  let i = 1;
  let j = 0;

  while (i <= string.length) {
    if (Number.isNaN(+string[i]) && string[i] !== '.') {
      const action = Number.isNaN(+string[j]) ? string[j] : null;
      const valueString = action
        ? string.slice(j + 1, i)
        : string.slice(j, i);

      pack.push(new Num(valueString, action));
      j = i;
    }
    i += 1;
  }
  return pack;
}

function packArray(array) {
  const pack = [array[0]];
  for (let i = 1; i < array.length; i += 1) {
    const num = array[i];
    if (num.action) {
      if (pack[pack.length - 1] instanceof Num) {
        const lastElem = pack.pop();
        pack.push([lastElem, num]);
      } else {
        pack[pack.length - 1].push(num);
      }
    } else {
      pack.push(num);
    }
  }
  return pack;
}

function solveFirst(array) {
  let memo = array[0];
  for (let i = 1; i < array.length; i += 1) {
    const current = array[i];
    const newMemo = (current.action === '*') ? multyply(memo, current) : divide(memo, current);
    memo = newMemo;
  }
  return memo;
}

function summArray(array) {
  return array.reduce((acc, el) => new Num(acc.value + el.value), new Num());
}

function solveSplitted(array) {
  const packed = packArray(array);
  const firstStep = packed.map((el) => (el instanceof Num ? el : solveFirst(el)));
  return summArray(firstStep);
}

function solveSubString(string) {
  const splitted = splitString(string);
  return solveSplitted(splitted);
}

function findCloseBracket(string, start) {
  let counter = 1;
  let i = start + 1;
  while (counter > 0) {
    if (string[i] === '(') counter += 1;
    if (string[i] === ')') counter -= 1;
    i += 1;
  }
  return i - 1;
}

function splitBrackets(string) {
  let i = 0;
  let j = 0;
  const pack = [];
  while (i < string.length) {
    if (string[i] === '(') {
      if (i !== j) {
        pack.push(string.slice(j, i));
      }
      const closeBracket = findCloseBracket(string, i);
      const subString = string.slice(i + 1, closeBracket);
      pack.push(splitBrackets(subString));
      i = closeBracket + 1;
      j = i;
    } else {
      i += 1;
    }
  }
  if (i !== j) {
    pack.push(string.slice(j, i));
  }
  return pack;
}

function solveUnbracketed(array) {
  if (array.length === 1) {
    if (typeof array[0] === 'string') {
      return solveSubString(array[0]);
    }
    return solveUnbracketed(array[0]);
  }

  let pack = [];
  let actionCash = null;
  for (let i = 0; i < array.length; i += 1) {
    const element = array[i];

    if (typeof element === 'object') {
      const { value } = solveUnbracketed(element);
      const newNum = new Num(value, actionCash);
      actionCash = null;
      pack.push(newNum);
    } else {
      const lastChar = element[element.length - 1];
      if (Number.isNaN(+lastChar)) {
        actionCash = lastChar;
        pack = [...pack, ...splitString(element.slice(0, -1))];
      } else {
        pack = [...pack, ...splitString(element)];
      }
    }
  }
  return solveSplitted(pack);
}

function solve(string) {
  const unbracketed = splitBrackets(string);
  const num = solveUnbracketed(unbracketed);
  return num.value;
}

module.exports = {
  Num,
  solveFirst,
  splitString,
  summArray,
  packArray,
  solveSubString,
  splitBrackets,
  findCloseBracket,
  solve,
};
