import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {CleverTable} from '../components/clevertable'
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';


const usersEndpoint = process.env.REACT_APP_API_BASEURL + "users/"
const devicesEndpoint = process.env.REACT_APP_API_BASEURL + "devices/"
  

export function DeviceForm(props) {

    const { id } = useParams()
    const navigate = useNavigate();
    const { deviceId } = useParams()

    //Validators for form
    const [nameValid, setNameValid ] = useState(true);


  //Start with a blank device
  const [device, setDevice] = useState({
    name:"",
    description: "",
    available: true,
    users: [],
  });

  //If a prop is specified, load the details into the state hooks, if not, they will be blank
  useEffect(() => {
    async function loadDataFromEndpoints() {
        if (id!=="" && id!==undefined) {
            let device = await fetch (devicesEndpoint+id);
            let jsonDevice = await device.json();
            setDevice(jsonDevice);         }
   }
    loadDataFromEndpoints();
  },[props]);

  function checkValid() {
    let result = true;
    if (device.name == "") {
      setNameValid(false);
      result = false;
    }
    else {
      setNameValid(true);
    }
    return result;
  }

  async function handleSubmit(e) {
    //Prevent any default form action happening
    e.preventDefault();

    if (!checkValid()) {
        return false;
    }

    let methodType;

    if (device.id === undefined) {
        methodType = "POST"; //create
    }
    else {
        methodType = "PUT"; //update
    }

    let response = await fetch(devicesEndpoint, {
        method: methodType,
        headers: {
            'Content-type': 'application/json'
        },
     body: JSON.stringify(device)
   });

   if (!response.ok) {
    let json = await response.json();
    console.log("Posting user update failed - " + response.statusText);
    alert("Update failed - " + json["message"]);
    return;
   }

   //Return to previous page
   navigate(-1); 
  };

    return (
      <div className="App-header">
        <Form onSubmit = {e => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="formDevice">
            <Form.Label>Device name</Form.Label>
            <Form.Control type="text" placeholder="Enter device name"
            onChange={ e=> setDevice(prev => {return {...prev, name: e.target.value}}) }  value={device!==undefined && device.name || "" } />
            <Form.Text className="text-muted">
              This must be unique.
            </Form.Text>
            {!nameValid && <Alert variant="danger">Device name must be specified</Alert> }
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDevice">
            <Form.Label>Device description</Form.Label>
            <Form.Control type="text" placeholder="Enter device description" 
              onChange={ e=> setDevice(prev => {return {...prev, description: e.target.value}}) }  value={device!==undefined && device.description|| "" } />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Device available?" 
              onChange={e=> setDevice(prev => {return {...prev, available: e.target.checked}}) }  checked={device!==undefined && device.available } />
          </Form.Group>
          <hr/>
          <Button variant="success" type="submit">
            Apply
          </Button>
          <Button variant="danger" onClick={()=>{navigate(-1);}} >
            Cancel
          </Button>
        </Form>
      </div>
    );    
}