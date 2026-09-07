const express = require("express");
const router = express.Router();

let resumes = [
  {
    id: 1,
    title: "Backend Developer",
    name: "Иванов Иван",
    skills: ["JavaScript", "Express", "Node.js"],
  },
  {
    id: 2,
    title: "Backend Developer",
    name: "Шевкович Анна",
    skills: ["JavaScript", "Express", "Node.js", "Redis"],
  },
  {
    id: 3,
    title: "Frontend Developer",
    name: "Петров Петр",
    skills: ["Figma", "JavaScript"],
  },
];

router.get("/", (req, res, next) => {
  try {
    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const resume = resumes.find((r) => r.id === id);

    if (!resume) {
      return res.status(404).json({ error: `Резюме с ID ${id} не найдено` });
    }

    res.json(resume);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { title, name, skills } = req.body || {};

    if (!title || !name) {
      return res
        .status(400)
        .json({ error: "Поля 'title' и 'name' обязательны для заполнения" });
    }

    const newResume = {
      id: resumes.length > 0 ? Math.max(...resumes.map((r) => r.id)) + 1 : 1, // Генерация ID
      title,
      name,
      skills: skills || [],
    };

    resumes.push(newResume);
    res.status(201).json(newResume);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, name, skills } = req.body || {};

    const resumeIndex = resumes.findIndex((r) => r.id === id);

    if (resumeIndex === -1) {
      return res
        .status(404)
        .json({ error: `Резюме с ID ${id} не найдено для обновления` });
    }

    if (!title || !name) {
      return res.status(400).json({
        error: "Поля 'title' и 'name' обязательны при полном обновлении",
      });
    }

    resumes[resumeIndex] = { id, title, name, skills: skills || [] };

    res.json(resumes[resumeIndex]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const resumeIndex = resumes.findIndex((r) => r.id === id);

    if (resumeIndex === -1) {
      return res
        .status(404)
        .json({ error: `Резюме с ID ${id} не найдено для удаления` });
    }

    resumes.splice(resumeIndex, 1);

    res.json({ message: `Резюме с ID ${id} успешно удалено` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
