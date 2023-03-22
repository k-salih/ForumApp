import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import entryService from "../services/entries";

const EditEntry = ({ entries }) => {
  const navigate = useNavigate();
  const id = useParams().id;
  const entryToEdit = entries.find((entry) => entry.id === id);

  const [content, setContent] = useState(entryToEdit.content);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedEntry = {
      ...entryToEdit,
      content,
    };
    entryService.update(id, updatedEntry);
    navigate(`/entries/${updatedEntry.id}`);
  };

  const handleDelete = () => {
    entryService.remove(id);
    navigate(`/titles/${entryToEdit.title}`);
  };

  return (
    <div>
      <h2>Edit entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Entry content"
          />
        </div>
        <button type="submit">Update</button>
      </form>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default EditEntry;
