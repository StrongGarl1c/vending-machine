import { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pseudoConsole, setPseudoConsole] = useState([]);

  function handleInput(e) {
    const input = e.target.value;
    setInputValue(input);
  }

  function onSubmit(e) {
    e.preventDefault();
    checkInput(inputValue);
  }

  function addCategory(newCategory) {
    setCategory((prevState) => [...prevState, newCategory]);
    return `${newCategory.name} ${newCategory.price} ${newCategory.amount}`;
  }

  function addItem(newAmount) {
    const { name, amount } = newAmount;
    const snack = category.find((item) => item.name === name);
    if (!snack) {
      const error = new Error(`Category ${name} not found`);
      return `${error.name} ${error.message}`;
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
    return `${name} ${snack.price} ${snack.amount + parseInt(amount)}`;
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
                amount: item.amount--,
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

  function checkInput(input) {
    const array = input.split(' ');
    const start = input.indexOf('"') + 1;
    const finish = input.lastIndexOf('"');
    const name = input.slice(start, finish);
    const re = /\s*"\s*/;
    const arrayRe = input.split(re);
    switch (array[0]) {
      case 'addCategory':
        const priceAndAmount = arrayRe[2].split(' ');
        setPseudoConsole((prevState) => [
          ...prevState,
          addCategory({
            name,
            amount: priceAndAmount[1] || 0,
            price: parseFloat(priceAndAmount[0]).toFixed(2),
            purchasable: true, //priceAndAmount[1] ? true : false,
          }),
        ]);
        break;
      case 'addItem':
        setPseudoConsole((prevState) => [
          ...prevState,
          addItem({
            name,
            amount: arrayRe[2],
          }),
        ]);
        break;
      case 'purchase':
        purchase({ name, date: arrayRe[2] }).forEach((item) =>
          setPseudoConsole((prevState) => [...prevState, item]),
        );
        break;
      case 'list':
        list().forEach((item) =>
          setPseudoConsole((prevState) => [...prevState, item]),
        );
        break;
      case 'clear':
        clear().forEach((item) =>
          setPseudoConsole((prevState) => [...prevState, item]),
        );
        break;
      case 'report':
        report(array[1]).forEach((item) =>
          setPseudoConsole((pseudoConsole) => [...pseudoConsole, item]),
        );
        break;
      default:
        const error = new Error('Syntax Error');
        setPseudoConsole((pseudoConsole) => [
          ...pseudoConsole,
          `${error.name} ${error.message}`,
        ]);
        break;
    }
  }
  return (
    <>
      <h1>Vending Machine</h1>
      <form onSubmit={onSubmit}>
        <input
          id="pseudoConsole-input"
          value={inputValue}
          onChange={handleInput}
          autoFocus
          style={{ width: '100%' }}
        />
      </form>
      <div id="pseudoConsole">
        {pseudoConsole.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
    </>
  );
}

export default App;
