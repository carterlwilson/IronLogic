'use client';

import { ActionIcon, Modal, MultiSelect, NumberInput, Select, Table, TagsInput, TextInput, Text, Button } from "@mantine/core";
import { Activity, Annotation, BenchmarkTemplate } from "../types";
import { SetStateAction, useEffect, useState } from "react";
import { IconCheck, IconCircleCheckFilled, IconTrashX } from "@tabler/icons-react";
import { BenchmarkTypes } from "../enums";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure } from "@mantine/hooks";
import { UpdateBenchmarkTemplate } from "@/utils/persistence/persistence";

const BenchMarkTableRow = (params: {
    data: BenchmarkTemplate, 
    annotationOptions: Annotation[],
    activities: Activity[],
    deleteBenchmarkTemplate: (templateId: string) => void
}) => {
    const [updated, setUpdated] = useState(false);
    const [updatedAnnotations, setUpdatedAnnotations] = useState(params.data.annotations);
    const [updatedNotes, setUpdatedNotes] = useState(params.data.notes);
    const [updatedType, setUpdatedType] = useState(params.data.type);
    const [updatedActivityId, setUpdatedActivityId] = useState(params.data.activity_id);

    const [opened, { open, close }] = useDisclosure(false);

    const supabase = createClient();

    useEffect(() => {
        setUpdatedAnnotations(params.data.annotations);
        setUpdatedNotes(params.data.notes);
        setUpdatedType(params.data.type);
        setUpdatedActivityId(params.data.activity_id);
    }, [params.data]);

    const updateBenchmarkTemplate = async (
        newType? : number, newActivityId?: number, newAnnotations?: string[]) => {
        const updateParams: any = {
            updated_template_id: Number(params.data.id),
            updated_type: (newType != undefined) ? newType : updatedType,
            updated_notes: updatedNotes,
            updated_annotations: getAnnotationsForUpdate(newAnnotations),
            updated_activity_id: newActivityId || Number(updatedActivityId),
        };
        UpdateBenchmarkTemplate(updateParams)
            .then(() => {
                setUpdated(true);
                setUpdatedAnnotations(newAnnotations != undefined ? newAnnotations.join(',') : updatedAnnotations);
            })
            .catch(error => console.error('Error updating template:', error));
    }

    const getAnnotationsForUpdate = (newAnnotations?: string[]): string[] => {
        if (newAnnotations !== undefined) {
            return newAnnotations;
        }
        else if (updatedAnnotations) {
            return updatedAnnotations.split(',');
        }
        else {
            return []
        };
    }

    const getAnnotations = (annotations: string) => {
        if (!annotations) return [];
        const ids = annotations.split(',');
        const result = params.annotationOptions.filter((annotation) => ids.includes(annotation.id.toString()));
        return result;
    }

    const changeType = (value: string) => {
        if (value) {
            setUpdatedType(Number(value));
        }
    }

    const updateActivityId = (value: string | null) => {
        if (value) {
            setUpdatedActivityId(value);
        }
        updateBenchmarkTemplate(undefined, Number(value));
    }

    const updateType = (value: string | null) => {
        if (value) {
            setUpdatedType(Number(value));
        }
        updateBenchmarkTemplate(Number(value), undefined);
    }

    const updateAnnotations = (value: string[] | null) => {
        if (value) {
            updateBenchmarkTemplate(undefined, undefined, value);
        }
    }

    return (
        <>
            <Table.Tr key={params.data.id}>
                <Table.Td>
                    <Select
                        value={updatedActivityId}
                        data={params.activities.map((activity) => ({ value: activity.id.toString(), label: activity.name }))}
                        onChange={(value) => updateActivityId(value) }
                    />
                </Table.Td>
                <Table.Td>
                    <Select
                        data={[0,1,2].map((type) => ({ value: type.toString(), label: BenchmarkTypes[type] }))}
                        value={String(updatedType)}
                        onChange={(value) => updateType(value) }
                    />
                </Table.Td>
                <Table.Td>
                    <MultiSelect
                        placeholder="Pick tags from list"
                        data={params.annotationOptions.map((annotation) => ({ value: annotation.id.toString(), label: annotation.text }))}
                        value={getAnnotations(updatedAnnotations).map((annotation) => annotation.id.toString())}
                        onChange={(value) => updateBenchmarkTemplate(undefined, undefined, value) }
                    />
                </Table.Td>
                <Table.Td>
                    <TextInput
                        value={updatedNotes}
                        onBlur={(event) => updateBenchmarkTemplate()}
                        onChange={(event) => setUpdatedNotes(event.currentTarget.value)}
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
                <Button onClick={() => { params.deleteBenchmarkTemplate(params.data.id); close(); }} color="green" mr={5}>Yes</Button>
                <Button onClick={close} color="red">No</Button>
            </Modal>
        </>
    );
};

export default BenchMarkTableRow;