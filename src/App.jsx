import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "./styles/global.css";

function App(){
  return(
    <Router>
      <AppRouter/>
    </Router>
  );
}

export default App