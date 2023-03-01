import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const Title = ({ titles }) => {
  const id = useParams().id;
  const title = titles.find((title) => title.id === id);
  return (
    <div>
      <h2>{title.name}</h2>
      {title.entries.map((entry) => (
        <div key={entry.id}>
          <p>{entry.content}</p>
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
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Title;