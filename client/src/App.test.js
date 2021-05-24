import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

Element.prototype.scrollIntoView = jest.fn();
render(<App />);
const input = screen.getByTestId('consoleInput');
const output = screen.getByTestId('consoleOutput');

test('app end to end test', () => {
  userEvent.type(input, 'addCategory "Chocolate bar" 32.75 12');
  expect(input).toHaveValue('addCategory "Chocolate bar" 32.75 12');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Chocolate bar 32.75 12');

  userEvent.type(input, 'addCategory "Donut" 29.5');
  expect(input).toHaveValue('addCategory "Donut" 29.5');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Donut 29.50 0');

  userEvent.type(input, 'addCategory "Cracker" 18 2');
  expect(input).toHaveValue('addCategory "Cracker" 18 2');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Cracker 18.00 2');

  userEvent.type(input, 'purchase "Cracker" 2021-04-21');
  expect(input).toHaveValue('purchase "Cracker" 2021-04-21');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    '2021-04-21',
  );
  expect(output.lastChild.textContent).toBe('Cracker 18.00');

  userEvent.type(input, 'addItem "Donut" 3');
  expect(input).toHaveValue('addItem "Donut" 3');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Donut 29.50 3');

  userEvent.type(input, 'purchase "Chocolate bar" 2021-04-22');
  expect(input).toHaveValue('purchase "Chocolate bar" 2021-04-22');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    '2021-04-22',
  );
  expect(output.lastChild.textContent).toBe('Chocolate bar 32.75');

  userEvent.type(input, 'purchase "Cracker" 2021-04-24');
  expect(input).toHaveValue('purchase "Cracker" 2021-04-24');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    '2021-04-24',
  );
  expect(output.lastChild.textContent).toBe('Cracker 18.00');

  userEvent.type(input, 'purchase "Donut" 2021-04-25');
  expect(input).toHaveValue('purchase "Donut" 2021-04-25');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    '2021-04-25',
  );
  expect(output.lastChild.textContent).toBe('Donut 29.50');

  userEvent.type(input, 'list');
  expect(input).toHaveValue('list');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 3].textContent).toBe(
    'Chocolate bar 32.75 11',
  );
  expect(output.children[output.children.length - 2].textContent).toBe(
    'Donut 29.50 2',
  );
  expect(output.lastChild.textContent).toBe('Cracker 18.00 0');

  userEvent.type(input, 'clear');
  expect(input).toHaveValue('clear');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Cracker 18.00');

  userEvent.type(input, 'purchase "Chocolate bar" 2021-04-28');
  expect(input).toHaveValue('purchase "Chocolate bar" 2021-04-28');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    '2021-04-28',
  );
  expect(output.lastChild.textContent).toBe('Chocolate bar 32.75');

  userEvent.type(input, 'addItem "Donut" 10');
  expect(input).toHaveValue('addItem "Donut" 10');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('Donut 29.50 12');

  userEvent.type(input, 'list');
  expect(input).toHaveValue('list');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.children[output.children.length - 2].textContent).toBe(
    'Donut 29.50 12',
  );
  expect(output.lastChild.textContent).toBe('Chocolate bar 32.75 10');

  userEvent.type(input, 'report 2021-04');
  expect(input).toHaveValue('report 2021-04');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('>Total 131.00');

  userEvent.type(input, 'report 2021-04-25');
  expect(input).toHaveValue('report 2021-04-25');
  fireEvent.submit(input);
  expect(input).toHaveValue('');
  expect(output.lastChild.textContent).toBe('>Total 62.25');
});
