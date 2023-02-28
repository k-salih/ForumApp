import PropTypes from "prop-types";

const PopularTitles = ({ titles }) => {
  titles = titles.sort((a, b) => b.entries.length - a.entries.length);
  return (
    <div>
      {titles.map((title) => (
        <div key={title.id}>
          <li>
            {title.name} {title.entries.length}
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
