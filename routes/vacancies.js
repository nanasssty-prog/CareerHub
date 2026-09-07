const express = require("express");
const router = express.Router();

let vacancies = [
  {
    id: 1,
    title: "Backend Developer",
    companyName: "БеларусБанк",
    description: "",
    location: "Минск, Беларусь",
    employmentType: "Полная занятость",
    workplaceType: "В офисе",
    experienceLevel: "Senior",
    skillsRequired: ["TypeScript", "Docker", "REST API"],
    salary: { from: 3000, to: 4500, currency: "РБ" },
    status: "Активна",
  },
  {
    id: 2,
    title: "Frontend Developer",
    companyName: "БелинвестБанк",
    description: "",
    location: "Орша, Беларусь",
    employmentType: "Контракт",
    workplaceType: "Удаленно",
    experienceLevel: "Middle",
    skillsRequired: ["Figma", "JavaScript"],
    salary: { from: 2000, to: 2500, currency: "РБ" },
    status: "Активна",
  },
  {
    id: 3,
    title: "1С Программист",
    companyName: "ГБСофт",
    description: "",
    location: "Минск, Беларусь",
    employmentType: "Стажировка",
    workplaceType: "Частичная занятость",
    experienceLevel: "Intern",
    skillsRequired: ["1С"],
    salary: { from: 500, to: 600, currency: "USD" },
    status: "Активна",
  },
  {
    id: 4,
    title: "Backend Developer",
    companyName: "Инновайз",
    description: "",
    location: "Минск, Беларусь",
    employmentType: "Частичная занятость",
    workplaceType: "Гибрид",
    experienceLevel: "Junior",
    skillsRequired: ["TypeScript", "Docker", "REST API"],
    salary: { from: 3000, to: 4500, currency: "USD" },
    status: "Активна",
  },
];

router.get("/", (req, res, next) => {
  try {
    res.json(vacancies);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const vacancy = vacancies.find((r) => r.id === id);

    if (!vacancy) {
      return res.status(404).json({ error: `Вакансия с ID ${id} не найдена` });
    }

    res.json(vacancy);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { title, companyName, skillsRequired } = req.body || {};

    if (!title || !companyName) {
      return res.status(400).json({
        error: "Поля 'title' и 'companyName' обязательны для заполнения",
      });
    }

    const newvacancy = {
      id:
        vacancies.length > 0 ? Math.max(...vacancies.map((r) => r.id)) + 1 : 1, // Генерация ID
      title,
      companyName,
      skillsRequired: skillsRequired || [],
    };

    vacancies.push(newvacancy);
    res.status(201).json(newvacancy);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, companyName, skillsRequired } = req.body || {};

    const vacancyIndex = vacancies.findIndex((r) => r.id === id);

    if (vacancyIndex === -1) {
      return res
        .status(404)
        .json({ error: `Вакансия с ID ${id} не найдена для обновления` });
    }

    if (!title || !companyName) {
      return res.status(400).json({
        error: "Поля 'title' и 'companyName' обязательны при полном обновлении",
      });
    }

    vacancies[vacancyIndex] = {
      id,
      title,
      companyName,
      skillsRequired: skillsRequired || [],
    };

    res.json(vacancies[vacancyIndex]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const vacancyIndex = vacancies.findIndex((r) => r.id === id);

    if (vacancyIndex === -1) {
      return res
        .status(404)
        .json({ error: `Вакансия с ID ${id} не найдена для удаления` });
    }

    vacancies.splice(vacancyIndex, 1);

    res.json({ message: `Вакансия с ID ${id} успешно удалена` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
