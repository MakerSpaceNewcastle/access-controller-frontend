//React
import { useContext } from 'react';

//Self-imports
import { loggedInUser } from '../loggedinuser';

//Endpoints this page uses
const logoutEndpoint = process.env.REACT_APP_API_BASEURL + "auth/logout"

export function LogoutForm() {

    const { username, setUsername } = useContext(loggedInUser);

    //Hit the logout endpoint.
    async function logout() {
        let result = await fetch(logoutEndpoint);
        setUsername("");
        return result.ok;        
    };

    return (
        <div className="App-header">
            { logout() && "Logout Successful"  || "Logout failed" }
        </div>
    );

}