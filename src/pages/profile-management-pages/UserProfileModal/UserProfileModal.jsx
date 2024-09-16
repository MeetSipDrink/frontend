import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ADS_API_URL = 'http://10.0.2.2:8080';

const UserProfileModal = ({
                              visible,
                              onClose,
                              user,
                              relationship,
                              onUnfriend,
                              onUnblock,
                              onProfileUpdate
                          }) => {
    const handleUnfriend = async () => {
        try {
            await onUnfriend(user.friendId);
            onClose();
            onProfileUpdate();
        } catch (error) {
            console.error('Error unfriending:', error);
            Alert.alert('오류', '친구 삭제에 실패했습니다.');
        }
    };

    const handleBlock = async () => {
        try {
            await axios.post(`${ADS_API_URL}/ban`, {
                blockerId: 1, // TODO: 실제 로그인한 사용자의 ID로 교체해야 함
                blockedMemberId: user.friendId
            });
            Alert.alert('성공', '사용자가 차단되었습니다.');
            onClose();
            onProfileUpdate();
        } catch (error) {
            console.error('Error blocking user:', error);
            Alert.alert('오류', '사용자 차단에 실패했습니다.');
        }
    };

    const handleUnblock = async () => {
        try {
            await onUnblock(user.banMemberId);
            onClose();
            onProfileUpdate();
        } catch (error) {
            console.error('Error unblocking user:', error);
            Alert.alert('오류', '사용자 차단 해제에 실패했습니다.');
        }
    };

    const renderActionButtons = () => {
        switch(relationship) {
            case 'notFriend':
                return (
                    <TouchableOpacity style={styles.actionButton} onPress={handleBlock}>
                        <Text style={styles.buttonText}>차단하기</Text>
                    </TouchableOpacity>
                );
            case 'friend':
                return (
                    <>
                        <TouchableOpacity style={styles.actionButton} onPress={handleUnfriend}>
                            <Text style={styles.buttonText}>친구 끊기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={handleBlock}>
                            <Text style={styles.buttonText}>차단하기</Text>
                        </TouchableOpacity>
                    </>
                );
            case 'blocked':
                return (
                    <TouchableOpacity style={styles.actionButton} onPress={handleUnblock}>
                        <Text style={styles.buttonText}>차단 해제</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Image
                        source={{ uri: user?.friendProfileImage || 'https://via.placeholder.com/50' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.nickname}>{user?.bannedNickname || user?.friendNickName}</Text>
                    <Text style={styles.details}>{user?.friendGender} | {user?.friendAlcoholType1}</Text>

                    {renderActionButtons()}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.buttonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
        width: '80%',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    nickname: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    details: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
        minWidth: 150,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default UserProfileModal;