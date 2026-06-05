import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import {
    addSubject,
} from "../database/database";

export default function AddSubjectScreen({
    navigation,
}: any) {

    const [name, setName] =
        useState("");

    const [target, setTarget] =
        useState("75");

    const handleAddSubject =
        async () => {

            if (!name.trim()) {

                Alert.alert(
                    "Error",
                    "Please enter subject name"
                );

                return;
            }

            await addSubject({
                name,
                attended: 0,
                total: 0,
                target: Number(target),
            });

            Alert.alert(
                "Success",
                "Subject Added"
            );

            navigation.goBack();
        };

    return (

        <KeyboardAvoidingView
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }

            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
            }}
        >

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingTop: 90,
                }}
            >

                {/* Header */}

                <View
                    style={{
                        marginBottom: 45,
                    }}
                >

                    <Text
                        style={{
                            fontSize: 42,
                            color: "white",
                            fontFamily:
                                "Inter_800ExtraBold",
                        }}
                    >
                        Add Subject
                    </Text>

                    <Text
                        style={{
                            color: "#7c7c7c",
                            fontSize: 17,
                            marginTop: 8,
                            fontFamily:
                                "Inter_400Regular",
                        }}
                    >
                        Create a new attendance tracker
                    </Text>

                </View>

                {/* Subject Name */}

                <TextInput
                    placeholder="Subject Name"

                    placeholderTextColor="#666"

                    value={name}

                    onChangeText={setName}

                    style={{
                        backgroundColor: "#1c1c1f",

                        color: "white",

                        paddingVertical: 22,
                        paddingHorizontal: 20,

                        borderRadius: 22,

                        marginBottom: 22,

                        fontSize: 18,

                        borderWidth: 1,
                        borderColor: "#2a2a2d",

                        fontFamily:
                            "Inter_500Medium",
                    }}
                />

                {/* Target Attendance */}

                <TextInput
                    placeholder="Target Attendance"

                    placeholderTextColor="#666"

                    value={target}

                    onChangeText={setTarget}

                    keyboardType="numeric"

                    style={{
                        backgroundColor: "#1c1c1f",

                        color: "white",

                        paddingVertical: 22,
                        paddingHorizontal: 20,

                        borderRadius: 22,

                        marginBottom: 35,

                        fontSize: 18,

                        borderWidth: 1,
                        borderColor: "#2a2a2d",

                        fontFamily:
                            "Inter_500Medium",
                    }}
                />

                {/* Save Button */}

                <TouchableOpacity
                    onPress={handleAddSubject}

                    activeOpacity={0.85}

                    style={{
                        backgroundColor: "#2563eb",

                        paddingVertical: 22,

                        borderRadius: 24,

                        shadowColor: "#2563eb",

                        shadowOpacity: 0.35,

                        shadowRadius: 12,

                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },

                        elevation: 10,
                    }}
                >

                    <Text
                        style={{
                            color: "white",

                            textAlign: "center",

                            fontSize: 18,

                            fontFamily:
                                "Inter_700Bold",
                        }}
                    >
                        Save Subject
                    </Text>

                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}