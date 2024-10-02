import { ActionIcon, Modal, Select, Table, TextInput, Text, Button } from "@mantine/core"
import { Activity, ActivityType } from "../types"
import { useEffect, useState } from "react";
import { IconCircleCheckFilled, IconTrashX } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure } from "@mantine/hooks";
import { UpdateActivity } from "@/utils/persistence/persistence";

const TableRow = (params: {
    index: number,
    row: Activity,
    activityTypes: ActivityType[],
    deleteActivity: (index: number) => void
}) => {

    const [opened, { open, close }] = useDisclosure(false);

    const [updatedType, setUpdatedType] = useState(params.row.type);
    const [updatedNotes, setUpdatedNotes] = useState(params.row.notes);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        setUpdatedType(params.row.type);
        setUpdatedNotes(params.row.notes);
    }, [params.row]);

    const submitChange = async (type?: number, notes?: string) => {
        UpdateActivity({ id: params.row.id, type: type ? type : updatedType, notes: notes ? notes : updatedNotes })
        .then(() => {
            setUpdated(true);
            if (type) setUpdatedType(type);
            if (notes) setUpdatedNotes(notes);
        })
        .catch(error => console.error('Error updating activity:', error))
    }

    return (
        <>
            <Table.Tr key={params.index}>
                <Table.Td>{params.row.name}</Table.Td>
                <Table.Td>
                    <Select
                    value={updatedType.toString()}
                    placeholder="Type"
                    data={params.activityTypes.map((type) => ({ value: type.id.toString(), label: type.name }))}
                    onChange={(value) => {
                        if (value) {
                            setUpdatedType(Number(value));
                        }
                    }}
                    onBlur={() => submitChange(updatedType)}
                    />
                </Table.Td>
                <Table.Td>
                    <TextInput
                    value={updatedNotes}
                    onChange={(e) => setUpdatedNotes(e.target.value)}
                    placeholder="Notes"
                    onBlur={() => submitChange(undefined, updatedNotes)}
                    />
                </Table.Td>
                <Table.Td>
                    {updated ? (
                    <IconCircleCheckFilled color="green" />
                    ) : (
                        ''
                    )}
                    <ActionIcon color="red">
                        <IconTrashX color="white" onClick={() => open()} />
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
                <Modal opened={opened} onClose={close} withCloseButton={false}>
                <Text>Are you sure you want to delete this template? Any benchmarks for clients using this template will also be deleted.</Text>
                <Button onClick={() => { params.deleteActivity(params.row.id); close(); }} color="green" mr={5}>Yes</Button>
                <Button onClick={close} color="red">No</Button>
            </Modal>
        </>
    )
}

export default TableRow