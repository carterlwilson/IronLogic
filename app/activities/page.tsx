'use client';

import { Button, Container, Group, Loader, Modal, Pagination, Select, Table, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Activity, ActivityType } from "../types";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "@mantine/form";
import { FetchAllActivities, FetchActivityTypes, DeleteActivity, SubmitNewActivity } from "@/utils/persistence/persistence"; 
import TableRow from "./table-row";

const ActivitiesPage = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [activePage, setActivePage] = useState(1);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    const deleteActivity = async (id: Number) => {
        DeleteActivity(id).then(() => {
            const newActivities = activities.filter((activity) => activity.id !== id);
            setActivities(newActivities);
        }).catch(error => console.error('Error deleting activity:', error))
    }

    const submitNewActivity = async (values: Partial<Activity>) => {
        values.type = Number(values.type);
        SubmitNewActivity(values).then(createdId => {
            const newActivity: Activity = {
                id: Number(createdId),
                name: values.name ? values.name : '',
                type: values.type ? values.type : 0,
                notes: values.notes ? values.notes : ''
            }
            setActivities([...activities, newActivity]);
        }).catch(error => console.log('Error creating activity:', error))
        close();
    }

    const form = useForm<Partial<Activity>>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            type: 0,
            notes: ''        
        }
    });

    useEffect(() => {
        FetchAllActivities().then(
            data => {
                setActivities(data);
                setLoading(false);
            }
        ).catch(error => {
            console.log(error)
            setLoading(false);
        })
        FetchActivityTypes().then(
            data => setActivityTypes(data)
        ).catch(error => console.log(error))
    }, []);

    if (loading) {
        return (
        <Container>
            <Loader size="xl" />
        </Container>
        );
    }

    return (
        <Container size="xl">
        <Title order={1} mb="md">Activities</Title>
        <Table striped highlightOnHover withTableBorder>        
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {activities.map((row, index) => (
                <TableRow key={index} index={index} row={row} activityTypes={activityTypes} deleteActivity={deleteActivity}/>
            ))}
          </Table.Tbody>
        </Table>
        <Pagination
          value={activePage}
          onChange={setActivePage}
          total={Math.ceil(activities.length / 10)}
          style={{ marginTop: 16 }}
        />
        <Button onClick={open} mt={10}>Add Benchmark</Button>
        <Modal opened={opened} onClose={close} title="Add Benchmark">
            <form onSubmit={form.onSubmit(submitNewActivity)}>
                <TextInput
                    label="Name"
                    placeholder="Name"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="Notes"
                    placeholder="Notes"
                    {...form.getInputProps('notes')}
                />
                <Select
                    label="Type"
                    placeholder="Type"
                    data={activityTypes.map((type) => ({ value: type.id.toString(), label: type.name }))}
                    {...form.getInputProps('type')}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Modal>
      </Container>
    )
};

export default ActivitiesPage