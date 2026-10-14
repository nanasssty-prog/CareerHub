import React from "react";
import VacancyList from "./components/VacancyList";

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center">CareerHub: Управление вакансиями</h1>
      <hr />
      <VacancyList />
    </div>
  );
}

export default App;
