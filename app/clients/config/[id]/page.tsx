'use client';

import { Tabs, Container, Title } from '@mantine/core';
import { Client, ClientConfigProps } from '../../../types';
import { useState } from 'react';
import Dashboard from './dashboard';
import Benchmarks from './benchmarks/benchmarks';

const ClientConfig = ({ params }: { params: {id: string} }) => {

  const [client, setClient] = useState<Client>({} as Client);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <Container>
      <Title order={2} mb="md">Client Configuration: {client.firstname} {client.lastname}</Title>

      <Tabs defaultValue="dashboard">
        <Tabs.List>
          <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
          <Tabs.Tab value="schedule">Schedule</Tabs.Tab>
          <Tabs.Tab value="benchmarks">Benchmarks</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="dashboard">
          <Dashboard id={params.id} />
        </Tabs.Panel>

        <Tabs.Panel value="schedule">
          <Title order={3} mt="md">Schedule</Title>
          {/* Add content for Schedule tab */}
        </Tabs.Panel>

        <Tabs.Panel value="benchmarks">
          <Title order={3} mt="md">Benchmarks</Title>
          <Benchmarks clientId={params.id}/>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ClientConfig;