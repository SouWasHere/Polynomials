let currentPage = "basic";

function openPage(id, el) {
  if (id === currentPage) return;

  const current = document.getElementById(currentPage);
  const next = document.getElementById(id);

  current.classList.remove("active");
  current.classList.add("exit");

  setTimeout(() => {
    current.classList.remove("exit");
    next.classList.add("active");
  }, 300);

  document.querySelectorAll(".sidebar-link")
    .forEach(l => l.classList.remove("active"));

  el.classList.add("active");
  currentPage = id;
}

// --- Utility ---
function chop(num, k) {
  if (num === 0) return 0;
  const factor = Math.pow(10, k);
  return Math.trunc(num * factor) / factor;
}

function roundNum(num, k) {
  const factor = Math.pow(10, k);
  return Math.round(num * factor) / factor;
}

function formatNumber(num, k) {
  if (Math.abs(num) < 1e-4 && num !== 0)
    return num.toExponential(k);
  return num.toFixed(k);
}

// --- Basic ---
function compute() {
  const a = parseFloat(num1.value);
  const b = parseFloat(num2.value);
  const op = operator.value;
  const k = parseInt(sig.value);
  const m = method.value;

  if (isNaN(a) || isNaN(b)) return;

  let exact;

  if (op === '+') exact = a + b;
  if (op === '-') exact = a - b;
  if (op === '*') exact = a * b;
  if (op === '/') {
    if (b === 0) {
      alert("Cannot divide by 0");
      return;
    }
    exact = a / b;
  }

  const approx = m === 'chop' ? chop(exact, k) : roundNum(exact, k);
  const absErr = Math.abs(exact - approx);
  const relErr = exact !== 0 ? absErr / Math.abs(exact) : 0;
  const sigDigits = approx !== 0
    ? Math.floor(Math.log10(Math.abs(approx))) + 1
    : 0;

  basicResult.innerText = `
Exact Value: ${formatNumber(exact, k)}
Approximation (${m}): ${formatNumber(approx, k)}
Absolute Error: ${formatNumber(absErr, k)}
Relative Error: ${formatNumber(relErr, k)}
Significant Digits: ${sigDigits}
Scientific Notation: ${approx.toExponential(k)}
`;
}

// --- Error ---
function errorAnalysis() {
  const p = parseFloat(trueVal.value);
  const pstar = parseFloat(approxVal.value);

  if (isNaN(p) || isNaN(pstar)) return;

  const absErr = Math.abs(p - pstar);
  const relErr = p !== 0 ? absErr / Math.abs(p) : 0;

  errorResult.innerText = `
Absolute Error: ${formatNumber(absErr, 6)}
Relative Error: ${formatNumber(relErr, 6)}
`;
}

// --- Polynomial ---
function evaluatePoly() {
  let poly = polyInput.value.trim();
  const x = parseFloat(xval.value);
  const k = parseInt(polySig.value);
  const m = polyMethod.value;

  if (!poly || isNaN(x)) return;

  try {
    poly = poly.replace(/\^/g, '**');
    poly = poly.replace(/(\d)(x)/gi, '$1*$2');
    poly = poly.replace(/x/gi, `(${x})`);

    const exact = eval(poly);

    const approx = m === 'chop'
      ? chop(exact, k)
      : roundNum(exact, k);

    const absErr = Math.abs(exact - approx);
    const relErr = exact !== 0 ? absErr / Math.abs(exact) : 0;
    const sigDigits = approx !== 0
      ? Math.floor(Math.log10(Math.abs(approx))) + 1
      : 0;

    polyResult.innerText = `
Exact Value: ${formatNumber(exact, k)}
Approximation (${m}): ${formatNumber(approx, k)}
Absolute Error: ${formatNumber(absErr, k)}
Relative Error: ${formatNumber(relErr, k)}
Significant Digits: ${sigDigits}
Scientific Notation: ${approx.toExponential(k)}
`;

  } catch {
    polyResult.innerText = "Invalid polynomial format.";
  }
}
