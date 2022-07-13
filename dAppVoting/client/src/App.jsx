import { EthProvider } from "./contexts/EthContext";
import NavigationBar from "./components/NavigationBar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {

  return (
    <EthProvider>
      <div className="App" >
        <div className="container">
          <NavigationBar />
         </div>
      </div>
    </EthProvider>
  );
}


