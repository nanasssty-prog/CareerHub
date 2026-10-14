import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initialVacancies = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Belinvestbank",
    salary: 2100,
  },
  { id: 2, title: "Backend Developer", company: "BelarusBank", salary: 2500 },
  { id: 3, title: "UI/UX Designer", company: "UIAgency", salary: 1600 },
  { id: 4, title: "Business Analyst", company: "SoftClub", salary: 1700 },
  { id: 5, title: "Backend Developer", company: "SoftClub", salary: 2200 },
  { id: 6, title: "Test Engineer", company: "BelarusBank", salary: 1600 },
];

export default function VacancyList() {
  const [vacancies, setVacancies] = useLocalStorage(
    "careerhub_vacancies",
    initialVacancies,
  );

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [sortType, setSortType] = useState("default");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !salary.trim()) return;

    if (editingId) {
      setVacancies(
        vacancies.map((vacancy) =>
          vacancy.id === editingId
            ? { ...vacancy, title, company, salary: Number(salary) }
            : vacancy,
        ),
      );
      setEditingId(null);
    } else {
      const newVacancy = {
        id: Date.now(),
        title: title,
        company: company,
        salary: Number(salary),
      };
      setVacancies([newVacancy, ...vacancies]);
    }

    setTitle("");
    setCompany("");
    setSalary("");
  };

  const handleEdit = (vacancy) => {
    setEditingId(vacancy.id);
    setTitle(vacancy.title);
    setCompany(vacancy.company);
    setSalary(vacancy.salary);
  };

  const handleDelete = (id) => {
    setVacancies(vacancies.filter((vacancy) => vacancy.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setCompany("");
      setSalary("");
    }
  };

  const filteredVacancies = vacancies.filter(
    (vacancy) =>
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedAndFilteredVacancies = [...filteredVacancies].sort((a, b) => {
    switch (sortType) {
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      case "salary_asc":
        return a.salary - b.salary;
      case "salary_desc":
        return b.salary - a.salary;
      default:
        return 0;
    }
  });

  const totalCount = sortedAndFilteredVacancies.length;
  const sumSalary = sortedAndFilteredVacancies.reduce(
    (acc, curr) => acc + curr.salary,
    0,
  );
  const averageSalary = totalCount > 0 ? Math.round(sumSalary / totalCount) : 0;

  return (
    <div className="mt-4 pb-5">
      {/* Форма */}
      <div
        className={`card mb-4 shadow-sm border-0 ${editingId ? "bg-warning-subtle" : "bg-light"}`}
      >
        <div className="card-body">
          <h5
            className={`card-title mb-3 ${editingId ? "text-warning" : "text-primary"}`}
          >
            {editingId ? "Редактирование вакансии" : "Добавить новую вакансию"}
          </h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Компания"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Зарплата (\$)"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button
                type="submit"
                className={`btn w-100 fw-bold ${editingId ? "btn-warning" : "btn-primary"}`}
              >
                {editingId ? "Сохранить" : "+ Добавить"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary w-50"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setCompany("");
                    setSalary("");
                  }}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Поиск и сортировка */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h2 className="mb-0">Список вакансий</h2>
        <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: "600px" }}>
          <input
            type="text"
            className="form-control border-primary w-50"
            placeholder="🔍 Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-select border-primary w-50"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Сортировка: По умолчанию</option>
            <option value="title_asc">Название (А-Я)</option>
            <option value="title_desc">Название (Я-А)</option>
            <option value="salary_asc">Зарплата (по возрастанию)</option>
            <option value="salary_desc">Зарплата (по убыванию)</option>
          </select>
        </div>
      </div>

      <div className="alert alert-info d-flex justify-content-between align-items-center mb-3 shadow-sm">
        <span>
          <strong>Найдено вакансий:</strong> {totalCount}
        </span>
        <span>
          <strong>Средняя зарплата:</strong> {averageSalary} \$
        </span>
      </div>

      {/* Список вакансий */}
      {sortedAndFilteredVacancies.length === 0 ? (
        <p className="text-muted text-center mt-5 fs-5">
          По вашему запросу ничего не найдено.
        </p>
      ) : (
        <ul className="list-group shadow-sm">
          {sortedAndFilteredVacancies.map((vacancy) => (
            <li
              key={vacancy.id}
              className="list-group-item d-flex justify-content-between align-items-center p-3"
            >
              <div>
                <strong className="fs-5 text-dark">{vacancy.title}</strong>
                <span className="text-secondary ms-2">({vacancy.company})</span>
              </div>
              <div>
                <span className="badge bg-success rounded-pill px-3 py-2 fs-6 me-3">
                  {vacancy.salary} \$
                </span>
                <button
                  onClick={() => handleEdit(vacancy)}
                  className="btn btn-sm btn-outline-warning me-2"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(vacancy.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
