import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    useCallback,
    useState,
} from "react";

import {
    getSubjects,
    markPresent,
    markAbsent,
} from "../database/database";

import SubjectCard from "../components/SubjectCard";

import {
    Ionicons,
} from "@expo/vector-icons";

export default function DashboardScreen({
    navigation,
}: any) {

    const [subjects, setSubjects] =
        useState<any[]>([]);

    const loadSubjects = async () => {

        const data: any =
            await getSubjects();

        setSubjects(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadSubjects();
        }, [])
    );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
                paddingHorizontal: 20,
                paddingTop: 75,
            }}
        >

            {/* Header */}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30,
                }}
            >

                <View>

                    <Text
                        style={{
                            fontSize: 44,
                            color: "white",
                            letterSpacing: 1,
                            fontFamily:
                                "Inter_800ExtraBold",
                        }}
                    >
                        Attendance
                    </Text>

                    <Text
                        style={{
                            color: "#888",
                            fontSize: 17,
                            marginTop: 6,
                            letterSpacing: 0.5,
                            fontFamily:
                                "Inter_400Regular",
                        }}
                    >
                        Track your classes efficiently
                    </Text>

                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 20,
                    }}
                >

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "Analytics"
                            )
                        }
                    >

                        <Ionicons
                            name="bar-chart-outline"
                            size={30}
                            color="#3b82f6"
                        />

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "Settings"
                            )
                        }
                    >

                        <Ionicons
                            name="settings-outline"
                            size={30}
                            color="#9ca3af"
                        />

                    </TouchableOpacity>

                </View>

            </View>

            {/* Subject List */}

            <FlatList
                data={subjects}

                keyExtractor={(item) =>
                    item.id.toString()
                }

                renderItem={({ item }) => (
                    <SubjectCard
                        subject={item}

                        onPresent={async () => {

                            const success =
                                await markPresent(
                                    item.id
                                );

                            if (!success) {

                                Alert.alert(
                                    "Attendance Exists",
                                    "Attendance already recorded today."
                                );

                                return;
                            }

                            loadSubjects();
                        }}

                        onAbsent={async () => {

                            const success =
                                await markAbsent(
                                    item.id
                                );

                            if (!success) {

                                Alert.alert(
                                    "Attendance Exists",
                                    "Attendance already recorded today."
                                );

                                return;
                            }

                            loadSubjects();
                        }}

                        onPress={() =>
                            navigation.navigate(
                                "SubjectDetail",
                                {
                                    subject: item,
                                }
                            )
                        }
                    />
                )}

                showsVerticalScrollIndicator={
                    false
                }

                contentContainerStyle={{
                    paddingBottom: 260,
                }}
            />

            {/* Floating Button */}

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(
                        "AddSubject"
                    )
                }

                style={{
                    position: "absolute",

                    bottom: 55,
                    right: 30,

                    width: 72,
                    height: 72,

                    backgroundColor: "#3b82f6",

                    borderRadius: 100,

                    justifyContent: "center",
                    alignItems: "center",

                    elevation: 8,

                    shadowColor: "#3b82f6",
                    shadowOpacity: 0.4,
                    shadowRadius: 12,

                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },

                    transform: [
                        {
                            scale: 1,
                        },
                    ],
                }}
            >

                <Ionicons
                    name="add"
                    size={38}
                    color="white"
                />

            </TouchableOpacity>

        </View>
    );
}