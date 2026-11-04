const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const resumesRouter = require("./routes/resumes");
const vacanciesRouter = require("./routes/vacancies");

app.use("/auth", authRoutes);
app.use("/resumes", resumesRouter);
app.use("/vacancies", vacanciesRouter);

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Успешный доступ к защищенному маршруту",
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  console.error("Глобальный перехват ошибки:", err.stack);

  res.status(500).json({
    success: false,
    error: "На сервере произошла внутренняя ошибка",
    message: err.message,
  });
});

app.listen(PORT, () =>
  console.log("Сервер запущен на http://localhost:${PORT}"),
);
