import axios from "axios";
const API = "http://localhost:5000/api";

export const generateExtension = async (prompt) => {
  const response = await axios.post(
    `${API}/generate`,
    { prompt }
  );

  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(
    `${API}/projects`
  );

  return response.data;
};
