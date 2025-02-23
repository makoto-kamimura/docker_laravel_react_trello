import { Task } from "../types/Type";

const API_URL = "/api";

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
};

export const fetchStatuses = async (): Promise<{ id: string; name: string }[]> => {
    const response = await fetch(`${API_URL}/statuses`);
    return response.json();
};

export const updateTaskStatus = async (taskId: string, statusId: string) => {
    await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: statusId }),
    });
};

export const deleteTask = async (taskId: string) => {
    await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" });
};

export const deleteStatus = async (statusId: string) => {
    await fetch(`${API_URL}/statuses/${statusId}`, { method: "DELETE" });
};
