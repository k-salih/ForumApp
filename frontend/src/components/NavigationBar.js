import { Link } from "react-router-dom";
import storageService from "../services/storage";

const Navbar = () => {
  const user = storageService.loadUser();

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Forum Salih
      </Link>
      <ul>
        <Link to="/popular-titles">Popular Titles</Link>
        {user ? (
          <ul>
            <Link to={`/profile/${user.username}`}>Profile</Link>
          </ul>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
