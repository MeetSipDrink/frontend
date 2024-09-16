import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert, TextInput, Image } from "react-native";
import axios from 'axios';
import FriendRequestModal from '../FriendRequestPage/FriendRequestPage';
import UserProfileModal from '../UserProfileModal/UserProfileModal';

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function FriendListPage({ navigation }) {
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [pendingFriendsCount, setPendingFriendsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [newFriendId, setNewFriendId] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        setLoading(true);
        try {
            const memberId = 1; // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            const [acceptedResponse, pendingResponse] = await Promise.all([
                axios.get(`${ADS_API_URL}/friends/${memberId}/accepted`),
                axios.get(`${ADS_API_URL}/friends/${memberId}/pending`)
            ]);
            setAcceptedFriends(acceptedResponse.data.data);
            setPendingFriendsCount(pendingResponse.data.data.length);
        } catch (error) {
            console.error('Error fetching friends:', error);
            Alert.alert('오류', '친구 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const addFriend = async () => {
        try {
            const requesterId = 1; // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            await axios.post(`${ADS_API_URL}/friends`, {
                requesterId: requesterId,
                recipientId: parseInt(newFriendId)
            });
            Alert.alert('성공', '친구 요청을 보냈습니다.');
            setNewFriendId('');
            loadFriends();
        } catch (error) {
            console.error('Error adding friend:', error);
            Alert.alert('오류', '친구 요청 보내기에 실패했습니다.');
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const memberId = 1; // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
            await axios.delete(`${ADS_API_URL}/friends/remove`, {
                data: {
                    requesterId: memberId,
                    recipientId: friendId
                }
            });
            Alert.alert('성공', '친구가 삭제되었습니다.');
            loadFriends();
        } catch (error) {
            console.error('Error removing friend:', error);
            Alert.alert('오류', '친구 삭제에 실패했습니다.');
            throw error;
        }
    };

    const renderFriendItem = ({ item }) => (
        <View style={styles.friendItem}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedFriend(item);
                    setProfileModalVisible(true);
                }}
            >
                <Image
                    source={{ uri: item.friendProfileImage || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.friendNickName}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.addFriendContainer}>
                <TextInput
                    style={styles.input}
                    value={newFriendId}
                    onChangeText={setNewFriendId}
                    placeholder="친구 ID 입력"
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.addButton} onPress={addFriend}>
                    <Text style={styles.buttonText}>친구 추가</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.requestButton}
                onPress={() => setRequestModalVisible(true)}
            >
                <Text style={styles.buttonText}>친구 요청</Text>
                {pendingFriendsCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingFriendsCount}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {loading ? (
                <Text>친구 목록을 불러오는 중...</Text>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>친구 목록</Text>
                    <FlatList
                        data={acceptedFriends}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.friendId.toString()}
                        style={styles.list}
                    />
                </>
            )}

            <FriendRequestModal
                visible={requestModalVisible}
                onClose={() => setRequestModalVisible(false)}
                onRequestsUpdated={loadFriends}
            />

            <UserProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
                user={selectedFriend}
                relationship="friend"
                onUnfriend={removeFriend}
                onProfileUpdate={loadFriends}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    addFriendContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    requestButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    list: {
        flex: 1,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
});