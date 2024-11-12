import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'text-encoding-polyfill';

const ChatRoomPage = ({ chatRoomId, userNickname }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState(userNickname);
    const [memberId] = useState(1);  // 로그인된 사용자의 ID를 1로 설정 (예시)
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

        let subscription;
        const receivedMessages = new Set(); // 중복 메시지 방지를 위한 Set
        
        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            setStompClient(client);
            setConnectionStatus('Connected');
        
            // 기존 구독 해제
            if (subscription) {
                subscription.unsubscribe();
            }
        
            // 새로운 구독 설정
            subscription = client.subscribe(`/topic/chatrooms/${chatRoomId}`, (message) => {
                const msg = JSON.parse(message.body);
        
                // 중복 메시지 필터링 (messageId 기반)
                if (!receivedMessages.has(msg.messageId)) { // messageId 중복 검사
                    receivedMessages.add(msg.messageId); // Set에 추가하여 중복 방지
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
            });
        
            // 입장 알림 메시지 전송
            const joinMessage = {
                sender: username,
                content: `${username} has joined the chat`,
                type: 'JOIN',
                chatRoomId: chatRoomId,
                memberId: memberId,
            };
            client.publish({
                destination: '/app/chat.addUser',
                body: JSON.stringify(joinMessage),
            });
        };
            
            client.publish({
                destination: '/app/chat.addUser',
                body: JSON.stringify(joinMessage)
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
    }, [chatRoomId, username, memberId]);

    const sendMessage = useCallback(() => {
        if (stompClient && messageInput) {
            const msg = {
                sender: username,
                content: messageInput,
                type: 'CHAT',
                chatRoomId: chatRoomId,  // chatRoomId 추가
                memberId: memberId,  // 메시지 전송 시 로그인된 사용자의 ID 추가
            };

            try {
                stompClient.publish({
                    destination: '/app/chat.sendMessage',
                    body: JSON.stringify(msg)
                });
                console.log('Message sent: ', msg);

                // 바로 전송한 메시지를 로컬에서 리스트에 추가
                setMessages((prevMessages) => [...prevMessages, msg]);

            } catch (error) {
                console.error('Error sending message: ', error);
            }

            setMessageInput('');
        } else {
            Alert.alert('Not Connected', 'Please wait until you are connected to the chat room.');
        }
    }, [stompClient, username, messageInput, chatRoomId, memberId]);

    const renderItem = ({ item }) => {
        const isOwnMessage = item.sender === username;
        return (
            <View
                style={[
                    styles.messageContainer,
                    isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
                    ]}
                >
                    <Text style={styles.sender}>{item.sender}</Text>
                    <Text>{item.content}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>Connection Status: {connectionStatus}</Text>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    renderItem={renderItem}
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
    messageList: {
        flex: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-end',
    },
    ownMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        padding: 10,
        borderRadius: 15,
        maxWidth: '80%',
    },
    ownMessageBubble: {
        backgroundColor: '#DCF8C6',
        marginRight: 10,
    },
    otherMessageBubble: {
        backgroundColor: '#ECECEC',
        marginLeft: 10,
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        padding: 10,
        flex: 1,
    },
});

export default ChatRoomPage;
