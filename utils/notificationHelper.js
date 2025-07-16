// utils/notificationHelper.js
import * as Notifications from 'expo-notifications';

/**
 * Schedule a local notification
 * @param {Object} reminder - The reminder object
 * @param {string} soundName - Name of the tone (without extension), defaults to 'default'
 * @returns {string|null} notificationId or null if not scheduled
 */
export const scheduleNotification = async (reminder, soundName = 'default') => {
  const trigger = new Date(reminder.date);

  // Prevent scheduling in the past
  if (trigger <= new Date()) {
    console.warn('Scheduled time is in the past. Notification will not be triggered.');
    return null;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: reminder.title,
        sound: soundName === 'default' ? undefined : `${soundName}.wav`, // Ensure sound file is included in app.json
      },
      trigger,
    });

    return id;
  } catch (e) {
    console.error('Failed to schedule notification:', e);
    return null;
  }
};

/**
 * Cancel a specific scheduled notification
 * @param {string} id - Notification ID
 */
export const cancelNotification = async (id) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.warn('Failed to cancel notification:', e);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Failed to cancel all notifications:', e);
  }
};
