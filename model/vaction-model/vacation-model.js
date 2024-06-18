const pool = require("../../database/db");
const insertQuery = require("./utlis").insertQuery;
const selectQuery = require("./utlis").selectQuery;
const getVacationsQuery = require("./utlis").queryToGetVacations;
const updateDaysQuery = require("./utlis").queryAvalibleDays;
const getRequestsQuery = require("./utlis").queryRequestList;
const findVacationByIdQuery = require("./utlis").findVacationQuery;
const updateVacationQuery = require("./utlis").updateVacationStatusQuery;
const updateDeadlineQuery = require("./utlis").updateVacationDeadlineQuery;
const check = require("./utlis").hollidayChecker;

class VacationModel {
  static async createVacationRequest(data) {
    const { type, startDate, endDate } = data;
    try {
      let daysToApprove;
      if (type === "Ежегодный") daysToApprove = 5;
      if (type === "Ненормированный") daysToApprove = 2;
      if (type === "Студенческий") daysToApprove = 3;

      const startDateRequest = new Date();
      const deadline = null;

      const endDateCalculate = new Date();
      const endDateRequest = new Date(
        endDateCalculate.setDate(endDateCalculate.getDate() + daysToApprove)
      );

      const dateStart = new Date(startDate);
      const dateEnd = new Date(endDate);

      const timeDifference = dateEnd - dateStart;
      let days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

      const countDays = check(dateStart, dateEnd, days);

      const payload = {
        type: type,
        startDate: dateStart.toString(),
        endDate: dateEnd.toString(),
        status: "pending_approval",
        countDays: countDays,
        numberRequest: `RE${dateStart.getTime()}${dateEnd.getTime()}`,
      };

      const vacationFromDb = await pool.query(selectQuery, [
        payload.startDate,
        payload.endDate,
      ]);
      if (vacationFromDb.rows.length === 0) {
        const insert = await pool.query(insertQuery, [
          payload.type,
          payload.startDate,
          payload.endDate,
          payload.status,
          payload.countDays,
          payload.numberRequest,
          endDateRequest,
          startDateRequest,
          deadline,
        ]);
        const vacations = await pool.query(getVacationsQuery);
        const vacationforEdit = vacations.rows.find(
          (el) => el.type === payload.type
        );
        const calcaulateAvalibleDays =
          vacationforEdit.avalible_days - countDays;
        const updateAvalibleDays = await pool.query(updateDaysQuery, [
          calcaulateAvalibleDays,
          payload.type,
        ]);
        return {
          message: "Ваша заявка успешно создана",
          numberRequest: payload.numberRequest,
          count_days: countDays,
        };
      }
      throw new Error(
        `Ошибка! Отпуск по переданной дате ${dateStart}-${dateEnd} уже назначен`
      );
    } catch (e) {
      throw e;
    }
  }

  static async getRequestList() {
    try {
      const list = await pool.query(getRequestsQuery);
      return list.rows;
    } catch (e) {
      throw e;
    }
  }

  static async findRow({ reqnumber }) {
    try {
      const findResult = await pool.query(findVacationByIdQuery, [reqnumber]);
      return findResult.rows[0];
    } catch (e) {
      throw e;
    }
  }

  static async findAndUpdateRow({ reqnumber, status }) {
    try {
      const findResult = await pool.query(findVacationByIdQuery, [reqnumber]);

      if (findResult.rowCount > 0) {
        const row = findResult.rows[0];
        const startDateRequest = new Date(row.start_request);
        const endDateRequest = new Date(row.end_request);
        const dateNowForCalculation = new Date();
        let deadline = new Date();

        if (startDateRequest > endDateRequest) {
          const startMs = Date.parse(dateNowForCalculation);
          const endMs = Date.parse(endDateRequest);
          const differenceMs = startMs - endMs;
          const result = differenceMs / (1000 * 60 * 60 * 24);
          deadline = result;
        }

        if (endDateRequest > startDateRequest) {
          const startMs = Date.parse(startDateRequest);
          const endMs = Date.parse(endDateRequest);
          const differenceMs = endMs - startMs;
          const result = differenceMs / (1000 * 60 * 60 * 24);
          deadline = result;
        }

        const updateDeadlineinDB = await pool.query(updateDeadlineQuery, [
          deadline,
          reqnumber,
        ]);
        const updatedVacation = await pool.query(updateVacationQuery, [
          status,
          reqnumber,
        ]);
        return updatedVacation;
      } else
        throw new Error(
          `Ошибка! Заявка по перденным параметрам: ${id} не найдена`
        );
    } catch (error) {
      throw error;
    }
  }

  static async getVacationInitialData() {
    try {
      const vacations = await pool.query(getVacationsQuery);
      return vacations.rows;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = VacationModel;
