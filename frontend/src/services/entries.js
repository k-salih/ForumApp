import axios from "axios";

const baseUrl = "http://localhost:3001/api/entries";
const authorization = `Bearer ${
  JSON.parse(window.localStorage.getItem("forumappUser")).token
}`;

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject);
  return response.data;
};

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: authorization },
  };
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: authorization },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
};

const entryService = { getAll, create, update, remove };

export default entryService;
