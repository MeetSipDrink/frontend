import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const ADS_API_URL = 'http://10.0.2.2:8080'; // 안드로이드 에뮬레이터 기준 localhost

export default function MyPage({ navigation, route }) {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // 사용자 정보를 서버에서 가져오는 함수
    const fetchUserInfo = useCallback(async () => {
        try {
            console.log('Fetching user info...');
            const memberId = 1;  // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            const response = await axios.get(`${ADS_API_URL}/members/${memberId}`);
            console.log('Response:', response.data);

            setUserInfo(response.data.data);
        } catch (error) {
            console.error('Error fetching user info:', error.response ? error.response.data : error.message);
            Alert.alert('오류', '사용자 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    // 첫 렌더링 시에만 사용자 정보를 가져옴
    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    // 프로필 수정 후 돌아왔을 때만 정보를 다시 가져옴
    useFocusEffect(
        useCallback(() => {
            if (route.params?.profileUpdated) {
                fetchUserInfo();
            }
        }, [fetchUserInfo, route.params?.profileUpdated])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9B300" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentWrapper}>
                    {/* 사용자 프로필 영역 */}
                    <View style={styles.userInfo}>
                        <Image source={{ uri: userInfo?.profileImage || 'https://via.placeholder.com/150' }} style={styles.mainImage} />
                        <Text style={styles.userInfoText}>{userInfo?.nickname || '닉네임 없음'}</Text>
                        <Text style={styles.userInfoEmail}>{userInfo?.email || '이메일 없음'}</Text>
                    </View>

                    {/* 페이지 이동 버튼들 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FriendList')}>
                            <Text style={styles.buttonText}>친구목록</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('ProfileEditor', { userInfo: userInfo })}
                        >
                            <Text style={styles.buttonText}>정보수정</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 사용자 정보 영역 */}
                <View style={styles.infoContainer}>
                    <InfoItem label="이름" value={userInfo?.name || '이름 없음'} />
                    <InfoItem label="성별" value={userInfo?.gender || '성별 정보 없음'} />
                    <InfoItem label="나이" value={userInfo?.age ? userInfo.age.toString() : '나이 정보 없음'} />
                    <InfoItem label="선호주종 1" value={userInfo?.alcoholType1 || '정보 없음'} />
                    {userInfo?.alcoholType2 && userInfo.alcoholType2 !== '' && (
                        <InfoItem label="선호주종 2" value={userInfo.alcoholType2} />
                    )}
                    {userInfo?.alcoholType3 && userInfo.alcoholType3 !== '' && (
                        <InfoItem label="선호주종 3" value={userInfo.alcoholType3} />
                    )}
                </View>
            </ScrollView>

            {/* 차단목록, 탈퇴 버튼 */}
            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('BlockList')}>
                    <Text style={styles.secondaryButtonText}>차단목록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryButton, styles.dangerButton]}>
                    <Text style={[styles.secondaryButtonText, styles.dangerButtonText]}>탈퇴</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const InfoItem = ({ label, value }) => (
    <View style={styles.infoItem}>
        <Text style={styles.infoText}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 50,
    },
    contentWrapper: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fcefc1',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingBottom: 20,
    },
    userInfo: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    infoContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    userInfoText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    userInfoEmail: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    button: {
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    secondaryButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dangerButton: {
        borderColor: '#ff4d4f',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    secondaryButtonText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    dangerButtonText: {
        color: '#ff4d4f',
    },
    mainImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
});