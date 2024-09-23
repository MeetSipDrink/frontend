import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain'; // Keychain 추가

const API_URL = 'http://10.0.2.2:8080';

const Comment = ({
                     comment,
                     postId,
                     allComments,
                     onCommentAdded,
                     onCommentUpdated,
                     onCommentDeleted,
                     depth = 0,
                 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [inputContent, setInputContent] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);

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

    // 로그인한 사용자 ID를 가져오는 함수
    const fetchLoggedInUserId = async () => {
        try {
            const token = await getAccessToken();
            if (token) {
                const response = await axios.get(`${API_URL}/members`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLoggedInUserId(response.data.data.memberId);
            }
        } catch (error) {
            console.error('사용자 정보 가져오기 오류:', error);
        }
    };

    const handleUpdate = async () => {
        if (!inputContent.trim()) {
            Alert.alert('오류', '댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            await axios.patch(`${API_URL}/posts/${postId}/comments`, {
                content: inputContent,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
                },
            });
            setIsEditing(false);
            setInputContent('');
            onCommentUpdated();
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            Alert.alert('오류', '댓글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            await axios.delete(`${API_URL}/posts/${postId}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
                },
            });
            onCommentDeleted();
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            Alert.alert('오류', '댓글 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleReplySubmit = async () => {
        if (!inputContent.trim()) {
            Alert.alert('오류', '대댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const token = await getAccessToken(); // 액세스 토큰 가져오기
            const requestBody = {
                postId: postId,
                content: inputContent,
                parentCommentId: comment.postCommentId,
            };

            await axios.post(`${API_URL}/posts/${postId}/comment`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
                },
            });
            setIsReplying(false);
            setInputContent('');
            onCommentAdded();
        } catch (error) {
            console.error('대댓글 작성 실패:', error);
            Alert.alert('오류', '대댓글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        setInputContent(comment.content);
    };

    const startReplying = () => {
        setIsReplying(true);
        setInputContent('');
    };

    const cancelAction = () => {
        setIsEditing(false);
        setIsReplying(false);
        setInputContent('');
    };

    const replies = allComments.filter(c => c.parentCommentId === comment.postCommentId);

    useEffect(() => {
        fetchLoggedInUserId(); // 로그 출력 추가
        console.log('LoggedInUserId:', loggedInUserId);
    }, [loggedInUserId]);

    return (
        <View style={[styles.commentContainer, {
            marginLeft: depth * 20,
            backgroundColor: depth > 0 ? '#f9f9f9' : '#fff'
        }]}>
            <View style={styles.commentHeader}>
                <View style={styles.authorInfo}>
                    {comment.profileImage ? (
                        <Image source={{ uri: comment.profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profilePlaceholder} />
                    )}
                    <Text style={styles.commentAuthor}>{comment.nickname || 'Unknown'}</Text>
                </View>
                <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
            </View>
            {!isEditing && !isReplying && (
                <Text style={styles.commentContent}>{comment.content}</Text>
            )}
            {(isEditing || isReplying) && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputContent}
                        onChangeText={setInputContent}
                        placeholder={isEditing ? "댓글을 수정하세요" : "대댓글을 입력하세요"}
                        multiline
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={isEditing ? handleUpdate : handleReplySubmit}>
                            <Text style={styles.submitButtonText}>{isEditing ? "수정" : "작성"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={cancelAction}>
                            <Text style={styles.cancelButtonText}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {!isEditing && !isReplying && (
                <View style={styles.commentActions}>
                    {depth === 0 && (
                        <TouchableOpacity style={styles.actionButton} onPress={startReplying}>
                            <Text style={styles.actionButtonText}>답글</Text>
                        </TouchableOpacity>
                    )}
                    {comment.memberId === loggedInUserId && (
                        <>
                            <TouchableOpacity style={styles.actionButton} onPress={startEditing}>
                                <Text style={styles.actionButtonText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                                <Text style={styles.actionButtonText}>삭제</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
            {replies.map((reply) => (
                <Comment
                    key={reply.postCommentId}
                    comment={reply}
                    postId={postId}
                    allComments={allComments}
                    onCommentAdded={onCommentAdded}
                    onCommentUpdated={onCommentUpdated}
                    onCommentDeleted={onCommentDeleted}
                    depth={depth + 1}
                />
            ))}
        </View>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
    commentContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderRadius: 5,
        marginVertical: 5,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    profilePlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    commentAuthor: {
        fontWeight: 'bold',
    },
    commentDate: {
        color: '#888',
        fontSize: 12,
    },
    commentContent: {
        marginBottom: 5,
        color: '#333',
    },
    commentActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 5,
        marginRight: 10,
    },
    actionButtonText: {
        color: '#F9B300',
    },
    inputContainer: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        minHeight: 80,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    submitButton: {
        backgroundColor: '#F9B300',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
});

export default Comment;