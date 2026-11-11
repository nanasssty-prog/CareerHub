const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const Vacancy = require("../models/vacancy");

router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { skillsRequired: { $regex: search, $options: "i" } },
        ],
      };
    }

    const vacancies = await Vacancy.find(query);

    const formattedVacancies = vacancies.map((v) => {
      const doc = v.toObject();
      doc.id = doc._id;
      return doc;
    });

    res.json(formattedVacancies);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ error: "Вакансия не найдена" });

    const doc = vacancy.toObject();
    doc.id = doc._id;
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, companyName, salaryFrom, salaryTo, skillsRequired } =
      req.body || {};
    if (!title || !companyName) {
      return res
        .status(400)
        .json({ error: "Поля 'title' и 'companyName' обязательны" });
    }

    const newVacancy = await Vacancy.create({
      title,
      companyName,
      salaryFrom: salaryFrom ? Number(salaryFrom) : null,
      salaryTo: salaryTo ? Number(salaryTo) : null,
      skillsRequired: skillsRequired || "",
      responses: [],
    });

    const doc = newVacancy.toObject();
    doc.id = doc._id;
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, companyName, salaryFrom, salaryTo, skillsRequired } =
      req.body || {};
    if (!title || !companyName) {
      return res
        .status(400)
        .json({ error: "Поля 'title' и 'companyName' обязательны" });
    }

    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      { title, companyName, salaryFrom, salaryTo, skillsRequired },
      { new: true },
    );

    if (!updatedVacancy)
      return res.status(404).json({ error: "Вакансия не найдена" });

    const doc = updatedVacancy.toObject();
    doc.id = doc._id;
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const deletedVacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (!deletedVacancy)
      return res.status(404).json({ error: "Вакансия не найдена" });

    res.json({ message: `Вакансия успешно удалена` });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/responses", async (req, res, next) => {
  try {
    const { candidateName, coverLetter } = req.body;
    if (!candidateName) {
      return res.status(400).json({ error: "Имя кандидата обязательно" });
    }

    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ error: "Вакансия не найдена" });

    vacancy.responses.push({
      candidateName,
      coverLetter: coverLetter || "",
    });

    await vacancy.save();

    res.status(201).json({
      message: "Отклик успешно добавлен!",
      responses: vacancy.responses,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
