import { SplashScreen } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenController() {
    const authContext = useContext(AuthContext);

    if (!authContext.isLoading) {
        SplashScreen.hide();
    }

    return null;
}
