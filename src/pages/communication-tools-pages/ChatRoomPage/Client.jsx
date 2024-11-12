import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, Button, ScrollView, View } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const ChatApp = () => {
  const [stompClient, setStompClient] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatRoomId = 1; // You can change this based on the room you want to join

  // Connect to WebSocket server
  useEffect(() => {
    const socket = new SockJS('http://10.0.2.2:8080/chattings'); // Update with your WebSocket URL
    const stomp = Stomp.over(socket);

    stomp.connect({}, frame => {
      console.log('Connected: ' + frame);
      
      // Subscribe to chat messages in the room
      stomp.subscribe(`/topic/chatRoom/${chatRoomId}`, message => {
        const receivedMessage = JSON.parse(message.body);
        showMessage(receivedMessage);
      });
    });

    setStompClient(stomp);

    // Cleanup on component unmount
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);


  const joinChat = () => {
    if (stompClient && username.trim()) {
      stompClient.send('/chat.addUser', {}, JSON.stringify({
        sender: username, 
        content: '', 
        type: 'JOIN', 
        chatRoomId
      }));
    }
  };


  const sendMessage = () => {
    if (stompClient && message.trim()) {
      stompClient.send('/chat.sendMessage', {}, JSON.stringify({
        sender: username, 
        content: message, 
        type: 'CHAT', 
        chatRoomId
      }));
      setMessage(''); 
    }
  };

  // Function to display messages
  const showMessage = (chat) => {
    setMessages(prevMessages => [...prevMessages, chat]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <TextInput 
          placeholder="Enter your name"
          value={username}
          onChangeText={setUsername}
          style={{
            borderWidth: 1, 
            padding: 10, 
            marginBottom: 10
          }}
        />
        <Button title="Join Chat" onPress={joinChat} />
      </View>

      <View style={{ marginTop: 20 }}>
        <TextInput 
          placeholder="Type your message here..."
          value={message}
          onChangeText={setMessage}
          style={{
            borderWidth: 1, 
            padding: 10, 
            marginBottom: 10
          }}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {messages.map((msg, index) => (
          <Text key={index}>
            <Text style={{ fontWeight: 'bold' }}>{msg.sender}: </Text>
            {msg.content}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatApp;
