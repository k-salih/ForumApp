import axios from "axios";

const baseUrl = "http://localhost:3001/api/entries";

let authorization;
try {
  authorization = `Bearer ${
    JSON.parse(window.localStorage.getItem("forumappUser")).token
  }`;
} catch (error) {
  console.log("No user logged in");
}

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: authorization },
  };
  const response = await axios.post(baseUrl, newObject, config);
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
  await axios.delete(`${baseUrl}/${id}`, config);
};

const entryService = { getAll, create, update, remove };

export default entryService;
