import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import Stomp from '@stomp/stompjs';

const ChatRoomPage = ({ chatRoomId, userNickname }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState(userNickname);
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        const client = new Stomp.Client({
            brokerURL: 'ws://10.0.2.2:8080/chat',  // Spring Boot WebSocket 엔드포인트
            connectHeaders: {},
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            // 특정 채팅방 구독 (chatRoomId)
            client.subscribe(`/topic/chatRoom/${chatRoomId}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [chatRoomId]);

    // 유저가 자동으로 채팅방에 참여하도록 설정
    useEffect(() => {
        if (stompClient && username && !joined) {
            joinChat();
        }
    }, [stompClient, username, joined]);

    // 채팅방에 참여하는 함수
    const joinChat = useCallback(() => {
        if (stompClient && username) {
            stompClient.publish({
                destination: '/app/chat.addUser',  // 유저가 방에 입장한 사실을 서버로 알림
                body: JSON.stringify({
                    sender: username,
                    content: '',
                    type: 'JOIN',
                    chatRoomId: chatRoomId  // 현재 채팅방 ID
                })
            });
            setJoined(true);
        }
    }, [stompClient, username, chatRoomId]);

    // 메시지 보내기 함수
    const sendMessage = useCallback(() => {
        if (stompClient && messageInput) {
            stompClient.publish({
                destination: '/app/chat.sendMessage',  // 서버로 메시지를 보냄
                body: JSON.stringify({
                    sender: username,
                    content: messageInput,
                    type: 'CHAT',
                    chatRoomId: chatRoomId  // 현재 채팅방 ID
                })
            });
            setMessageInput('');
        }
    }, [stompClient, username, messageInput, chatRoomId]);

    // 메시지 렌더링 함수
    const renderMessage = useCallback(({ item }) => (
        <Text style={styles.message}>
            <Text style={styles.sender}>{item.sender}: </Text>
            {item.content}
        </Text>
    ), []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.chatContainer}>
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
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
                    <Button title="Send" onPress={sendMessage} />
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
