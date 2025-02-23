import { useState, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Columns, Task } from "../types/Type";
import { fetchTasks, fetchStatuses, updateTaskStatus } from "../api/kanbanApi";

export const useKanban = () => {
    const [columns, setColumns] = useState<Columns>({});

    useEffect(() => {
        Promise.all([fetchTasks(), fetchStatuses()])
            .then(([tasks, statuses]) => {
                const initialColumns: Columns = {};
                statuses.forEach((status) => {
                    initialColumns[status.id] = {
                        name: status.name,
                        items: tasks.filter((task) => task.status_id === status.id),
                    };
                });
                setColumns(initialColumns);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return; // ドロップ先がない場合は何もしない
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        setColumns((prevColumns) => {
            const sourceColumn = prevColumns[source.droppableId];
            const destColumn = prevColumns[destination.droppableId];
            const sourceItems = Array.from(sourceColumn.items);
            const destItems = Array.from(destColumn.items);

            const [movedItem] = sourceItems.splice(source.index, 1); // 元のカラムから削除
            movedItem.status_id = destination.droppableId; // ✅ `status_id` を更新
            destItems.splice(destination.index, 0, movedItem); // 新しいカラムに追加

            // DBに更新
            updateTaskStatus(movedItem.id, destination.droppableId);

            return {
                ...prevColumns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            };
        });
    };

    return { columns, setColumns, onDragEnd };
};
