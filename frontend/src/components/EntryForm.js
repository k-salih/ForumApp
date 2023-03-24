import { useState } from "react";
import entryService from "../services/entries";

const EntryForm = ({ title, placeholder }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newEntry = {
      title: title,
      content,
    };

    entryService.create(newEntry);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          value={content}
          onChange={({ target }) => setContent(target.value)}
          placeholder={placeholder}
          rows="5"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default EntryForm;
