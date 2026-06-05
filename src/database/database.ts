import * as SQLite from "expo-sqlite";
import { Subject } from "../types/Subject";

const db = SQLite.openDatabaseSync("attendance.db");

export const initializeDatabase = async () => {

    try {

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            attended INTEGER NOT NULL,
            total INTEGER NOT NULL,
            target INTEGER NOT NULL
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS attendance_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL
          );
        `);

        console.log("Database initialized");

    } catch (error) {

        console.log(
            "Database error:",
            error
        );
    }
};

export const addSubject = async (
    subject: Subject
) => {

    try {

        await db.runAsync(
            `
      INSERT INTO subjects
      (name, attended, total, target)
      VALUES (?, ?, ?, ?)
      `,
            [
                subject.name,
                subject.attended,
                subject.total,
                subject.target,
            ]
        );

        console.log("Subject added");

    } catch (error) {
        console.log("Add subject error:", error);
    }
};

export const getSubjects = async () => {

    try {

        const result = await db.getAllAsync(`
      SELECT * FROM subjects
    `);

        return result;

    } catch (error) {

        console.log("Get subjects error:", error);

        return [];
    }
};

export const addAttendanceLog = async (
    subjectId: number,
    status: string
) => {

    try {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        await db.runAsync(
            `
            INSERT INTO attendance_logs
            (subject_id, status, date)
            VALUES (?, ?, ?)
            `,
            [
                subjectId,
                status,
                today,
            ]
        );

    } catch (error) {

        console.log(
            "Attendance log error:",
            error
        );
    }
};

export const getAttendanceLogs =
    async (subjectId: number) => {

        try {

            const result =
                await db.getAllAsync(
                    `
                    SELECT * FROM attendance_logs
                    WHERE subject_id = ?
                    ORDER BY id DESC
                    `,
                    [subjectId]
                );

            return result;

        } catch (error) {

            console.log(
                "Get logs error:",
                error
            );

            return [];
        }
    };

export const attendanceAlreadyMarkedToday =
    async (
        subjectId: number
    ) => {

        try {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            const result =
                await db.getFirstAsync(
                    `
                    SELECT *
                    FROM attendance_logs
                    WHERE
                        subject_id = ?
                        AND date = ?
                    `,
                    [
                        subjectId,
                        today,
                    ]
                );

            return !!result;

        } catch (error) {

            console.log(
                "Check attendance error:",
                error
            );

            return false;
        }
    };

export const markPresent = async (
    id: number
) => {

    try {

        const alreadyMarked =
            await attendanceAlreadyMarkedToday(
                id
            );

        if (
            alreadyMarked
        ) {
            return false;
        }

        await db.runAsync(
            `
            UPDATE subjects
            SET attended = attended + 1,
                total = total + 1
            WHERE id = ?
            `,
            [id]
        );

        await addAttendanceLog(
            id,
            "Present"
        );

        return true;

    } catch (error) {

        console.log(
            "Mark present error:",
            error
        );

        return false;
    }
};

export const markAbsent = async (
    id: number
) => {

    try {

        const alreadyMarked =
            await attendanceAlreadyMarkedToday(
                id
            );

        if (
            alreadyMarked
        ) {
            return false;
        }

        await db.runAsync(
            `
            UPDATE subjects
            SET total = total + 1
            WHERE id = ?
            `,
            [id]
        );

        await addAttendanceLog(
            id,
            "Absent"
        );

        return true;

    } catch (error) {

        console.log(
            "Mark absent error:",
            error
        );

        return false;
    }
};

export const deleteSubject = async (
    subjectId: number
) => {

    try {

        // Delete logs first

        await db.runAsync(
            `
            DELETE FROM attendance_logs
            WHERE subject_id = ?
            `,
            [subjectId]
        );

        // Delete subject

        await db.runAsync(
            `
            DELETE FROM subjects
            WHERE id = ?
            `,
            [subjectId]
        );

    } catch (error) {

        console.log(
            "Delete subject error:",
            error
        );
    }
};

export const getLastAttendanceLog = async (
    subjectId: number
) => {

    try {

        const result =
            await db.getFirstAsync(
                `
                SELECT *
                FROM attendance_logs
                WHERE subject_id = ?
                ORDER BY id DESC
                LIMIT 1
                `,
                [subjectId]
            );

        return result;

    } catch (error) {

        console.log(
            "Get last log error:",
            error
        );

        return null;
    }
};

export const deleteAttendanceLog =
    async (
        logId: number,
        subjectId: number,
        status: string
    ) => {

        try {

            if (
                status === "Present"
            ) {

                await db.runAsync(
                    `
                    UPDATE subjects
                    SET attended = attended - 1,
                        total = total - 1
                    WHERE id = ?
                    `,
                    [subjectId]
                );

            } else {

                await db.runAsync(
                    `
                    UPDATE subjects
                    SET total = total - 1
                    WHERE id = ?
                    `,
                    [subjectId]
                );
            }

            await db.runAsync(
                `
                DELETE FROM attendance_logs
                WHERE id = ?
                `,
                [logId]
            );

        } catch (error) {

            console.log(
                "Delete log error:",
                error
            );
        }
    };

export const undoLastAttendance = async (
    subjectId: number
) => {

    try {

        const log: any =
            await getLastAttendanceLog(
                subjectId
            );

        if (!log) {
            return false;
        }

        if (
            log.status === "Present"
        ) {

            await db.runAsync(
                `
                UPDATE subjects
                SET attended = attended - 1,
                    total = total - 1
                WHERE id = ?
                `,
                [subjectId]
            );

        } else {

            await db.runAsync(
                `
                UPDATE subjects
                SET total = total - 1
                WHERE id = ?
                `,
                [subjectId]
            );
        }

        await db.runAsync(
            `
    DELETE FROM attendance_logs
    WHERE id = ?
    `,
            [log.id]
        );

        return true;

    } catch (error) {

        console.log(
            "Undo attendance error:",
            error
        );

        return false;
    }
};

export const updateSubject = async (
    subjectId: number,
    name: string,
    attended: number,
    total: number,
    target: number
) => {

    try {

        await db.runAsync(
            `
            UPDATE subjects
            SET
                name = ?,
                attended = ?,
                total = ?,
                target = ?
            WHERE id = ?
            `,
            [
                name,
                attended,
                total,
                target,
                subjectId,
            ]
        );

    } catch (error) {

        console.log(
            "Update subject error:",
            error
        );
    }
};

export const getAnalyticsData = async () => {

    try {

        const subjects: any =
            await getSubjects();

        if (
            subjects.length === 0
        ) {

            return {
                overallAttendance: 0,
                bestSubject: null,
                weakestSubject: null,
                totalPresent: 0,
                totalAbsent: 0,
            };
        }

        let totalPresent = 0;
        let totalClasses = 0;

        let bestSubject =
            subjects[0];

        let weakestSubject =
            subjects[0];

        subjects.forEach(
            (subject: any) => {

                totalPresent +=
                    subject.attended;

                totalClasses +=
                    subject.total;

                const current =
                    subject.total === 0
                        ? 0
                        : (
                            subject.attended /
                            subject.total
                        ) * 100;

                const best =
                    bestSubject.total === 0
                        ? 0
                        : (
                            bestSubject.attended /
                            bestSubject.total
                        ) * 100;

                const weakest =
                    weakestSubject.total === 0
                        ? 0
                        : (
                            weakestSubject.attended /
                            weakestSubject.total
                        ) * 100;

                if (
                    current > best
                ) {
                    bestSubject =
                        subject;
                }

                if (
                    current < weakest
                ) {
                    weakestSubject =
                        subject;
                }
            }
        );

        const needsAttention =
            subjects.filter(
                (subject: any) => {

                    const percentage =
                        subject.total === 0
                            ? 0
                            : (
                                subject.attended /
                                subject.total
                            ) * 100;

                    return (
                        percentage <
                        subject.target
                    );
                }
            );

        const rankings =
            [...subjects].sort(
                (
                    a: any,
                    b: any
                ) => {

                    const percentageA =
                        a.total === 0
                            ? 0
                            : (
                                a.attended /
                                a.total
                            ) * 100;

                    const percentageB =
                        b.total === 0
                            ? 0
                            : (
                                b.attended /
                                b.total
                            ) * 100;

                    return (
                        percentageB -
                        percentageA
                    );
                }
            );

        return {

            overallAttendance:
                totalClasses === 0
                    ? 0
                    : (
                        (
                            totalPresent /
                            totalClasses
                        ) * 100
                    ).toFixed(1),

            bestSubject,
            weakestSubject,
            needsAttention,
            rankings,
            totalPresent,
            totalAbsent:
                totalClasses -
                totalPresent,
        };

    } catch (error) {

        console.log(
            "Analytics error:",
            error
        );

        return null;
    }
};

export const updateAttendanceLog =
    async (
        logId: number,
        subjectId: number,
        oldStatus: string,
        newStatus: string
    ) => {

        try {

            if (
                oldStatus === newStatus
            ) return;

            if (
                oldStatus ===
                "Present" &&
                newStatus ===
                "Absent"
            ) {

                await db.runAsync(
                    `
                    UPDATE subjects
                    SET attended =
                        attended - 1
                    WHERE id = ?
                    `,
                    [subjectId]
                );
            }

            if (
                oldStatus ===
                "Absent" &&
                newStatus ===
                "Present"
            ) {

                await db.runAsync(
                    `
                    UPDATE subjects
                    SET attended =
                        attended + 1
                    WHERE id = ?
                    `,
                    [subjectId]
                );
            }

            await db.runAsync(
                `
                UPDATE attendance_logs
                SET status = ?
                WHERE id = ?
                `,
                [
                    newStatus,
                    logId,
                ]
            );

        } catch (error) {

            console.log(
                "Update log error:",
                error
            );
        }
    };

export const getSubjectById = async (
    subjectId: number
) => {

    try {

        const result =
            await db.getFirstAsync(
                `
                SELECT *
                FROM subjects
                WHERE id = ?
                `,
                [subjectId]
            );

        return result;

    } catch (error) {

        console.log(
            "Get subject error:",
            error
        );

        return null;
    }
};

export const resetSemester = async () => {

    try {

        await db.runAsync(`
            DELETE FROM attendance_logs
        `);

        await db.runAsync(`
            DELETE FROM subjects
        `);

        return true;

    } catch (error) {

        console.log(
            "Reset semester error:",
            error
        );

        return false;
    }
};

export const getAllAttendanceLogs =
    async () => {

        try {

            const result =
                await db.getAllAsync(
                    `
                    SELECT *
                    FROM attendance_logs
                    `
                );

            return result;

        } catch (error) {

            console.log(
                "Get all logs error:",
                error
            );

            return [];
        }
    };

export const getBackupData =
    async () => {

        try {

            const subjects =
                await getSubjects();

            const logs =
                await getAllAttendanceLogs();

            return {
                subjects,
                attendance_logs:
                    logs,
            };

        } catch (error) {

            console.log(
                "Backup data error:",
                error
            );

            return null;
        }
    };

export default db;