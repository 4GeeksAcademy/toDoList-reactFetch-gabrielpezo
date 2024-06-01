import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const Prueba = () => {
    const [list, setList] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // Función para obtener las tareas del usuario
        const fetchTasks = async () => {
            try {
                const response = await fetch('https://playground.4geeks.com/todo/users/gabriel');
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setList(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setList([]);
            }
        };
        fetchTasks(); // Obtener las tareas al cargar la página
    }, []);

    if (!Array.isArray(list)) {
        return <div>Loading...</div>; // Muestra un mensaje de carga si list no es un array
    }

    const addTask = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users/gabriel', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([...list, input])
            });
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            setList([...list, input]);
            setInput('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const deleteTask = async (index) => {
        try {
            const updatedList = list.filter((_, idx) => idx !== index);
            const response = await fetch('https://playground.4geeks.com/todo/users/gabriel', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedList)
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setList(updatedList);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const clearAllTasks = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users/gabriel', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([])
            });
            if (!response.ok) {
                throw new Error('Failed to clear tasks');
            }
            setList([]);
        } catch (error) {
            console.error('Error clearing tasks:', error);
        }
    };

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <ul>
                {list.map((task, index) => (
                    <li key={index}>
                        {task}
                        <button onClick={() => deleteTask(index)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={clearAllTasks}>Clear All Tasks</button>
        </div>
    );
};

export default Prueba;