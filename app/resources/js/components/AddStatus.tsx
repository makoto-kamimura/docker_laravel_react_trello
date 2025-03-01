import React, { useState } from 'react';
import { Add, Save } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';

interface AddStatusProps {
    addStatus: (status: { id: string, name: string }) => void;
}

const AddStatus: React.FC<AddStatusProps> = ({ addStatus }) => {
    const [isAddingStatus, setIsAddingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const handleAddStatus = async () => {
        if (newStatus.trim()) {
            try {
                const response = await fetch('/api/statuses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newStatus }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
                }

                const newStatusObj = await response.json();
                addStatus(newStatusObj);
                setNewStatus("");
                setIsAddingStatus(false);
            } catch (error) {
                console.error('Error adding status:', error);
            }
        }
    };

    return (
        <div style={{ padding: 16, background: '#f4f4f4', borderRadius: 8, width: 250, minHeight: 200, position: 'relative' }}>
            {isAddingStatus ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                        type="text"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        placeholder="新しいステータス"
                        style={{ padding: "4px", flexGrow: 1 }}
                    />
                    <button onClick={handleAddStatus} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                        <SaveIcon />
                    </button>
                </div>
            ) : (
                <IconButton onClick={() => setIsAddingStatus(true)} style={{ border: "none", background: "transparent", cursor: "pointer", position: 'absolute', top: '3%', left: '3%', transform: 'translate(-50%, -50%)', fontSize: '2rem' }}>
                    <Add fontSize="inherit" />
                </IconButton>
            )}
        </div>
    );
};

export default AddStatus;