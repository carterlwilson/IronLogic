export interface Max {
    id: string;
    weight: number;
    templateId: string;
  }

export interface Client {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    weight: Number;
  }

export interface ClientConfigProps {
    client: Client;
  }

export interface BenchmarkTemplate {
    id: string;
    type: number;
    name: string;
    notes: string;
    annotations: string;
    activity_id: string;
}

export interface BenchmarkTemplateSummary {
    id: string;
    name: string;
    annotations: string;
    type: number;
}

export interface Benchmark {
    id: string;
    name: string;
    notes: string;
    value: number;
    type: number;
    annotations: string;
}

export interface Annotation {
    id: string;
    text: string;
}

export interface Activity {
    notes: string;
    name: string;
    type: number;
    id: number;
}

export interface ActivityType {
    id: string;
    name: string;
}