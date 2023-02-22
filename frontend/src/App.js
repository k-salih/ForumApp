import { useState, useEffect } from "react";
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

  if (!user) {
    return (
      <div>
        <LoginForm onLogin={login} />
      </div>
    );
  }

  return (
    <div>
      <p>{user.username} logged in</p>
    </div>
  );
}

export default App;
