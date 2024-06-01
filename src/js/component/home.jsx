import React, {useState,useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

//include images into your bundle


//create your first component
const Home = () => {
    const [list, setList] = useState([]);
    const [user, setUser] = useState('');
    const [input, setInput] = useState('');

    // Función para obtener las tareas del usuario
    const fetchTasks = () => {
		fetch('https://playground.4geeks.com/todo/users/gabriel')
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data)) {
					setList(data);
				} else {
					console.error('Error fetching tasks: Unexpected response format');
				}
			})
			.catch(error => console.error('Error fetching tasks:', error));
	};
    // Función para crear un usuario
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
        fetchTasks(); // Obtiene las tareas al cargar la página
        createUser(); // Crea el usuario al cargar la página
    }, []);

    // Función para agregar una tarea
    const addTask = () => {
        fetch('https://playground.4geeks.com/todo/users/gabriel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...list, input])
        })
            .then(response => response.json())
            .then(() => {
                setList([...list, input]);
                setInput('');
            })
            .catch(error => console.error('Error adding task:', error));
    };

    // Renderizado
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
                            {item}
                            <FontAwesomeIcon
                                className="iconX"
                                icon={faXmark}
                                onClick={() => {
                                    const updatedList = list.filter((_, idx) => idx !== index);
                                    fetch('https://playground.4geeks.com/todo/user/gabriel', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(updatedList)
                                    })
                                        .then(response => response.json())
                                        .then(() => setList(updatedList))
                                        .catch(error => console.error('Error removing task:', error));
                                }}
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
