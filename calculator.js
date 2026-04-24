let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetInput = false;
let expression = '';

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(animate = false) {
  let display = currentInput;
  if (display.length > 12) {
    const num = parseFloat(display);
    display = num.toPrecision(8).replace(/\.?0+$/, '');
  }
  resultEl.textContent = display;
  expressionEl.textContent = expression;
  if (animate) {
    resultEl.classList.remove('result-pop');
    void resultEl.offsetWidth;
    resultEl.classList.add('result-pop');
  }
}

function inputDigit(digit) {
  if (shouldResetInput) {
    currentInput = digit;
    shouldResetInput = false;
  } else {
    if (currentInput === '0' && digit !== '.') {
      currentInput = digit;
    } else if (currentInput.length < 12) {
      currentInput += digit;
    }
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetInput) {
    currentInput = '0.';
    shouldResetInput = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function inputOperator(op) {
  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));

  if (operator && !shouldResetInput) {
    const result = compute();
    currentInput = String(result);
    expression = formatNum(result) + ' ' + opSymbol(op);
  } else {
    expression = formatNum(parseFloat(currentInput)) + ' ' + opSymbol(op);
  }

  previousInput = currentInput;
  operator = op;
  shouldResetInput = true;

  const opButtons = document.querySelectorAll('.btn-operator');
  opButtons.forEach(b => {
    if (b.textContent === opSymbol(op)) b.classList.add('active');
  });

  updateDisplay();
}

function opSymbol(op) {
  return { '/': '÷', '*': '×', '-': '−', '+': '+' }[op] || op;
}

function formatNum(n) {
  const s = String(n);
  return s.length > 10 ? parseFloat(n.toPrecision(8)).toString() : s;
}

function compute() {
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(curr)) return curr;
  switch (operator) {
    case '+': return prev + curr;
    case '-': return prev - curr;
    case '*': return prev * curr;
    case '/': return curr === 0 ? 'Error' : prev / curr;
    default: return curr;
  }
}

function calculate() {
  if (!operator || shouldResetInput) return;

  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));

  const fullExpr = expression + ' ' + formatNum(parseFloat(currentInput)) + ' =';
  const result = compute();

  currentInput = result === 'Error' ? 'Error' : String(result);
  expression = fullExpr;
  operator = null;
  previousInput = '';
  shouldResetInput = true;

  updateDisplay(true);
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetInput = false;
  expression = '';
  document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));
  updateDisplay();
}

function toggleSign() {
  if (currentInput === '0' || currentInput === 'Error') return;
  currentInput = currentInput.startsWith('-')
    ? currentInput.slice(1)
    : '-' + currentInput;
  updateDisplay();
}

function percent() {
  if (currentInput === 'Error') return;
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') inputOperator('+');
  else if (e.key === '-') inputOperator('-');
  else if (e.key === '*') inputOperator('*');
  else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    if (!shouldResetInput && currentInput !== '0') {
      currentInput = currentInput.length === 1 ? '0' : currentInput.slice(0, -1);
      updateDisplay();
    }
  }
});
