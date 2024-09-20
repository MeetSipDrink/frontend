import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import RNFS from 'react-native-fs';
import 'text-encoding-polyfill';

const ChatRoomPage = ({ chatRoomId, userNickname }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState(userNickname);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://10.0.2.2:8080/chat'),
            connectHeaders: {},
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 20000,
            heartbeatOutgoing: 20000,
        });

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            setStompClient(client);
            setConnectionStatus('Connected');
            client.subscribe(`/topic/chatrooms/${chatRoomId}`, (message) => {
                try {
                    const msg = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, msg]);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
        };

        client.onDisconnect = (frame) => {
            console.log('Disconnected: ' + frame);
            setConnectionStatus('Disconnected');
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error: ', frame);
            setConnectionStatus('Error: ' + frame.headers.message);
            Alert.alert('Connection Error', 'Failed to connect to chat server. Please try again later.');
        };

        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [chatRoomId]);

    const sendMessage = useCallback(() => {
        if (stompClient && messageInput) {
            const msg = {
                sender: username,
                content: messageInput,
                type: 'CHAT',
                chatRoomId: chatRoomId
            };

            try {
                stompClient.publish({
                    destination: '/app/chat.sendMessage',
                    body: JSON.stringify(msg)
                });
                console.log('Message sent: ', msg);
            } catch (error) {
                console.error('Error sending message: ', error);
            }

            setMessageInput('');
        } else {
            Alert.alert('Not Connected', 'Please wait until you are connected to the chat room.');
        }
    }, [stompClient, username, messageInput, chatRoomId]);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Connection Status: {connectionStatus}</Text>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={styles.message}>
                            <Text style={styles.sender}>{item.sender}: </Text>
                            <Text>{item.content}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message here..."
                        value={messageInput}
                        onChangeText={setMessageInput}
                    />
                    <Button title="Send" onPress={sendMessage} disabled={!stompClient} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    chatContainer: {
        flex: 1,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        padding: 10,
        flex: 1,
    },
    message: {
        marginBottom: 8,
    },
    sender: {
        fontWeight: 'bold',
    },
    messageList: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ChatRoomPage;


 