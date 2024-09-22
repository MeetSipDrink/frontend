import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, Alert, Image, ActivityIndicator } from "react-native";
import axios from 'axios';
import Keychain from "react-native-keychain";

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function FriendRequestModal({ visible, onClose, onRequestsUpdated = () => {} }) {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchFriendRequests();
        }
    }, [visible]);

    const fetchFriendRequests = async () => {
        setLoading(true);
        try {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('No credentials stored');
            }
            const { accessToken } = JSON.parse(credentials.password);

            const response = await axios.get(`${ADS_API_URL}/friends/get/pending`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setFriendRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                Alert.alert('오류', error.response.data.message || '친구 요청 목록을 불러오는데 실패했습니다.');
            } else {
                Alert.alert('오류', '친구 요청 목록을 불러오는데 실패했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, friendId) => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('No credentials stored');
            }
            const { accessToken } = JSON.parse(credentials.password);

            if (action === 'accept') {
                await axios.post(`${ADS_API_URL}/friends/accept`, {
                    recipientId: friendId
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                // Alert.alert('성공', '친구 요청을 수락했습니다.');
            } else if (action === 'reject') {
                await axios.delete(`${ADS_API_URL}/friends`, {
                    data: {
                        recipientId: friendId
                    },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                Alert.alert('성공', '친구 요청을 거절했습니다.');
            }

            // onRequestsUpdated가 함수인지 확인한 후 호출
            if (typeof onRequestsUpdated === 'function') {
                try {
                    onRequestsUpdated();
                } catch (updateError) {
                    console.error('Error in onRequestsUpdated:', updateError);
                    Alert.alert('오류', '요청 업데이트에 실패했습니다.');
                }
            }

            // 친구 요청 목록 갱신
            try {
                await fetchFriendRequests();
            } catch (fetchError) {
                console.error('Error fetching friend requests after action:', fetchError);
                Alert.alert('오류', '친구 요청을 업데이트하는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                Alert.alert('오류', error.response.data.message || '요청 처리에 실패했습니다.');
            } else {
                Alert.alert('오류', '요청 처리에 실패했습니다.');
            }
        }
    };

    const renderFriendRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Image
                source={{ uri: item.friendProfileImage || 'https://via.placeholder.com/50' }}
                style={styles.profileImage}
            />
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.friendNickName}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAction('accept', item.friendId)}
                >
                    <Text style={styles.actionButtonText}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleAction('reject', item.friendId)}
                >
                    <Text style={styles.actionButtonText}>거절</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>친구 요청</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : friendRequests.length === 0 ? (
                        <Text style={styles.noRequestsText}>대기 중인 친구 요청이 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={friendRequests}
                            renderItem={renderFriendRequestItem}
                            keyExtractor={(item) => item.friendId.toString()}
                            style={styles.list}
                        />
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    list: {
        width: '100%',
    },
    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#f44336',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    noRequestsText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
});