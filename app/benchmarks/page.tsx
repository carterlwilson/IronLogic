"use client";

import { useState, useEffect } from 'react';
import { Table, Pagination, Title, Container, Modal, Text, Button, Loader } from '@mantine/core';
import { Activity, Annotation, BenchmarkTemplate } from '../types';
import BenchMarkTableRow from './benchmarkTableRow';
import { useDisclosure } from '@mantine/hooks';
import NewBenchmarkForm from './newBenchmarkForm';
import { createClient } from '@/utils/supabase/client';
import { DeleteBenchmarkTemplate, FetchAllActivities, FetchAnnotations, FetchTemplates, SubmitNewBenchmarkTemplate } from '@/utils/persistence/persistence';


const BenchmarksPage = () => {
  const [templates, setTemplates] = useState<BenchmarkTemplate[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [annotationOptions, setAnnotationOptions] = useState<Annotation[]>([]);
  const [activityOptions, setActivityOptions] = useState<Activity[]>([]);
  const [newTemplateAdded, setNewTemplateAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    FetchTemplates()
      .then(data => setTemplates(data))
      .catch(error => console.error('Error fetching templates:', error))
  };

  const submitNewBenchmarkTemplate = async (values: Partial<BenchmarkTemplate>) => {
    const newAnnotations = values.annotations as unknown as string[];
    SubmitNewBenchmarkTemplate(values)
      .then(newId => {
        const newTemplate: BenchmarkTemplate = {
          id: newId,
          type: 0,
          name: '',
          notes: values.notes? values.notes : '',
          annotations: newAnnotations.join(','),
          activity_id: values.name? values.name : ''
        }
        console.log('newTemplate', newTemplate);
        setTemplates([...templates, newTemplate]);
      })
      .catch(error => console.error('Error creating template:', error));
      close();
    }

  const deleteBenchmarkTemplate = async (templateId: string) => {
    DeleteBenchmarkTemplate(templateId)
      .then(() => {
        console.log('successfully deleted template')
        const newTemplates = templates.filter((template) => template.id !== templateId);
        setTemplates(newTemplates);
      })
      .catch(error => console.error('Error deleting template:', error))
  }

  useEffect(() => {
    fetchTemplates();
  }, [activePage]);

  useEffect(() => {
    FetchAllActivities()
      .then(data => {
        setActivityOptions(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("error loading activities", error)
        setLoading(false);
      })
    FetchAnnotations()
      .then(data => setAnnotationOptions(data))
      .catch(error => console.log('Error fetching annotations:', error))
    }
, [])

  if (loading) {
    return (
    <Container>
        <Loader size="xl" />
    </Container>
    );
  }

  return (
    <Container size="xl">
      <Title order={1} mb="md">Benchmarks</Title>
      <Table striped highlightOnHover withTableBorder>        
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Annotations</Table.Th>
            <Table.Th>Notes</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {templates.map((row, index) => (
            <BenchMarkTableRow 
            data={row} 
            key={index}
            annotationOptions={annotationOptions}
            activities={activityOptions}
            deleteBenchmarkTemplate={deleteBenchmarkTemplate}/>
          ))}
        </Table.Tbody>
      </Table>
      <Pagination
        value={activePage}
        onChange={setActivePage}
        total={Math.ceil(templates.length / 10)}
        style={{ marginTop: 16 }}
      />
      <Button onClick={open} mt={10}>Add Benchmark</Button>
      <Modal opened={opened} onClose={close} title="Add Benchmark">
        <NewBenchmarkForm 
        templates={templates} 
        annotationOptions={annotationOptions}
        activities={activityOptions}
        submitMethod={submitNewBenchmarkTemplate} />
      </Modal>
    </Container>
  );
};


export default BenchmarksPage;