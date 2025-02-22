import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
    ActivityIndicator,
    SafeAreaView,
    FlatList,
    Dimensions,
    Alert,
    TextInput,
} from 'react-native';
import axios from 'axios';
import Comment from '../CommentComponents/CommentComponents';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Keychain from 'react-native-keychain'; // Keychain 불러오기

const API_URL = 'http://10.0.2.2:8080';
const { width } = Dimensions.get('window');

const BoardViewPage = ({ route, navigation }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const flatListRef = useRef(null);
    const scrollViewRef = useRef(null);

    const { postId } = route.params;

    // 토큰을 가져오는 함수
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

    const fetchMemberInfo = async () => {
        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            if (!token) {
                throw new Error('토큰을 가져올 수 없습니다.');
            }

            const response = await axios.get(`${API_URL}/members`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const memberId = response.data.data.memberId; // memberId 값 가져오기
            setLoggedInUserId(memberId); // 상태로 저장
        } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
            Alert.alert('오류', '사용자 정보를 가져오는데 실패했습니다.');
        }
    };

    const fetchPostData = useCallback(async () => {
        try {
            await fetchMemberInfo();
            await fetchPost();
            await fetchComments();
            await checkLikeStatus();
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            setError('데이터를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useFocusEffect(
        useCallback(() => {
            fetchPostData();
        }, [fetchPostData])
    );

    const fetchPost = async () => {
        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            const response = await axios.get(`${API_URL}/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPost(response.data.data);
        } catch (err) {
            setError('게시물을 불러오는 데 실패했습니다.');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
            });
            setComments(response.data);
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            Alert.alert('오류', '댓글을 불러오는데 실패했습니다.');
        }
    };

    // 좋아요 상태 확인 함수
    const checkLikeStatus = async () => {
        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            const response = await axios.get(`${API_URL}/posts/${postId}/likes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Like status response:', response.data);
            // 응답값이 true인지 false인지 명확히 확인하여 설정
            if (response.data.data.isLike === true) { // 'isLike' 키로 수정
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (error) {
            console.error('좋아요 상태 확인 실패:', error);
            setIsLiked(false); // 에러 발생 시 기본값 설정
        }
    };

    // 좋아요 토글 함수 수정
    const toggleLike = async () => {
        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            // 1. POST 요청으로 좋아요 토글
            await axios.post(`${API_URL}/posts/${postId}/likes`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Toggle like response: POST completed');

            // 2. GET 요청으로 최신 좋아요 상태 가져오기
            const getResponse = await axios.get(`${API_URL}/posts/${postId}/likes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Toggle like response: GET', getResponse.data);

            if (getResponse.data && getResponse.data.data && getResponse.data.data.isLike !== undefined) {
                const newIsLiked = getResponse.data.data.isLike; // 'isLike' 키로 접근
                setIsLiked(newIsLiked);

                // 좋아요 상태에 따라 likeCount 업데이트
                setPost(prevPost => ({
                    ...prevPost,
                    likeCount: newIsLiked ? (prevPost.likeCount + 1) : (prevPost.likeCount - 1)
                }));
            } else {
                // 응답 데이터가 예상과 다를 경우 로컬 상태 토글
                setIsLiked(prev => {
                    const newIsLiked = !prev;
                    setPost(prevPost => ({
                        ...prevPost,
                        likeCount: newIsLiked ? (prevPost.likeCount + 1) : (prevPost.likeCount - 1)
                    }));
                    return newIsLiked;
                });
            }
        } catch (error) {
            console.error('좋아요 토글 실패:', error);
            Alert.alert('오류', '좋아요 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleDeletePost = () => {
        Alert.alert(
            '게시글 삭제',
            '정말 게시글을 삭제하시겠습니까?',
            [
                {
                    text: '아니오',
                    style: 'cancel',
                },
                {
                    text: '예',
                    onPress: async () => {
                        try {
                            const token = await getAccessToken(); // 액세스 토큰 가져오기
                            await axios.delete(`${API_URL}/posts/${postId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            Alert.alert('성공', '게시글이 삭제되었습니다.');
                            navigation.goBack(); // 삭제 후 이전 화면으로 이동
                        } catch (error) {
                            console.error('게시글 삭제 실패:', error);
                            Alert.alert('오류', '게시글 삭제에 실패했습니다. 다시 시도해주세요.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleNewCommentSubmit = async () => {
        if (!newCommentContent.trim()) {
            Alert.alert('오류', '댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            const requestBody = {
                content: newCommentContent,
            };

            await axios.post(`${API_URL}/posts/${postId}/comments`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewCommentContent('');
            fetchComments();

            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            Alert.alert('오류', '댓글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const renderImageItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.postImage} />
    );

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const imageIndex = Math.floor(contentOffset / width);
        setCurrentImageIndex(imageIndex);
    };

    const getTotalCommentCount = () => {
        return comments.length;
    };

    const renderComments = () => {
        return comments
            .filter(comment => comment.parentCommentId === null)
            .map(comment => (
                <Comment
                    key={comment.postCommentId}
                    comment={comment}
                    postId={postId}
                    allComments={comments}
                    onCommentAdded={fetchComments}
                    onCommentUpdated={fetchComments}
                    onCommentDeleted={fetchComments}
                    depth={0}
                />
            ));
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
                <TouchableOpacity style={styles.retryButton} onPress={fetchPostData}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.centered}>
                <Text>게시물을 찾을 수 없습니다.</Text>
            </View>
        );
    }

    const canEdit = post.memberId === loggedInUserId;
    const images = [post.imageUrl1, post.imageUrl2, post.imageUrl3, post.imageUrl4, post.imageUrl5, post.imageUrl6].filter(Boolean);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.postHeader}>
                    <View style={styles.authorInfo}>
                        {post.profileImage ? (
                            <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profilePlaceholder} />
                        )}
                        <View>
                            <Text style={styles.nickname}>{post.nickname}</Text>
                            <Text style={styles.dateText}>작성: {formatDate(post.createdAt)}</Text>
                            {post.modifiedAt && <Text style={styles.dateText}>수정: {formatDate(post.modifiedAt)}</Text>}
                        </View>
                    </View>
                    {canEdit && (
                        <View style={styles.editDeleteContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('BoardEdit', { postId })}
                            >
                                <Text style={styles.editButtonText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeletePost}
                            >
                                <Text style={styles.deleteButtonText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content}</Text>
                {images.length > 0 && (
                    <View style={styles.imageContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={images}
                            renderItem={renderImageItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                        />
                        {images.length > 1 && (
                            <View style={styles.pagination}>
                                {images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            index === currentImageIndex && styles.paginationDotActive
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}
                <View style={styles.postFooter}>
                    <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                        <Icon
                            name={isLiked ? "heart" : "heart-o"}
                            size={24}
                            color={isLiked ? "red" : "black"}
                        />
                        <Text style={styles.likeCount}>{post.likeCount}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postInfo}>조회 {post.views}</Text>
                    <Text style={styles.postInfo}>댓글 {getTotalCommentCount()}</Text>
                </View>
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsSectionTitle}>댓글</Text>
                    {renderComments()}
                </View>
            </ScrollView>
            <View style={styles.commentFormContainer}>
                <View style={styles.commentForm}>
                    <TextInput
                        style={styles.input}
                        value={newCommentContent}
                        onChangeText={setNewCommentContent}
                        placeholder="댓글을 입력하세요"
                        multiline
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleNewCommentSubmit}>
                        <Text style={styles.submitButtonText}>작성</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    nickname: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
    },
    editDeleteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#F9B300',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 15,
        color: '#333',
    },
    content: {
        fontSize: 16,
        padding: 15,
        color: '#666',
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    postImage: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#FFF',
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333',
    },
    postInfo: {
        fontSize: 14,
        color: '#888',
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
    commentsSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 10,
    },
    commentsSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentFormContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        padding: 10,
    },
    commentForm: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
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

export default BoardViewPage;
