import axios from "axios";

const baseUrl = "http://localhost:3001/api/titles";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const titleservice = { getAll };

export default titleservice;
