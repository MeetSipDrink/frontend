import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
    Image,
    RefreshControl,
    TextInput,
    SafeAreaView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import useRefreshPosts from '../useRefreshPosts/useRefreshPosts'; // 분리된 훅을 임포트합니다.

const API_URL = 'http://10.0.2.2:8080';

const BoardListPage = ({ navigation }) => {
    // 상태 변수 선언
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt_desc');
    const [size] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchOption, setSearchOption] = useState('title');
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

    const loadingRef = useRef(false);
    const flatListRef = useRef();

    // 분리된 useRefreshPosts 훅을 사용하여 새로고침 기능을 구현합니다.
    const { refreshing, refreshPosts } = useRefreshPosts(
        size,
        sortBy,
        searchKeyword,
        searchOption,
        setPosts,
        setPage,
        setHasMore
    );

    const mergePosts = useCallback((prevPosts, newPosts) => {
        const postIds = new Set(prevPosts.map(post => post.postId));
        return [...prevPosts, ...newPosts.filter(post => !postIds.has(post.postId))];
    }, []);

    const fetchPosts = useCallback(async (pageToFetch, reset = false, keyword = '', option = '') => {
        if (loadingRef.current || (!hasMore && !reset)) return;

        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const url = `${API_URL}/posts/search/?page=${pageToFetch}&size=${size}&keyword=${keyword}&sort=${sortBy}&searchOption=${option}`;
            console.log(`Fetching: ${url}`);
            const response = await axios.get(url);
            const newPosts = response.data.data;

            if (reset) {
                setPosts(newPosts);
            } else {
                setPosts(prevPosts => mergePosts(prevPosts, newPosts));
            }

            setPage(pageToFetch + 1);
            setHasMore(newPosts.length === size);

        } catch (error) {
            setError('게시물을 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [sortBy, size, mergePosts, hasMore]);

    useEffect(() => {
        setHasMore(true);
        setPage(0);
        fetchPosts(0, true, searchKeyword, searchOption);
    }, [sortBy, fetchPosts]);

    const handleSearch = useCallback(() => {
        setHasMore(true);
        setPage(0);
        fetchPosts(0, true, searchKeyword, searchOption);
    }, [fetchPosts, searchKeyword, searchOption]);

    const handleLoadMore = useCallback(() => {
        if (!loadingRef.current && hasMore) {
            fetchPosts(page, false, searchKeyword, searchOption);
        }
    }, [hasMore, fetchPosts, page, searchKeyword, searchOption]);

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.postItem}
            onPress={() => navigation.navigate('BoardView', { postId: item.postId })}
        >
            <View style={styles.postHeader}>
                <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                <Text style={styles.nickname}>{item.nickname}</Text>
            </View>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>
            <View style={styles.postFooter}>
                <Text style={styles.postInfo}>조회 {item.views}</Text>
                <Text style={styles.postInfo}>좋아요 {item.likeCount}</Text>
                <Text style={styles.postInfo}>댓글 {item.commentCount}</Text>
            </View>
        </TouchableOpacity>
    ), [navigation]);

    const renderFooter = useCallback(() => {
        if (!loading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#F9B300" />
            </View>
        );
    }, [loading]);

    const handleScroll = useCallback(event => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setShowScrollTopButton(currentOffset > 200);
    }, []);

    const scrollToTop = useCallback(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts(0, true, searchKeyword, searchOption)}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>게시판</Text>
            </View>

            {/* 검색 영역 */}
            <View style={styles.searchContainer}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={searchOption}
                        style={styles.searchOptionPicker}
                        onValueChange={setSearchOption}
                    >
                        <Picker.Item label="제목" value="title" />
                        <Picker.Item label="내용" value="content" />
                        <Picker.Item label="제목+내용" value="title_content" />
                    </Picker>
                </View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </TouchableOpacity>
            </View>

            {/* 정렬 선택 영역 */}
            <View style={styles.sortContainer}>
                <Picker
                    selectedValue={sortBy}
                    style={styles.sortPicker}
                    onValueChange={setSortBy}
                >
                    <Picker.Item label="최신순" value="createdAt_desc" />
                    <Picker.Item label="오래된순" value="createdAt_asc" />
                    <Picker.Item label="좋아요순" value="likeCount_desc" />
                    <Picker.Item label="조회수순" value="views_desc" />
                </Picker>
            </View>

            {/* 게시물 목록 */}
            <FlatList
                ref={flatListRef}
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.postId.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshPosts}
                        colors={["#F9B300"]}
                        tintColor="#F9B300"
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            {/* 맨 위로 가기 버튼 */}
            {showScrollTopButton && (
                <TouchableOpacity
                    style={styles.scrollTopButton}
                    onPress={scrollToTop}
                >
                    <Text style={styles.scrollTopButtonText}>↑</Text>
                </TouchableOpacity>
            )}

            {/* 게시글 작성 버튼 */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('BoardPost')}
            >
                <Text style={styles.createButtonText}>게시글 작성</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#F9B300',
        padding: 15,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#F9B300',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        width: 90,
        height: 40,
        marginRight: 10,
        justifyContent: 'center',
    },
    searchOptionPicker: {
        height: 40,
        width: 140,
        backgroundColor: 'transparent',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#F9B300',
        fontWeight: 'bold',
    },
    sortContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sortPicker: {
        height: 50,
        width: '100%',
    },
    postItem: {
        backgroundColor: '#FFF',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    nickname: {
        fontWeight: 'bold',
        color: '#333',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    postContent: {
        fontSize: 14,
        marginBottom: 10,
        color: '#666',
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postInfo: {
        fontSize: 12,
        color: '#888',
    },
    scrollTopButton: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: '#F9B300',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollTopButtonText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    createButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerLoader: {
        marginTop: 10,
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
});

export default BoardListPage;