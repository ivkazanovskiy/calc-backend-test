# Решение тестового задания по реализации консольного калькулятора

**npm i** - установка jest

**npm test** - проверка тестов

**npm start** - запуск калькулятора

Выполнение рассчета:

Выражение должно иметь корректный вид математического выражения: 
* все скобки парные
* отстутствие пробелов в записании выражения
* перед скобками должен быть математический знак

## Реализованный функционал

Разложение выражения на состовляющие в соответствии с заданными скобками

Разложение цельной строки (2+2*2) на состовляюшие (Num) с учетом вычислительной операции (action) перед слогаемым/множителем 

Группировка Num в сообстветии с математическим принципом, что деление/умножение выполняется в первую очередь

Вычисление результата

Валидация скобок

Валидация допустимых символов

## Не реализовано

Более сложная введенного выражения (на повторение математических операторов, отсутствие знаков до/после скобок, корректрость записи десятичной дроби и т.д.)

Выведение ошибки при делении на 0 (будет выведенно: Infinity)
