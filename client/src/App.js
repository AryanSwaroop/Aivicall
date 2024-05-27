import HomeMain from './exports/home/HomeMain.jsx';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import './css/main.css';
import InterfaceMain from './exports/interface/InterfaceMain.jsx';
import Room from './exports/app/room.jsx';


function App() {

  return (
    <div>
    <Routes>
        <Route path="/" element={<HomeMain />}/>
        <Route path="/create" element={<InterfaceMain/>} />
        <Route path="/room/:roomId" element={<Room/>} />
    </Routes>
    </div>
  );
}

export default App;
