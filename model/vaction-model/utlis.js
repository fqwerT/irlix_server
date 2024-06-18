const insertQuery = "INSERT INTO vacation_list (type, start_date, end_date, status, count_days, number_request, end_request, start_request, deadline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";

const selectQuery = `SELECT * FROM vacation_list WHERE start_date = $1 AND end_date = $2`;

const queryToGetVacations = "SELECT * FROM vacations_data";

const queryAvalibleDays = "UPDATE vacations_data SET avalible_days = $1 WHERE type = $2 RETURNING *";

const queryRequestList = "SELECT * FROM vacation_list";

const findVacationQuery = "SELECT * FROM vacation_list WHERE number_request = $1";

const updateVacationStatusQuery = "UPDATE vacation_list SET status = $1 WHERE number_request = $2 RETURNING *";

const updateVacationDeadlineQuery = "UPDATE vacation_list SET deadline = $1 WHERE number_request = $2 RETURNING *";


const hollidayChecker = (start, end, countDays) => {
  let count = countDays;
  const hollidayMay = new Date("2023-05-09");

  const holliday1stJan = new Date("2024-01-01");
  const holliday2ndJan = new Date("2024-01-02");
  const holliday3rdJan = new Date("2024-01-03");
  const holliday4thJan = new Date("2024-01-04");
  const holliday5thJan = new Date("2024-01-05");

  const hollidays = [
    hollidayMay,
    holliday1stJan,
    holliday2ndJan,
    holliday3rdJan,
    holliday4thJan,
    holliday5thJan
    
  ];

  for (let i = 0; i < hollidays.length; i++) {
    if (start.getTime() === hollidays[i].getTime()) {
      count--;
    }
    if (
      start.getTime() < hollidays[i].getTime() &&
      hollidays[i].getTime() < end.getTime()
    ) {
      count--;
    }
    if (end.getTime() === hollidays[i].getTime()) {
      count--;
    }
  }

  return count;
};

module.exports = {
  insertQuery,
  selectQuery,
  queryToGetVacations,
  queryAvalibleDays,
  queryRequestList,
  findVacationQuery,
  updateVacationStatusQuery,
  updateVacationDeadlineQuery,
  hollidayChecker,
};
