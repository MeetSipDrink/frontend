import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const CreateChatRoom = ({ navigation }) => {
    const [roomName, setRoomName] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [memberId] = useState(1);  // 로그인된 사용자의 ID를 1로 설정

    const API_URL = 'http://10.0.2.2:8080/chatrooms'; // 실제 API URL로 변경

    const handleCreateChatRoom = () => {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName,      // 채팅방 이름
                memberId,      // 로그인된 사용자의 memberId
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Chat room created:', data);
            navigation.navigate('ChatRoomList');  // 채팅방 생성 후 목록으로 이동
        })
        .catch(error => {
            console.error('Error creating chat room:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>채팅방 생성</Text>
            <TextInput
                style={styles.input}
                placeholder="채팅방 이름"
                value={roomName}
                onChangeText={setRoomName}
            />
            <Button title="채팅방 생성" onPress={handleCreateChatRoom} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
});

export default CreateChatRoom;
