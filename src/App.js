import './main.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Village from './components/village/Village';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/village/:villageId" element={ <Village />}/> 
        </Routes>
    </Router>
  );
}

export default App;
