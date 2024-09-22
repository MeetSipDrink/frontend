import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomNavigation from '../../auth-management-pages/HomePage/bottomNavigation/bottomNavigation';

export default function NoticeViewPage({ route, navigation }) {
    const { noticeId } = route.params;
    const [notice, setNotice] = useState(null); // 공지사항 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태 저장
    const memberId = 1; // 현재 로그인한 사용자의 ID

    const API_URL = 'http://10.0.2.2:8080';

    useEffect(() => {
        // 공지사항 데이터 가져오기 함수
        const fetchNoticeData = async () => {
            if (noticeId) {
                try {
                    const response = await axios.get(`${API_URL}/notices/${noticeId}`);
                    setNotice(response.data.data); // data.data로 접근
                    setLoading(false);
                } catch (error) {
                    console.error('공지사항을 불러오는 중 오류가 발생했습니다:', error);
                    setLoading(false);
                }
            } else {
                console.error('noticeId가 전달되지 않았습니다.');
            }
        };
    
        // 처음 마운트될 때 공지사항 데이터를 가져옴
        fetchNoticeData();
    
        // 페이지에 포커스가 될 때마다 데이터를 새로 가져옴
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true); // 새로 로딩 상태로 설정
            fetchNoticeData(); // 데이터를 새로 가져옴
        });
    
        return unsubscribe;
    }, [noticeId, navigation]);

    // 삭제 함수
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/notices/${noticeId}?memberId=${memberId}`);
            if (response.ok) {
                Alert.alert('성공', '공지사항이 삭제되었습니다.');
                navigation.navigate('NoticeList');
            } else {
                Alert.alert('실패', '공지사항 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('공지사항 삭제 오류:', error);
            Alert.alert('오류', '공지사항을 삭제하는 중 오류가 발생했습니다.');
        }
    };

    // 수정 페이지로 이동
    const handleEdit = () => {
        navigation.navigate('NoticeEdit', { noticeId }); // 수정 페이지로 이동
    };

    // 로딩 중일 때 로딩 스피너를 표시
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // 공지사항 데이터가 없을 때
    if (!notice) {
        return (
            <View style={styles.errorContainer}>
                <Text>공지사항을 불러오는 중 문제가 발생했습니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* 상단의 뒤로가기 버튼 */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={24} color="black" />
                        <Text style={styles.backText}>공지사항</Text>
                    </TouchableOpacity>
                </View>

                {/* 공지사항 제목과 조회수, 작성일 */}
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{notice.title}</Text>
                    <View style={styles.info}>
                        <Text style={styles.views}>조회수: {notice.views}</Text>
                        <Text style={styles.date}>
                            작성일: {new Date(notice.createdAt).toISOString().slice(0, 10)}
                        </Text>
                    </View>
                </View>

                {/* 이미지 슬라이드 */}
                {notice.imageUrls && notice.imageUrls.length > 0 && (
                    <View style={styles.swiperContainer}>
                        <Swiper style={styles.swiper} dotStyle={styles.dotStyle} activeDotStyle={styles.activeDotStyle}>
                            {notice.imageUrls.map((url, index) => (
                                <View key={index} style={styles.slide}>
                                    <Image key={index} source={{ uri: url }} style={styles.image} />
                                </View>
                            ))}
                        </Swiper>
                    </View>
                )}

                {/* 프로필 사진과 닉네임 */}
                <View style={styles.profileContainer}>
                    {notice.profileImage ? (
                        <Image source={{ uri: notice.profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImagePlaceholder} />
                    )}
                    <Text style={styles.nickname}>{notice.nickname}</Text>

                    {/* 수정 및 삭제 버튼 (memberId가 1인 사용자만 표시) */}
                    {memberId === 1 && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                <AntDesign name="edit" size={25} color="#007bff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                <AntDesign name="delete" size={25} color="#ff4d4d" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* 공지사항 내용 */}
                <Text style={styles.content}>{notice.content}</Text>
            </ScrollView>

            {/* 바텀 네비게이션 */}
            <View style={styles.bottomNavigationWrapper}>
                <BottomNavigation navigation={navigation} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 20,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    info: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    views: {
        fontSize: 14,
        color: '#888',
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
    swiperContainer: {
        height: 240,
        marginBottom: 10,
    },
    swiper: {
        height: 220,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'contain', 
    },
    dotStyle: {
        bottom: -10,
    },
    activeDotStyle: {
        backgroundColor: '#007bff',
        bottom: -10,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        marginRight: 10,
    },
    profileImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    nickname: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
        alignItems: 'center',
    },
    editButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    deleteButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    content: {
        fontSize: 16,
        marginTop: 20,
    },
    bottomNavigationWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        width: '100%',
    },
});
