const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const resumesRouter = require("./routes/resumes");
const vacanciesRouter = require("./routes/vacancies");

app.use(express.json());

app.use("/resumes", resumesRouter);
app.use("/vacancies", vacanciesRouter);

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
