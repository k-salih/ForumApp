import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import moment from "moment";

const Entry = ({ entries }) => {
  const id = useParams().id;
  const entry = entries.find((entry) => entry.id === id);

  if (!entry) return null;

  return (
    <div>
      <p>{entry.content}</p>
      <p align="right">
        {entry.user.username}
        {" ~ "}
        {entry.updatedAt
          ? moment(entry.updatedAt).format("DD.MM.YYYY HH:mm")
          : moment(entry.createdAt).format("DD.MM.YYYY HH:mm")}
      </p>
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
