import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const username = route.params.name;
    const color = route.params.color;
    const id = route.params.id;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
        // console.log(messages);
      };
    
      //customizes chat bubble colors
      const renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: "#000" },
              left: { backgroundColor: "#fff" },
            }}
          />
        );
      };
    
      //message example
      // useEffect(() => {
      //   onSnapshot(query(collection(db, "messages")), orderBy("createdAt", "desc"));
      // }, []);
    
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
    
      useEffect(() => {
        navigation.setOptions({ title: username });
    
        if (isConnected === true) {
          // unregister current onSnapshot() listener to avoid registering multiple listeners when
          // useEffect code is re-executed.
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
    
          return () => {
            if (unsubMessages) unsubMessages();
          };
        }
      }, []);
    
      useEffect(() => {
        //sets chat page title to username given on start page
        navigation.setOptions({ title: username });
      });
    
      const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
      };
    
      //
      //
      const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />;
      };
    
      const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
          return (
            <MapView
              style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          );
        }
        return null;
      };

    return (
      <View style={[styles.container, {backgroundColor: color,}]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={messages => onSend(messages)}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
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