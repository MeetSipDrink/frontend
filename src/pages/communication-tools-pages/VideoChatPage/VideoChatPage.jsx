import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function VideoChatPage({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const result = await request(
          Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA
      );

      switch (result) {
        case RESULTS.GRANTED:
          setHasPermission(true);
          break;
        case RESULTS.DENIED:
          setHasPermission(false);
          console.log('카메라 권한이 거부되었습니다. 다시 요청합니다.');
          requestCameraPermission(); // 거부된 경우 다시 요청
          break;
        case RESULTS.BLOCKED:
          setHasPermission(false);
          console.log('카메라 권한이 차단되었습니다. 설정에서 권한을 허용해주세요.');
          break;
      }
    } catch (error) {
      console.warn('권한 요청 중 오류 발생:', error);
      setHasPermission(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(
        cameraType === RNCamera.Constants.Type.back
            ? RNCamera.Constants.Type.front
            : RNCamera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>카메라 권한을 요청 중입니다...</Text></View>;
  }

  if (hasPermission === false) {
    return (
        <View style={styles.container}>
          <Text>카메라 접근 권한이 없습니다.</Text>
          <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
            <Text style={styles.buttonText}>권한 다시 요청</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.pageText}>영상통화 페이지</Text>
        <View style={styles.videoContainer}>
          <RNCamera
              ref={cameraRef}
              style={styles.localVideo}
              type={cameraType}
              captureAudio={false}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                <Text style={styles.flipText}>카메라 전환</Text>
              </TouchableOpacity>
            </View>
          </RNCamera>
          <View style={styles.remoteVideo}>
            <Text style={styles.remoteVideoText}>상대방 화면</Text>
          </View>
        </View>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>통화 종료</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  pageText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  localVideo: {
    width: 120,
    height: 160,
    marginRight: 10,
  },
  remoteVideo: {
    width: 240,
    height: 320,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoText: {
    color: '#fff',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  flipButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 5,
    margin: 20,
  },
  flipText: {
    fontSize: 14,
    color: 'white',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});