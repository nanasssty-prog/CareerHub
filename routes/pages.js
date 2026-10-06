const {
  validateFields,
  validateStringValue,
  validateNumberValue,
} = require("../validation/validationHelper.js");

const express = require("express");
const router = express.Router();
const { Vacancy } = require("../models");

const simulateAuth = require("../middleware/simulateAuth");

// Рендер списка вакансий
router.get("/", async (req, res, next) => {
  try {
    //throw new Error("Тестовая поломка для 500 ошибки");
    const vacancies = await Vacancy.findAll();
    res.render("index", { vacancies });
  } catch (error) {
    next(error);
  }
});

// Рендер детальной страницы
router.get("/item/:id", async (req, res, next) => {
  try {
    const vacancy = await Vacancy.findByPk(req.params.id);
    if (!vacancy) return next();
    res.render("item", { vacancy });
  } catch (error) {
    next(error);
  }
});

// Форма добавления
router.get("/add", simulateAuth, (req, res) => {
  res.render("add");
});

// Сохранение данных
router.post("/add", simulateAuth, async (req, res, next) => {
  try {
    const { title, description, salary } = req.body;

    // Валидация данных
    const validationErrors = [];
    let errors = validateFields({ title, description, salary });
    validationErrors.push(...errors);

    const titleError = validateStringValue({ title }, 5, 100);
    if (titleError) validationErrors.push(titleError);

    const descriptionError = validateStringValue({ description }, 10, 500);
    if (descriptionError) validationErrors.push(descriptionError);

    const salaryError = validateNumberValue({ salary }, 1, 100000);
    if (salaryError) validationErrors.push(salaryError);

    if (validationErrors.length > 0) {
      return res.render("add", { error: validationErrors.join(", ") });
    }

    await Vacancy.create({ title, description, salary });
    res.redirect("/");
  } catch (error) {
    res.render("add", { error: "Произошла ошибка при сохранении" });
  }
});

router.get("/login", (req, res) => {
  res.send("Страница входа. Для имитации авторизации добавьте ?auth=1 к URL.");
});

module.exports = router;
