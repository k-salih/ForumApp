import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PopularTitles = ({ titles }) => {
  titles = titles.sort((a, b) => b.entries.length - a.entries.length);
  return (
    <div>
      {titles.map((title) => (
        <div key={title.id}>
          <li>
            <Link to={`/titles/${title.id}`}>
              {title.name} {title.entries.length}
            </Link>
          </li>
        </div>
      ))}
    </div>
  );
};

PopularTitles.propTypes = {
  titles: PropTypes.array.isRequired,
};

export default PopularTitles;
