import React, { useState, useEffect } from 'react';
import './App.css';

const Operator = {
  Nop: -1,
  Add: 0,
  Sub: 1,
  Mul: 2,
  Div: 3,
  Power: 4,
  Neg: 100,
  Percent: 101,
  Square: 102,
  Sqrt: 103,
  Inv: 104,
  Eq: 1000,
  MemR: 501,
  MemC: 502,
  MemAdd: 503,
  MemSub: 504,
  Rank: (x, y) => {
    let is1 = (x) => { return x === Operator.Mul || x === Operator.Div; }
    let is2 = (x) => { return x === Operator.Add || x === Operator.Sub; }

    if (x === y || (is1(x) && is1(y)) || (is2(x) && is2(y))) return 0;
    if (x === Operator.Power || y === Operator.Power) {
      return x === Operator.Power ? 1 : -1;
    }
    return is1(x) ? 1 : -1;
  }
}

class Calculator {
  constructor() {
    this.new = true;
    this.memory = null;
    this.isResult = true;
    this.history = {"op": Operator.Nop, "val": null};
    this.valStk = ["0"];
    this.opStk = [];
  }
  reset() {
    this.new = true;
    this.isResult = true;
    this.history = {"op": Operator.Nop, "val": null};
    this.valStk = ["0"];
    this.opStk = [];
  }
  clear() {
    this.new = true;
    this.valStk.pop();
    this.valStk.push("0");
  }
  processValue(val) {
    if (isNaN(val)) return "Error";
    if (!isFinite(val)) return val;
    if (val.length <= 8) return val;

    let a = Math.round(parseFloat(val)).toString()
    let b = (parseFloat(val) - a).toPrecision(Math.max(1, 8 - a.length - 1));
    console.log(a, b);
    if (a.length > 8) return parseFloat(a).toExponential(2);
    if (a === "0") {
      if (parseFloat(val).toString().length > 9) return parseFloat(val).toExponential(2);
      return parseFloat(val).toString();
    }
    if (Math.abs(parseFloat(b)) < 1e-8) return a;
    if ((a + "." + b.split(".")[1]).length > 8) return a;//parseFloat(val).toExponential(3);
    return (a + "." + b.split(".")[1]).trimRight("0");
  }
  faceValue() {
    let val = this.valStk.at(-1);
    if (val === null) val = this.valStk.at(-2);

    return this.processValue(val);
  }
  nextDigit(digit) {
    let prev = this.valStk.pop(), backup = prev;
    if (prev === null || this.isResult) prev = "0";
    if (prev === "0" && digit !== ".") {
      if (digit !== "0") prev = digit;
    } else if (digit === ".") {
      if (prev.indexOf(".") === -1) prev += ".";
    } else {
      prev += digit;
    }
    if (prev.length > 8) {
      this.valStk.push(backup);
      return;
    }
    this.isResult = false;
    this.valStk.push(prev);
    this.history.val = prev;
    if (prev !== "0") this.new = false;
  }
  flush(stop) {
    let startOp = this.opStk.at(-1);
    while (true) {
      if (this.opStk.length === 0) break;
      if (stop && Operator.Rank(startOp, this.opStk.at(-1)) > 0) break;

      let op = this.opStk.pop();
      let num1 = this.valStk.pop();
      let num2 = this.valStk.pop();
      if (num1 === null) {
        this.history.val = num2;
        num1 = num2;
      }
      num1 = parseFloat(num1);
      num2 = parseFloat(num2);
      let result = null;

      if (op === Operator.Nop) result = num2;
      else if (op === Operator.Add) result = num2 + num1;
      else if (op === Operator.Sub) result = num2 - num1;
      else if (op === Operator.Mul) result = num2 * num1;
      else if (op === Operator.Div) result = num2 / num1;
      else if (op === Operator.Power) result = num2 ** num1;
      else throw "unrecognized or invalid operator";

      this.valStk.push(String(result));

      console.log("flush", this.valStk, this.opStk, this.history);
    }
  }
  nextOp(op) {
    let addNew = () => {
      this.opStk.push(op);
      this.valStk.push(null);
      this.history = {"op": op, "val": null};
    }
    if (op === Operator.Eq) {
      if (this.opStk.length === 0) {
        this.opStk.push(this.history.op);
        this.valStk.push(this.history.val);
      }
      this.flush(false);
      this.isResult = true;
    } 
    else {
      if (this.opStk.length === 0) {
        addNew();
      } 
      else {
        let prevOp = this.opStk.at(-1);
        let prevVal = this.valStk.at(-1);
        if (prevVal === null) {
          this.opStk.pop();
          this.valStk.pop();
          addNew();
        } 
        else {
          if (Operator.Rank(op, prevOp) > 0) {
            addNew();
          } 
          else {
            this.flush(true);
            addNew();
          }
        }
      }
    }
  }
  nextFunc(func) {
    let num = this.valStk.pop();
    if (num === null) num = this.valStk.at(-1);
    num = parseFloat(num);

    if (func === Operator.Neg) num = -num;
    else if (func === Operator.Percent) num = num * 0.01;
    else if (func === Operator.Square) num = num * num;
    else if (func === Operator.Sqrt) num = Math.sqrt(num);
    else if (func === Operator.Inv) num = 1 / num;
    this.isResult = true;

    num = String(num);
    this.history.val = num;
    this.valStk.push(num);
  }
  nextMem(mem) {
    let val = this.valStk.at(-1);
    if (val === null) val = this.valStk.at(-2);

    if (this.memory === null) {
      if (mem === Operator.MemAdd) this.memory = val;
      else if (mem === Operator.MemSub) this.memory = String(-parseFloat(val));
    }
    else {
      if (mem === Operator.MemAdd) this.memory = String(parseFloat(this.memory) + parseFloat(val));
      else if (mem === Operator.MemSub) this.memory = String(parseFloat(this.memory) - parseFloat(val));
      else if (mem === Operator.MemC) this.memory = null;
      else if (mem === Operator.MemR) {
        this.valStk[this.valStk.length-1] = this.memory; 
        this.isResult = true;
      }
    }
  }
}

