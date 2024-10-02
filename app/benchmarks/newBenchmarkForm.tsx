'use client';

import { useForm } from "@mantine/form"
import { Activity, Annotation, BenchmarkTemplate } from "../types";
import { Button, Group, MultiSelect, Select, TagsInput, TextInput } from "@mantine/core";
import { BenchmarkTypes } from "../enums";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BenchmarkTemplateDb } from "../dbTypes";

const NewBenchmarkForm = (params: {
    annotationOptions: Annotation[],
    templates: BenchmarkTemplate[],
    activities: Activity[],
    submitMethod: (values: Partial<BenchmarkTemplate>) => void
}) => {
    
    const form = useForm<Partial<BenchmarkTemplate>>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            type: 0,
            notes: ''        
        }
    });

    return (
        <form onSubmit={form.onSubmit(params.submitMethod)}>
            <Select
                label="Name"
                placeholder="Name"
                data={params.activities.map((activity) => ({ value: activity.id.toString(), label: activity.name }))}
                {...form.getInputProps('name')}
            />
            <MultiSelect
                label="Annotations"
                placeholder="Annotations"
                data={params.annotationOptions.map((annotation) => ({ value: annotation.id.toString(), label: annotation.text }))}
                {...form.getInputProps('annotations')}
                />
            <TextInput
                label="Notes"
                placeholder="Notes"
                {...form.getInputProps('notes')}
            />
            <Select
                label="Type"
                placeholder="Type"
                data={[0,1,2].map((type) => ({ value: type.toString(), label: BenchmarkTypes[type] }))}
                {...form.getInputProps('type')}
            />
            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    )
}

export default NewBenchmarkForm