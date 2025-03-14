import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import PushNotification from '../src/components/PushNotification'; 
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
}));

describe('PushNotification Component', () => {
  it('should request notification permissions on mount', async () => {
    const { requestPermissionsAsync } = Notifications;
    render(<PushNotification />);
    expect(requestPermissionsAsync).toHaveBeenCalled();
  });

  it('should schedule a notification when the button is pressed', async () => {
    const { scheduleNotificationAsync } = Notifications;
    const { getByText } = render(<PushNotification />);
    const button = getByText('Send Notification'); 

    fireEvent.press(button);

    expect(scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.any(Object),
        trigger: expect.any(Object),
      })
    );
  });
});
