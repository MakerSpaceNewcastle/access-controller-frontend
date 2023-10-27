import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import {Home} from './pages/home'

import {NavBar} from './components/navbar'

import {Users} from './pages/users'
import {UserForm} from './pages/userform'

import {Devices} from './pages/devices'
import {DeviceForm} from './pages/deviceform'

import {Admins} from './pages/admins'
import {AdminForm} from './pages/adminform'

import {Logs} from './pages/logs'

import {LoginForm} from './pages/loginform'
import {LogoutForm} from './pages/logoutform'

//A state object used to tell whether a user is logged in or not.
import {loggedInUser} from './loggedinuser';

export default function App(props) {
  const [username, setUsername] = useState("");

  return (
    <loggedInUser.Provider value = {{ username, setUsername}}>
      <React.StrictMode>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/users" element={<Users/>} />
            <Route exact path="/users/form" element={<UserForm/>} />
            <Route exact path="/users/form/:id" element={<UserForm />} />
            <Route exact path="/devices" element={<Devices/>} />
            <Route exact path="/devices/form" element={<DeviceForm/>} />
            <Route exact path="/devices/form/:id" element={<DeviceForm/>} />
            <Route exact path="/administrators" element={<Admins/>} />
            <Route exact path="/administrators/form" element={<AdminForm/>} />
            <Route exact path="/administrators/form/:id" element={<AdminForm/>} />
            <Route exact path="/logs" element={<Logs/>} />
            <Route exact path="/login" element = {<LoginForm/>} />
            <Route exact path="/logout" element = { <LogoutForm />} />
          </Routes>
        </Router>
       </React.StrictMode>
    </loggedInUser.Provider> 
  );
};
