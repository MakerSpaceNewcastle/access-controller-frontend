import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useEffect, useState } from 'react';
import {LinkContainer} from 'react-router-bootstrap'
import { useContext } from 'react';

import { loggedInUser } from '../loggedinuser';

export function NavBar (props) {
  const { username, setUsername } = useContext(loggedInUser);

    return (
        <Navbar bg="dark" variant="dark" >
        <Container>
          <Navbar.Brand>Makerspace</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav >
            {username!="" && 
            <LinkContainer to="/users">
            <Nav.Link>Users</Nav.Link>
            </LinkContainer>
            }

            {username!="" && 
            <LinkContainer to="/devices">
            <Nav.Link>Devices</Nav.Link>
            </LinkContainer>
            }     

            {username!="" && 
            <LinkContainer to="/administrators">
            <Nav.Link>Admins</Nav.Link>
            </LinkContainer>
            }

            {username!="" && 
            <LinkContainer to="/logs">
            <Nav.Link>Logs</Nav.Link>
            </LinkContainer>
            }
            
            {username!="" && 
            <LinkContainer to="/logout">
            <Nav.Link>Logout ({username})</Nav.Link>
            </LinkContainer>
            } 
            
            {username == "" && 
          <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
          </LinkContainer>
          }
      
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}