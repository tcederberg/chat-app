import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { LogBox, Alert } from 'react-native';
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  //connection status
  const connectionStatus = useNetInfo();
  //if user is not connected to the internet, disable trying to connect to the database
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //Initialize Firebase with the provided configuration
    const app = initializeApp(firebaseConfig);
  //Create a Firestore database instance
    const db = getFirestore(app);
  // Initialize Cloud Firestore Storage and get a reference to the service
    const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"> 
            {(props) => (
              <Chat 
                db={db} 
                storage={storage}
                isConnected={connectionStatus.isConnected} 
                {...props} />
              )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;