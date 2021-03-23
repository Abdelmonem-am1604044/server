const Record = require('../models/Record');

const submitRecord = async (req, res) => {
  try {
    const { temperature, humidity } = req.params;
    let record = new Record({
      temperature,
      humidity,
    });
    await record.save();
    let latest = await getLatestData(req, res);
    global.io.sockets.emit('new_data', latest);
    res.status(200).json(record);
  } catch (error) {
    console.log(error.message);
  }
};

const getLatestData = async (req, res) => {
  try {
    let data = await Record.aggregate([
      {
        $group: {
          _id: null,
          temperature: {
            $sum: '$temperature',
          },
          humidity: {
            $sum: '$humidity',
          },
        },
      },
    ]);

    if (res) res.status(200).json(data[0]);
    return data[0];
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { submitRecord, getLatestData };
