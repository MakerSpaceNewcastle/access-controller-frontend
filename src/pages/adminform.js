import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {CleverTable} from '../components/clevertable'
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

let adminEndpoint = process.env.REACT_APP_API_BASEURL + "admins/"

export function AdminForm(props) {

  const { id } = useParams()
  const navigate = useNavigate();

  //Start with a blank admin
  const [admin, setAdmin] = useState({
    username:"",
    password:"",
    password2: ""
  });

  //This hides the alerts on page load
  const [invalidUsername, setinvalidUsername] = useState(false);
  const [passwordNoMatch, setPasswordNoMatch] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  //If a prop is specified, load the details into the state hooks, if not, they will be blank
  useEffect(() => {
    async function loadDataFromEndpoints() {
      if (id!=="" && id!==undefined) {
        //Collect this user's name (backend won't give the pw hash)
        let admin = await fetch (adminEndpoint+id);
        let jsonAdmin = await admin.json();
        setAdmin(prev => {return {...prev, username: jsonAdmin.username}}) 
      }
    }
    loadDataFromEndpoints();
  },[props]);

  function checkValid() {
    let result = true;
    if (admin.username == "") {
      result = false;
      setinvalidUsername(true);
    }
    if (admin.password == "" || admin.password.length < 8) {
      result = false;
      setInvalidPassword(true);
    }
    else setInvalidPassword(false);
    
    if (admin.password != admin.password2) {
      result = false;
      setPasswordNoMatch(true);
    }
    else setPasswordNoMatch(false);

    return result;
  }

  async function handleSubmit(e) {
    //Prevent any default form action happening
    e.preventDefault();

    if (!checkValid()) {
        return false;
    }

    let response;
    let methodType;

    if (id === undefined) {
        methodType = "POST"; //create
    }
    else {
        methodType = "PUT"; //update
    }
    response = await fetch(adminEndpoint, {
      method: methodType,
      headers: {
        'Content-type': 'application/json'
      },
     body: JSON.stringify(admin)
    });

  if (!response.ok) {
    let json = await response.json();
    console.log(json);
    alert("Update failed - " + json["message"]);
    return;
  }
  navigate(-1); 
};

  return (
    <div className="App-header">
      <Form onSubmit = {e => handleSubmit(e)}>

        <Form.Group className="mb-3" >
          <Form.Label>Admin username</Form.Label>
          <Form.Control type="text" placeholder="Enter username"
            onChange={ e=> setAdmin(prev => {return {...prev, username: e.target.value}}) }  value={admin!==undefined && admin.username || "" } />
          <Form.Text className="text-muted">
              This must be unique.
          </Form.Text>
          {invalidUsername && <Alert variant="danger">Admin username must be specified</Alert> }
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" id="password"
           onChange={ e=> setAdmin(prev => {return {...prev, password: e.target.value}})} />
           { invalidPassword && <Alert variant="danger">Password must be minimum 8 chars</Alert> }
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Password (repeat)</Form.Label>
          <Form.Control type="password" placeholder="Enter password" id="password2" 
            onChange={ e=> setAdmin(prev => {return {...prev, password2: e.target.value}})} />
           { passwordNoMatch && <Alert variant="danger">Password does not match</Alert> }
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