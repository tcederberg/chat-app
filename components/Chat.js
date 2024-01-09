import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
    const username = route.params.name;
    const color = route.params.color;
    const id = route.params.id;
    const [messages, setMessages] = useState([]);

    // Function to send message
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    }
    // Function to change the background color of the messages
    const renderBubble = (props) => {
        return (<Bubble 
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
        );
    };

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
        setLists(JSON.parse(cachedMessages));
      };
    
      const cacheMessages = async (messagesToCache) => {
        try {
          await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
          console.log(error.message);
        }
      };
      //local storage code
      let unsubMessages;

   // Title for the screen
    useEffect(() => {
        navigation.setOptions({ title: username });
        
        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
              let newMessages = [];
              docs.forEach((doc) => {
                newMessages.push({
                  id: doc.id,
                  ...doc.data(),
                  createdAt: new Date(doc.data().createdAt.toMillis()),
                });
              });
              cacheMessages(newMessages);
              setMessages(newMessages);
            });
        } else {
            loadCachedMessages();
      
        }

        return () => {
         if( unsubMessages ) unsubMessages();
        }
    }, []);
    
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
      };

    return (
      <View style={[styles.container, {backgroundColor: color,}]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={messages => onSend(messages)}
            user={{
                _id: id,
                name: username,
            }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        { Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null }
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

}

);
export default Chat;