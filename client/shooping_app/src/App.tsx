import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import ProtectedRoute from "./feature/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
