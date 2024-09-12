import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 아이콘 임포트

// 로딩 중 표시될 문구들
const loadingPhrases = [
  '오늘 밤 술잔 속에 우정을 담아요 🍻',
  '한 잔 마시고 한마디 나누는 중... 🗨️',
  '화면 너머로 건배해요! 🥂',
  '술자리 인증 준비 완료! 📸',
  '친구들과의 술자리, 로딩 중... ⏳',
  '오늘의 한잔 메이트 찾는 중... 🔍',
  '술자리 채팅방 개설 중... 💬',
  '화상 건배 준비하세요! 🎥🍾',
];

export default function LoadingPage() {
  const [phrase, setPhrase] = useState('');
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    async function prepare() {
      try {
        // 스플래시 스크린 유지
        await SplashScreen.preventAutoHideAsync();
        // 랜덤한 문구 선택
        setPhrase(
            loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)],
        );
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      // 페이드 인 애니메이션 시작
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(async () => {
        // 애니메이션 완료 후 스플래시 스크린 숨기기
        await SplashScreen.hideAsync();
      });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
      <View style={styles.container}>
        <Animated.View style={{opacity: fadeAnim}}>
          <Icon name="glass-cheers" size={80} color="#F9B300" />
        </Animated.View>
        <Animated.Text style={[styles.title, {opacity: fadeAnim}]}>
          한마디 한잔
        </Animated.Text>
        <Animated.Text style={[styles.phrase, {opacity: fadeAnim}]}>
          {phrase}
        </Animated.Text>
      </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // 배경색 유지
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  phrase: {
    fontSize: 18,
    color: '#F9B300',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});