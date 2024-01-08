import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';


const Chat = ({ route, navigation, db }) => {
    const username = route.params.name;
    const color = route.params.color;
    const id = route.params.id;
    const [messages, setMessages] = useState([]);
   // Title for the screen
    useEffect(() => {
        navigation.setOptions({ title: username });
        
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const message = onSnapshot(q,
            (documentSnapshot) => {
            let newMessages = [];
            documentSnapshot.forEach(doc => {
                newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis())})
            });
            setMessages(newMessages);
            })

        return () => {
         if( message ) message();
        }
    }, []);
    // Function to send message
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    }
    // Function to change the background color of the messages
    const renderBubble = (props) => {
        return <Bubble 
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
    }

    return (
      <View style={[styles.container, {backgroundColor: color,}]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
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