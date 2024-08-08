import './main.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VillageData from './components/village/VillageData';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/village/:villageId" element={ <VillageData />}/> 
        </Routes>
    </Router>
  );
}

export default App;
