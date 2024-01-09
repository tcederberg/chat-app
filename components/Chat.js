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

    const loadCachedMessages = async () => {
        try {
          const cachedMessages = await AsyncStorage.getItem('messages');
          if (cachedMessages !== null) {
            setMessages(JSON.parse(cachedMessages));
          }
        } catch (error) {
          console.error("Error loading cached messages:", error.message);
        }
      };

      // Append the new messages to the old ones
  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      console.error("Error adding message to Firestore:", error.message);
    }
  };

  const renderInputToolbar = (props) => {
    // Render input toolbar only when connected
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  // Define the individual style of the bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };


  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Error caching messages:", error.message);
    }
  };

  useEffect(() => {
    let unsubMessages;

    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        unsubMessages = onSnapshot(q, (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach((doc) => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt?.toMillis()), // convert createdAt to Date object
            });
          });
          cachedMessages(newMessages);
          setMessages(newMessages);
        });

    } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    if (isConnected) {
      fetchMessages();
    } else {
      loadCachedMessages();
    }

    return () => {
        if (unsubMessages) {unsubMessages();
        }
    };
    }, [db, isConnected]);

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