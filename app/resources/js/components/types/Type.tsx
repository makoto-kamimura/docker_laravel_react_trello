export interface Task {
    id: string;
    content: string;
    status_id: string;
    status: { id: string, name: string };
    description?: string;
}

export interface Column {
    name: string;
    items: Task[];
}

export interface Columns {
    [key: string]: Column;
}
