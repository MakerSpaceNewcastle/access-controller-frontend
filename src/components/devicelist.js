import React, { useEffect, useState } from 'react';

import {CleverTable} from './clevertable'
import { useNavigate } from "react-router-dom";

//Delete device endpoint from globals
let devicesEndpoint = process.env.REACT_APP_API_BASEURL + "devices/"

export function DeviceList(props) {

    const navigate = useNavigate();
    const [deviceList, setDeviceList] = useState([]);

    useEffect(()=> {
        loadDeviceList();
    }, []);

    async function loadDeviceList() {
        let response = await fetch(devicesEndpoint);
        if (response.ok) {
            let json = await response.json();
            setDeviceList(json);
        }
        else {
            alert("API access failed: " + response.statusText);
        }
    }

    function addDevice(device) {
            navigate("/devices/form");
    }
    
    function modifyDevice(ids) {
        navigate("/devices/form/"+ids[0]);
    }

    function deleteDevices(device_ids) {
        device_ids.forEach(id=> {
            let device = deviceList.find(e=>e.id == id);
            let result = window.confirm("Are you sure? This will delete " + device.name + " permanently")
            if (result) {
                deleteDevice(device.id);
            }
        });
        //Refresh the device list
        loadDeviceList();
    };

    async function deleteDevice(id) {
        let response = await fetch(devicesEndpoint + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Update failed - " + response.statusText);
        }
        else {
            loadDeviceList();
        }
    }

    return (
        <div>
        <h1>Devices</h1>
        <hr/>
        <CleverTable key="devicetable"
        header={[{name: "name", title: "Name"}, {name:"description", title: "Description"}, {name:"available", title:"Available?"}]}
        data={deviceList}
        addFunction={addDevice}
        deleteFunction = { deleteDevices }
        modifyFunction = { modifyDevice }
      />
      </div>
    );
}
