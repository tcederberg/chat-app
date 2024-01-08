import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { LogBox } from 'react-native';

//create navigator
const Stack = createNativeStackNavigator();

const App = () => {
  LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

  const firebaseConfig = {
    apiKey: "AIzaSyC9zRjdkdSgX8EfNQlVf7c3_VHFJsQfr1E",
    authDomain: "chatapp-22545.firebaseapp.com",
    projectId: "chatapp-22545",
    storageBucket: "chatapp-22545.appspot.com",
    messagingSenderId: "74615674988",
    appId: "1:74615674988:web:8c3f1de1f53b7e6288a049"
  };

  //Initialize Firebase with the provided configuration
    const app = initializeApp(firebaseConfig);
  //Create a Firestore database instance
    const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"> 
            {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;