function test() {
  let calculator = new Calculator();
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextDigit("1");
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextDigit("1");
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextDigit("1");
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextOp(Operator.Add);
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextDigit("2");
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextOp(Operator.Mul);
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextDigit("3");
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextOp(Operator.Power);
  console.log(calculator.valStk, calculator.opStk, calculator.history);
  calculator.nextOp(Operator.Eq);
  console.log(calculator.valStk, calculator.opStk, calculator.history);
}

var calculator = new Calculator();

function App() {
  const [val, setVal] = useState("0");

  let clickNum = (e) => {
    if (calculator.valStk.at(-1) === null) {
      document.getElementById(calculator.opStk.at(-1)).classList.remove("active");
    }
    calculator.nextDigit(e.target.textContent);
    console.log(calculator.valStk, calculator.opStk, calculator.history);
    setVal(calculator.faceValue());
  }
  let clickOp = (e) => {
    if (calculator.valStk.at(-1) === null) {
      document.getElementById(calculator.opStk.at(-1)).classList.remove("active");
    }
    calculator.nextOp(parseInt(e.target.id));
    console.log(calculator.valStk, calculator.opStk, calculator.history);
    setVal(calculator.faceValue());
    if (calculator.valStk.at(-1) === null) {
      document.getElementById(calculator.opStk.at(-1)).classList.add("active");
    }
  }
  let clickFunc = (e) => {
    if (calculator.valStk.at(-1) === null) {
      document.getElementById(calculator.opStk.at(-1)).classList.remove("active");
    }
    calculator.nextFunc(parseInt(e.target.id));
    console.log(calculator.valStk, calculator.opStk, calculator.history);
    setVal(calculator.faceValue());
  }
  let clickMem = (e) => {
    let isNullBefore = calculator.valStk.at(-1) === null;
    calculator.nextMem(parseInt(e.target.id));
    console.log(calculator.valStk, calculator.opStk, calculator.history, calculator.memory);
    setVal(calculator.faceValue());

    if (isNullBefore && calculator.valStk.at(-1)) {
      document.getElementById(calculator.opStk.at(-1)).classList.remove("active");
    }

    if (calculator.memory !== null) document.getElementById(Operator.MemR).classList.add("active");
    else document.getElementById(Operator.MemR).classList.remove("active");
  }
  let clear = (e) => {
    if (calculator.valStk.at(-1) === null) {
      document.getElementById(calculator.opStk.at(-1)).classList.remove("active");
    }
    if (e.target.textContent === "C") {
      calculator.clear();
    } 
    else {
      calculator.reset();
    }
    console.log(calculator.valStk, calculator.opStk, calculator.history);
    setVal(calculator.faceValue());
  }

  useEffect(() => {
    if (!calculator.new) document.getElementById("clear").textContent = "C";
    else document.getElementById("clear").textContent = "AC";
  });

  return (
    <div className="calculator">
      <div className="top-container">
        <div className="value" id="value-box">{val}</div>
      </div>
      <div className="buttons-container">
        <div onClick={clickMem} id={Operator.MemC} className="button memory">MC</div>
        <div onClick={clickMem} id={Operator.MemR} className="button memory">MR</div>
        <div onClick={clickMem} id={Operator.MemAdd} className="button memory">M+</div>
        <div onClick={clickMem} id={Operator.MemSub} className="button memory">M-</div>
        <div onClick={clear} id="clear" className="button function ac">AC</div>
        <div onClick={clickFunc} id={Operator.Neg} className="button function pm">±</div>
        <div onClick={clickFunc} id={Operator.Percent} className="button function percent">%</div>
        <div onClick={clickOp} id={Operator.Power} className="button operator division">x^y</div>
        <div onClick={clickFunc} id={Operator.Square} className="button function">x^2</div>
        <div onClick={clickFunc} id={Operator.Sqrt} className="button function">√x</div>
        <div onClick={clickFunc} id={Operator.Inv} className="button function">1/x</div>
        <div onClick={clickOp} id={Operator.Div} className="button operator division">÷</div>
        <div onClick={clickNum} className="button number-7">7</div>
        <div onClick={clickNum} className="button number-8">8</div>
        <div onClick={clickNum} className="button number-9">9</div>
        <div onClick={clickOp} id={Operator.Mul} className="button operator multiplication">×</div>
        <div onClick={clickNum} className="button number-4">4</div>
        <div onClick={clickNum} className="button number-5">5</div>
        <div onClick={clickNum} className="button number-6">6</div>
        <div onClick={clickOp} id={Operator.Sub} className="button operator subtraction">−</div>
        <div onClick={clickNum} className="button number-1">1</div>
        <div onClick={clickNum} className="button number-2">2</div>
        <div onClick={clickNum} className="button number-3">3</div>
        <div onClick={clickOp} id={Operator.Add} className="button operator addition">+</div>
        <div onClick={clickNum} className="button number-0">0</div>
        <div onClick={clickNum} className="button decimal">.</div>
        <div onClick={clickOp} id={Operator.Eq} className="button operator equal">=</div>
      </div>
    </div>
  );
}

export default App;
