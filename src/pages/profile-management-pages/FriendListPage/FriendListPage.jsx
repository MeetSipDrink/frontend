import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert, TextInput, Image, ActivityIndicator } from "react-native";
import axios from 'axios';
import FriendRequestModal from '../FriendRequestPage/FriendRequestPage';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import Keychain from "react-native-keychain";
import { useFocusEffect } from "@react-navigation/native";

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

    useFocusEffect(
        React.useCallback(() => {
            loadFriends();
        }, [])
    );

    const loadFriends = async () => {
        setLoading(true);
        try {
            console.log('Loading friends...');
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('No credentials stored');
            }
            const { accessToken } = JSON.parse(credentials.password);

            const [acceptedResponse, pendingResponse] = await Promise.all([
                axios.get(`${ADS_API_URL}/friends/get/accepted`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
                axios.get(`${ADS_API_URL}/friends/get/pending`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
            ]);

            console.log('Accepted friends:', acceptedResponse.data.data);
            console.log('Pending friends count:', pendingResponse.data.data.length);

            setAcceptedFriends(acceptedResponse.data.data);
            setPendingFriendsCount(pendingResponse.data.data.length);
        } catch (error) {
            console.error('Error fetching friends:', error.response || error);
            Alert.alert('오류', '친구 목록을 불러오는데 실패했습니다: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
            console.log('Loading friends completed.');
        }
    };

    const addFriend = async () => {
        try {
            console.log(`Attempting to add friend with nickname: ${newFriendId}`);
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('No credentials stored');
            }
            const { accessToken } = JSON.parse(credentials.password);

            if (!newFriendId) {
                Alert.alert('오류', '친구의 닉네임을 입력해주세요.');
                return;
            }

            // 현재 사용자의 정보를 가져옵니다.
            let currentUser;
            try {
                console.log('Fetching current user info...');
                const currentUserResponse = await axios.get(`${ADS_API_URL}/members`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                currentUser = currentUserResponse.data.data;
                console.log('Current User:', JSON.stringify(currentUser, null, 2));
            } catch (error) {
                console.error('Error fetching current user:', error);
                Alert.alert('오류', '사용자 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
                return;
            }

            // 입력된 닉네임으로 사용자 정보를 가져옵니다.
            let friendUser;
            try {
                console.log(`Fetching friend info for nickname: ${newFriendId}`);
                const friendResponse = await axios.get(`${ADS_API_URL}/members/${newFriendId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                friendUser = friendResponse.data.data;
                console.log('Friend User:', JSON.stringify(friendUser, null, 2));
            } catch (error) {
                console.error('Error fetching friend info:', error);
                if (error.response && error.response.status === 404) {
                    Alert.alert('오류', '해당 닉네임의 사용자를 찾을 수 없습니다.');
                } else {
                    Alert.alert('오류', '친구 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
                }
                return;
            }

            // 본인에게 친구 신청을 하려는 경우 방지
            if (currentUser.nickname === friendUser.nickname) {
                console.log('Attempt to add self as friend');
                Alert.alert('오류', '자기 자신에게는 친구 신청을 할 수 없습니다.');
                return;
            }

            // 친구 신청 요청 보내기
            try {
                console.log(`Sending friend request to ID: ${friendUser.memberId}`);
                const addFriendResponse = await axios.post(`${ADS_API_URL}/friends`, {
                    recipientId: friendUser.memberId
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                console.log('Friend Request Response:', JSON.stringify(addFriendResponse.data, null, 2));

                if (addFriendResponse.status === 201) {
                    Alert.alert('성공', `${friendUser.nickname}님에게 친구 요청을 보냈습니다.`);
                    setNewFriendId('');
                    loadFriends();
                } else {
                    console.log('Unexpected response status:', addFriendResponse.status);
                    Alert.alert('오류', '친구 요청 보내기에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    if (error.response.data && error.response.data.message) {
                        // 서버에서 보낸 구체적인 메시지가 있다면 그것을 표시
                        Alert.alert('알림', error.response.data.message);
                    } else {
                        // 구체적인 메시지가 없다면 일반적인 메시지 표시
                        Alert.alert('알림', '이미 친구이거나 친구 요청이 진행 중입니다.');
                    }
                } else {
                    Alert.alert('오류', '친구 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
                }
            }

        } catch (error) {
            console.error('Error in addFriend function:', error);
            Alert.alert('오류', '친구 추가 과정에서 문제가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const removeFriend = async (friendId) => {
        try {
            console.log(`Attempting to remove friend with ID: ${friendId}`);
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                throw new Error('No credentials stored');
            }
            const { accessToken } = JSON.parse(credentials.password);

            await axios.delete(`${ADS_API_URL}/friends/remove`, {
                data: {
                    recipientId: friendId
                },
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log(`Friend with ID ${friendId} removed successfully.`);
            Alert.alert('성공', '친구가 삭제되었습니다.');

            await loadFriends(); // `loadFriends`를 `await`하여 오류를 포착
        } catch (error) {
            console.error('Error removing friend:', error.response || error);
            Alert.alert('오류', '친구 삭제에 실패했습니다: ' + (error.response?.data?.message || error.message));
            throw error; // 오류를 다시 던져 `UserProfileModal`에서 처리
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
                    keyboardType="keyboard"
                    placeholderTextColor="#888"
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
                <ActivityIndicator size="large" color="#F9B300" />
            ) : (
                <>
                    <Text style={styles.sectionTitle}>친구 목록</Text>
                    {acceptedFriends.length === 0 ? (
                        <Text style={styles.noFriendsText}>현재 친구가 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={acceptedFriends}
                            renderItem={renderFriendItem}
                            keyExtractor={(item) => item.friendId.toString()}
                            style={styles.list}
                        />
                    )}
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
        backgroundColor: '#FFF9E6', // 밝은 노란색 배경
    },
    addFriendContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#F9B300',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
    },
    requestButton: {
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#FF6B6B',
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
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#F9B300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#F9B300',
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#F9B300',
    },
    noFriendsText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
});