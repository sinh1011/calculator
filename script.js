// ===== STATE =====
let currentExpression = '';
let justCalculated = false;

// ===== DOM ELEMENTS =====
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

// ===== APPEND TO DISPLAY =====
function appendToDisplay(value) {
  if (justCalculated) {
    // If an operator is pressed after '=', continue from result
    if (['+', '-', '*', '/', '%'].includes(value)) {
      currentExpression = resultEl.textContent + value;
    } else {
      currentExpression = value;
    }
    justCalculated = false;
  } else {
    currentExpression += value;
  }
  updateDisplay();
}

// ===== CLEAR ALL =====
function clearAll() {
  currentExpression = '';
  justCalculated = false;
  expressionEl.textContent = '';
  resultEl.textContent = '0';
}

// ===== DELETE LAST CHARACTER =====
function deleteLast() {
  if (justCalculated) return;
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

// ===== CALCULATE =====
function calculate() {
  if (!currentExpression) return;

  try {
    // Replace % with /100 for percentage calculation
    const sanitized = currentExpression
      .replace(/%(\d)/g, '/100*$1')
      .replace(/%/g, '/100');

    // eslint-disable-next-line no-eval
    const raw = Function('"use strict"; return (' + sanitized + ')')();

    if (!isFinite(raw)) throw new Error('Invalid');

    const rounded = parseFloat(raw.toFixed(10));

    expressionEl.textContent = currentExpression + ' =';
    resultEl.textContent = rounded;
    currentExpression = String(rounded);
    justCalculated = true;
  } catch {
    expressionEl.textContent = currentExpression;
    resultEl.textContent = 'Lỗi';
    currentExpression = '';
    justCalculated = false;
  }
}

// ===== UPDATE DISPLAY =====
function updateDisplay() {
  expressionEl.textContent = currentExpression;
  if (!currentExpression) {
    resultEl.textContent = '0';
    return;
  }
  try {
    const sanitized = currentExpression
      .replace(/%(\d)/g, '/100*$1')
      .replace(/%/g, '/100');
    const preview = Function('"use strict"; return (' + sanitized + ')')();
    if (isFinite(preview)) {
      resultEl.textContent = parseFloat(preview.toFixed(10));
    }
  } catch {
    // Silent - just don't update live preview if expression is incomplete
  }
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
  else if (['+', '-', '*', '/', '%', '.'].includes(e.key)) appendToDisplay(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
