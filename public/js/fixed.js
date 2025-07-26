// public/js/fixed.js

// 1) Safe comment handling
document.getElementById('post').addEventListener('click', () => {
  const t = document.getElementById('commentInput').value;
  const li = document.createElement('li');
  li.textContent = t;               // escape user input
  document.getElementById('comments').appendChild(li);
});

// 2) Strict arithmetic parser without eval or Function
function tokenize(expr) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i, dotCount = 0;
      while (j < expr.length && /[0-9.]/.test(expr[j])) {
        if (expr[j] === '.') dotCount++;
        if (dotCount > 1) throw new Error('Invalid number');
        j++;
      }
      tokens.push({ type: 'num', value: parseFloat(expr.slice(i, j)) });
      i = j;
      continue;
    }
    if ('+-*/()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    throw new Error('Invalid character: ' + ch);
  }
  return tokens;
}

function toRPN(tokens) {
  const out = [], stack = [];
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  for (const t of tokens) {
    if (t.type === 'num') out.push(t);
    else if (t.type === 'op' && '+-*/'.includes(t.value)) {
      while (
        stack.length &&
        '+-*/'.includes(stack[stack.length - 1].value) &&
        prec[stack[stack.length - 1].value] >= prec[t.value]
      ) {
        out.push(stack.pop());
      }
      stack.push(t);
    } else if (t.type === 'op' && t.value === '(') {
      stack.push(t);
    } else if (t.type === 'op' && t.value === ')') {
      while (stack.length && stack[stack.length - 1].value !== '(') out.push(stack.pop());
      if (!stack.length) throw new Error('Mismatched parentheses');
      stack.pop(); // remove '('
    }
  }
  while (stack.length) {
    const op = stack.pop();
    if (op.value === '(') throw new Error('Mismatched parentheses');
    out.push(op);
  }
  return out;
}

function evalRPN(rpn) {
  const st = [];
  for (const t of rpn) {
    if (t.type === 'num') st.push(t.value);
    else {
      const b = st.pop(), a = st.pop();
      if (a === undefined || b === undefined) throw new Error('Bad expression');
      switch (t.value) {
        case '+': st.push(a + b); break;
        case '-': st.push(a - b); break;
        case '*': st.push(a * b); break;
        case '/': st.push(a / b); break;
        default: throw new Error('Bad operator');
      }
    }
  }
  if (st.length !== 1) throw new Error('Bad expression');
  return st[0];
}

function calc(expr) {
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}

document.getElementById('calc').addEventListener('click', () => {
  const expr = document.getElementById('expr').value;
  try {
    const result = calc(expr);
    document.getElementById('output').textContent = String(result);
  } catch {
    document.getElementById('output').textContent = 'Error';
  }
});

