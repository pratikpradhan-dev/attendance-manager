import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";

import { useState } from "react";

import {
    updateSubject,
} from "../database/database";

export default function EditSubjectScreen({
    route,
    navigation,
}: any) {

    const { subject } = route.params;

    const [name, setName] =
        useState(subject.name);

    const [target, setTarget] =
        useState(
            subject.target.toString()
        );

    const [attended, setAttended] =
        useState(
            subject.attended.toString()
        );

    const [total, setTotal] =
        useState(
            subject.total.toString()
        );

    const handleSave = async () => {

        if (
            !name.trim()
        ) {

            Alert.alert(
                "Error",
                "Subject name is required."
            );

            return;
        }

        const attendedNum =
            Number(attended);

        const totalNum =
            Number(total);

        const targetNum =
            Number(target);

        if (
            attendedNum > totalNum
        ) {

            Alert.alert(
                "Invalid Data",
                "Attended classes cannot exceed total classes."
            );

            return;
        }

        await updateSubject(
            subject.id,
            name,
            attendedNum,
            totalNum,
            targetNum
        );

        Alert.alert(
            "Success",
            "Subject updated successfully."
        );

        navigation.goBack();
    };

    return (

        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
            }}

            contentContainerStyle={{
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
                    marginBottom: 30,
                }}
            >
                Edit Subject
            </Text>

            <InputField
                label="Subject Name"
                value={name}
                onChangeText={setName}
            />

            <InputField
                label="Target Attendance %"
                value={target}
                onChangeText={setTarget}
                keyboardType="numeric"
            />

            <InputField
                label="Attended Classes"
                value={attended}
                onChangeText={setAttended}
                keyboardType="numeric"
            />

            <InputField
                label="Total Classes"
                value={total}
                onChangeText={setTotal}
                keyboardType="numeric"
            />

            <TouchableOpacity
                onPress={handleSave}
                style={{
                    backgroundColor:
                        "#2563eb",

                    paddingVertical: 18,

                    borderRadius: 20,

                    alignItems: "center",

                    marginTop: 20,
                }}
            >

                <Text
                    style={{
                        color: "white",
                        fontSize: 18,
                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    Save Changes
                </Text>

            </TouchableOpacity>

        </ScrollView>
    );
}

function InputField({
    label,
    value,
    onChangeText,
    keyboardType,
}: any) {

    return (

        <View
            style={{
                marginBottom: 20,
            }}
        >

            <Text
                style={{
                    color: "#9ca3af",
                    marginBottom: 8,
                    fontSize: 16,
                }}
            >
                {label}
            </Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                style={{
                    backgroundColor:
                        "#1c1c1f",

                    color: "white",

                    borderRadius: 18,

                    paddingHorizontal: 18,

                    paddingVertical: 16,

                    borderWidth: 1,

                    borderColor:
                        "#2a2a2d",
                }}
            />

        </View>
    );
}