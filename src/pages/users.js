import {UserList} from '../components/userlist';

export function Users(props) {
  return (
    <div className='app'>
      <div className="App-header">
        <UserList /> 
      </div>
    </div>
  );
}