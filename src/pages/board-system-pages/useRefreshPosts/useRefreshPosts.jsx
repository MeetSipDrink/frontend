import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080';

const useRefreshPosts = (size, sortBy, setPosts, setPage, setHasMore, setSearchKeyword, setSearchOption) => {
    const [refreshing, setRefreshing] = useState(false);

    const refreshPosts = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            const url = `${API_URL}/posts/search/?page=0&size=${size}&keyword=&sort=${sortBy}&searchOption=title`;
            console.log(`Refreshing: ${url}`);
            const response = await axios.get(url);
            const newPosts = response.data.data;
            setPosts(newPosts);
            setPage(1);
            setHasMore(newPosts.length === size);
            setSearchKeyword(''); // 검색어 초기화
            setSearchOption('title'); // 검색 옵션 초기화
        } catch (error) {
            console.error('새로고침 중 오류 발생:', error);
        } finally {
            setRefreshing(false);
        }
    }, [size, sortBy, setPosts, setPage, setHasMore, setSearchKeyword, setSearchOption]);

    return { refreshing, refreshPosts };
};

export default useRefreshPosts;