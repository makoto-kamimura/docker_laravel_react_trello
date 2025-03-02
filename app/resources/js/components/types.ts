export interface Task {
    id: string;
    content: string;
    status_id: string;
    status: { id: string, name: string };
    description?: string;
    due_date?: string;
    completed_at?: string;
    created_at: string; // 追加
}

export interface Column {
    name: string;
    items: Task[];
}

export interface Columns {
    [key: string]: Column;
}