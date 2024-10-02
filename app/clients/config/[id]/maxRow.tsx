import React from 'react';
import { Max, BenchmarkTemplate } from "../../../types";
import { ActionIcon, NumberInput, Table } from "@mantine/core";
import { useState } from "react";
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';

interface MaxRowProps {
    max: Max
    clientId: string
    templates: BenchmarkTemplate[]
}

const MaxRow: React.FC<MaxRowProps> = (params: MaxRowProps ) => {

    const [editing, setEditing] = useState(false);
    const [edited, setEdited] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxWeight, setMaxWeight] = useState(params.max.weight);
    const [template, setTemplate] = useState<BenchmarkTemplate | null>(null);

    const submitMaxChange = () => {
        setEditing(false);
        setEdited(true);
        setError(error);
    }
    
    useEffect(() => {
        const matchingTemplate = params.templates.find((t) => t.id === params.max.templateId);
        setTemplate(matchingTemplate || null);
    }, [params.max.templateId, params.templates]);

    return (
        <Table.Tr key={params.max.id}>
            <Table.Td>{template?.name}</Table.Td>
            <Table.Td>
            {editing === true ? (
                <NumberInput
                value={maxWeight}
                onBlur={submitMaxChange}
                onChange={(e) => setMaxWeight(e as number)}
                autoFocus
                min={0}
                step={1}
                styles={{ input: { width: '100px' } }}
                />
            ) : (
                <span onClick={() => setEditing(true)}>{maxWeight}</span>
            )}
            </Table.Td>
            <Table.Td>
                { template?.annotations }
            </Table.Td>
            <Table.Td>
                <ActionIcon variant="filled" aria-label="Settings">
                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
                {edited === true && error === null ? (
                    <ActionIcon aria-label="Settings" color='green' ml={5}>
                        <IconCheck style={{ width: '70%', height: '70%' }} stroke={1.5}/>
                    </ActionIcon>
                ) : null}
            </Table.Td>
        </Table.Tr>
    )
}

export default MaxRow;