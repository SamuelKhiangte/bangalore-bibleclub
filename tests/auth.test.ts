import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhoneAuthModal } from '../src/components/auth/PhoneAuthModal.tsx';
import { SimulatedSmsBanner } from '../src/components/auth/SimulatedSmsBanner.tsx';

describe('Auth Flow', () => {
  it('renders phone input and submit button', () => {
    const onLogin = vi.fn();
    render(React.createElement(PhoneAuthModal, { onLoginSuccess: onLogin }));

    expect(screen.getByText('BibleReal')).toBeDefined();
    expect(screen.getByPlaceholderText('555 123 4567')).toBeDefined();
    expect(screen.getByText('Send Verification Code')).toBeDefined();
  });

  it('triggers SMS banner autofill callback', () => {
    const onAutofill = vi.fn();
    const onDismiss = vi.fn();
    render(
      React.createElement(SimulatedSmsBanner, {
        code: '654321',
        onAutofill,
        onDismiss
      })
    );

    expect(screen.getByText('654321')).toBeDefined();
    const autofillBtn = screen.getByText('Autofill');
    fireEvent.click(autofillBtn);
    expect(onAutofill).toHaveBeenCalledTimes(1);
  });
});
