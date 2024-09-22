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
                    source={{ uri: item.profileImage || 'https://via.placeholder.com/50' }}
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
            <UserProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
                user={selectedUser}
                relationship="blocked"
                onUnblock={() => {
                    if (selectedUser) {
                        unblockUser(selectedUser.banMemberId);
                        setProfileModalVisible(false);
                    }
                }}
                onProfileUpdate={loadBlockedUsers}
            />
        </View>
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