import { Platform } from 'react-native';
<<<<<<< HEAD
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
=======
import {
  requestMultiple,
  PERMISSIONS,
} from 'react-native-permissions';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

export async function requestAppPermissions() {
  try {
    if (Platform.OS === 'android') {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ]);
      console.log('Permission results:', result);
    } else {
      const result = await requestMultiple([
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      ]);
      console.log('Permission results:', result);
    }
  } catch (error) {
    console.warn('Permission request error:', error);
  }
}
