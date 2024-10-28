import { ActualGroup, Block, blockGroups } from "@/app/schedules/testData";
import { Accordion, Box, Button, Flex, NumberInput, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import { Week } from "../app/schedules/testData"
import DayComponent from "./Day";

const WeekComponent = (props: { 
    block: Block,
    week: Week, 
    blockIndex: number, 
    weekIndex: number, 
    addNewDay: (blockIndex: number, weekIndex: number) => void,
    updateBlock: (block: Block, blockIndex: number) => void,
}) => {
        
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const getTotalRepsForWeek = (week: Week): number => {
        return week.days.reduce((weekTotal, day) => {
            return weekTotal + day.activities.reduce((dayTotal, activity) => {
                return dayTotal + activity.reps;
            }, 0);
        }, 0);
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

    return(
        <Accordion.Item key={props.weekIndex} value={props.week.title}>
        <Accordion.Control>{props.week.title}</Accordion.Control>
        <Accordion.Panel>
            <Flex direction="row" justify="space-between">
                <Box style={{ width: '48%' }}>
                    <Flex direction="row" justify="space-between" align="center" mb="md">
                        <Flex align="center" gap="md">
                            <Text>Goal Reps:</Text>
                            <NumberInput
                                value={props.week.goalReps}
                                onChange={(value) => {
                                    // Implement a function to update the week's goal reps
                                    // updateWeekGoalReps(blockIndex, weekIndex, Number(value));
                                }}
                                min={0}
                                style={{ width: '80px' }}
                            />
                        </Flex>
                        <Text>Actual Reps: {getTotalRepsForWeek(props.week)}</Text>
                    </Flex>
                    <Button mb="md" onClick={() => {
                        props.addNewDay(props.blockIndex, props.weekIndex);
                    }}>
                        Add Day
                    </Button>
                    <Title order={4} mb="md">Activities</Title>         
                    <Flex>
                        <Box style={{ width: '30%', marginRight: '20px' }}>
                            {props.week.days.map((day, dayIndex) => (
                                <Button
                                    key={dayIndex}
                                    variant="outline"
                                    fullWidth
                                    mb="sm"
                                    onClick={() => { 
                                        console.log(dayIndex)
                                        setSelectedDay(dayIndex)
                                    } }
                                    style={{ justifyContent: 'flex-start' }}
                                >
                                    {day.title}
                                </Button>
                            ))}
                        </Box>
                        <Box style={{ width: '70%' }}>
                            {selectedDay !== null && (
                                <DayComponent
                                    block={props.block}
                                    day={props.week.days[selectedDay]}
                                    dayIndex={selectedDay}
                                    weekIndex={props.weekIndex}
                                    blockIndex={props.blockIndex}
                                    updateBlock={props.updateBlock}
                                />
                            )}
                        </Box>
                    </Flex>
                </Box>
                <Box style={{ width: '48%' }}>
                    <Title order={4} mb="md">Volume Percentages</Title>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Group</Table.Th>
                                <Table.Th>Percentage</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {getActualGroupPercentages(props.week).map((group) => (
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
    )
}

export default WeekComponent;