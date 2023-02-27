import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import loginService from "./services/login";
import storageService from "./services/storage";

import LoginForm from "./components/LoginForm";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = storageService.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      storageService.saveUser(user);
    } catch (e) {
      alert("Username or password is incorrect");
    }
  };

  return (
    <Router>
      <div>
        <Link to="/login">login</Link>
      </div>

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <p>{user.username} logged in</p>
            ) : (
              <LoginForm onLogin={login} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
