export const calculateAttendance = (
    attended: number,
    total: number
) => {

    if (total === 0) {
        return 0;
    }

    return (
        (attended / total) * 100
    ).toFixed(1);
};

export const classesNeededForTarget = (
    attended: number,
    total: number,
    target: number
) => {

    let extraClasses = 0;

    while (
        (
            (
                attended + extraClasses
            ) /
            (
                total + extraClasses
            )
        ) * 100 < target
    ) {

        extraClasses++;
    }

    return extraClasses;
};

export const classesCanMiss = (
    attended: number,
    total: number,
    target: number
) => {

    let missedClasses = 0;

    while (
        (
            attended /
            (
                total +
                missedClasses +
                1
            )
        ) * 100 >= target
    ) {

        missedClasses++;
    }

    return missedClasses;
};