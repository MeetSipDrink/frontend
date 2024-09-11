import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatBotExample = () => {
    const navigation = useNavigation();
    const texts = ["술추천해줄께", "나 취해ㅆ다음에 와라!","나 술 전문가!","술이야 뭐든지 물어봐!"];
    const [text, setText] = useState("쳇봇");

    const changeText = () => {
        const randomIndex = Math.floor(Math.random() * texts.length);
        setText(texts[randomIndex]);
    };

    const handlePress1 = () => {
        changeText();
        navigation.navigate('BotResponse');
    };

    return (
        <View style={styles.container}>
            <View style={styles.chatbotContainer}>
                <View style={styles.speechBubbleContainer}>
                    <View style={styles.speechBubble}>
                        <Text style={styles.speechText}>{text}</Text>
                    </View>
                    <View style={styles.speechBubblePointer} />
                </View>
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
        padding: 20,
    },
    chatbotContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    speechBubbleContainer: {
        marginRight: 10,
        marginBottom: 15, // 말풍선을 아래로 내림
    },
    speechBubble: {
        backgroundColor: '#fcefc1',
        borderRadius: 20,
        padding: 10,
        maxWidth: 150,
    },
    speechText: {
        fontSize: 14,
        color: '#333',
    },
    speechBubblePointer: {
        position: 'absolute',
        right: -10,
        bottom: 10,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fcefc1',
        transform: [{ rotate: '90deg' }],
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -15, // 로봇 이미지를 조금 더 아래로 내림
    },
    robotImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
});

export default ChatBotExample;