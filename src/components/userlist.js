import {CleverTable} from './clevertable'
import React, { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";

let usersEndpoint = process.env.REACT_APP_API_BASEURL + "users/"

export function UserList(props) {

    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        loadUserDataFromEndpoint();
        //Load the list of users on component render
    }, []);

    function loadUserDataFromEndpoint() {
        fetch(usersEndpoint).then((response) => response.json()).then((data) => {setUserList(data)});
    }

    function addUser() {
        navigate("/users/form");
    }

    function modifyUser(ids) {
        navigate("/users/form/"+ids[0]);
    }
 
    async function deleteUser(ids) {
        ids.forEach(async id=> {
            let confirm = window.confirm("Confirm delete user?");
            if (confirm===true) {
                let response = await fetch(usersEndpoint + id, {
                    method: "DELETE"
                });
                if (response !== true) {
                    window.alert("Delete failed: " + response.body());
                }

            //Check response
            }
        }); 
        //Reload user data to refresh the table
        loadUserDataFromEndpoint();
    }    

    return (
        <div>
            <h1>Users</h1>
            <hr/>
            <CleverTable key="usertable"
                header={[{name: "name", title: "Name"}, {name:"phone", title: "Tel:"}, {name:"email", title: "Email"}, {name:"active", title:"Active?"}]}
                data={userList}

                addFunction={addUser}
                modifyFunction={modifyUser}
                deleteFunction={deleteUser}

                class="LogTable"
            />
        </div>
    );
}