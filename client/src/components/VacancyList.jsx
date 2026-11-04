import React, { useState } from "react";
import {
  fetchVacancies,
  addVacancy,
  updateVacancy,
  deleteVacancy,
} from "../api";
import { useCrud } from "../hooks/useCrud";

export default function VacancyList() {
  const {
    items: vacancies,
    loading,
    error,
    create,
    update,
    remove,
    reload,
  } = useCrud({
    fetchItems: fetchVacancies,
    addItem: addVacancy,
    updateItem: updateVacancy,
    deleteItem: deleteVacancy,
  });

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [sortType, setSortType] = useState("default");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const vacancyData = {
      title,
      companyName: company,
      skillsRequired: skillsRequired,
      salaryFrom: salaryFrom ? Number(salaryFrom) : null,
      salaryTo: salaryTo ? Number(salaryTo) : null,
    };

    const success = editingId
      ? await update(editingId, vacancyData)
      : await create(vacancyData);
    if (success) resetForm();
  };

  const handleEdit = (vacancy) => {
    setEditingId(vacancy.id);
    setTitle(vacancy.title);
    setCompany(vacancy.companyName || "");
    setSkillsRequired(vacancy.skillsRequired || "");
    setSalaryFrom(vacancy.salaryFrom || "");
    setSalaryTo(vacancy.salaryTo || "");
  };

  const handleDelete = async (id) => {
    await remove(id);
    if (editingId === id) resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCompany("");
    setSkillsRequired("");
    setSalaryFrom("");
    setSalaryTo("");
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      reload(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, reload]);

  const sortedVacancies = [...vacancies].sort((a, b) => {
    const getSortSalary = (v) => {
      const from = Number(v.salaryFrom);
      if (from > 0) return from;
      const to = Number(v.salaryTo);
      if (to > 0) return to;
      return 0;
    };

    switch (sortType) {
      case "title_asc":
        return (a.title || "").localeCompare(b.title || "");
      case "title_desc":
        return (b.title || "").localeCompare(a.title || "");
      case "salary_asc":
        return getSortSalary(a) - getSortSalary(b);
      case "salary_desc":
        return getSortSalary(b) - getSortSalary(a);
      default:
        return 0;
    }
  });

  const totalCount = sortedVacancies.length;
  const averageSalary =
    totalCount > 0
      ? Math.round(
          sortedVacancies.reduce(
            (acc, curr) => acc + (curr.salaryFrom || 0),
            0,
          ) / totalCount,
        )
      : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <span className="ms-3 fs-5">Загрузка вакансий...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5 text-center shadow-sm">
        <h4>Ошибка!</h4>
        <p>{error}</p>
        <button className="btn btn-danger mt-2" onClick={reload}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 pb-5">
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
            {/* Первая строка формы */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Компания"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="ЗП от (б.р.)"
                value={salaryFrom}
                onChange={(e) => setSalaryFrom(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="ЗП до (б.р.)"
                value={salaryTo}
                onChange={(e) => setSalaryTo(e.target.value)}
              />
            </div>

            {/* Вторая строка формы: Поле для навыков */}
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Требуемые навыки (например: React, Node.js, Express)"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button
                type="submit"
                className={`btn w-100 fw-bold ${editingId ? "btn-warning" : "btn-primary"}`}
              >
                {editingId ? "Сохранить" : "Добавить"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

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
            <option value="default">Сортировка по умолчанию</option>
            <option value="title_asc">Название (А-Я)</option>
            <option value="salary_desc">Зарплата (убыв.)</option>
          </select>
        </div>
      </div>

      <div className="alert alert-info d-flex justify-content-between mb-3 shadow-sm">
        <span>
          <strong>Найдено:</strong> {totalCount}
        </span>
        <span>
          <strong>Средняя ЗП (от):</strong> {averageSalary} $
        </span>
      </div>

      <ul className="list-group shadow-sm">
        {sortedVacancies.map((v) => (
          <li
            key={v.id}
            className="list-group-item d-flex justify-content-between align-items-center p-3"
          >
            <div>
              <strong className="fs-5 text-dark">{v.title}</strong>
              <span className="text-secondary ms-2">
                ({v.companyName || "Не указана"})
              </span>
              {/* Вывод навыков под названием */}
              <div className="text-muted small mt-1">
                <strong>Навыки:</strong> {v.skillsRequired || "Не указаны"}
              </div>
            </div>
            <div>
              <span className="badge bg-success rounded-pill px-3 py-2 fs-6 me-3">
                {v.salaryFrom ? `${v.salaryFrom}$` : "0$"}{" "}
                {v.salaryTo ? `- ${v.salaryTo}$` : ""}
              </span>
              <button
                onClick={() => handleEdit(v)}
                className="btn btn-sm btn-outline-warning me-2"
              >
                Ред.
              </button>
              <button
                onClick={() => handleDelete(v.id)}
                className="btn btn-sm btn-outline-danger"
              >
                Удал.
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
