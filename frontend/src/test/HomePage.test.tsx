import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock the useAuth hook
const mockUser = {
  uid: '123',
  displayName: 'Test User',
  email: 'test@example.com',
  photoURL: null,
};

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    currentUser: mockUser,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MockWrapper>
      {component}
    </MockWrapper>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/¡hola/i)).toBeInTheDocument();
  });

  it('displays user level information', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/nivel 1/i)).toBeInTheDocument();
  });

  it('shows achievement section', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/logros recientes/i)).toBeInTheDocument();
  });

  it('displays achievement message when no achievements', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/registra tu primera bebida para desbloquear logros/i)).toBeInTheDocument();
  });
});