// ПЗ 1 Логирующее middleware
const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "..", "logs");
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ на файл
const MAX_FILES = 10; // макс файлов в папке с учётом текущего

fs.mkdirSync(LOG_DIR, { recursive: true });

const pad = (n) => String(n).padStart(2, "0");
const now = () => {
  const d = new Date();
  return (
    `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const logFile = path.join(LOG_DIR, "access.log");

const cleanOldLogs = () => {
  const archives = fs
    .readdirSync(LOG_DIR)
    .filter((f) => /^access-\d+\.log$/.test(f))
    .sort();

  archives
    .slice(0, Math.max(0, archives.length - (MAX_FILES - 1)))
    .forEach((f) => fs.unlinkSync(path.join(LOG_DIR, f)));
};

const writeLog = (message) => {
  const line = `[${now()}] ${message}\n`;

  try {
    if (fs.statSync(logFile).size >= MAX_SIZE) {
      fs.renameSync(logFile, path.join(LOG_DIR, `access-${Date.now()}.log`));
      cleanOldLogs();
    }
  } catch {}

  fs.appendFile(logFile, line, () => {});
};

const logger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const info = `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`;
    console.log(`[${now()}] ${info}`);
    writeLog(info);
  });
  next();
};

module.exports = logger;
module.exports.writeLog = writeLog;

// const logger = (req, res, next) => {
//   const time = new Date().toLocaleTimeString("ru-RU");
//   console.log(`[${time}] ${req.method} ${req.url}`);
//   next();
// };

// module.exports = logger;
