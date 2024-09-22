import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

const API_URL = 'http://10.0.2.2:8080';

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
            ];
            setImages(postImages); // 초기값 설정시 null로 초기화하지 않고 서버에서 받아온 값을 그대로 설정
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
                imageUrl1: images[0],
                imageUrl2: images[1],
                imageUrl3: images[2],
                imageUrl4: images[3],
                imageUrl5: images[4],
                imageUrl6: images[5],
              };

            const response = await axios.patch(`${API_URL}/posts/${postId}`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            Alert.alert('성공', '게시물이 수정되었습니다.');
            navigation.goBack();
        } catch (error) {
            if (error.response) {
                Alert.alert('오류', `서버 오류: ${error.response.status}`);
            } else if (error.request) {
                Alert.alert('오류', '네트워크 연결을 확인해주세요.');
            } else {
                Alert.alert('오류', '요청 중 오류가 발생했습니다.');
            }
        }
    };

    const uploadImageToS3 = async (uri) => {
        const formData = new FormData();
        formData.append('multipartFile', {
            uri: uri,
            type: 'image/jpeg',
            name: `image_${new Date().getTime()}.jpg`,
        });

        try {
            const response = await fetch(`${API_URL}/images`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json(); // JSON 형식일 경우 파싱
            } else {
                result = await response.text(); // JSON 형식이 아닐 경우 텍스트로 처리
            }

            if (response.ok) {
                Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다.');
                console.log(result);
                return result;
            } else {
                throw new Error(result.message || '이미지 업로드 실패');
            }
        } catch (error) {
            console.error('이미지 업로드 오류:', error);
            throw error;
        }
    };

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 600,
            maxHeight: 600,
            quality: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                Alert.alert('알림', '이미지 선택이 취소되었습니다.');
            } else if (response.errorMessage) {
                Alert.alert('에러', '이미지를 선택하는 중 오류가 발생했습니다.');
            } else {
                const uri = response.assets[0].uri;

                try {
                    const uploadedImageUrl = await uploadImageToS3(uri);

                    const newImages = [...images];
                    const emptyIndex = newImages.findIndex(image => !image);
                    if (emptyIndex !== -1) {
                        newImages[emptyIndex] = uploadedImageUrl;
                    } else {
                        newImages.push(uploadedImageUrl);
                    }
                    setImages(newImages);

                } catch (error) {
                    Alert.alert('오류', '이미지 업로드 중 문제가 발생했습니다.');
                }
            }
        });
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
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
            <View style={styles.imagesContainer}>
                {images.map((img, index) => (
                    img ? (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri: img }} style={styles.image} />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                                <Text style={styles.removeImageButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
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
