import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert, Image } from "react-native";
import axios from 'axios';
import UserProfileModal from '../UserProfileModal/UserProfileModal';
import * as Keychain from 'react-native-keychain';

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function BlockListPage({ navigation }) {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    const getAccessToken = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                return JSON.parse(credentials.password).accessToken;
            }
            throw new Error('No credentials stored');
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const loadBlockedUsers = async () => {
        setLoading(true);
        try {
            const accessToken = await getAccessToken();
            const response = await axios.get(`${ADS_API_URL}/ban`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setBlockedUsers(response.data);
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            Alert.alert('오류', '차단 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const unblockUser = async (blockedId) => {
        try {
            const accessToken = await getAccessToken();
            await axios.delete(`${ADS_API_URL}/ban/${blockedId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            Alert.alert('성공', '차단이 해제되었습니다.');
            loadBlockedUsers();
        } catch (error) {
            console.error('Error unblocking user:', error);
            Alert.alert('오류', '차단 해제에 실패했습니다.');
        }
    };

    const renderBlockedUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedUser(item);
                    setProfileModalVisible(true);
                }}
            >
                <Image
                    source={{ uri: item.friendProfileImage || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.bannedNickname}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>차단 목록을 불러오는 중...</Text>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>차단 목록</Text>
                    {blockedUsers.length === 0 ? (
                        <Text style={styles.noBlockedUsersText}>차단한 사용자가 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={blockedUsers}
                            renderItem={renderBlockedUserItem}
                            keyExtractor={(item) => item.banId.toString()}
                            style={styles.list}
                        />
                    )}
                </>
            )}

            <UserProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
                user={selectedUser}
                relationship="blocked"
                onUnblock={() => {
                    if (selectedUser) {
                        unblockUser(selectedUser.bannedMemberId);
                        setProfileModalVisible(false);
                    }
                }}
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    list: {
        flex: 1,
    },
    userItem: {
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
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noBlockedUsersText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});