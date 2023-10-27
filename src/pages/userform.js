import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'bootstrap/dist/css/bootstrap.min.css';

import {CleverTable} from '../components/clevertable'
import {UserFormAddRfidModal} from '../components/userform_addrfid_modal'
import {UserFormAddDeviceModal} from '../components/userform_adddevice_modal'

//Endpoints this page uses
const usersEndpoint = process.env.REACT_APP_API_BASEURL  + "users/"
const devicesEndpoint = process.env.REACT_APP_API_BASEURL + "devices/"

//If a device with this name exists, it will be auto-added when a new user is created.
const defaultDeviceToAdd = "Back door"; //process.env.REACT_APP_DEFAULT_DEVICE;

export function UserForm(props) {

  const navigate = useNavigate();
  const { id } = useParams()

  //Start with a blank user.
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    active: true,
    rfids: [],
    permissions: []
  });

  const [allDevices, setAllDevices ] = useState([]);

  //If the rfid modal is called to modify an existing RFID, it goes here.
  const [rfidToModify, setRfidToModify] = useState({});

  //The states for which modals are visible.
  const [modalRfidVisible, setModalRfidVisible] = useState(false);
  const [modalDeviceVisible, setModalDeviceVisible] = useState(false);

  //Hooks for the form validators
  const [nameValid, setNameValid ] = useState(true);

  //If a prop is specified, load the details into the state hooks, if not, they will be blank
  useEffect(() => {
    async function loadDataFromEndpoints() {
      //If user id is not blank, load this user.
      if (id!==undefined) {
        let response = await fetch (usersEndpoint+id);
        let jsonuser = await response.json();
        //the user object will contain both the rfids and permissions entries.
        setUser(prev=> {return jsonuser});
      }

      //load devices list from JSON endpoints
      let allDevices = await fetch(devicesEndpoint);
      let jsonAllDevices = await allDevices.json();
      setAllDevices(jsonAllDevices);
      console.log(jsonAllDevices);

      if (id===undefined && user.permissions.count==undefined ) {
        //If this is a new create user, find and add the default device if it exists.
        jsonAllDevices.forEach(e=>  {
          if (e.name == defaultDeviceToAdd) {
            setUser(prev=> {
              return {...prev, permissions: [e]}
            })
          };
        });
    }
  };
    loadDataFromEndpoints();
  },[props]);


  function checkValid() {
    let result = true;
    if (user.name == "") {
      result = false;
      setNameValid(false);
    }
    return result;
  }

  //Remove the RFID specified by ID from the list of users' rfids
  function deleteRfid(ids) {
    ids.forEach(id=> {  
      setUser(prev=> {
        return {...prev, rfids: prev.rfids.filter(e=>e.id != id)}  
      });  
    });
  }
  
  function handleAddRfid(rfid) {
    //This function decides whether to add an RFID or update an existing one, depending on 
    //whether the id parameter is set or not.    
    if (rfid.id !== undefined) {
      //Update
      setUser(prev=> {
        return {...prev, rfids: [...prev.rfids.filter(e=>e.id !== rfid.id), rfid]}  
      });
    }
    else {
      //Create
      //this ID won't have an id parameter.
      //If we don't create one then we can't modify it etc as we've no way to identify it.
      //So, give it a temporary id of TEMP:+hash. Once the user object is posted, the server will ignore this anyway.
      rfid.id = "TEMP" + rfid.card_hash;
      setUser(prev=> {
        return {...prev, rfids: [...prev.rfids, rfid] }
      });
    }
    setModalRfidVisible(false);
  }

  function deleteDevice(ids) { 
    ids.forEach(id=> {
      setUser(prev=> {
        return {...prev, permissions: prev.permissions.filter(e=>e.id != id)}
      });
    });
  }

  function handleAddDevice(device) {
    setUser(prev=> {
      return {...prev, permissions: [...prev.permissions, device]}
    })
    //Hide the modal again
    setModalDeviceVisible(false);
  }

  async function handleSubmit(e) {
    //Block default action
    e.preventDefault();

    if (!checkValid()) {
      return false;
    }

    let response;
    let methodType;

    if (user.id === undefined) {
      methodType = "POST"; //create
    }
    else {
      methodType = "PUT"; //update
    }

    response = await fetch(usersEndpoint, {
      method: methodType,
      headers: {
        'Content-type': 'application/json'
      },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        alert("Update failed - " + response.statusText);
      }
      navigate(-1);
    }
    
    return (
      <div className="App-header">
        <Form onSubmit = {e => handleSubmit(e) } >
        <Form.Group className="mb-3" controlId="formDevice">
          <Form.Label>User name</Form.Label>
          <Form.Control type="text" placeholder="Enter user name" 
            onChange={e=> setUser(prev => {return {...prev, name: e.target.value}}) }  value={user.name} />
          <Form.Text className="text-muted">
            This must be unique.
          </Form.Text>
          {!nameValid && <Alert variant="danger">User name must be specified</Alert> }


        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formDevice">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text" placeholder="Email address (optional)" 
           onChange={e=> setUser(prev => {return {...prev, email: e.target.value}}) }  value={user!==undefined && user.email|| ""} />
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formDevice">
          <Form.Label>Contact Tel</Form.Label>
          <Form.Control type="text" placeholder="Contact tel (optional)" 
          onChange={e=> setUser(prev => {return {...prev, phone: e.target.value}}) }  value={user!==undefined && user.phone|| ""} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Member active?" 
          onChange={e=> setUser(prev => {return {...prev, active: e.target.checked}}) }  checked={user!==undefined && user.active} />
        </Form.Group>

        <hr/>
        Assigned RFIDs:
        <CleverTable key="rfidtable"
          header={[{name: "description" , title: "Description"} , {name: "card_hash" , title: "Hash"}, {name: "active", title:"Enabled?"}]}
          data={user !== undefined && user.rfids || []}
          deleteFunction={deleteRfid}
          modifyFunction={(selectedIds)=>{    
            setRfidToModify(...user.rfids.filter(e=>e.id == selectedIds[0]));
            setModalRfidVisible(true)}
          }
          addFunction={()=>{
            setRfidToModify();  
            setModalRfidVisible(true)}
          }
        />
        <hr/>
      
        Authorised devices:
        <CleverTable key="devicetable"
          header={[{name: "name", title: "Name"}, {name:"description", title: "Description"}, {name:"available", title:"Available?"}]}
          data={user.permissions} 
          deleteFunction = {deleteDevice} 
          addFunction = {()=>{setModalDeviceVisible(true)}}
        />

        <UserFormAddRfidModal key="addRfidModal" 
          show={modalRfidVisible} 
          rfid = {rfidToModify}
          okFunction = {handleAddRfid}  
          closeFunction={()=>{setModalRfidVisible(false)}} 
        />

        <UserFormAddDeviceModal 
          key="addDeviceModal" show={modalDeviceVisible} currentDevices={user.permissions} allDevices={allDevices} 
          okFunction={handleAddDevice}
          closeFunction={()=>{setModalDeviceVisible(false)}}
        />
        
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
