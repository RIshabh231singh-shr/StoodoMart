import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('notificationsState');
    if (serializedState === null) {
      return {
        notifications: [
          {
            id: 1,
            message: "Now you are eligible to sell products",
            read: false,
            createdAt: new Date().toISOString()
          }
        ],
        unreadCount: 1,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { notifications: [], unreadCount: 0 };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('notificationsState', serializedState);
  } catch {
    // ignore write errors
  }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: loadState(),
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
        saveState(state);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      saveState(state);
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      saveState(state);
    }
  }
});

export const { markAsRead, markAllAsRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
