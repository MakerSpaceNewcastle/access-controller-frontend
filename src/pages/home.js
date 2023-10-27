import '../App.css';
import MakerLogo from '../img/makerlogo.png'

export function Home() {
  return (
    <div className="App-header">
      {<img src={MakerLogo} alt="Logo" />}
      Welcome to the Maker Space Access Control System
    </div>
  );
}