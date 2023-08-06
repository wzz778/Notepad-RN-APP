import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = async (key: string, value: string) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const load = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
