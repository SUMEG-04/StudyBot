import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Components/Login.jsx';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from './App.js';

// Mock navigate function
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login component', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    mockedNavigate.mockClear();

    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderLogin = () =>
    render(
      <UserContext.Provider value={{ state: {}, dispatch }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

  test('renders email, password inputs and login button', () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('allows user to type email and password', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/your email/i);
    const passwordInput = screen.getByPlaceholderText(/your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('mypassword');
  });

  test('successful login calls dispatch and navigate', async () => {
    renderLogin();

    // Mock fetch response for success
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ success: true }),
    });

    const emailInput = screen.getByPlaceholderText(/your email/i);
    const passwordInput = screen.getByPlaceholderText(/your password/i);
    const loginButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({ type: 'USER', payload: true });
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('failed login shows alert with "Invalid Credential"', async () => {
    renderLogin();

    // Mock fetch response for failure
    global.fetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({}),
    });

    window.alert = jest.fn();

    const loginButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid Credential');
    });
  });
});
