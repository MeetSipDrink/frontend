import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import BottomNavigation from '../../auth-management-pages/HomePage/bottomNavigation/bottomNavigation';
import { useFocusEffect } from '@react-navigation/native';

export default function NoticeListPage({ navigation }) {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortOption, setSortOption] = useState('createdAt_desc');
    const [memberId, setMemberId] = useState(1); // 로그인한 사용자의 memberId를 1로 설정
    const loadingRef = useRef(false);

    const API_URL = 'http://10.0.2.2:8080';

    // 공지사항 목록을 가져오는 함수
    const fetchNotices = async (reset = false) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
    
        try {
            const response = await axios.get(`${API_URL}/notices`, {
                params: {
                    page: reset ? 1 : page,
                    size: 20,
                    sort: sortOption,
                },
            });
    
            const result = response.data; // response.json() 대신 response.data 사용
            const data = result.data; // 서버 응답의 데이터를 추출
    
            if (Array.isArray(data)) {
                if (reset) {
                    setNotices(data); // 공지사항 리스트 초기화
                    setPage(2); // 페이지 번호 초기화
                } else {
                    setNotices(prevNotices => [...prevNotices, ...data]); // 기존 리스트에 추가
                    setPage(prevPage => prevPage + 1); // 페이지 번호 증가
                }
    
                // 마지막 페이지인지 확인하여 더 불러올 데이터가 있는지 설정
                if (result.pageInfo.page >= result.pageInfo.totalPages) {
                    setHasMore(false); // 더 이상 데이터가 없으면 false
                } else {
                    setHasMore(true); // 더 불러올 데이터가 있으면 true
                }
            } else {
                console.error('응답 데이터가 배열이 아닙니다:', result);
            }
        } catch (error) {
            console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    };

    // 새로고침을 처리하는 함수
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNotices(true);
        setRefreshing(false);
    };

    // 화면이 포커스될 때 공지사항 리스트를 갱신하는 함수
    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setHasMore(true);
            fetchNotices(true); // 화면이 포커스될 때 공지사항 갱신
        }, [sortOption])
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchNotices();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.noticeItem}
                onPress={() => navigation.navigate('NoticeView', { noticeId: item.noticeId })} // noticeId 전달
            >
                <View style={styles.noticeContent}>
                    <Text style={styles.noticeTitle}>{item.title}</Text>
                    <View style={styles.noticeFooter}>
                        <Text style={styles.noticeViews}>조회수: {item.views.toString()}</Text>
                        <Text style={styles.noticeDate}>작성일: {formatDate(item.createdAt)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* 상단 헤더 (뒤로 가기 버튼, 페이지 제목, 정렬 기능) */}
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={24} color="black" />
                        <Text style={styles.title}>공지사항</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sortContainer}>
                    <Picker
                        selectedValue={sortOption}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSortOption(itemValue)}
                    >
                        <Picker.Item label="최신 순" value="createdAt_desc" />
                        <Picker.Item label="오래된 순" value="createdAt_asc" />
                        <Picker.Item label="조회수 높은 순" value="views_desc" />
                        <Picker.Item label="조회수 낮은 순" value="views_asc" />
                    </Picker>
                </View>
            </View>

            <FlatList
                data={notices}
                renderItem={renderItem}
                keyExtractor={(item) => item.noticeId.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#FF6347"]}
                    />
                }
            />

            {/* memberId가 1인 사용자만 + 버튼 보이게 */}
            {memberId === 1 && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('NoticePost')}
                >
                    <AntDesign name="plus" size={30} color="white" />
                </TouchableOpacity>
            )}

            <BottomNavigation navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    sortContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    picker: {
        height: 30,
        width: 160,
    },
    noticeItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    noticeContent: {
        flexDirection: 'column',
    },
    noticeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noticeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noticeViews: {
        fontSize: 14,
        color: '#888',
    },
    noticeDate: {
        fontSize: 14,
        color: '#888',
    },
    footerLoader: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE",
        alignItems: "center",
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F9B300',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
    },
});

