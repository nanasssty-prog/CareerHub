import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchVacancies = (searchQuery = "") => {
  return api.get("/vacancies", {
    params: { search: searchQuery },
  });
};
export const addVacancy = (vacancy) => api.post("/vacancies", vacancy);
export const updateVacancy = (id, updatedVacancy) =>
  api.put(`/vacancies/${id}`, updatedVacancy);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);
