import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080';

const useRefreshPosts = (size, sortBy, searchKeyword, searchOption, setPosts, setPage, setHasMore) => {
    const [refreshing, setRefreshing] = useState(false);

    const refreshPosts = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            const url = `${API_URL}/posts/search/?page=0&size=${size}&keyword=${searchKeyword}&sort=${sortBy}&searchOption=${searchOption}`;
            console.log(`Refreshing: ${url}`);
            const response = await axios.get(url);
            const newPosts = response.data.data;
            setPosts(newPosts);
            setPage(1); // 새로고침 후 페이지를 1로 설정
            setHasMore(newPosts.length === size);

        } catch (error) {
            console.error('새로고침 중 오류 발생:', error);
        } finally {
            setRefreshing(false);
        }
    }, [size, sortBy, searchKeyword, searchOption, setPosts, setPage, setHasMore, refreshing]);

    return { refreshing, refreshPosts };
};

export default useRefreshPosts;
