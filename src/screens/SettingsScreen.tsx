import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";

import {
    resetSemester,
} from "../database/database";

export default function SettingsScreen({
    navigation,
}: any) {

    const handleReset = () => {

        Alert.alert(
            "Reset Semester",
            "This will permanently delete all subjects and attendance history.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Reset",
                    style: "destructive",

                    onPress: async () => {

                        const success =
                            await resetSemester();

                        if (success) {

                            Alert.alert(
                                "Success",
                                "Semester data cleared."
                            );

                            navigation.goBack();
                        }
                    },
                },
            ]
        );
    };

    return (

        <View
            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
                padding: 24,
                paddingTop: 80,
            }}
        >

            <Text
                style={{
                    color: "white",
                    fontSize: 36,
                    fontFamily:
                        "Inter_800ExtraBold",
                    marginBottom: 40,
                }}
            >
                Settings
            </Text>

            <TouchableOpacity
                onPress={handleReset}

                style={{
                    backgroundColor: "#ef4444",
                    padding: 20,
                    borderRadius: 20,
                }}
            >

                <Text
                    style={{
                        color: "white",
                        fontSize: 18,
                        textAlign: "center",
                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    Reset Semester
                </Text>

            </TouchableOpacity>

        </View>
    );
}