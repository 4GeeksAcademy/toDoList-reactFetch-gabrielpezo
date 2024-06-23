import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [list, setList] = useState([]);
    const [user, setUser] = useState('');
    const [input, setInput] = useState('');

    const fetchTasks = () => {
        fetch('https://playground.4geeks.com/todo/users/gabriel')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.todos)) {
                    setList(data.todos);
                } else {
                    console.error('Error fetching tasks: Unexpected response format');
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    };

    const createUser = () => {
        fetch('https://playground.4geeks.com/todo/users/gabriel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": "gabriel",
                "todos": []
            })
        })
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error creating user:', error));
    };

    useEffect(() => {
        fetchTasks(); 
    }, []);

    const addTask = () => {
        const newTask = {
            label: input,
            is_done: false
        };

        fetch('https://playground.4geeks.com/todo/todos/gabriel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); 
            setInput(''); 
        })
        .catch(error => console.error('Error adding task:', error));
    };

    const removeTask = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchTasks(); 
        })
        .catch(error => console.error('Error removing task:', error));
    };
   
    return (
        <div className="backGround">
            <div className="divCon container text-center">
                <button type="button" className="btn btn-success" onClick={createUser}>
                    Crear usuario
                </button>
                <h1 className="title">
                    <i>To-Do List</i>
                </h1>
                <ul className="shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                    <li>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyUp={e => {
                                if (e.key === 'Enter') {
                                    addTask();
                                }
                            }}
                            placeholder="¿Qué necesitas hacer?"
                        />
                    </li>
                    {list.map((item, index) => (
                        <li key={index}>
                            {item.label}
                            <FontAwesomeIcon
                                className="iconX"
                                icon={faXmark}
                                onClick={() => removeTask(item.id)}
                            />
                        </li>
                    ))}
                </ul>
                <div className="counter d-flex justify-content-left">
                    <strong>{list.length} tareas</strong>
                </div>
            </div>
        </div>
    );
};

export default Home;
