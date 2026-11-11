const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    salaryFrom: { type: Number },
    salaryTo: { type: Number },
    skillsRequired: { type: String },

    responses: [
      {
        candidateName: { type: String, required: true },
        coverLetter: { type: String },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vacancy", vacancySchema);
