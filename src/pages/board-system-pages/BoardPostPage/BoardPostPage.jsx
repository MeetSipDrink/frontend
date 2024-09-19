import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, Alert } from "react-native";
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080';
const TEST_IMG_URL = 'https://img.khan.co.kr/news/2023/05/12/news-p.v1.20230512.e5fffd99806f4dcabd8426d52788f51a_P1.png';
const  TEST_IMG_URL2 = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F15c1u%2FbtrBF5rq2s1%2FuCDT0O1GSpm5WEu8kHzna0%2Fimg.jpg';
const  TEST_IMG_URL3 = 'https://image.blip.kr/v1/file/7c6212f87437d9d26c1a34327e329ccb';

export default function BoardPostPage({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const pickImage = () => {
        Alert.alert('알림', '이미지 업로드 기능은 아직 구현되지 않았습니다.');
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const postData = {
                title,
                content,
                memberId: 1,
                imageUrl1: TEST_IMG_URL,
                imageUrl2: TEST_IMG_URL2,
                imageUrl3: TEST_IMG_URL2,
                imageUrl4: null,
                imageUrl5: null,
                imageUrl6: null,
            };

            console.log('Submitting post data:', postData);

            const response = await axios.post(`${API_URL}/posts`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);

            Alert.alert('성공', '게시물이 등록되었습니다.');
            navigation.goBack();
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                Alert.alert('오류', `서버 오류: ${error.response.status}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                Alert.alert('오류', '네트워크 연결을 확인해주세요.');
            } else {
                console.error('Error message:', error.message);
                Alert.alert('오류', '요청 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="제목"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.contentInput}
                placeholder="내용"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>이미지 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>게시물 등록</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    contentInput: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        height: 150,
        textAlignVertical: 'top',
    },
    imageButton: {
        backgroundColor: '#F9B300',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#F9B300',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});