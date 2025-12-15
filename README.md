# 🏋️ FitTrack Pro

A comprehensive fitness tracking mobile application built with React Native and Expo, designed to help you monitor your daily workouts, water intake, meals, and achieve your health goals.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

## 📱 Download the App
Start tracking your fitness journey today!
[**Download FitTrack Pro v1.0.2 for Android**](https://github.com/purvanshh/fittrack-pro/releases/download/v1.0.2/FitTrackPro-v1.0.2.apk)
[View All Releases](https://github.com/purvanshh/fittrack-pro/releases)

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Sign-In** - Secure authentication powered by Supabase
- **User Accounts** - Create account, sign in, sign out
- **Session Persistence** - Stay logged in across app restarts
- **Per-User Data** - Each user has their own private fitness data
- **Glass-Themed Login** - Beautiful login screen with smooth animations

### 🏠 Dashboard
- **Personalized Greeting** - Welcome message with your name
- **Goals Overview Card** - Quick view of daily water, calorie, and workout goals with tap-to-edit
- **Progress Rings** - Visual circular progress indicators for water, calories, and workouts
- **Streak Counter** - Flashy orange streak badge in the header showing consecutive active days
- **Quick Actions** - One-tap buttons to log workouts, water, or meals
- **Smart Summary** - Today's stats with percentage of goals completed

### 🏋️ Workout Tracker
- **8 Workout Types** - Running, Cycling, Swimming, Weight Training, Yoga, HIIT, Walking, Other
- **Duration & Calories** - Track workout time and calories burned
- **Weekly Summary** - Total workouts and time for the current week
- **Smart Suggestions** - Quick-start buttons based on your recent workout history
- **Workout History** - View and delete past workouts

### 💧 Water Tracker
- **Animated Water Bottle** - Visual representation with fill animation
- **Quick-Add Presets** - 150ml, 250ml, 350ml, 500ml buttons for fast logging
- **Daily Goal Progress** - Bar showing remaining water to reach your goal
- **Intake History** - Timestamped log of all water intake for the day

### 🍽️ Meal Tracker
- **Calorie Logging** - Track food intake with calorie counts
- **Meal Type Categories** - Breakfast, Lunch, Dinner, Snack
- **Meal Breakdown** - View calories consumed by meal type
- **Progress Visualization** - Color-coded progress bar (green/yellow/red)
- **Daily Calorie Summary** - Track total calories vs. your goal

### 📊 Weekly Report
- **7-Day Summary Cards** - Total workouts, water intake, and calories
- **Insights & Analytics** - Best workout day, average water intake, calorie trends
- **Interactive Charts** - Line chart for water trends, bar chart for calories
- **Data Visualization** - Powered by react-native-chart-kit

### 👤 Profile & Settings
- **Personal Details** - Name, weight, height
- **Custom Goals** - Set your own daily water (ml), calorie, and weekly workout targets
- **Notification Preferences** - Toggle water reminders, workout reminders, meal goal notifications, and streak notifications
- **Theme Toggle** - Switch between light and dark mode
- **Data Management** - Clear all data option

---

## 🎨 Design Highlights

- **Vibrant Color Palette** - Eye-catching violet, sky blue, and orange accents
- **Dark Mode Support** - Seamless theme switching with persistent preference
- **Smooth Animations** - Progress rings, water bottle fill, and micro-interactions
- **Modern UI** - Clean, intuitive interface with glassmorphism effects
- **Responsive Layout** - Optimized for various screen sizes

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/purvanshh/fittrack-pro.git
   cd fittrack-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

---

## 📱 Tech Stack

- **Framework:** React Native 0.81.5
- **Platform:** Expo SDK 54
- **Language:** TypeScript 5.9
- **Navigation:** Expo Router 6.0
- **Authentication:** Supabase Auth
- **Storage:** @react-native-async-storage/async-storage (per-user isolated)
- **Charts:** react-native-chart-kit
- **Icons:** @expo/vector-icons (Ionicons)
- **Notifications:** expo-notifications (requires development build)

---

## 📂 Project Structure

```
fittrack-pro/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Bottom tab navigation
│   │   ├── index.tsx        # Dashboard
│   │   ├── workout.tsx      # Workout Tracker
│   │   ├── water.tsx        # Water Tracker
│   │   ├── meals.tsx        # Meal Tracker
│   │   └── profile.tsx      # Profile & Settings (+ Sign Out)
│   ├── login.tsx            # Login/Sign-up screen
│   ├── weekly-report.tsx    # Weekly Analytics
│   └── _layout.tsx          # Root layout with auth routing
├── components/              # Reusable UI components
│   ├── GlassCard.tsx        # Glassmorphism card component
│   ├── ProgressRing.tsx     # Circular progress indicator
│   ├── WaterBottle.tsx      # Animated water visualization
│   ├── WorkoutCard.tsx      # Workout entry card
│   ├── MealCard.tsx         # Meal entry card
│   └── ...more
├── constants/               # Theme and styling
│   └── theme.ts
├── context/                 # React Context
│   ├── ThemeContext.tsx     # Theme state
│   └── AuthContext.tsx      # Authentication state
├── src/supabase/            # Supabase integration
│   ├── supabaseClient.ts    # Supabase client setup
│   └── auth.ts              # Auth helper functions
├── utils/                   # Utility functions
│   ├── storage.ts           # Per-user AsyncStorage helpers
│   ├── dateUtils.ts         # Date formatting & calculations
│   └── notifications.ts     # Notification scheduling
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
└── types.ts                 # TypeScript type definitions
```

---

## 🎯 How to Use

### Setting Your Goals
1. Navigate to **Profile** tab
2. Tap **Edit** in the Personal Details section
3. Modify your daily goals:
   - Water Goal (ml) - default: 2500ml
   - Calorie Goal - default: 2000 kcal
   - Weekly Workouts - default: 5
4. Tap **Save**

### Logging Activities
- **Quick Water:** Tap "Add Water" on Dashboard (adds 250ml)
- **Log Workout:** Tap "Add Workout" → Select type → Enter duration & calories
- **Log Meal:** Tap "Add Meal" → Select meal type → Enter food name & calories

### Viewing Progress
- **Dashboard:** See today's progress rings and summary
- **Weekly Report:** Tap "View Weekly Report" for 7-day analytics

---

## 🔔 Notifications

> **Note:** Push notifications require a development build and are not available in Expo Go.

To enable notifications in a development build:
1. Go to **Profile** → **Notifications**
2. Toggle **Water Reminders** (reminds every 2 hours)
3. Toggle **Workout Reminders** (daily reminder at 9:00 AM)
4. Toggle **Meal Goal Notifications** (get notified when you reach your calorie goal)
5. Toggle **Streak Notifications** (celebrate your streak milestones)

---

## 💾 Data Persistence

All data is stored locally using AsyncStorage with per-user isolation:
- ✅ **User Accounts** - Each user has completely separate data
- ✅ **Session Persistence** - Stay logged in across app restarts
- ✅ **Workouts, meals, and water** - Persist per user account
- ✅ **Goals and preferences** - Saved to your profile
- ✅ **Historical data** - Available for weekly analytics
- ✅ **Streak counter** - Tracks consecutive active days

> 📖 See [README_SUPABASE.md](./README_SUPABASE.md) for authentication setup details.

---

## 🛠️ Future Enhancements

### Planned Features
- [ ] **Macro Tracking** - Detailed protein, carbs, and fat breakdown
- [ ] **Exercise Library** - Pre-defined exercises with calorie estimates
- [ ] **Photo Logging** - Add photos to meals and workouts
- [ ] **Social Features** - Share achievements with friends
- [ ] **Integration** - Connect with Apple Health / Google Fit
- [ ] **Advanced Analytics** - Monthly reports, trend predictions
- [ ] **Workout Plans** - Pre-built workout routines
- [ ] **Meal Suggestions** - AI-powered meal recommendations
- [ ] **Barcode Scanner** - Scan food items for instant calorie lookup
- [ ] **Export Data** - Download your data as CSV/PDF

### Potential Improvements
- [ ] **Offline Mode** - Full functionality without internet
- [ ] **Cloud Sync** - Backup data to cloud storage
- [ ] **Wearable Integration** - Sync with fitness trackers
- [ ] **Gamification** - Badges, achievements, and challenges
- [ ] **Custom Reminders** - Set personalized notification times
- [ ] **Multi-language Support** - Internationalization
- [ ] **Voice Input** - Log activities using voice commands
- [ ] **Widget Support** - Home screen widgets for quick logging

---

## 🐛 Known Issues

- **Expo Go Limitation:** Push notifications are not supported in Expo Go (SDK 53+). Use a development build for full notification functionality.
- **Web Version:** Limited functionality on web platform due to native dependencies.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ using React Native and Expo

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Tracking! 🎉**
