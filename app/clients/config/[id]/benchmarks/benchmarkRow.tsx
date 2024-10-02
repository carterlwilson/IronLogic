import { Benchmark } from "@/app/types";
import { DeleteBenchmark, UpdateClientBenchmarkValue } from "@/utils/persistence/persistence";
import { ActionIcon, NumberInput, Table } from "@mantine/core";
import { IconCircleCheckFilled, IconTrashX } from "@tabler/icons-react";
import { useState } from "react";

const BenchmarkRow = (params: {benchmark: Benchmark, deleteBenchmark: (benchmarkId: number) => void}) => {

    const [updatedValue, setUpdatedValue] = useState(params.benchmark.value);
    const [updated, setUpdated] = useState(false);

    const updateBenchmarkValue = async () => {
        console.log('updatedValue', updatedValue);
        console.log('id', params.benchmark.id);
        UpdateClientBenchmarkValue(Number(params.benchmark.id), updatedValue)
        .then(() => {
            setUpdated(true);
        })
        .catch(error => console.error('Error updating benchmark:', error))
    }
    
    return (
        <Table.Tr>
            <Table.Td>{params.benchmark.name}</Table.Td>
            <Table.Td>
                <NumberInput 
                value={updatedValue} 
                onChange={(e) => setUpdatedValue(e as number)} 
                onBlur={() => updateBenchmarkValue()}/>
            </Table.Td>
            <Table.Td>{params.benchmark.annotations}</Table.Td>
            <Table.Td>{params.benchmark.notes}</Table.Td>
            <Table.Td>
                {updated ? (
                    <IconCircleCheckFilled color="green" />
                ) : (
                    ''
                )}
                <ActionIcon color="red">
                    <IconTrashX color="white" onClick={() => params.deleteBenchmark(Number(params.benchmark.id), )} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    )
}

export default BenchmarkRow;