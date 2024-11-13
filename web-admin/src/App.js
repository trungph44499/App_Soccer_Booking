import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login_page";
import UserManagement from "./pages/user_management";
import AdminManagement from "./pages/admin_page";
import WebSocketContext from "./context/WebSocketContext";
import Payment from "./pages/payment";
import StadiumManagement from "./pages/StadiumManagement"; // Import mới

function App() {
  return (
    <div className="App">
      <WebSocketContext
        child={
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/user" element={<UserManagement />} />
              <Route path="/admin" element={<AdminManagement />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/stadium-management" element={<StadiumManagement />} /> 
            </Routes>
          </BrowserRouter>
        }
      />
    </div>
  );
}

export default App;
