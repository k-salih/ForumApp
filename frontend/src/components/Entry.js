import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const Entry = ({ entries }) => {
  const id = useParams().id;
  const entry = entries.find((entry) => entry.id === id);
  return (
    <div>
      <h2>{entry.content}</h2>
    </div>
  );
};

Entry.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Entry;
