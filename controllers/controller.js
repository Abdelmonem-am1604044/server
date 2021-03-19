const Record = require('../models/Record'),
  Sensor = require('../models/Sensor');
  
const submitRecord = async (req, res) => {
  try {
    const { temperature, humidity } = req.params;


    let record = new Record({
      temperature,
      humidity,
    });
    await record.save();

    res.status(200).json(record);
  } catch (error) {
    console.log(error.message);
  }
};

const getLatestData = async (req, res) => {
  try {

    let data = await Record.aggregate([
      {
        '$group': {
          '_id': null, 
          'temperature': {
            '$sum': '$temperature'
          }, 
          'humidity': {
            '$sum': '$humidity'
          }
        }
      }
    ])


    if (res) res.status(200).json(data[0]);
    return data[0];
  } catch (error) {
    console.log(error.message);
  }
};



const validateCivilDefense = async (req, res) => {
  try {
    let newSensors = [];
    const { code } = req.body;
    if (code != 123) res.status(422).send({ error: 'Invalid Passcode' });

    const sensors = await Sensor.find();
    // console.log(sensors);
    for (let i = 0; i < sensors.length; i++) {
      let data = await Record.find({ sensorId: sensors[i]._id })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate('sensorId');

      newSensors.push({ ...data[0], ...sensors[i]._doc });
    }

    res.status(200).json(newSensors);
  } catch (error) {}
};

module.exports = { submitRecord, getLatestData, validateCivilDefense };
