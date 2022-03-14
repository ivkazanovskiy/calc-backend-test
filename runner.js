const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const { Calculator } = require('./calc');

const rl = readline.createInterface({ input, output });

rl.question('Введите выражение:\n', (expression) => {
  console.log(`Результат: ${Calculator.count(expression)}`);
  rl.close();
});
