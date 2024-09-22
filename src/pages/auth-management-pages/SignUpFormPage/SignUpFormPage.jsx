import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const SignUpTermsPage = () => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = () => {
        if (agreeTerms && agreePrivacy) {
            navigation.navigate('SignUpAdultAuth');
        } else {
            Alert.alert("알림", "모든 약관에 동의해주세요.");
        }
    };

    const handleCancel = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>회원가입</Text>
                <Text style={styles.subTitle}>아래 약관을 읽고 동의해 주세요.</Text>

                <View style={styles.termsSection}>
                    <Text style={styles.termsTitle}>이용약관 동의</Text>
                    <ScrollView style={styles.termsContent} showsVerticalScrollIndicator={false}>
                        <Text>
                            {`# 한마디 한 잔 서비스 이용약관\n
## 제1조 [목적]\n
이 이용약관은 한마디 한 잔이 제공하는 소셜 네트워킹 및 커뮤니케이션 서비스(이하 "서비스") 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n
## 제2조 [약관의 효력과 변경]\n
1. 본 약관은 서비스를 통하여 이를 공지하거나 전자우편, 기타의 방법으로 회원에게 통지함으로써 효력이 발생됩니다.\n
2. 한마디 한 잔은 사정상 중요한 사유가 발생될 경우 사전 고지 없이 이 약관의 내용을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이 발생됩니다.\n
3. 회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 사용할 경우 약관의 변경 사항에 동의한 것으로 간주됩니다.\n
## 제3조 [약관 외 준칙]\n
1. 이 약관은 당사가 제공하는 서비스에 관한 이용규정 및 별도 약관과 함께 적용됩니다.\n
2. 이 약관에 명시되지 않은 사항이 관계 법령에 규정되어 있을 경우에는 그 규정에 따릅니다.\n`}
                        </Text>
                    </ScrollView>
                    <CheckBox
                        title="이용약관에 동의합니다."
                        checked={agreeTerms}
                        onPress={() => setAgreeTerms(!agreeTerms)}
                    />
                </View>

                <View style={styles.termsSection}>
                    <Text style={styles.termsTitle}>개인정보 수집 및 이용 동의</Text>
                    <ScrollView style={styles.termsContent} showsVerticalScrollIndicator={false}>
                        <Text>
                            {`'한마디 한 잔'은 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.\n
한마디 한 잔은 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.\n
한마디 한 잔은 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.\n
본 방침은 : 2024년 08월 12일부터 시행됩니다.\n
● 수집하는 개인정보 항목\n
한마디 한 잔은 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.\n
◦ 수집항목 : 이름, 성별, 로그인 ID, 비밀번호, 자택 전화번호, 자택 주소, 휴대전화번호, 이메일, 생년월일, 서비스 이용기록, 접속 로그, 접속 IP 정보, sms수신여부\n
◦ 개인정보 수집 방법 : 홈페이지(회원가입)\n`}
                        </Text>
                    </ScrollView>
                    <CheckBox
                        title="개인정보 수집 및 이용에 동의합니다."
                        checked={agreePrivacy}
                        onPress={() => setAgreePrivacy(!agreePrivacy)}
                    />
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
                        <Text style={styles.confirmButtonText}>확인</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F9B300',
        textAlign: 'center',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#757575',
    },
    termsSection: {
        marginBottom: 30,
    },
    termsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a4a4a',
        marginBottom: 10,
    },
    termsContent: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        height: 150,
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F9B300',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#F9B300',
        textAlign: 'center',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#F9B300',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    confirmButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default SignUpTermsPage;