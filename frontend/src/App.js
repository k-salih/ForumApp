import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import loginService from "./services/login";
import storageService from "./services/storage";
import titleService from "./services/titles";
import entryService from "./services/entries";

import LoginForm from "./components/LoginForm";
import PopularTitles from "./components/PopularTitles";
import Title from "./components/Title";
import Entry from "./components/Entry";

function App() {
  const [user, setUser] = useState(null);
  const [titles, setTitles] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const user = storageService.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    titleService.getAll().then((titles) => setTitles(titles));
    entryService.getAll().then((entries) => setEntries(entries));
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
        <Route path="/entries/:id" element={<Entry entries={entries} />} />
      </Routes>
    </Router>
  );
}

export default App;
