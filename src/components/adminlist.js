import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import {CleverTable} from './clevertable'
import { useNavigate } from "react-router-dom";

//Endpoints this page uses
let adminEndpoint = process.env.REACT_APP_API_BASEURL + "admins/"

export function AdminList(props) {

    const navigate = useNavigate();
    const [adminList, setAdminList] = useState([]);

    useEffect(()=> {
        //Load the device list on component render
        loadAdminList();
    }, [props]);

    async function loadAdminList() {
        let response = await fetch(adminEndpoint);
        if (response.ok) {
            let json = await response.json();
            console.log(json);
            setAdminList(json);
        }
        else {
            alert("API access failed: " + response.statusText);
        }
    }

    function addAdmin(device) {
            navigate("/administrators/form");
    }
    
    async function modifyAdmin(id) {
        navigate("/administrators/form/"+id);
    }

    async function deleteAdmin(ids) {
        ids.forEach(async id=> {
            let confirm = window.confirm("Confirm delete admin?");
            if (confirm===true) {
                let response = await fetch(adminEndpoint + id, {
                    method: "DELETE"
                });
                if (response !== true) {
                    window.alert("Delete failed: " + response.body());
                }
            }
        }); 
        //Reload user data to refresh the table
        loadAdminList();
    }

    return (
        <div>
        <h1>Administrators</h1>
        <hr/>
        <CleverTable key="devicetable"
        header={[{name: "username", title: "Name"}]}
        data={adminList}
        addFunction={addAdmin}
        modifyFunction={modifyAdmin}
        deleteFunction={deleteAdmin}
      />
      </div>
    );
}
