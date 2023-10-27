//React imports
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';

//Bootstrap imports
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Self-imports
import { loggedInUser } from '../loggedinuser';

//Endpoints this page uses
const loginEndpoint = process.env.REACT_APP_API_BASEURL  + "auth/login"

export function LoginForm(props) {

  const { username, setUsername } =  useContext(loggedInUser);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    //Get values from the form
    let username = e.target.elements.username.value;
    let password = e.target.elements.password.value;

    try  {
      let response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
          body: JSON.stringify({"username": username, "password": password
        })
      });

      if (response.ok) {  
        //Store the logged in username in the global context  
        setUsername(username);
        //Back to homepage (the navbar will update with new links via context)
        navigate("/");
      }
      else {
        //Get the message from the server's JSON reply
        let result = await response.json();
        window.alert("Login failed: " + result.message)
      }
    }
    catch (err) {
      alert("Login failed: " + err.message)
    }
  }

  return (
    <div className="App-header">
      <Form onSubmit = {e => handleSubmit(e)}>
        <Form.Group className="mb-1" >
          <Form.Label>Username</Form.Label>
          <Form.Control  name="username" type="text" placeholder="Enter Administrator username" />
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" placeholder="Password" />
        </Form.Group>
        <hr/>
       <Button variant="success" type="submit">
        Login
       </Button>
       <Button variant="danger" onClick="this.href='http://www.google.com'" >
        Cancel
       </Button>
     </Form>
    </div>
  );
}