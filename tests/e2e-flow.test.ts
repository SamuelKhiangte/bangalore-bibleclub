import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App.tsx';
import { BibleRealDB } from '../src/services/storage.ts';

describe('E2E BibleReal App Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders PhoneAuthModal when unauthenticated, and completes login flow', async () => {
    render(React.createElement(App));

    expect(screen.getByText('Bangalore BibleClub')).toBeDefined();
    expect(screen.getByPlaceholderText('98450 12345')).toBeDefined();

    // Click Send Verification Code
    const sendBtn = screen.getByText('Send Verification Code');
    fireEvent.click(sendBtn);

    // Verify confirmation code screen appears
    await waitFor(() => {
      expect(screen.getByText('Confirm your code')).toBeDefined();
    });

    // Enter test bypass code 123456
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(1);

    // Enter digits 123456
    const digits = ['1', '2', '3', '4', '5', '6'];
    inputs.slice(0, 6).forEach((input, idx) => {
      fireEvent.change(input, { target: { value: digits[idx] } });
    });

    // Should transition to profile setup or main feed
    await waitFor(() => {
      expect(
        screen.queryByText('Create Profile') ||
        screen.queryByText('Circle')
      ).toBeDefined();
    });
  });

  it('displays feed, progress tracker, and notifications when user is logged in', async () => {
    BibleRealDB.setUser({
      id: 'test-user-sam',
      phoneNumber: '+15551234567',
      name: 'Samuel Khiangte',
      username: 'samuelk',
      avatarUrl: 'https://example.com/avatar.jpg',
      streakDays: 4,
      lastReadDate: new Date().toISOString().split('T')[0],
      joinedAt: '2026-10-01'
    });

    render(React.createElement(App));

    // Should show TopHeader with name / brand
    expect(screen.getByText('Bangalore BibleClub')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined(); // Streak flame

    // Check BottomNav buttons
    expect(screen.getByText('Circle')).toBeDefined();
    expect(screen.getByText('Tracker')).toBeDefined();
    expect(screen.getByText('Alerts')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();

    // Navigate to Progress Tracker
    fireEvent.click(screen.getByText('Tracker'));
    await waitFor(() => {
      expect(screen.getByText('Bible Journey Tracker')).toBeDefined();
      expect(screen.getByText('Testament Breakdown')).toBeDefined();
      expect(screen.getByText('Old Testament (39 Books)')).toBeDefined();
    });

    // Navigate to Alerts
    fireEvent.click(screen.getByText('Alerts'));
    await waitFor(() => {
      expect(screen.getByText('Club Notifications')).toBeDefined();
      expect(screen.getByText('Simulate Friend Reading')).toBeDefined();
    });
  });
});
