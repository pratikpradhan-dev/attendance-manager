import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import {
    calculateAttendance,
    classesNeededForTarget,
} from "../utils/attendance";

export default function SubjectCard({
    subject,
    onPresent,
    onAbsent,
    onPress,
}: any) {

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

    const isSafe =
        percentage >= subject.target;

    return (

        <TouchableOpacity

            onPress={onPress}

            activeOpacity={0.92}

            style={{
                backgroundColor: "#1c1c1f",

                padding: 24,

                borderRadius: 28,

                marginBottom: 22,

                borderWidth: 1,
                borderColor: "#2a2a2d",

                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 15,

                shadowOffset: {
                    width: 0,
                    height: 8,
                },

                elevation: 8,
            }}
        >

            {/* Subject Name */}

            <View>

                <Text
                    style={{
                        fontSize: 22,
                        color: "white",
                        lineHeight: 32,

                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    {subject.name}
                </Text>

                {/* Percentage */}

                <Text
                    style={{
                        fontSize: 34,

                        marginTop: 12,

                        color: isSafe
                            ? "#4ade80"
                            : "#f87171",

                        fontFamily:
                            "Inter_800ExtraBold",
                    }}
                >
                    {percentage}%
                </Text>

            </View>

            {/* Attendance Text */}

            <Text
                style={{
                    color: "#9ca3af",

                    marginTop: 10,

                    fontSize: 17,

                    fontFamily:
                        "Inter_400Regular",
                }}
            >
                {subject.attended}/
                {subject.total}
                {" "}classes attended
            </Text>

            {/* Progress Bar */}

            <View
                style={{
                    height: 12,

                    backgroundColor: "#2d2d2d",

                    borderRadius: 20,

                    marginTop: 22,

                    overflow: "hidden",
                }}
            >

                <View
                    style={{
                        width: `${percentage}%`,

                        height: "100%",

                        backgroundColor:
                            isSafe
                                ? "#4ade80"
                                : "#f87171",

                        borderRadius: 20,
                    }}
                />

            </View>

            {/* Warning */}

            {
                !isSafe && (

                    <Text
                        style={{
                            color: "#f87171",

                            marginTop: 14,

                            fontSize: 15,

                            fontFamily:
                                "Inter_500Medium",
                        }}
                    >
                        Attend {needed}
                        {" "}more classes
                    </Text>
                )
            }

            {/* Buttons */}

            <View
                style={{
                    flexDirection: "row",

                    marginTop: 24,

                    gap: 14,
                }}
            >

                {/* Present */}

                <TouchableOpacity

                    activeOpacity={0.85}

                    onPress={onPresent}

                    style={{
                        flex: 1,

                        backgroundColor: "#22c55e",

                        paddingVertical: 16,

                        borderRadius: 18,
                    }}
                >

                    <Text
                        style={{
                            color: "white",

                            textAlign: "center",

                            fontSize: 16,

                            fontFamily:
                                "Inter_700Bold",
                        }}
                    >
                        Present
                    </Text>

                </TouchableOpacity>

                {/* Absent */}

                <TouchableOpacity

                    activeOpacity={0.85}

                    onPress={onAbsent}

                    style={{
                        flex: 1,

                        backgroundColor: "#ef4444",

                        paddingVertical: 16,

                        borderRadius: 18,
                    }}
                >

                    <Text
                        style={{
                            color: "white",

                            textAlign: "center",

                            fontSize: 16,

                            fontFamily:
                                "Inter_700Bold",
                        }}
                    >
                        Absent
                    </Text>

                </TouchableOpacity>

            </View>

        </TouchableOpacity>
    );
}