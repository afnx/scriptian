import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Animated to silence warnings
jest.mock('react-native/Libraries/Animated/AnimatedImplementation', () => 'Animated');

// Additional React Native mocks for Expo
jest.mock('expo-constants', () => ({
    default: {
        deviceId: 'test-device-id',
        experienceUrl: 'exp://test.com',
    },
}));