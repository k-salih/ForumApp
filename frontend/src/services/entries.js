import axios from "axios";

const baseUrl = "http://localhost:3001/api/entries";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const entryService = { getAll };

export default entryService;
