import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EntryForm from "./EntryForm";

const SearchBar = ({ titles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults([]);
      return;
    }
    const results = titles.filter((title) =>
      title.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, titles]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      {searchResults.length > 0 && searchTerm !== "" && (
        <div className="dropdown">
          {searchResults.map((title) => (
            <div key={title.id}>
              <Link to={`/titles/${title.name}`}>{title.name}</Link>
            </div>
          ))}
        </div>
      )}
      {searchTerm !== "" && searchResults.length === 0 && (
        <div className="dropdown">
          <div>
            <EntryForm
              title={searchTerm}
              placeholder={`No one has written about '${searchTerm}' yet. Please enter your opinion on title '${searchTerm}'`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
