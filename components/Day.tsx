import { Activity, Block, blockGroups, Day, testActivityTemplates } from "@/app/schedules/testData"
import { Table, ActionIcon, Button, Modal, Select, Group, NumberInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"

const DayComponent = (
    props: {
        block: Block
        day: Day,
        blockIndex: number,
        weekIndex: number,
        dayIndex: number,
        updateBlock: (block: Block, blockIndex: number) => void,
    }
) => {

    const [isAddActivityModalOpen, { open: openAddActivityModal, close: closeAddActivityModal }] = useDisclosure(false);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

    const deleteActivity = (weekIndex: number, dayIndex: number, activityIndex: number) => {
        const updatedBlock = {...props.block};
        updatedBlock.weeks[weekIndex].days[dayIndex].activities.splice(activityIndex, 1);
        props.updateBlock(updatedBlock, props.blockIndex);
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
                const updatedBlock = {...props.block};
                if (props.block !== null && props.weekIndex !== null && props.dayIndex !== null) {
                    updatedBlock.weeks[props.weekIndex].days[props.dayIndex].activities.push(newActivity);
                    props.updateBlock(updatedBlock, props.blockIndex);
                }
            }
        }
    }

    const updateActivityReps = (activityIndex: number, value: number) => {
        const updatedBlock = {...props.block};
        updatedBlock.weeks[props.weekIndex].days[props.dayIndex].activities[activityIndex].reps = value;
        props.updateBlock(updatedBlock, props.blockIndex);
    }

    return (
        <div>
            <Button onClick={openAddActivityModal}>Add Activity</Button>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                    <Table.Th>Activity</Table.Th>
                    <Table.Th>Group</Table.Th>
                    <Table.Th>Reps</Table.Th>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {props.day.activities.map((activity, activityIndex) => (
                        <Table.Tr key={activityIndex}>
                            <Table.Td>{activity.title}</Table.Td>
                            <Table.Td>{blockGroups.find(group => group.id === activity.groupId)?.name}</Table.Td>
                            <Table.Td>
                                <NumberInput
                                    value={activity.reps}
                                    onChange={(value) => {
                                        updateActivityReps(activityIndex, value as number);
                                    }}
                                    min={0}
                                    style={{ width: '80px' }}
                                />
                            </Table.Td>
                            <Table.Td>
                                <ActionIcon
                                    color="red"
                                    onClick={() => deleteActivity(props.weekIndex, props.dayIndex, activityIndex)}
                                    size="sm"
                                >
                                    <IconTrash size="1rem" />
                                </ActionIcon>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <Modal
                opened={isAddActivityModalOpen}
                onClose={() => closeAddActivityModal()}
                title="Add Activity"
            >
                <Select
                    label="Select Activity"
                    placeholder="Choose an activity"
                    data={testActivityTemplates.map((template) => ({ value: template.id, label: template.title} ))}
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
        </div>
    )
}

export default DayComponent