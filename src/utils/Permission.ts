import { Platform } from 'react-native';
import {
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export async function requestAppPermissions() {
  try {
    if (Platform.OS === 'android') {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ]);

      console.log('Permission results:', result);
    } else {
      const result = await requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ]);
      console.log('Permission results:', result);
    }
  } catch (error) {
    console.warn('Permission request error:', error);
  }
}
