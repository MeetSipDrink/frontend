import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';  // app.json 파일에서 이름을 가져옵니다.

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// 'nativeCliTest'는 'app.json'에서 가져온 'name' 변수로 대체됩니다.
AppRegistry.registerComponent(appName, () => App);