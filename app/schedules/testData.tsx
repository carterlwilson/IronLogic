export type Activity = {
    title: string;
    groupId: string;
    reps: number;
};

export type Day = {
    title: string;
    activities: Activity[];
};

export type Week = {
    title: string;
    days: Day[];
    goalReps: number;
};

export type Block = {
    title: string;
    weeks: Week[];
    groups: TargetGroup[];
};

export type TargetGroup = {
    name: string;
    id: string;
    percentage: number;
}

export type ActualGroup = {
    name: string;
    id: string;
    targetPercentage: number;
    actualPercentage: number;
}

export const blockGroups: TargetGroup[] = [
    {
        name: "Snatch",
        id: "1",
        percentage: 25
    },
    {
        name: "Clean and Jerk",
        id: "2",
        percentage: 25
    },
    {
        name: "Push Press",
        id: "3",
        percentage: 25
    },
    {
        name: "Squat",
        id: "4",
        percentage: 25
    }
]
export const testBlocks: Block[] = [
    {
        title: "Block 1",
        weeks: [
            {
                title: "Week 1",
                days: [
                    {
                        title: "Day 1",
                        activities: [
                            {
                                title: "Snatch",
                                groupId: "1",
                                reps: 5
                            },
                            {
                                title: "Clean and Jerk",
                                groupId: "2",
                                reps: 5
                            },
                            {
                                title: "Front Squat",
                                groupId: "4",
                                reps: 5
                            },
                            {
                                title: "Back Squat",
                                groupId: "4",
                                reps: 5
                            }
                        ]
                    },
                    {
                        title: "Day 2",
                        activities: [
                            {
                                title: "Snatch",
                                groupId: "1",
                                reps: 5
                            },
                            {
                                title: "Clean and Jerk",
                                groupId: "2",
                                reps: 5
                            },
                            {
                                title: "Front Squat",
                                groupId: "4",
                                reps: 5
                            },
                            {
                                title: "Back Squat",
                                groupId: "4",
                                reps: 5
                            }
                        ]
                    }
                ],
                goalReps: 100
            }
        ],
        groups: blockGroups
    }
];