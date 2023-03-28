import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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
import EditEntry from "./components/EditEntry";
import User from "./components/User";
import NavigationBar from "./components/NavigationBar";
import Profile from "./components/Profile";

export const UsersContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [titles, setTitles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

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
    window.localStorage.removeItem("forumappUser");
    setUser(null);
  };

  return (
    <>
      <UsersContext.Provider value={users}>
        <NavigationBar
          user={user}
          titles={titles}
          handleLogout={() => {
            logout();
            navigate("/");
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <div>
                  {user.username} logged in <br />
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
          <Route
            path={"/entries/:id/edit"}
            element={<EditEntry entries={entries} />}
          />
          <Route path={"/users/:username"} element={<User users={users} />} />
          <Route
            path={"/profile/:username"}
            element={
              <Profile
                handleLogout={() => {
                  logout();
                  navigate("/");
                }}
              />
            }
          />
        </Routes>
      </UsersContext.Provider>
    </>
  );
}

export default App;
