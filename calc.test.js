/* eslint-disable no-mixed-operators */
const {
  Num,
  Calculator,
  Parser,
  Validator,
  ArrayMathExpression,
} = require('./calc');

describe('Проверки без скобок', () => {
  const expression = '-1+25.5*34/47+9-8-45/15*18.9/14.8+7-3.3+25*45';
  let packed;
  let answer;
  beforeEach(() => {
    const splitted = Parser.splitNums(expression);
    packed = Parser.packArray(splitted);
    answer = -1 + 25.5 * 34 / 47 + 9 - 8 - 45 / 15 * 18.9 / 14.8 + 7 - 3.3 + 25 * 45;
    // console.log('Работаем с массивом:', packed);
  });

  it('Умножение и деление пример 1', () => {
    const firstExample = packed[1];
    expect(ArrayMathExpression.multiply(firstExample).value).toBeCloseTo(25.5 * 34 / 47);
  });

  it('Умножение и деление пример 2', () => {
    const secondExample = packed[4];
    expect(ArrayMathExpression.multiply(secondExample).value).toBeCloseTo(-45 / 15 * 18.9 / 14.8);
  });

  it('Проверка всей строки 1', () => {
    const firstStep = packed.map((el) => (
      el instanceof Num
        ? el
        : ArrayMathExpression.multiply(el)));
    const secondStep = ArrayMathExpression.summ(firstStep);
    expect(secondStep.value).toBeCloseTo(answer);
  });

  it('Проверка всей строки 2', () => {
    const newExpression = '355/5*20+849.9-700*85/7';
    const newSplitted = Parser.splitNums(newExpression);
    const newPacked = Parser.packArray(newSplitted);
    const firstStep = newPacked.map((el) => (
      el instanceof Num
        ? el
        : ArrayMathExpression.multiply(el)
    ));
    const secondStep = ArrayMathExpression.summ(firstStep);
    const newAnswer = (355 / 5 * 20 + 849.9 - 700 * 85 / 7);
    expect(secondStep.value).toBeCloseTo(newAnswer);
  });

  it('Проверка общей функции', () => {
    expect(Calculator.count(expression)).toBeCloseTo(answer);
  });
});

describe('Разбитие строки по скобкам', () => {
  it('Проверяем поиск закрывающей скобки', () => {
    const expression = '12(34)56(7(8)9)0';
    expect(Parser.findCloseBracketIndex(expression, 2)).toEqual(5);
    expect(Parser.findCloseBracketIndex(expression, 8)).toEqual(14);
  });

  it('Проверка на разбитие по скобкам', () => {
    const expression = '12(34)56(78)9012(34(5)6(7)8)90';
    const answer = ['12', ['34'], '56', ['78'], '9012', ['34', ['5'], '6', ['7'], '8'], '90'];
    expect(JSON.stringify(Parser.splitBrackets(expression)) === JSON.stringify(answer)).toBeTruthy();
  });

  it('Пример 1', () => {
    const expression = '1+2';
    expect(Calculator.count(expression)).toBeCloseTo(3);
  });

  it('Пример 2', () => {
    const expression = '2+2*2';
    expect(Calculator.count(expression)).toBeCloseTo(6);
  });

  it('Пример 3', () => {
    const expression = '(2+2*2)';
    expect(Calculator.count(expression)).toBeCloseTo(6);
  });

  it('Пример 4', () => {
    const expression = '(2+2)*2';
    expect(Calculator.count(expression)).toBeCloseTo(8);
  });

  it('Пример 5', () => {
    const expression = '2*(2+2)';
    expect(Calculator.count(expression)).toBeCloseTo(8);
  });

  it('Пример 6', () => {
    const expression = '2+(2+2)*2*3/(4*(5+6))-7';
    expect(Calculator.count(expression)).toBeCloseTo(2 + (2 + 2) * 2 * 3 / (4 * (5 + 6)) - 7);
  });

  it('Пример 7', () => {
    const expression = '(14.5*8-45)/83*(7.5+9*8/(78*15))-45+(3)-5.2/8';
    expect(Calculator.count(expression))
      .toBeCloseTo((14.5 * 8 - 45) / 83 * (7.5 + 9 * 8 / (78 * 15)) - 45 + (3) - 5.2 / 8);
  });
});

describe('Проверка валидатора', () => {
  it('Корректность скобок ', () => {
    expect(Validator.isCorrectBrackets('()')).toBeTruthy();
    expect(Validator.isCorrectBrackets('(())')).toBeTruthy();
    expect(Validator.isCorrectBrackets('(')).toBeFalsy();
    expect(Validator.isCorrectBrackets(')')).toBeFalsy();
    expect(Validator.isCorrectBrackets('(()')).toBeFalsy();
    expect(Validator.isCorrectBrackets('(()(')).toBeFalsy();
  });
  it('Корректность символов ', () => {
    expect(Validator.isCorrectSymbols('1234567890.+-*/()')).toBeTruthy();
    expect(Validator.isCorrectSymbols(',^-')).toBeFalsy();
  });
  it('Корректность выражения ', () => {
    expect(Validator.isValid('(2+2)*2')).toBeTruthy();
    expect(Validator.isValid('(2+2,0)*2')).toBeFalsy();
    expect(Validator.isValid('(2+2*2')).toBeFalsy();
  });
});
