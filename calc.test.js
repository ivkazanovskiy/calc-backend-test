/* eslint-disable no-mixed-operators */
const _ = require('lodash');
const {
  Num,
  solveFirst,
  splitString,
  summArray,
  solveSubString,
  splitBrackets,
  packArray,
  findCloseBracket,
  solve,
} = require('./calc');

describe('Проверки без скобок', () => {
  const string = '-1+25.5*34/47+9-8-45/15*18.9/14.8+7-3.3+25*45';
  let packed;
  let answer;
  beforeEach(() => {
    const splitted = splitString(string);
    packed = packArray(splitted);
    answer = (-1 + 25.5 * 34 / 47 + 9 - 8 - 45 / 15 * 18.9 / 14.8 + 7 - 3.3 + 25 * 45);
    // console.log('Работаем с массивом:', splitted);
  });

  it('Умножение и деление пример 1', () => {
    const firstExample = packed[1];
    expect(solveFirst(firstExample).value).toBeCloseTo(25.5 * 34 / 47);
  });

  it('Умножение и деление пример 2', () => {
    const secondExample = packed[4];
    expect(solveFirst(secondExample).value).toBeCloseTo(-45 / 15 * 18.9 / 14.8);
  });

  it('Проверка всей строки 1', () => {
    const firstStep = packed.map((el) => (el instanceof Num ? el : solveFirst(el)));
    const secondStep = summArray(firstStep);
    expect(secondStep.value).toBeCloseTo(answer);
  });

  it('Проверка всей строки 2', () => {
    const newString = '355/5*20+849.9-700*85/7';
    const newSplitted = splitString(newString);
    const newPacked = packArray(newSplitted);
    const firstStep = newPacked.map((el) => (el instanceof Num ? el : solveFirst(el)));
    const secondStep = summArray(firstStep);
    const newAnswer = (355 / 5 * 20 + 849.9 - 700 * 85 / 7);
    expect(secondStep.value).toBeCloseTo(newAnswer);
  });

  it('Проверка общей функции', () => {
    expect(solveSubString(string).value).toBeCloseTo(answer);
  });
});

describe('Разбитие строки по скобкам', () => {
  it('Проверяем поиск закрывающей скобки', () => {
    const string = '12(34)56(7(8)9)0';
    expect(findCloseBracket(string, 2)).toEqual(5);
    expect(findCloseBracket(string, 8)).toEqual(14);
  });

  it('Проверка на разбитие по скобкам', () => {
    const string = '12(34)56(78)9012(34(5)6(7)8)90';
    const answer = ['12', ['34'], '56', ['78'], '9012', ['34', ['5'], '6', ['7'], '8'], '90'];
    expect(_.isEqual(splitBrackets(string), answer)).toBeTruthy();
  });

  it('Пример 1', () => {
    const string = '1+2';
    expect(solve(string)).toBeCloseTo(3);
  });

  it('Пример 2', () => {
    const string = '2+2*2';
    expect(solve(string)).toBeCloseTo(6);
  });

  it('Пример 3', () => {
    const string = '(2+2*2)';
    expect(solve(string)).toBeCloseTo(6);
  });

  it('Пример 4', () => {
    const string = '(2+2)*2';
    expect(solve(string)).toBeCloseTo(8);
  });

  it('Пример 5', () => {
    const string = '2*(2+2)';
    expect(solve(string)).toBeCloseTo(8);
  });

  it('Пример 6', () => {
    const string = '2+(2+2)*2*3/(4*(5+6))-7';
    expect(solve(string)).toBeCloseTo(2 + (2 + 2) * 2 * 3 / (4 * (5 + 6)) - 7);
  });

  it('Пример 7', () => {
    const string = '(14.5*8-45)/83*(7.5+9*8/(78*15))-45+(3)-5.2/8';
    expect(solve(string)).toBeCloseTo((14.5 * 8 - 45) / 83 * (7.5 + 9 * 8 / (78 * 15)) - 45 + (3) - 5.2 / 8);
  });
});
