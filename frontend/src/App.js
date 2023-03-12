import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./style.css";

import loginService from "./services/login";
import storageService from "./services/storage";
import titleService from "./services/titles";
import entryService from "./services/entries";
import userService from "./services/users";

import LoginForm from "./components/LoginForm";
import PopularTitles from "./components/PopularTitles";
import Title from "./components/Title";
import Entry from "./components/Entry";
import User from "./components/User";
import NavigationBar from "./components/NavigationBar";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [titles, setTitles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const user = storageService.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    titleService.getAll().then((titles) => setTitles(titles));
    entryService.getAll().then((entries) => setEntries(entries));
    userService.getAll().then((users) => setUsers(users));
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

  const logout = () => {
    setUser(null);
    storageService.removeUser();
  };

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <div>
                {user.username} logged in <br />
                <button onClick={logout}>logout</button>
              </div>
            ) : (
              <LoginForm onLogin={login} />
            )
          }
        />
        <Route
          path="/popular-titles"
          element={<PopularTitles titles={titles} />}
        />
        <Route path={`/titles/:name`} element={<Title titles={titles} />} />
        <Route path={"/entries/:id"} element={<Entry entries={entries} />} />
        <Route path={"/users/:username"} element={<User users={users} />} />
        <Route
          path={"/profile/:username"}
          element={<Profile users={users} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
