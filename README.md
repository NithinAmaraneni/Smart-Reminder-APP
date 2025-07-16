# 📱 Smart Reminder App

Smart Reminder App is a productivity-focused mobile application built using **React Native**. It allows users to efficiently manage **reminders**, **tasks**, **routines**, and **notes**, all in one place — with local storage, notifications, and a clean, green-themed user interface.

---

## 🌟 Features

### ✅ Reminders
- Add title, date, time, and select notification tone
- Schedule local notifications using Expo Notifications
- Swipe to delete reminders
- Auto-persisted using AsyncStorage

### 📅 Calendar
- Tap on any date to view reminders for that day

### 🗒️ Notes
- Add, view, edit, and delete notes (title + description)
- Swipe to delete
- Data stored with AsyncStorage

### 📌 Tasks (Coming up!)
- Add daily to-dos
- Mark complete/incomplete
- Task tracking saved locally

### 🔁 Routines (Coming up!)
- Add recurring activities (e.g., workouts, study sessions)
- View routine list

---

## 🛠️ Tech Stack

- **React Native** (Expo)
- **AsyncStorage** for local data
- **Expo Notifications** for reminders
- **react-navigation** for page routing
- **react-native-reanimated** for animations
- **react-native-gesture-handler** for swipe actions

---

## 📦 Installation

```bash
git clone https://github.com/NithinAmaraneni/Smart-Reminder-APP.git
cd SmartReminderApp
npm install
npx expo start
