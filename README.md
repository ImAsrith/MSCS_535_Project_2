
# XSS-Eval-CSP Demo

## Overview
This minimal Express app demonstrates three things: code injection via an input text field, dynamic evaluation at runtime using `eval`, and complete mitigations that include safe DOM APIs and a Content Security Policy. The app serves two pages. The `/vulnerable` route shows the problems. The `/fixed` route shows the solutions.

## Quick start
1. Install and run:
   ```bash
   npm install
   npm start


2. Open:

   * Vulnerable: `http://localhost:3000/vulnerable`
   * Fixed: `http://localhost:3000/fixed`

## What the vulnerable page shows

Input text field injection:

* The page appends user input to the DOM with `innerHTML`. HTML is parsed, so event handler payloads execute.
* Try this in the input text field, then click Post:

  ```html
  <img src=x onerror="alert('XSS')">
  ```
* Try this to confirm HTML parsing:

  ```html
  <b>bold</b>
  ```

Dynamic evaluation with `eval`:

* The calculator reads a string and calls `eval(expr)`.
* Try:

  ```text
  2+2; alert('XSS via eval')
  ```
* You will see the result of the math and the alert.

## What the fixed page does

* Uses `textContent` to display user input from the input text field as literal text, so markup and handlers do not execute.
* Replaces `eval` with a small arithmetic parser that accepts digits, spaces, periods, parentheses, and the operators `+ - * /`. No dynamic code execution occurs.
* Sends a CSP on the `/fixed` route that allows scripts from self and blocks inline script.

Valid calculator examples on `/fixed`:

```text
(10 + 20) * 3.5
100 / (2 + 3)
```

Invalid examples that should show `Error`:

```text
2+2; alert('x')
console.log('hi')
```

## Verifying the CSP

Check the header in DevTools Network tab on the `/fixed` document, or run:

```bash
curl -I http://localhost:3000/fixed
```

You should see a `Content-Security-Policy` header similar to:

```
default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

A quick behavior check: on `/fixed`, try adding an inline script via the console. The browser should log a CSP violation and block it.

## File layout

```
xss-eval-csp-demo/
  package.json
  Report.pdf
  server.js
  public/
    vulnerable.html
    fixed.html
    js/
      fixed.js
```


