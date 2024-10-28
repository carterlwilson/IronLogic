"use client"

import { Accordion, Button, Container, NumberInput, Table, Title } from "@mantine/core"
import React from "react";
import { useState } from "react";
import { Block, testBlocks, Week, blockGroups, Day, ActualGroup } from "./testData";
import WeekComponent from "@/components/Week";

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
        console.log(updatedBlocks)
        setBlocks(updatedBlocks);
    };

    const updateGroupPercentage = (groupId: string, value: number, blockIndex: number) => {
        const updatedBlocks = [...blocks];
        const group = updatedBlocks[blockIndex].groups.find(group => group.id === groupId);
        if (group) {
            group.percentage = value;
        }
        setBlocks(updatedBlocks);
    }

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

    const updateBlock = (block: Block, blockIndex: number) => {
        const updatedBlocks = [...blocks]
        updatedBlocks[blockIndex] = block;
        setBlocks(updatedBlocks);
        console.log('updatedBlock', block);
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
                                    <Title order={3} mb="md">Weekly Volume Ratio Targets</Title>
                                    <Table striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Group</Table.Th>
                                                <Table.Th>Percentage</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {block.groups.map((group, index) => (
                                                <Table.Tr key={group.id}>
                                                    <Table.Td>{group.name}</Table.Td>
                                                    <Table.Td>
                                                        <NumberInput
                                                            value={group.percentage}
                                                            onChange={(value) => {
                                                                updateGroupPercentage(group.id, value as number, index);
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
                                        <WeekComponent 
                                            key={weekIndex} 
                                            block={block} 
                                            week={week} 
                                            blockIndex={blockIndex} 
                                            weekIndex={weekIndex} 
                                            addNewDay={addNewDay} 
                                            updateBlock={updateBlock} 
                                        />
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