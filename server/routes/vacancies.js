const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { Vacancy } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const vacancies = await Vacancy.findAll();
    res.json(vacancies);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const vacancy = await Vacancy.findByPk(id);

    if (!vacancy) {
      return res.status(404).json({ error: `Вакансия с ID ${id} не найдена` });
    }

    res.json(vacancy);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      description,
      location,
      employmentType,
      workplaceType,
      experienceLevel,
      skillsRequired,
      salary,
      status,
    } = req.body || {};

    if (!title || !companyName) {
      return res.status(400).json({
        error: "Поля 'title' и 'companyName' обязательны для заполнения",
      });
    }

    const newVacancy = await Vacancy.create({
      title,
      companyName,
      description: description || "",
      location: location || "",
      employmentType: employmentType || "",
      workplaceType: workplaceType || "",
      experienceLevel: experienceLevel || "",
      skillsRequired: skillsRequired || [],
      salary: salary || {},
      status: status || "Активна",
    });

    res.status(201).json(newVacancy);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      title,
      companyName,
      description,
      location,
      employmentType,
      workplaceType,
      experienceLevel,
      skillsRequired,
      salary,
      status,
    } = req.body || {};

    if (!title || !companyName) {
      return res.status(400).json({
        error: "Поля 'title' и 'companyName' обязательны при полном обновлении",
      });
    }

    const vacancy = await Vacancy.findByPk(id);

    if (!vacancy) {
      return res
        .status(404)
        .json({ error: `Вакансия с ID ${id} не найдена для обновления` });
    }

    await vacancy.update({
      title,
      companyName,
      description: description || "",
      location: location || "",
      employmentType: employmentType || "",
      workplaceType: workplaceType || "",
      experienceLevel: experienceLevel || "",
      skillsRequired: skillsRequired || [],
      salary: salary || {},
      status: status || "Активна",
    });

    res.json(vacancy);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const vacancy = await Vacancy.findByPk(id);

    if (!vacancy) {
      return res
        .status(404)
        .json({ error: `Вакансия с ID ${id} не найдена для удаления` });
    }

    await vacancy.destroy();

    res.json({ message: `Вакансия с ID ${id} успешно удалена` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
