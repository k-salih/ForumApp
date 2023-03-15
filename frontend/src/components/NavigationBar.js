import { Link } from "react-router-dom";

const Navbar = (title, user) => {
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
