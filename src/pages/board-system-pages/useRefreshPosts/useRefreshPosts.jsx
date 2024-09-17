import { useState, useCallback } from 'react';

const API_URL = 'http://10.0.2.2:8080';

const useRefreshPosts = (size, sortBy, setPosts, setPage, setHasMore) => {
    const [refreshing, setRefreshing] = useState(false);

    const refreshPosts = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            const response = await fetch(`${API_URL}/posts/search/?page=0&size=${size}&keyword=&sort=${sortBy}`);
            const result = await response.json();

            const newPosts = result.data;
            setPosts(newPosts);
            setPage(1); // 새로고침 후 페이지를 초기화
            setHasMore(newPosts.length === size);

        } catch (error) {
            console.error('새로고침 중 오류 발생:', error);
        } finally {
            setRefreshing(false);
        }
    }, [sortBy, size, setPosts, setPage, setHasMore, refreshing]);

    return { refreshing, refreshPosts };
};

export default useRefreshPosts;
