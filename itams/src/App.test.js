import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ITAMS homepage content', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /^ITAMS$/i, level: 1 })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/IT Asset Management System/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Manage and Track IT Assets Efficiently/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getAllByRole('button', { name: /login/i }).length
  ).toBeGreaterThan(0);
});