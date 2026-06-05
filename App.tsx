import { useEffect } from "react";

import AppNavigator from "./src/navigation/AppNavigator";

import {
    initializeDatabase,
} from "./src/database/database";

import {
    useFonts,

    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,

} from "@expo-google-fonts/inter";

export default function App() {

    const [fontsLoaded] =
        useFonts({
            Inter_400Regular,
            Inter_500Medium,
            Inter_700Bold,
            Inter_800ExtraBold,
        });

    useEffect(() => {
        initializeDatabase();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return <AppNavigator />;
}