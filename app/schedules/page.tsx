"use client"

import { Accordion, Box, Button, Container, Flex, NumberInput, Table, Title, Text } from "@mantine/core"
import React from "react";
import { useState } from "react";
import { Block, TargetGroup, ActualGroup, testBlocks, Week, blockGroups } from "./testData";

const SchedulesPage = () => {
    const [blocks, setBlocks] = useState<Block[]>(testBlocks);
    const addWeekToBlock = (index: number) => {
        const updatedBlocks = [...blocks];
        const newWeek = {
            title: `Week ${updatedBlocks[index].weeks.length + 1}`,
            days: [
                {
                    title: "Day 1",
                    activities: [
                        {
                            title: "Activity 1",
                            groupId: "1",
                            reps: 5
                        }
                    ],
                }
            ],
            goalReps: 100
        };
        updatedBlocks[index].weeks.push(newWeek);
        setBlocks(updatedBlocks);
    };

    const getActualGroupPercentages = (week: Week): ActualGroup[] => {
        // Initialize an object to store total reps for each group
        const groupTotalReps: { [key: string]: number } = {};

        // Calculate total reps for each group
        week.days.forEach(day => {
            day.activities.forEach(activity => {
                if (groupTotalReps[activity.groupId]) {
                    groupTotalReps[activity.groupId] += activity.reps;
                } else {
                    groupTotalReps[activity.groupId] = activity.reps;
                }
            });
        });

        // Calculate the total reps across all groups
        const totalReps = Object.values(groupTotalReps).reduce((sum, reps) => sum + reps, 0);

        // Create ActualGroup objects for each group
        const actualGroups: ActualGroup[] = blockGroups.map(group => {
            const groupReps = groupTotalReps[group.id] || 0;
            const actual: ActualGroup = {
                name: group.name,
                id: group.id,
                targetPercentage: group.percentage,
                actualPercentage: totalReps > 0 ? (groupReps / totalReps) * 100 : 0
            }
            return actual;
        });

        return actualGroups;
    };

    const updateActivityReps = (blockIndex: number, weekIndex: number, dayIndex: number, activityIndex: number, value: number) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[blockIndex].weeks[weekIndex].days[dayIndex].activities[activityIndex].reps = value;
        setBlocks(updatedBlocks);
    }

    const getTotalRepsForWeek = (week: Week): number => {
        return week.days.reduce((weekTotal, day) => {
            return weekTotal + day.activities.reduce((dayTotal, activity) => {
                return dayTotal + activity.reps;
            }, 0);
        }, 0);
    };



    return (
        <Container size="xl">
            <Title order={1} mb="md">Schedules</Title>
            <Accordion>
                {blocks.map((block, blockIndex) => (
                    <Accordion.Item key={blockIndex} value={block.title}>
                        <Accordion.Control>{block.title}</Accordion.Control>
                        <Accordion.Panel>
                            <Accordion>
                                <div>
                                    <Title order={3} mb="md">Target Volume Ratios</Title>
                                    <Table striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Group</Table.Th>
                                                <Table.Th>Percentage</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {block.groups.map((group) => (
                                                <Table.Tr key={group.id}>
                                                    <Table.Td>{group.name}</Table.Td>
                                                    <Table.Td>
                                                        <NumberInput
                                                            value={group.percentage}
                                                            onChange={(value) => {
                                                                // Handle percentage change
                                                                // You'll need to implement a function to update the group's percentage
                                                                // updateGroupPercentage(group.id, value);
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            style={{ width: '80px' }}
                                                        />
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                    <Title order={3} mb="md">Weeks</Title>
                                    <Button mb="md" onClick={() => {
                                        addWeekToBlock(blockIndex);
                                    }}>
                                        Add Week
                                    </Button>
                                    {block.weeks.map((week, weekIndex) => (
                                        <Accordion.Item key={weekIndex} value={week.title}>
                                            <Accordion.Control>{week.title}</Accordion.Control>
                                            <Accordion.Panel>
                                                <Flex direction="row" justify="space-between">
                                                    <Box style={{ width: '48%' }}>
                                                        <Flex direction="row" justify="space-between" align="center" mb="md">
                                                            <Flex align="center" gap="md">
                                                                <Text>Goal Reps:</Text>
                                                                <NumberInput
                                                                    value={week.goalReps}
                                                                    onChange={(value) => {
                                                                        // Implement a function to update the week's goal reps
                                                                        // updateWeekGoalReps(blockIndex, weekIndex, Number(value));
                                                                    }}
                                                                    min={0}
                                                                    style={{ width: '80px' }}
                                                                />
                                                            </Flex>
                                                            <Text>Actual Reps: {getTotalRepsForWeek(week)}</Text>
                                                        </Flex>

                                                        <Title order={4} mb="md">Activities</Title>         
                                                        <Table striped highlightOnHover withTableBorder>
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>Activity</Table.Th>
                                                                    <Table.Th>Reps</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                {week.days.map((day, dayIndex) => (
                                                                    <React.Fragment key={dayIndex}>
                                                                        <Table.Tr>
                                                                            <Table.Td colSpan={2}><strong>{day.title}</strong></Table.Td>
                                                                        </Table.Tr>
                                                                        {day.activities.map((activity, activityIndex) => (
                                                                            <Table.Tr key={`${dayIndex}-${activityIndex}`}>
                                                                                <Table.Td>{activity.title}</Table.Td>
                                                                                <Table.Td>
                                                                                    <NumberInput
                                                                                        value={activity.reps}
                                                                                        onChange={(value) => {
                                                                                            updateActivityReps(blockIndex, weekIndex, dayIndex, activityIndex, Number(value));
                                                                                        }}
                                                                                        min={0}
                                                                                        style={{ width: '80px' }}
                                                                                    />
                                                                                </Table.Td>
                                                                            </Table.Tr>
                                                                        ))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Table.Tbody>
                                                        </Table>
                                                    </Box>
                                                    <Box style={{ width: '48%' }}>
                                                        <Title order={4} mb="md">Percentages</Title>
                                                        <Table striped highlightOnHover withTableBorder>
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>Group</Table.Th>
                                                                    <Table.Th>Percentage</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                {getActualGroupPercentages(week).map((group) => (
                                                                    <Table.Tr key={group.id}>
                                                                        <Table.Td>{group.name}</Table.Td>
                                                                        <Table.Td>{group.actualPercentage.toFixed(1)}%</Table.Td>
                                                                        <Table.Td>
                                                                            {group.actualPercentage < group.targetPercentage ? (
                                                                                <span style={{ color: 'green' }}>▲ (target: {group.targetPercentage}%)</span>
                                                                            ) : group.actualPercentage > group.targetPercentage ? (
                                                                                <span style={{ color: 'red' }}>▼ (target: {group.targetPercentage}%)</span>
                                                                            ) : null}
                                                                        </Table.Td>
                                                                    </Table.Tr>
                                                                ))}
                                                            </Table.Tbody>
                                                        </Table>
                                                    </Box>
                                                </Flex>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    ))}
                                </div>
                            </Accordion>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    )
}

export default SchedulesPage;