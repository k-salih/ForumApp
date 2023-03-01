import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import loginService from "./services/login";
import storageService from "./services/storage";
import titleservice from "./services/titles";

import LoginForm from "./components/LoginForm";
import PopularTitles from "./components/PopularTitles";
import Title from "./components/Title";

function App() {
  const [user, setUser] = useState(null);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const user = storageService.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    titleservice.getAll().then((titles) => setTitles(titles));
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
        <Link to="/popular-titles"> popular </Link>
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
        <Route
          path="/popular-titles"
          element={<PopularTitles titles={titles} />}
        />
        <Route path={`/titles/:id`} element={<Title titles={titles} />} />
      </Routes>
    </Router>
  );
}

export default App;
