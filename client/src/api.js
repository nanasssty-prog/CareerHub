import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Перехватчик запросов
api.interceptors.request.use((config) => {
  // Поиск токена авторизации в памяти браузера
  const token = localStorage.getItem("token");

  // Если токен есть, передавать его в заголовок каждого запроса
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Готовые функции CRUD для использования в компонентах
export const fetchVacancies = () => api.get("/vacancies");
export const addVacancy = (vacancy) => api.post("/vacancies", vacancy);
export const updateVacancy = (id, updatedVacancy) =>
  api.put(`/vacancies/${id}`, updatedVacancy);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}`);
