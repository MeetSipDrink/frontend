// FriendRequestModal.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, Alert, Image, ActivityIndicator } from "react-native";
import axios from 'axios';

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function FriendRequestModal({ visible, onClose, onRequestsUpdated }) {
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
            const memberId = 1; // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            const response = await axios.get(`${ADS_API_URL}/friends/${memberId}/pending`);
            setFriendRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            Alert.alert('오류', '친구 요청 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, friendId) => {
        try {
            const recipientId = 1; // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            if (action === 'accept') {
                await axios.post(`${ADS_API_URL}/friends/accept`, {
                    friendId: friendId,
                    recipientId: recipientId
                });
                Alert.alert('성공', '친구 요청을 수락했습니다.');
            } else if (action === 'reject') {
                await axios.delete(`${ADS_API_URL}/friends`, {
                    data: {
                        requesterId: friendId,
                        recipientId: recipientId
                    }
                });
                Alert.alert('성공', '친구 요청을 거절했습니다.');
            }
            fetchFriendRequests();
            onRequestsUpdated();
        } catch (error) {
            console.error('Error handling friend request:', error);
            Alert.alert('오류', '요청 처리에 실패했습니다.');
        }
    };

    const renderFriendRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Image
                source={{ uri: item.FriendProfileImage || 'https://via.placeholder.com/50' }}
                style={styles.profileImage}
            />
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.friendNickName}</Text>
                <Text style={styles.friendDetails}>{item.friendGender} | {item.friendAlcoholType1}</Text>
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
                            keyExtractor={(item) => item.friendId}
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
    friendDetails: {
        fontSize: 14,
        color: '#666',
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