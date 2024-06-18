const VacationModel = require("../../model/vaction-model/vacation-model");

class VacationService {
  static async createRequest(req, res) {
    const { type, startDate, endDate } = req.body;
    try {
      const vacation = await VacationModel.createVacationRequest({
        type,
        startDate,
        endDate,
      });
      res.status(200).json(vacation);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

  static async getRequests(req, res) {
    try {
      const list = await VacationModel.getRequestList();
      return res.json(list);
    } catch (e) {
      res.status(400).send("error");
    }
  }

  static async updateStatus(req, res) {
    const { reqnumber } = req.query;
    const { status } = req.body;
    try {
      const updatedRes = await VacationModel.findAndUpdateRow({
        reqnumber,
        status,
      });
      res.status(200).json(updatedRes.rows);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  static async getVacations(req, res) {
    try {
      const list = await VacationModel.getVacationInitialData();
      console.log(list);
      res.status(200).json(list);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  static async getVacation(req, res) {
    const { reqnumber } = req.query;
    try {
      const list = await VacationModel.findRow({ reqnumber });
      res.status(200).json(list);
    } catch (e) {
      res.status(400).send(e);
    }
  }
}

module.exports = VacationService;
