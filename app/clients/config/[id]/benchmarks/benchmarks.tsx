import { Activity, Benchmark, BenchmarkTemplate, BenchmarkTemplateSummary } from "@/app/types";
import { AddNewBenchmark, DeleteBenchmark, FetchAllActivities, FetchTemplates, GetBenchmarkTemplateSummaries, GetClientBenchmarks, UpdateClientBenchmarkValue } from "@/utils/persistence/persistence";
import { Button, Container, Loader, Modal, NumberInput, Select, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import BenchmarkRow from "./benchmarkRow";
import { useDisclosure } from "@mantine/hooks";
import { BenchmarkTypes } from "@/app/enums";

const Benchmarks = (params: {
    clientId: string
}) => {
    const [clientBenchmarks, setClientBenchmarks] = useState<Benchmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [newValue, setNewValue] = useState(0);
    const [newTemplateId, setNewTemplateId] = useState(0);
    const [queryData, setQueryData] = useState(false);
    const [templateOptions, setTemplateOptions] = useState<BenchmarkTemplateSummary[]>([]);
    
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        GetClientBenchmarks(params.clientId)
            .then(data => {
                setClientBenchmarks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching benchmarks:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (queryData) {
            setLoading(true);
            GetClientBenchmarks(params.clientId)
                .then(data => {
                    setClientBenchmarks(data);
                    setLoading(false);
                    setQueryData(false);
                })
                .catch(error => {
                    console.error('Error fetching benchmarks:', error);
                    setLoading(false);
                    setQueryData(false);
                });
        }
    }, [queryData]);

    const openAddModal = () => {
        setLoading(true);
        GetBenchmarkTemplateSummaries().then(data => {
            console.log(data)
            setTemplateOptions(data);
            setLoading(false);
            open();
        }).catch(error => {
            console.error('Error fetching activities:', error);
            setLoading(false);
        })
    }

    const submitNewBenchmark = () => {
        AddNewBenchmark(Number(params.clientId), newTemplateId, newValue).then(() => {
            setQueryData(true);
            close();
        }).catch(error => {
            console.error('Error adding new benchmark:', error);
        })
    }

    const deleteBenchmark = (benchmarkId: number) => {
        console.log('deleting')
        DeleteBenchmark(benchmarkId).then(() => {
            setQueryData(true);
        }).catch(error => {
            console.error('Error deleting benchmark:', error);
        })
    }

    if (loading) {
        <Container>
            <Loader size="xl" />
        </Container>
    }
    return (
        <>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th>Annotations</Table.Th>
                        <Table.Th>Notes</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {clientBenchmarks.map((benchmark, index) => (
                        <BenchmarkRow key={index} benchmark={benchmark} deleteBenchmark={deleteBenchmark}/>
                    ))}
                </Table.Tbody>
            </Table>
            <Button onClick={openAddModal} mt={"md"}>Add</Button>
            <Modal opened={opened} onClose={close} title="Add Benchmark">
                <Modal.Body>¬
                    <NumberInput value={newValue} onChange={(value) => { setNewValue(Number(value)) }} mb={"md"}/>
                    <Select 
                    onChange={(value) => { setNewTemplateId(Number(value)) }}
                    placeholder="Select Activity" 
                    data={templateOptions.map((template) => (
                        { 
                            value: template.id.toString(), 
                            label: `${template.name} (${template.annotations}) (${BenchmarkTypes[template.type]})`}))
                        }/>
                </Modal.Body>
                <Button onClick={close} mr={"md"}>Cancel</Button>
                <Button onClick={submitNewBenchmark}>Add</Button>
            </Modal>
        </>
    );
}

export default Benchmarks;