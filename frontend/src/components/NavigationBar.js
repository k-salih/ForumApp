import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Forum Salih
      </Link>
      <ul>
        <Link to="/popular-titles">Popular Titles</Link>
        <Link to="/login">Login</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
