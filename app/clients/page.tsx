'use client';

import { useState, useEffect } from 'react';
import { Table, Pagination, Container, Title, Loader, Text, Button, ActionIcon } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { Client } from '../types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { FetchAllClients } from '@/utils/persistence/persistence';

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const supabase = createClient();

  useEffect(() => {
    const fetchAllClients = async () => {
        setLoading(true);
        FetchAllClients()
          .then(data => {
            setClients(data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching clients:', error);
            setLoading(false);
          });
    }
    fetchAllClients();
  }, []);

  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(clients.length / itemsPerPage);

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
    <Container size="xl">
      <Title order={1} mb="md">Clients</Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>First Name</Table.Th>
            <Table.Th>Last Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Configure Client</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedClients.map((client) => (
            <Table.Tr key={client.id}>
              <Table.Td>{client.firstname}</Table.Td>
              <Table.Td>{client.lastname}</Table.Td>
              <Table.Td>{client.email}</Table.Td>
              <Table.Td>
                <Link
                  href={`/clients/config/${client.id}`}
                  >
                  <ActionIcon variant="filled" aria-label="Settings">
                    <IconAdjustments style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={setCurrentPage}
        mt="md"
      />
    </Container>
  );
};

export default ClientsPage;