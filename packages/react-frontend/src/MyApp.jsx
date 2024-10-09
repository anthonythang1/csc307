
import Table from "./Table";
import Form from "./Form";
import React, { useState, useEffect } from 'react';

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter(index) {
        const userToDelete = characters[index];

        fetch(`http://localhost:8000/users/${userToDelete.id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 204) {
                    // Successful delete, now update the frontend state
                    const updated = characters.filter((character, i) => i !== index);
                    setCharacters(updated);
                } else if (response.status === 404) {
                    console.log('User not found.');
                } else {
                    console.log('Failed to delete user. Status code:', response.status);
                }
            })
            .catch((error) => {
                console.log('Error while deleting user:', error);
            });
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });
        return promise;
    }

    function updateList(person) {
        postUser(person)
            .then((response) => {
                if (response.status === 201) {
                    return response.json();  
                } else {
                    console.log("User insertion failed with status:", response.status);
                }
            })
            .then((updatedUser) => {
                if (updatedUser) {
                    setCharacters([...characters, updatedUser]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;