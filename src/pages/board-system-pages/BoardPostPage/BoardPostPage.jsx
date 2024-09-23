import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image, Alert } from "react-native";
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomNavigation from '../../auth-management-pages/HomePage/bottomNavigation/bottomNavigation';
import * as Keychain from 'react-native-keychain';

const API_URL = 'http://10.0.2.2:8080';

export default function BoardPostPage({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    // 이미지 선택 및 S3에 업로드하는 함수
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
                setImages(prevImages => [...prevImages, { uri }]); // 선택한 이미지를 로컬에 추가

                // 이미지 업로드 (S3로 업로드)
                const formData = new FormData();
                formData.append('multipartFile', {
                    uri: uri,
                    type: 'image/jpeg',
                    name: `image_${new Date().getTime()}.jpg`,
                });

                try {
                    const uploadResponse = await axios.post(`${API_URL}/images`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                
                    const result = uploadResponse.data;
                
                    if (uploadResponse.status === 200) {
                        // 이미지 URL 저장
                        const uploadedImageUrl = typeof result === 'string' ? result : result.imageUrl;
                        Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다.');
                        console.log('이미지 URL:', uploadedImageUrl);
                        setImageUrls(prevUrls => [...prevUrls, uploadedImageUrl]); // 서버에서 받은 이미지 URL 추가
                    } else {
                        Alert.alert('실패', '이미지 업로드에 실패했습니다.');
                        console.error(result);
                    }
                } catch (error) {
                    console.error('이미지 업로드 오류:', error);
                    Alert.alert('에러', '이미지를 업로드하는 중 오류가 발생했습니다.');
                }
            }
        });
    };

    // 이미지 삭제 함수
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index)); // 로컬에서 선택된 이미지 삭제
        setImageUrls(imageUrls.filter((_, i) => i !== index)); // 업로드된 이미지 URL에서도 삭제
    };

    // 토큰 가져오기 함수
    const getAccessToken = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { accessToken } = JSON.parse(credentials.password);
                return accessToken;
            } else {
                console.error('토큰을 가져올 수 없습니다.');
                return null;
            }
        } catch (error) {
            console.error('Keychain에서 토큰 가져오기 오류:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            Alert.alert('알림', '제목과 내용을 입력해주세요.');
            return;
        }
        try {
            console.log(imageUrls);

            // 토큰 가져오기
            const token = await getAccessToken();
            if (!token) {
                Alert.alert('오류', '토큰을 가져올 수 없습니다. 다시 로그인 해주세요.');
                return;
            }

            const postData = {
                title,
                content,
                memberId: 1,  // 실제 프로젝트에서는 백엔드에서 토큰으로 memberId를 구하는 것이 좋습니다.
                imageUrl1: imageUrls[0] || null,
                imageUrl2: imageUrls[1] || null,
                imageUrl3: imageUrls[2] || null,
                imageUrl4: imageUrls[3] || null,
                imageUrl5: imageUrls[4] || null,
                imageUrl6: imageUrls[5] || null,
            };

            const response = await axios.post(`${API_URL}/posts`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
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
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="제목"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.textArea}
                        placeholder="내용"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>이미지 선택</Text>
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.image} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => removeImage(index)}>
                                    <AntDesign name="closecircle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>게시물 등록</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* 바텀 네비게이션을 최하단에 고정 */}
            <View style={styles.bottomNavigationWrapper}>
                <BottomNavigation navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, // 전체 화면을 채움
        justifyContent: 'space-between', // 스크롤 뷰와 네비게이션 사이에 공간 분배
    },
    scrollViewContent: {
        paddingBottom: 100, // 바텀 네비게이션에 가려지지 않도록 여유 공간
    },
    container: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    textArea: {
        borderWidth: 1,
        padding: 8,
        height: 150,
        marginBottom: 16,
        borderRadius: 4,
    },
    button: {
        backgroundColor: '#F9B300',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
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
    bottomNavigationWrapper: {
        height: 60,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
});
