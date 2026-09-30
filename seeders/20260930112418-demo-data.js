"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Resumes",
      [
        {
          title: "Backend Developer",
          name: "Иванов Иван",
          skills: JSON.stringify(["JavaScript", "Express", "Node.js"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Frontend Developer",
          name: "Петров Петр",
          skills: JSON.stringify(["Figma", "JavaScript"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      "Vacancies",
      [
        {
          title: "Backend Developer",
          companyName: "БеларусБанк",
          description: "Требуется опытный разработчик",
          location: "Минск, Беларусь",
          employmentType: "Полная занятость",
          workplaceType: "В офисе",
          experienceLevel: "Senior",
          skillsRequired: JSON.stringify(["TypeScript", "Docker", "REST API"]),
          salary: JSON.stringify({ from: 3000, to: 4500, currency: "РБ" }),
          status: "Активна",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Resumes", null, {});
    await queryInterface.bulkDelete("Vacancies", null, {});
  },
};
