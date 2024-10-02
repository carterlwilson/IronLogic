import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Title, 
  Text, 
  List,
  TextInput,
  Button,
  Textarea,
  NumberInput,
  Table,
  Stack,
  Card,
  SimpleGrid,
  Loader,
  CloseButton,
  Flex,
  Select
} from '@mantine/core';
import { Client } from '../../../types';
import { useState } from 'react';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface DashboardProps {
  id: string;
}

const Dashboard: React.FC<DashboardProps> = (params: { id: string }) => {
    const [modifiedFirstName, setModifiedFirstName] = useState('');
    const [modifiedLastName, setModifiedLastName] = useState('');
    const [modifiedEmail, setModifiedEmail] = useState('');
    const [modifiedWeight, setModifiedWeight] = useState(0);
    const [client, setClient] = useState<Client>({} as Client);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleClientInfoSubmit = () => {
    }

    const submitNewNotes = () => {
    }

    const submitNewMax = () => {
    }

    const deleteNote = (index: number) => {
    }

    useEffect(() => {
        const fetchClient = async () => {
            const { data, error } = await supabase.from('clients').select('*').eq('id', params.id);
            if (data) {
                setClient(data[0]);
            }
            if (error) {
                setError('Failed to fetch client. Please try again later.');
                console.error('Error fetching client:', error);
            }
            setLoading(false);
        };

        const fetchAllMaxTemplates = async () => {
        };
        fetchClient();
        fetchAllMaxTemplates();
      }, [params.id]);

    if (loading) {
        return (
            <Container>
            <Loader size="xl" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
            <Text color="red">{error}</Text>
            </Container>
        );
    }

    return (
        <Container size="xl" p="md">
        <Grid>
            {/* Top row */}
            <Grid.Col span={12}>
            <Grid>
                <Grid.Col span={6}>
                    <Paper p="md" shadow="sm">
                        <Stack>
                            <Title order={2}>Edit Client: {client.firstname} {client.lastname}</Title>
                            
                            <TextInput
                            label="First Name"
                            defaultValue={client.firstname}
                            onChange={(e) => setModifiedFirstName(e.target.value)}
                            required
                            />
                            
                            <TextInput
                            label="Last Name"
                            defaultValue={client.lastname}
                            onChange={(e) => setModifiedLastName(e.target.value)}
                            required
                            />
                            
                            <TextInput
                            label="Email"
                            type="email"
                            defaultValue={client.email}
                            onChange={(e) => setModifiedEmail(e.target.value)}
                            required
                            />

                            <NumberInput
                            label="Weight"
                            value={client.weight as number}
                            onChange={(e) => setModifiedWeight(e as number)}
                            required
                            />
                            
                            <Button type="submit" onClick={handleClientInfoSubmit}>Update Client</Button>
                        </Stack>
                    </Paper>
                </Grid.Col>

{/*                 <Grid.Col span={6}>
                    <Paper shadow="xs" p="md">
                        <Paper shadow="xs" p="md">
                            <Title order={3}>Notes</Title>
                            <SimpleGrid cols={2}>
                                {client?.notes?.map((note, index) => (
                                    <Card key = {index} shadow="sm" padding="lg" radius="md" withBorder>
                                        <Card.Section>
                                            <Flex direction={'row'} justify={'flex-end'}>
                                                <CloseButton onClick={() => deleteNote(index)}/>
                                            </Flex>
                                        </Card.Section>
                                        <Text>{note}</Text>
                                    </Card>
                                ))}
                            </SimpleGrid>
                            <Textarea placeholder="New note" style={{ marginTop: '10px' }} onChange={(e) => setNewNote(e.target.value)}/>
                            <Button style={{ marginTop: '10px' }} onClick={submitNewNotes}>Add Note</Button>
                        </Paper>
                    </Paper>
                </Grid.Col> */}
            </Grid>
            </Grid.Col>

            {/* Bottom row */}
{/*             <Grid.Col span={12}>
                <Paper shadow="xs" p="md">
                    <Title order={3}>Maxes</Title>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Weight</Table.Th>
                                <Table.Th>Notes</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {client?.maxes?.sort().map((max, index) => (
                                <MaxRow 
                                    key={index} 
                                    max={max} 
                                    clientId={client.id} 
                                    templates={maxTemplates}/>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Select 
                        placeholder="Select Max Template" 
                        data={maxTemplateSelectData}
                        value={selectedMaxTemplate}
                        onChange={(e) => setSelectedMaxTemplate(e as string)}
                        searchable 
                        style={{ marginTop: '10px' }} />
                    <NumberInput 
                        placeholder="Weight" 
                        style={{ marginTop: '10px' }}
                        onChange={(e) => setNewMaxWeight(e as number)} />
                    <Button style={{ marginTop: '10px' }} onClick={submitNewMax}>Add Max</Button>
                </Paper>
            </Grid.Col> */}
        </Grid>
        </Container>
    );
};

export default Dashboard;