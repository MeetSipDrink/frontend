import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_URL = 'http://10.0.2.2:8080';

// 테스트 이미지 URL을 사용할 경우, 실제 이미지 업로드 기능을 구현해야 합니다.
const TEST_IMG_URL = 'https://img.khan.co.kr/news/2023/05/12/news-p.v1.20230512.e5fffd99806f4dcabd8426d52788f51a_P1.png';
const TEST_IMG_URL2 = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F15c1u%2FbtrBF5rq2s1%2FuCDT0O1GSpm5WEu8kHzna0%2Fimg.jpg';
const TEST_IMG_URL3 = 'https://image.blip.kr/v1/file/7c6212f87437d9d26c1a34327e329ccb';

// 로그인한 사용자의 memberId를 1로 고정
const loggedInUserId = 1;

export default function BoardEditPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const { postId } = route.params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts/${postId}`);
            const postData = response.data.data;
            setTitle(postData.title);
            setContent(postData.content);
            const postImages = [
                postData.imageUrl1,
                postData.imageUrl2,
                postData.imageUrl3,
                postData.imageUrl4,
                postData.imageUrl5,
                postData.imageUrl6
            ].filter(Boolean);
            setImages(postImages);
        } catch (err) {
            console.error('게시글 불러오기 실패:', err);
            setError('게시글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const postData = {
                memberId: loggedInUserId,
                title,
                content,
                imageUrl1: images[0] || null,
                imageUrl2: images[1] || null,
                imageUrl3: images[2] || null,
                imageUrl4: images[3] || null,
                imageUrl5: images[4] || null,
                imageUrl6: images[5] || null,
            };


            // PATCH 요청 URL을 /posts/{postId}/{memberId}로 변경
            const response = await axios.patch(`${API_URL}/posts/${postId}`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response:', response.data);

            Alert.alert('성공', '게시물이 수정되었습니다.');
            navigation.goBack();
        } catch (error) {
            if (error.response) {
                console.error('1 response:', error.response.data);
                console.error('2 status:', error.response.status);
                console.error('3 headers:', error.response.headers);
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

    const pickImage = () => {
        Alert.alert('알림', '이미지 업로드 기능은 아직 구현되지 않았습니다.');
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F9B300" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchPost}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
            {/* 이미지 추가 및 삭제 기능 */}
            <View style={styles.imagesContainer}>
                {images.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: img }} style={styles.image} />
                        <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                            <Text style={styles.removeImageButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>이미지 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>게시물 수정</Text>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    errorText: {
        fontSize: 16,
        color: '#F9B300',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
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
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    removeImageButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4C4C',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
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
