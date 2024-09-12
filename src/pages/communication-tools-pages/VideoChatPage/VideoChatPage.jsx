import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

export default function VideoChatPage({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState('front');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageText}>영상통화 페이지</Text>
      <View style={styles.videoContainer}>
        <Camera style={styles.localVideo} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}>
              <Text style={styles.flipText}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
        <View style={styles.remoteVideo}>
          <Text>상대방 화면</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>홈으로</Text>
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
    width: 100,
    height: 150,
    marginRight: 10,
  },
  remoteVideo: {
    width: 200,
    height: 300,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flipButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin: 20,
  },
  flipText: {
    fontSize: 18,
    color: 'white',
  },
  Button: {
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
