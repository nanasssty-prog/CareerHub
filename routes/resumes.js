const express = require("express");
const router = express.Router();

const { Resume } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const resumes = await Resume.findAll();
    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findByPk(id);

    if (!resume) {
      return res.status(404).json({ error: `Резюме с ID ${id} не найдено` });
    }

    res.json(resume);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, name, skills } = req.body || {};

    if (!title || !name) {
      return res
        .status(400)
        .json({ error: "Поля 'title' и 'name' обязательны для заполнения" });
    }

    const newResume = await Resume.create({
      title,
      name,
      skills: skills || [],
    });

    res.status(201).json(newResume);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, name, skills } = req.body || {};

    if (!title || !name) {
      return res.status(400).json({
        error: "Поля 'title' и 'name' обязательны при полном обновлении",
      });
    }

    const resume = await Resume.findByPk(id);

    if (!resume) {
      return res
        .status(404)
        .json({ error: `Резюме с ID ${id} не найдено для обновления` });
    }

    await resume.update({
      title,
      name,
      skills: skills || [],
    });

    res.json(resume);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findByPk(id);

    if (!resume) {
      return res
        .status(404)
        .json({ error: `Резюме с ID ${id} не найдено для удаления` });
    }

    await resume.destroy();

    res.json({ message: `Резюме с ID ${id} успешно удалено` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
