"use client"

import { Accordion, Box, Button, Container, Flex, NumberInput, Table, Title, Text, ActionIcon, Modal, Select, Group } from "@mantine/core"
import React from "react";
import { useState } from "react";
import { Block, TargetGroup, ActualGroup, testBlocks, Week, blockGroups, Day, testActivityTemplates, Activity } from "./testData";
import { IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

const SchedulesPage = () => {
    const [blocks, setBlocks] = useState<Block[]>(testBlocks);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
    const [selectedBlockForActivity, setSelectedBlockForActivity] = useState<number | null>(null);
    const [selectedWeekForActivity, setSelectedWeekForActivity] = useState<number | null>(null);
    const [selectedDayForActivity, setSelectedDayForActivity] = useState<number | null>(null);

    const [isAddActivityModalOpen, { open: openAddActivityModal, close: closeAddActivityModal }] = useDisclosure(false);


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

    const addNewBlock = () => {
        if (blocks.length > 0) {
            var newBlock = {...blocks[blocks.length - 1]};
            newBlock.title = `Block ${blocks.length + 1}`;
            newBlock.weeks = blocks[blocks.length - 1].weeks;
            setBlocks([...blocks, newBlock]);
        } else {
            const newWeeks: Week[] = [1, 2, 3, 4].map((weekNumber) => {
                const newWeek: Week = {
                    title: `Week ${weekNumber}`,
                    days: [],
                    goalReps: 0
                }
                return newWeek;
            })
            var newBlock: Block = {
                title: `Block ${blocks.length + 1}`,
                weeks: newWeeks,
                groups: blockGroups
            };
        }
        setBlocks([...blocks, newBlock]);
    };

    const addNewDay = (blockIndex: number, weekIndex: number) => {
        const updatedBlocks = [...blocks];
        const daysLength = updatedBlocks[blockIndex].weeks[weekIndex].days.length;
        if (daysLength > 0) {
            var newDay = {...blocks[blockIndex].weeks[weekIndex].days[daysLength - 1]};
            newDay.title = `Day ${updatedBlocks[blockIndex].weeks[weekIndex].days.length + 1}`;
        } else {
            var newDay: Day = {
                title: "Day 1",
                activities: [],
            }
        }
        updatedBlocks[blockIndex].weeks[weekIndex].days.push(newDay);
        setBlocks(updatedBlocks);
    }

    const deleteActivity = (blockIndex: number, weekIndex: number, dayIndex: number, activityIndex: number) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[blockIndex].weeks[weekIndex].days[dayIndex].activities.splice(activityIndex, 1);
        setBlocks(updatedBlocks);
    }

    const handleAddActivity = () => {
        if (selectedActivityId) {
            const selectedTemplate = testActivityTemplates.find(template => template.id === selectedActivityId);
            if (selectedTemplate) {
                const newActivity: Activity = {
                    title: selectedTemplate.title,
                    groupId: selectedTemplate.groupId,
                    reps: 0
                }
                const updatedBlocks = [...blocks];
                if (selectedBlockForActivity !== null && selectedWeekForActivity !== null && selectedDayForActivity !== null) {
                    updatedBlocks[selectedBlockForActivity].weeks[selectedWeekForActivity].days[selectedDayForActivity].activities.push(newActivity);
                    setBlocks(updatedBlocks);
                }
            }
        }
    }

    const openAddActivityModalAndSetIndexes = (blockIndex: number, weekIndex: number, dayIndex: number) => {
        setSelectedBlockForActivity(blockIndex);
        setSelectedWeekForActivity(weekIndex);
        setSelectedDayForActivity(dayIndex);
        openAddActivityModal();
    }
    

    return (
        <Container size="xl">
            <Title order={1} mb="md">Schedules</Title>
            <Button mb="md" onClick={addNewBlock}>
                Add New Block
            </Button>
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
                                                        <Button mb="md" onClick={() => {
                                                            addNewDay(blockIndex, weekIndex);
                                                        }}>
                                                            Add Day
                                                        </Button>
                                                        <Title order={4} mb="md">Activities</Title>         
                                                        <Flex>
                                                            <Box style={{ width: '30%', marginRight: '20px' }}>
                                                                {week.days.map((day, dayIndex) => (
                                                                    <Button
                                                                        key={dayIndex}
                                                                        variant="outline"
                                                                        fullWidth
                                                                        mb="sm"
                                                                        onClick={() => setSelectedDay(dayIndex)}
                                                                        style={{ justifyContent: 'flex-start' }}
                                                                    >
                                                                        {day.title}
                                                                    </Button>
                                                                ))}
                                                            </Box>
                                                            <Box style={{ width: '70%' }}>
                                                                {selectedDay !== null && (
                                                                    <div>
                                                                        <Button onClick={() => openAddActivityModalAndSetIndexes(blockIndex, weekIndex, selectedDay)}>Add Activity</Button>
                                                                        <Table striped highlightOnHover withTableBorder>
                                                                            <Table.Thead>
                                                                                <Table.Tr>
                                                                                <Table.Th>Activity</Table.Th>
                                                                                <Table.Th>Group</Table.Th>
                                                                                <Table.Th>Reps</Table.Th>
                                                                            </Table.Tr>
                                                                        </Table.Thead>
                                                                        <Table.Tbody>
                                                                            {week.days[selectedDay].activities.map((activity, activityIndex) => (
                                                                                <Table.Tr key={activityIndex}>
                                                                                    <Table.Td>{activity.title}</Table.Td>
                                                                                    <Table.Td>{blockGroups.find(group => group.id === activity.groupId)?.name}</Table.Td>
                                                                                    <Table.Td>{activity.reps}</Table.Td>
                                                                                    <Table.Td>
                                                                                        <ActionIcon
                                                                                            color="red"
                                                                                            onClick={() => deleteActivity(blockIndex, weekIndex, selectedDay, activityIndex)}
                                                                                            size="sm"
                                                                                        >
                                                                                            <IconTrash size="1rem" />
                                                                                        </ActionIcon>
                                                                                    </Table.Td>
                                                                                </Table.Tr>
                                                                            ))}
                                                                        </Table.Tbody>
                                                                    </Table>
                                                                    </div>
                                                                )}
                                                            </Box>
                                                        </Flex>
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
            <Modal
                opened={isAddActivityModalOpen}
                onClose={() => closeAddActivityModal()}
                title="Add Activity"
            >
                <Select
                    label="Select Activity"
                    placeholder="Choose an activity"
                    data={testActivityTemplates.map((template) => ({ value: template.id, label: template.title }))}
                    value={selectedActivityId}
                    onChange={setSelectedActivityId}
                />
                <Group mt="md" justify="flex-end">
                    <Button color="red" onClick={() => closeAddActivityModal()}>
                        Cancel
                    </Button>
                    <Button color="green" onClick={handleAddActivity}>
                        Submit
                    </Button>
                </Group>
            </Modal>
        </Container>
    )
}

export default SchedulesPage;