# React Native Mobile Chat App

## Objective:

To build a chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.

<img src="/assets/screenshot1.PNG" alt="app screenshot" style="width:200px;"/>
<img src="/assets/screenshot2.PNG" alt="app screenshot" style="width:200px;"/>


## Technologies:

- Reacht Native
- Expo
- Google Firestore
- Google Firebase authentication
- Firebase Cloud Storage
- Gifted Chat library



## Key Features

- Users can enter their name and choose a background color (four colors to choose) for the chat screen before joining the chat.
- The conversation is displayed, as well as an input field and send button.
- The chat provides users with two additional communication features: sending images and location data.
- Data gets stored online and offline.



## Directions for setting up the environment

- Install <a href="https://nodejs.org/en/learn/getting-started/how-to-install-nodejs">Node JS</a> on your device
- In the terminal: Install Expo globally: `npm install -g expo-cli`
- Sign up for an <a href="https://expo.dev/">Expo Account </a> to be able to run the app on your device
- Clone this repository
- Navigate to the folder and run `npm install`
- Use your own Firebase configuration code:
  - Sign in at [Google Firebase](https://firebase.google.com/)
  - **Create a Project** (uncheck **Enable Google Analytics for this project**)
  - **Create Database** in **Firestore Database** (choose a close region from the dropdown, and **Start in production mode**)
  - Change `allow read, write: if false;` to `allow read, write, if true;` in **Rules** tab
  - **Register app(`</>`)** in **Project Overview**
  - Now, follow the provided directions of adding Firebase SDK:
    - Install firebase: `npm install firebase`
    - Initialize firebase: Copy and paste the provided Firebase configuration and change them in the _App.js_ of the downloaded repository
- Download Android Studio(Windows) or iOS Simulator/XCode(Mac)
- Run `expo start` in the terminal. Follow the instruction to access the app via the iOS Simulator/Android Emulator