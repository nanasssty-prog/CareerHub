const express = require("express");
const app = express();
require("dotenv").config();
const logger = require("./middleware/logger");

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/auth");
const resumesRouter = require("./routes/resumes");
const vacanciesRouter = require("./routes/vacancies");
const pagesRoutes = require("./routes/pages");
const authMiddleware = require("./middleware/auth");

// ПЗ 1 Подключение EJS
app.set("view engine", "ejs");
app.set("views", "./views");
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger); // ПЗ 1 подключение логгера для всех последующих маршрутов

app.use("/auth", authRoutes);
app.use("/resumes", resumesRouter);
app.use("/vacancies", vacanciesRouter);
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Успешный доступ к защищенному маршруту",
    user: req.user,
  });
});

// ПЗ 1 SSR маршруты
app.use("/", pagesRoutes);

// ПЗ 1 Обработчики ошибок
app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

// app.use((err, req, res, next) => {
//   console.error("Глобальный перехват ошибки:", err.stack);

//   res.status(500).json({
//     success: false,
//     error: "На сервере произошла внутренняя ошибка",
//     message: err.message,
//   });
// });

app.listen(PORT, () => console.log("Сервер запущен на http://localhost:3000"));
