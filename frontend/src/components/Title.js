import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import Entry from "./Entry";

const Title = ({ titles }) => {
  const id = useParams().id;
  const title = titles.find((title) => title.id === id);

  if (!title) return null;

  return (
    <div>
      <h2 align="center">{title.name}</h2>
      {title.entries.map((entry) => (
        <div key={entry.id}>
          <Entry entries={[entry]} />
        </div>
      ))}
    </div>
  );
};

Title.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      entries: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          user: PropTypes.shape({
            username: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Title;
