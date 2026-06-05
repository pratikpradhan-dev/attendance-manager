import {
    View,
    Text,
    ScrollView,
} from "react-native";

import {
    useState,
    useCallback,
} from "react";

import {
    useFocusEffect,
} from "@react-navigation/native";

import {
    getAnalyticsData,
} from "../database/database";

import {
    classesNeededForTarget,
} from "../utils/attendance";

export default function AnalyticsScreen() {

    const [analytics, setAnalytics] =
        useState<any>(null);

    const loadAnalytics =
        async () => {

            const data =
                await getAnalyticsData();

            setAnalytics(data);
        };

    useFocusEffect(
        useCallback(() => {

            loadAnalytics();

        }, [])
    );

    if (!analytics) {

        return (

            <View
                style={{
                    flex: 1,
                    backgroundColor: "#0f0f10",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

                <Text
                    style={{
                        color: "white",
                        fontSize: 18,
                    }}
                >
                    Loading...
                </Text>

            </View>
        );
    }

    return (

        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#0f0f10",
            }}

            contentContainerStyle={{
                padding: 24,
                paddingTop: 80,
                paddingBottom: 50,
            }}
        >

            <Text
                style={{
                    color: "white",
                    fontSize: 40,
                    fontFamily:
                        "Inter_800ExtraBold",
                    marginBottom: 30,
                }}
            >
                Analytics
            </Text>

            {/* Attendance Overview */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    📊 Attendance Overview
                </Text>

                {
                    analytics.rankings?.map(
                        (
                            subject: any
                        ) => {

                            const percentage =
                                subject.total === 0
                                    ? 0
                                    : Math.round(
                                        (
                                            subject.attended /
                                            subject.total
                                        ) * 100
                                    );

                            return (

                                <View
                                    key={subject.id}

                                    style={{
                                        marginTop: 18,
                                    }}
                                >

                                    <View
                                        style={{
                                            flexDirection:
                                                "row",

                                            justifyContent:
                                                "space-between",

                                            marginBottom: 8,
                                        }}
                                    >

                                        <Text
                                            style={{
                                                color:
                                                    "white",

                                                fontSize:
                                                    16,

                                                fontFamily:
                                                    "Inter_600SemiBold",
                                            }}
                                        >
                                            {subject.name}
                                        </Text>

                                        <Text
                                            style={{
                                                color:
                                                    percentage >=
                                                        subject.target
                                                        ? "#4ade80"
                                                        : "#f87171",

                                                fontSize:
                                                    16,

                                                fontFamily:
                                                    "Inter_700Bold",
                                            }}
                                        >
                                            {percentage}%
                                        </Text>

                                    </View>

                                    <View
                                        style={{
                                            height: 12,

                                            backgroundColor:
                                                "#2a2a2d",

                                            borderRadius:
                                                20,

                                            overflow:
                                                "hidden",
                                        }}
                                    >

                                        <View
                                            style={{
                                                width:
                                                    `${percentage}%`,

                                                height:
                                                    "100%",

                                                backgroundColor:
                                                    percentage >=
                                                        subject.target
                                                        ? "#4ade80"
                                                        : "#f87171",

                                                borderRadius:
                                                    20,
                                            }}
                                        />

                                    </View>

                                </View>
                            );
                        }
                    )
                }

            </View>

            {/* Overall Attendance */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    Overall Attendance
                </Text>

                <Text
                    style={{
                        color: "#4ade80",
                        fontSize: 48,
                        fontFamily:
                            "Inter_800ExtraBold",
                        marginTop: 8,
                    }}
                >
                    {
                        analytics
                            .overallAttendance
                    }
                    %
                </Text>

            </View>

            {/* Best Subject */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    Best Subject
                </Text>

                <Text
                    style={valueStyle}
                >
                    {
                        analytics
                            .bestSubject
                            ?.name ||
                        "N/A"
                    }
                </Text>

            </View>

            {/* Needs Attention */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    Needs Attention
                </Text>

                {
                    analytics
                        .needsAttention
                        .length === 0 ? (

                        <Text
                            style={{
                                color: "#4ade80",
                                fontSize: 20,
                                fontFamily:
                                    "Inter_700Bold",
                            }}
                        >
                            All Subjects Safe ✅
                        </Text>

                    ) : (

                        analytics
                            .needsAttention
                            .map(
                                (
                                    subject: any
                                ) => {

                                    const percentage =
                                        subject.total === 0
                                            ? 0
                                            : (
                                                (
                                                    subject.attended /
                                                    subject.total
                                                ) * 100
                                            ).toFixed(1);

                                    const needed =
                                        classesNeededForTarget(
                                            subject.attended,
                                            subject.total,
                                            subject.target
                                        );

                                    return (

                                        <View
                                            key={subject.id}

                                            style={{
                                                marginTop: 18,

                                                paddingBottom: 14,

                                                borderBottomWidth: 1,

                                                borderBottomColor:
                                                    "#2a2a2d",
                                            }}
                                        >

                                            <View
                                                style={{
                                                    flexDirection: "row",

                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        color: "white",

                                                        fontSize: 18,

                                                        fontFamily:
                                                            "Inter_600SemiBold",
                                                    }}
                                                >
                                                    {subject.name}
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: "#f87171",

                                                        fontSize: 18,

                                                        fontFamily:
                                                            "Inter_700Bold",
                                                    }}
                                                >
                                                    {percentage}%
                                                </Text>

                                            </View>

                                            <Text
                                                style={{
                                                    color: "#fbbf24",

                                                    marginTop: 6,

                                                    fontSize: 15,
                                                }}
                                            >
                                                Attend {needed}
                                                {" "}more class
                                                {needed !== 1 ? "es" : ""}
                                                {" "}to reach
                                                {" "}{subject.target}%
                                            </Text>

                                        </View>
                                    );
                                }
                            )
                    )
                }

            </View>

            {/* Present */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    Total Present
                </Text>

                <Text
                    style={{
                        color: "#4ade80",
                        fontSize: 34,
                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    {
                        analytics
                            .totalPresent
                    }
                </Text>

            </View>

            {/* Absent */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    Total Absent
                </Text>

                <Text
                    style={{
                        color: "#f87171",
                        fontSize: 34,
                        fontFamily:
                            "Inter_700Bold",
                    }}
                >
                    {
                        analytics
                            .totalAbsent
                    }
                </Text>

            </View>

            {/* Subject Rankings */}

            <View
                style={cardStyle}
            >

                <Text
                    style={labelStyle}
                >
                    🏆 Subject Rankings
                </Text>

                {
                    analytics.rankings
                        ?.map(
                            (
                                subject: any,
                                index: number
                            ) => {

                                const percentage =
                                    subject.total === 0
                                        ? 0
                                        : (
                                            (
                                                subject.attended /
                                                subject.total
                                            ) * 100
                                        ).toFixed(1);

                                return (

                                    <View
                                        key={
                                            subject.id
                                        }

                                        style={{
                                            flexDirection:
                                                "row",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "center",

                                            marginTop: 16,

                                            paddingBottom:
                                                12,

                                            borderBottomWidth:
                                                1,

                                            borderBottomColor:
                                                "#2a2a2d",
                                        }}
                                    >

                                        <Text
                                            style={{
                                                color:
                                                    "white",

                                                fontSize:
                                                    18,
                                            }}
                                        >
                                            {index + 1}.
                                            {" "}
                                            {
                                                subject.name
                                            }
                                        </Text>

                                        <Text
                                            style={{
                                                color:
                                                    "#4ade80",

                                                fontSize:
                                                    18,

                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {
                                                percentage
                                            }
                                            %
                                        </Text>

                                    </View>
                                );
                            }
                        )
                }

            </View>

        </ScrollView>
    );
}



const cardStyle = {
    backgroundColor: "#1c1c1f",

    borderRadius: 28,

    padding: 24,

    marginBottom: 20,

    borderWidth: 1,

    borderColor: "#2a2a2d",
};

const labelStyle = {
    color: "#9ca3af",

    fontSize: 16,

    marginBottom: 8,
};

const valueStyle = {
    color: "white",

    fontSize: 30,

    fontFamily:
        "Inter_700Bold",
};

