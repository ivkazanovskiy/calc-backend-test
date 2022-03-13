const { solve } = require('./calc');

const string = '(14.5*8-45)/83*(7.5+9*8/(78*15))-45+(3)-5.2/8';

console.log('Задано выражение: ', string);
console.log('Ответ: ', solve(string));
