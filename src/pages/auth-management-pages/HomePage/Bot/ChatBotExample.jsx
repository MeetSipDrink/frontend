import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatBotExample = () => {
    const navigation = useNavigation();

    // 3개의 임의의 텍스트 목록
    const texts = [
        "배고파", " 밥줘!"
    ];

    // 텍스트 상태를 관리하는 useState 훅
    const [text, setText] = useState(" 쳇봇");

    // 텍스트를 무작위로 변경하는 함수
    const changeText = () => {
        const randomIndex = Math.floor(Math.random() * texts.length);
        setText(texts[randomIndex]);
    };

    // 텍스트 변경 및 페이지 이동 함수
    const handlePress1 = () => {
        changeText();
        navigation.navigate('BotResponse');
    };

    return (
        <View style={styles.container}>
            {/* 말풍선 이미지와 텍스트를 가로로 정렬 */}
            <View style={styles.rowContainer}>
                {/* 말풍선 이미지 위에 텍스트를 올림 */}
                <View style={styles.speechBubbleContainer}>
                    <Image
                        source={require('/Users/gimchanjun/Desktop/MeetSipDrink/frontend/src/assets/testimg/ch.png')}
                        style={styles.speechBubbleImage}
                    />
                    <Text style={styles.speechText}>{text}</Text>
                </View>

                {/* 버튼을 눌렀을 때 텍스트가 변경되고 페이지가 이동됨 */}
                <TouchableOpacity style={styles.button} onPress={handlePress1}>
                    <Image
                        source={require('/Users/gimchanjun/Desktop/MeetSipDrink/frontend/src/assets/testimg/homeBot.png')}
                        style={styles.robotImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
    },
    rowContainer: {
        flexDirection: 'row', // 가로로 정렬
        alignItems: 'center', // 세로 중앙 정렬
    },
    speechBubbleContainer: {
        position: 'relative',
        width: 80, // 말풍선 이미지 크기를 줄임
        height: 50,  // 말풍선 이미지 크기를 줄임

    },
    speechBubbleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    speechText: {
        position: 'absolute',
        top: '30%',  // 텍스트의 위치를 말풍선 안에 맞춤
        left: '25%', // 텍스트를 더 왼쪽으로 이동
        fontSize: 10,  // 텍스트 크기 조절
        fontWeight: 'bold',
        color: '#000',
    },
    robotImage: {
        marginTop: 50, // 로봇 이미지를 말풍선 아래에 위치
        width: 50,  // 로봇 이미지 크기를 줄임
        height: 50, // 로봇 이미지 크기를 줄임

    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },

});

export default ChatBotExample;