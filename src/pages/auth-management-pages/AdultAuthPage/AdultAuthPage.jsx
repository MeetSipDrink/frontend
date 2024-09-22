import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator // 로딩 표시기 추가
} from 'react-native';
import axios from 'axios';

const AdultAuthPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [telecom, setTelecom] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const handleTelecomSelect = (selectedTelecom) => {
    setTelecom(selectedTelecom);
  };

  const handleAuthRequest = async () => {
    try {
      setLoading(true); // 로딩 시작
  
      // 입력값 예외처리
      if (!name) {
        Alert.alert("이름을 입력해 주세요.");
        setLoading(false);
        return;
      }
      if (!phoneNumber) {
        Alert.alert("전화번호를 입력해 주세요.");
        setLoading(false);
        return;
      }
      if (phoneNumber.length !== 11) {
        Alert.alert("올바른 전화번호가 아닙니다.");
        setLoading(false);
        return;
      }
      if (!identityNumber) {
        Alert.alert("주민등록번호를 입력해 주세요.");
        setLoading(false);
        return;
      }
      if (identityNumber.length !== 13) {
        Alert.alert("올바른 주민등록번호가 아닙니다.");
        setLoading(false);
        return;
      }
      if (telecom === -1) {
        Alert.alert("통신사를 선택해 주세요.");
        setLoading(false);
        return;
      }
  
      const currentYear = new Date().getFullYear();
      const birthYearPrefix = parseInt(identityNumber.charAt(6)) <= 2 ? 1900 : 2000;
      const birthYear = birthYearPrefix + parseInt(identityNumber.substring(0, 2));
      const age = currentYear - birthYear; 
  
      if (age < 19) {
        Alert.alert("성인만 이용 가능합니다.");
        setLoading(false);
        navigation.navigate("Home"); 
        return;
      }
  
      const response = await axios.post(
        `http://10.0.2.2:8080/api/identity/verify`,
        null,
        {
          params: {
            name: name,
            phoneNo: phoneNumber,
            identity: identityNumber,
            telecom: telecom,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const parsedResponse = JSON.parse(response.data.response);
      const resultCode = parsedResponse.result.code;
  
      if (resultCode === "CF-03002") {
        setModalVisible(true);
      } else {
        Alert.alert("인증 실패", "다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("인증 요청 실패:", error.response ? error.response.data : error.message);
      Alert.alert("인증 실패", error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handlePassVerification = async () => {
    try {
      setLoading(true); // 로딩 시작
      const response = await axios.post(
        'http://10.0.2.2:8080/api/identity/add-verify',
        null,
        {
          params: {
            name: name,
            phoneNo: phoneNumber,
            identity: identityNumber,
            telecom: telecom
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const parsedResponse = JSON.parse(response.data.response);
      const resultCode = parsedResponse.result.code;

      if (resultCode === 'CF-00000' || resultCode === 'CF-00025') {
        const genderDigit = parseInt(identityNumber.charAt(6));
        const birthYearPrefix = genderDigit <= 2 ? 1900 : 2000;
        const birthYear = birthYearPrefix + parseInt(identityNumber.substring(0, 2));
        const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear + 1; 
      const gender = genderDigit % 2 === 1 ? 'M' : 'F';

      const signUpData = {
          name: name,
          gender: gender ,
          age: age
        };

        console.log(signUpData);
        setModalVisible(false);
        navigation.navigate('SignUpAgreement', { ...signUpData });
      } else if (resultCode === 'CF-03002') {
        Alert.alert('Pass 인증을 완료해 주세요.');
      } else if (resultCode === 'CF-12001') {
        setModalVisible(false);
        Alert.alert('요청 시간이 초과되었습니다.', '다시 시도해 주세요.');
      } else if (resultCode === 'CF-00016') {
        setModalVisible(false);
        Alert.alert('동일한 요청이 처리 중입니다.', '잠시 후 다시 시도해 주세요.');
      } else {
        console.log(resultCode);
        setModalVisible(false);
        Alert.alert('인증 실패', '다시 시도해 주세요.');
      }
    } catch (error) {
      setModalVisible(false);
      Alert.alert('인증 실패', error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="이름"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="전화번호(' - '는 빼고 입력해주세요)"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="주민등록번호(' - '는 빼고 입력해주세요)"
                value={identityNumber}
                onChangeText={(text) => setIdentityNumber(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
            />

          <Text style={styles.label}>통신사 선택 :</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.telecomButton,
                telecom === 0 && styles.selectedTelecomButton,
              ]}
              onPress={() => handleTelecomSelect(0)}
            >
              <Text style={styles.buttonText}>SKT(알뜰폰)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.telecomButton,
                telecom === 1 && styles.selectedTelecomButton,
              ]}
              onPress={() => handleTelecomSelect(1)}
            >
              <Text style={styles.buttonText}>KT(알뜰폰)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.telecomButton,
                telecom === 2 && styles.selectedTelecomButton,
              ]}
              onPress={() => handleTelecomSelect(2)}
            >
              <Text style={styles.buttonText}>LG U+(알뜰폰)</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="인증하기"
            onPress={handleAuthRequest}
            disabled={loading} // 로딩 중일 때 버튼 비활성화
          />

          {loading && (
            <ActivityIndicator size="large" color="#F9B300" style={styles.loading} />
          )}

          {/* 2차 인증을 위한 모달 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <Text style={styles.modalText}>Pass 인증 후 완료를 눌러주세요</Text>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handlePassVerification}
                  disabled={loading} // 로딩 중일 때 버튼 비활성화
                >
                  <Text style={styles.modalButtonText}>완료</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telecomButton: {
    backgroundColor: '#F9B300',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '32%',
  },
  selectedTelecomButton: {
    backgroundColor: '#F96900',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 화면 어두움 처리
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  modalButtonText: {
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#F9B300',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'red',
  },
  loading: {
    marginTop: 10,
  },
});

export default AdultAuthPage;
