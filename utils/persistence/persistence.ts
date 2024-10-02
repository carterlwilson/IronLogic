import { Activity, ActivityType, Annotation, Benchmark, BenchmarkTemplate, BenchmarkTemplateSummary, Client } from '@/app/types'
import { createClient } from '../supabase/client'

export const FetchAllActivities = async (): Promise<Activity[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('activities').select('*');
    if (error) throw new Error(error.message);
    else return data;
}

export const DeleteActivity = async (id: Number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

export const SubmitNewActivity = async (values: Partial<Activity>): Promise<string> => {
    const supabase = createClient();
    values.type = Number(values.type);
    console.log('submitting new activity', values);
    const { data, error } = await supabase
        .from('activities')
        .insert([values])
        .select('id');
    if (error) {
        throw new Error(error.message);
    }
    else return data[0].id;
}

export const FetchActivityTypes = async (): Promise<ActivityType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('activity_types').select('*');
    if (error) throw new Error(error.message);
    else return data;
}

export const FetchAnnotations = async (): Promise<Annotation[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('benchmark_annotations').select('*');
    if (error) throw new Error(error.message);
    else return data;
};

export const FetchTemplates = async (): Promise<BenchmarkTemplate[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('getallbenchmarktemplates');
    if (error) throw new Error(error.message);
    else return data;
  };

export const SubmitNewBenchmarkTemplate = async (values: Partial<BenchmarkTemplate>): Promise<string> => {
    const newAnnotations = values.annotations as unknown as string[];
    const supabase = createClient();
    const { data, error } = await supabase.rpc('addnewbenchmarktemplate', {
        newactivity_id: Number(values.name),
        newtype: values.type,
        notes: values.notes,
        newannotations: newAnnotations.map((annotation) => Number(annotation))
    })
    if (error) throw new Error(error.message);
    else return data
}

export const DeleteBenchmarkTemplate = async (templateId: string): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from('benchmark_templates').delete().match({ id: Number(templateId) });
    if (error) throw new Error(error.message);
}

export const UpdateBenchmarkTemplate = async (values: any): Promise<void> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('update_benchmark_template', values);
    if (error) throw new Error(error.message);
}

export const GetClientBenchmarks = async (clientId: string): Promise<Benchmark[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_client_benchmarks', { client_id: Number(clientId) });
    if (error) throw new Error(error.message);
    else return data
}

export const GetBenchmarkTemplateSummaries = async (): Promise<BenchmarkTemplateSummary[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_benchmark_template_summaries');
    if (error) throw new Error(error.message);
    else return data
}

export const UpdateClientBenchmarkValue = async (id: number, value: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from('benchmarks').update({ value: value }).eq('id', id);
    if (error) throw new Error(error.message);
}

export const AddNewBenchmark = async (clientId: number, templateId: number, value: number): Promise<void> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('add_new_benchmark', {
        new_template_id: templateId,
        new_client_id: clientId,
        new_value: value
    })
    if (error) throw new Error(error.message);
    else return data;
}

export const DeleteBenchmark = async (id: number): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase.from('benchmarks').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

export const UpdateActivity = async (values: Partial<Activity>): Promise<void> => {
    const supabase = createClient();
    const { error } = await supabase
        .from('activities')
        .update(values)
        .match({ id: Number(values.id) });
    if (error) throw new Error(error.message);
}

export const FetchAllClients = async (): Promise<Client[]> => { 
    const supabase = createClient();
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw new Error(error.message);
    else return data;
}