import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = ({ titles, user, handleLogout }) => {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Forum Salih
      </Link>
      <SearchBar titles={titles} />
      <ul>
        <Link to="/popular-titles">Popular Titles</Link>
        {user ? (
          <ul>
            <Link to={`/profile/${user.username}`}>Profile</Link>
            <button onClick={handleLogout}> Logout </button>
          </ul>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
