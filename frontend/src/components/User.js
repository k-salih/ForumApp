import PropTypes from "prop-types";
import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Entry from "./Entry";
import { UsersContext } from "../App";

const User = () => {
  const users = useContext(UsersContext);

  const username = useParams().username;
  const user = users.find((user) => user.username === username);

  if (!user) return null;

  return (
    <div>
      <h2 align="center">{user.username}</h2>
      {user.entries.map((entry) => (
        <div key={entry.id}>
          <Link to={`/titles/${entry.title}`}>
            <h3 align="center">{entry.title}</h3>
          </Link>
          <Entry entries={[entry]} />
        </div>
      ))}
    </div>
  );
};

User.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      entries: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default User;
