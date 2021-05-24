import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pseudoConsole, setPseudoConsole] = useState([]);
  const pseudoConsoleEnd = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [pseudoConsole]);

  function scrollToBottom() {
    pseudoConsoleEnd.current?.scrollIntoView();
  }

  function handleInput(e) {
    const input = e.target.value;
    setInputValue(input);
  }

  function onSubmit(e) {
    e.preventDefault();
    checkInput(inputValue);
    setInputValue('');
  }

  function addCategory(newCategory) {
    setCategory((prevState) => [...prevState, newCategory]);
    return [`${newCategory.name} ${newCategory.price} ${newCategory.amount}`];
  }

  function addItem(newAmount) {
    const { name, amount } = newAmount;
    const snack = category.find((item) => item.name === name);
    if (!snack) {
      const error = new Error(`Category ${name} not found`);
      return [`${error.name} ${error.message}`];
    }
    setCategory((prevState) => {
      return prevState.map((item) =>
        item.name === name
          ? {
              ...item,
              amount: item.amount + parseInt(amount),
              purchasable: true,
            }
          : item,
      );
    });
    return [`${name} ${snack.price} ${snack.amount + parseInt(amount)}`];
  }
  function purchase(newTransaction) {
    const { name, date } = newTransaction;
    const snack = category.find((item) => item.name === name);
    if (!snack) {
      const error = new Error('Item not found');
      return [`${error.name} ${error.message}`];
    } else if (!snack.purchasable) {
      const error = new Error('Item is out of stock');
      return [`${error.name} ${error.message}`];
    } else {
      setCategory((prevState) => {
        return prevState.map((item) =>
          item.name === name
            ? {
                ...item,
                amount: item.amount - 1,
              }
            : item,
        );
      });
      setTransactions((transactions) => [
        ...transactions,
        {
          name,
          price: snack.price,
          date,
        },
      ]);
      return [date, `${name} ${snack.price}`];
    }
  }

  function list() {
    return category
      .sort((a, b) => parseInt(b.amount - a.amount))
      .filter((item) => item.purchasable)
      .map((item) => `${item.name} ${item.price} ${item.amount}`);
  }

  function clear() {
    const item = category.filter((item) => !item.amount);
    setCategory((prevState) => {
      return prevState.map((item) =>
        !item.amount
          ? {
              ...item,
              purchasable: false,
            }
          : item,
      );
    });
    return item.map((item) => `${item.name} ${item.price}`);
  }

  function report(date) {
    const dateArray = date.split('-');
    let arr;
    if (dateArray.length < 2) {
      const error = new Error('Syntax error');
      return [`${error.name} ${error.message}`];
    } else if (dateArray.length === 2) {
      arr = transactions.filter(
        (item) =>
          Date.parse(item.date) > Date.parse(date) &&
          Date.parse(item.date) < Date.parse(date) + 2629800000,
      );
    }
    if (dateArray.length === 3) {
      arr = transactions.filter((item) => item.date >= date);
    }
    if (!arr || !arr.length) {
      const error = new Error('No items to report on this date');
      return [`${error.name} ${error.message}`];
    }
    const total = arr
      .map((item) => parseFloat(item.price))
      .reduce((total, value) => total + value);
    return arr
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => `${item.name} ${item.price}`)
      .concat(`>Total ${total.toFixed(2)}`);
  }

  function error() {
    const error = new Error('Syntax Error');
    return [`${error.name} ${error.message}`];
  }

  function checkInput(input) {
    const array = input.split(' ');
    const start = input.indexOf('"') + 1;
    const finish = input.lastIndexOf('"');
    const name = input.slice(start, finish);
    const re = /\s*"\s*/;
    const arrayRe = input.split(re);
    const command = array[0];

    function execute(command, value) {
      [`>>> ${input}`]
        .concat(command(value))
        .forEach((item) =>
          setPseudoConsole((prevState) => [...prevState, item]),
        );
      return value;
    }

    switch (command) {
      case 'addCategory':
        if (!arrayRe[2]) {
          return execute(error);
        }
        const priceAndAmount = arrayRe[2].split(' ');
        execute(addCategory, {
          name,
          amount: parseInt(priceAndAmount[1] || 0),
          price: parseFloat(priceAndAmount[0]).toFixed(2),
          purchasable: true, //priceAndAmount[1] ? true : false,
        });
        break;
      case 'addItem':
        if (!arrayRe[2]) {
          return execute(error);
        }
        execute(addItem, {
          name,
          amount: arrayRe[2],
        });
        break;
      case 'purchase':
        if (!arrayRe[2]) {
          return execute(error);
        }
        execute(purchase, { name, date: arrayRe[2] });
        break;
      case 'list':
        execute(list);
        break;
      case 'clear':
        execute(clear);
        break;
      case 'report':
        if (!array[1]) {
          return execute(error);
        }
        execute(report, array[1]);
        break;
      default:
        execute(error);
        break;
    }
  }
  return (
    <section className="console__wrapper">
      <div className="console__wrapper__fixed">
        <h1 className="console__wrapper__heading">Vending Machine</h1>
        <form data-testid="consoleForm" onSubmit={onSubmit}>
          <input
            className="console__wrapper__input"
            value={inputValue}
            onChange={handleInput}
            autoFocus
            data-testid="consoleInput"
          />
        </form>
      </div>
      <div data-testid="consoleOutput" className="console__wrapper__output">
        {pseudoConsole.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
      <div ref={pseudoConsoleEnd}></div>
    </section>
  );
}

export default App;
