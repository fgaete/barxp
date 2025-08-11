import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddDrinkPage from '../pages/AddDrinkPage';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    currentUser: {
      uid: '123',
      displayName: 'Test User',
      email: 'test@example.com',
    },
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AddDrinkPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title', () => {
    renderWithRouter(<AddDrinkPage />);
    expect(screen.getByText(/agregar trago/i)).toBeInTheDocument();
  });

  it('displays drink categories', () => {
    renderWithRouter(<AddDrinkPage />);
    expect(screen.getByText(/todos \(58\)/i)).toBeInTheDocument();
    expect(screen.getByText(/cervezas/i)).toBeInTheDocument();
    expect(screen.getByText(/vinos/i)).toBeInTheDocument();
    expect(screen.getByText(/cócteles/i)).toBeInTheDocument();
  });

  it('shows search input', () => {
    renderWithRouter(<AddDrinkPage />);
    const searchInput = screen.getByPlaceholderText(/buscar bebidas/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays popular drinks', () => {
    renderWithRouter(<AddDrinkPage />);
    
    // Should show at least some popular drinks
    expect(screen.getByText(/pisco sour/i)).toBeInTheDocument();
    expect(screen.getByText(/mojito/i)).toBeInTheDocument();
  });

  it('shows drink emojis', () => {
    renderWithRouter(<AddDrinkPage />);
    
    // Should display emojis instead of placeholder images
    const drinkElements = screen.getAllByText(/🍸|🍺|🍷|🥃/);
    expect(drinkElements.length).toBeGreaterThan(0);
  });
});