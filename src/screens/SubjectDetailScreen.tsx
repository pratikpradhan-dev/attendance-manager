import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useEffect,
    useState,
    useCallback,
} from "react";

import {
    calculateAttendance,
    classesNeededForTarget,
    classesCanMiss,
} from "../utils/attendance";

import {
    getAttendanceLogs,
    deleteSubject,
    undoLastAttendance,
    updateAttendanceLog,
    deleteAttendanceLog,
    getSubjectById,
} from "../database/database";

export default function SubjectDetailScreen({
    route,
    navigation,
}: any) {

    const initialSubject =
        route.params.subject;

    const [subject, setSubject] =
        useState(initialSubject);

    const percentage = Number(
        calculateAttendance(
            subject.attended,
            subject.total
        )
    );

    const needed =
        classesNeededForTarget(
            subject.attended,
            subject.total,
            subject.target
        );

    const canMiss =
        classesCanMiss(
            subject.attended,
            subject.total,
            subject.target
        );

    const missed =
        subject.total - subject.attended;

    const isSafe =
        percentage >= subject.target;

    const [logs, setLogs] =
        useState<any[]>([]);

    const handleUndoLastAction =
        async () => {

            const success =
                await undoLastAttendance(
                    subject.id
                );

            if (success) {

                Alert.alert(
                    "Success",
                    "Last attendance action undone."
                );

                await loadLogs();
                await loadSubject();

            } else {

                Alert.alert(
                    "Nothing to Undo",
                    "No attendance records found."
                );
            }
        };

    const handleDeleteSubject = () => {

        Alert.alert(
            "Delete Subject",
            "This will delete the subject and all attendance history.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {

                        await deleteSubject(
                            subject.id
                        );

                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const loadSubject = async () => {
        const updatedSubject: any =
            await getSubjectById(
                subject.id
            );

        if (updatedSubject) {
            setSubject(updatedSubject);
        }
    };

    const loadLogs = useCallback(async () => {

        const data =
            await getAttendanceLogs(
                subject.id
            );

        setLogs(data);

    }, [subject.id]);

    useEffect(() => {

        loadLogs();

    }, [loadLogs]);

    return (

        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
            }}

            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 90,
                paddingBottom: 60,
            }}

            showsVerticalScrollIndicator={
                false
            }
        >

            {/* Subject Name */}

            <Text
                style={{
                    fontSize: 36,

                    color: "white",

                    lineHeight: 48,

                    fontFamily:
                        "Inter_800ExtraBold",
                }}
            >
                {subject.name}
            </Text>

            <View style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 12,
                gap: 20,
            }}
            >

                {/* Edit Button */}

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(
                            "EditSubject",
                            {
                                subject,
                            }
                        )
                    }
                >
                    <Ionicons
                        name="create-outline"
                        size={28}
                        color="#3b82f6"
                    />
                </TouchableOpacity>

                {/* Delete Button */}

                <TouchableOpacity
                    onPress={handleDeleteSubject}
                >
                    <Ionicons
                        name="trash-outline"
                        size={28}
                        color="#ef4444"
                    />
                </TouchableOpacity>

            </View>

            {/* Percentage */}

            <Text
                style={{
                    fontSize: 72,

                    marginTop: 30,

                    color: isSafe
                        ? "#4ade80"
                        : "#f87171",

                    fontFamily:
                        "Inter_800ExtraBold",
                }}
            >
                {percentage}%
            </Text>

            {/* Status */}

            <Text
                style={{
                    marginTop: 8,

                    fontSize: 18,

                    color: isSafe
                        ? "#4ade80"
                        : "#f87171",

                    fontFamily:
                        "Inter_700Bold",
                }}
            >
                {
                    isSafe
                        ? "Safe Attendance"
                        : "Low Attendance"
                }
            </Text>

            {/* Stats Card */}

            <View
                style={{
                    backgroundColor: "#1c1c1f",

                    marginTop: 40,

                    borderRadius: 28,

                    padding: 24,

                    borderWidth: 1,

                    borderColor: "#2a2a2d",
                }}
            >

                <DetailRow
                    label="Classes Attended"
                    value={subject.attended}
                />

                <DetailRow
                    label="Classes Missed"
                    value={missed}
                />

                <DetailRow
                    label="Total Classes"
                    value={subject.total}
                />

                <DetailRow
                    label="Target Attendance"
                    value={`${subject.target}%`}
                />

            </View>

            {/* Insights */}

            <View
                style={{
                    backgroundColor: "#1c1c1f",

                    marginTop: 24,

                    borderRadius: 28,

                    padding: 24,

                    borderWidth: 1,

                    borderColor: "#2a2a2d",
                }}
            >

                <Text
                    style={{
                        color: "white",

                        fontSize: 22,

                        marginBottom: 20,

                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    Insights
                </Text>

                {
                    isSafe ? (

                        <Text
                            style={{
                                color: "#4ade80",

                                fontSize: 18,

                                lineHeight: 30,

                                fontFamily:
                                    "Inter_500Medium",
                            }}
                        >
                            You can safely miss{" "}
                            {canMiss} more classes.
                        </Text>

                    ) : (

                        <Text
                            style={{
                                color: "#f87171",

                                fontSize: 18,

                                lineHeight: 30,

                                fontFamily:
                                    "Inter_500Medium",
                            }}
                        >
                            Attend {needed}
                            {" "}more classes to
                            reach {subject.target}%
                            attendance.
                        </Text>

                    )
                }

            </View>

            <View
                style={{
                    marginTop: 24,
                }}
            >

                <TouchableOpacity
                    onPress={
                        handleUndoLastAction
                    }

                    style={{
                        backgroundColor: "#2563eb",

                        paddingVertical: 18,

                        borderRadius: 20,

                        alignItems: "center",
                    }}
                >

                    <Text
                        style={{
                            color: "white",

                            fontSize: 17,

                            fontFamily:
                                "Inter_700Bold",
                        }}
                    >
                        ↩ Undo Last Action
                    </Text>

                </TouchableOpacity>

            </View>

            {/* Attendance History */}

            <View
                style={{
                    backgroundColor: "#1c1c1f",

                    marginTop: 24,

                    borderRadius: 28,

                    padding: 24,

                    borderWidth: 1,

                    borderColor: "#2a2a2d",
                }}
            >

                <Text
                    style={{
                        color: "white",

                        fontSize: 22,

                        marginBottom: 20,

                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    Attendance History
                </Text>

                {
                    logs.length === 0 ? (

                        <Text
                            style={{
                                color: "#888",

                                fontSize: 16,

                                fontFamily:
                                    "Inter_400Regular",
                            }}
                        >
                            No attendance records yet.
                        </Text>

                    ) : (

                        logs.map((log: any) => (

                            <TouchableOpacity
                                key={log.id}

                                onPress={() => {

                                    Alert.alert(
                                        "Attendance Entry",
                                        log.date,
                                        [
                                            {
                                                text: "Toggle Status",

                                                onPress: async () => {

                                                    await updateAttendanceLog(
                                                        log.id,
                                                        subject.id,
                                                        log.status,
                                                        log.status ===
                                                            "Present"
                                                            ? "Absent"
                                                            : "Present"
                                                    );

                                                    Alert.alert(
                                                        "Updated",
                                                        "Reopen this subject to refresh statistics."
                                                    );

                                                    await loadSubject();
                                                    await loadLogs();
                                                },
                                            },

                                            {
                                                text: "Delete Entry",

                                                style: "destructive",

                                                onPress: async () => {

                                                    await deleteAttendanceLog(
                                                        log.id,
                                                        subject.id,
                                                        log.status
                                                    );

                                                    Alert.alert(
                                                        "Updated",
                                                        "Reopen this subject to refresh statistics."
                                                    );

                                                    await loadSubject();
                                                    await loadLogs();
                                                },
                                            },

                                            {
                                                text: "Cancel",
                                                style: "cancel",
                                            },
                                        ]
                                    );
                                }}

                                style={{
                                    flexDirection: "row",

                                    justifyContent:
                                        "space-between",

                                    alignItems: "center",

                                    marginBottom: 18,

                                    paddingBottom: 12,

                                    borderBottomWidth: 1,

                                    borderBottomColor:
                                        "#2a2a2d",
                                }}
                            >

                                <Text
                                    style={{
                                        color: "white",

                                        fontSize: 16,

                                        fontFamily:
                                            "Inter_500Medium",
                                    }}
                                >
                                    {log.date}
                                </Text>

                                <Text
                                    style={{
                                        color:
                                            log.status ===
                                                "Present"
                                                ? "#4ade80"
                                                : "#f87171",

                                        fontSize: 16,

                                        fontFamily:
                                            "Inter_700Bold",
                                    }}
                                >
                                    {log.status}
                                </Text>

                            </TouchableOpacity>
                        ))
                    )
                }

            </View>

        </ScrollView>
    );
}

function DetailRow({
    label,
    value,
}: any) {

    return (

        <View
            style={{
                flexDirection: "row",

                justifyContent:
                    "space-between",

                marginBottom: 18,
            }}
        >

            <Text
                style={{
                    color: "#9ca3af",

                    fontSize: 17,

                    fontFamily:
                        "Inter_400Regular",
                }}
            >
                {label}
            </Text>

            <Text
                style={{
                    color: "white",

                    fontSize: 18,

                    fontFamily:
                        "Inter_700Bold",
                }}
            >
                {value}
            </Text>

        </View>
    );
}