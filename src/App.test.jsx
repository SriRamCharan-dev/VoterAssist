import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('VoterAssist App', () => {
  it('renders the Hero Page initially', () => {
    // We mock localStorage so the landing page shows
    Storage.prototype.getItem = vi.fn(() => null);
    
    render(<App />);
    
    // Check if the title text from HeroPage is rendered
    expect(screen.getByText(/Your Intent-Driven Election Guide/i)).toBeInTheDocument();
  });
});
