
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Home from './Home/Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/:userId' element={<Home/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
