const express = require('express');
const router = express.Router();
const mqttClient = require('./mqtt');
const db = require('./DBConnection');

router.get('/getNewData', (req, res) => {
  let sql = 'SELECT * FROM sensordata ORDER BY id DESC LIMIT 1';

  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error executing select query:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.json({data: result[0]});
          // console.log(result[0]);
      }
  });
});

router.get('/getData', (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.pageSize) || 5;
  const startIdx = (pageNumber - 1) * itemsPerPage;
  const sortByField = req.query.sortBy || 'id';
  const filterValue = req.query.value || '';
  const filterField = req.query.field || 'all';
  const sortOrder = req.query.sortDirection || 'asc'

  const filterCondition = filterField === 'all' ?
    `temp LIKE '%${filterValue}%' OR hum LIKE '%${filterValue}%' OR light LIKE '%${filterValue}%' OR createdAt LIKE '%${filterValue}%'` :
    `${filterField} LIKE '%${filterValue}%'`;

  let sqlQuery = `SELECT * FROM sensordata`;
  let countQuery = `SELECT COUNT(*) AS totalCount FROM sensordata`;

  if (filterValue) {
    sqlQuery += ` WHERE ${filterCondition}`;
    countQuery += ` WHERE ${filterCondition}`;
  }

  sqlQuery += ` ORDER BY ${sortByField} ${sortOrder} LIMIT ${itemsPerPage} OFFSET ${startIdx}`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).json({ err: 'Internal Server Error' });
    } else {
      db.query(countQuery, (err, countResult) => {
        if (err) {
          console.error('Error executing count query: ', err);
          res.status(500).json({ err: 'Internal Server Error' });
        } else {
          const totalCount = countResult[0].totalCount;
          // console.log(result);
          res.status(200).json({ totalCount, data: result });
        }
      });
    }
  });
});


router.post('/action', async (req, res) => {
  const { device, action } = req.body;

  const topic = device === 'led' ? 'led' : 'fan';
  const action_id = action ? "1" : "0";

  try {
      await new Promise((resolve, reject) => {
          mqttClient.publish(topic, action_id.toString(), (error) => {
              if (error) {
                  console.error('Error while publishing MQTT message:', error);
                  return reject(error);
              }
              resolve();
          });
      });

      const receivedMessage = await new Promise((resolve) => {
          mqttClient.on('message', (receivedTopic, message) => {
              if ((receivedTopic === 'led_status' || receivedTopic === 'fan_status')) {
                  const device_id = receivedTopic === 'led_status' ? 'led' : 'fan';
                  const data = message.toString();
                  const status = data === 'on' ? "1" : "0";

                  console.log('Device:', device_id);
                  console.log('Action:', data);

                  const sqlInsert = 'INSERT INTO history (device_id, action, time) VALUES (?, ?, NOW())';
                  const valuesInsert = [device_id, status];

                  db.query(sqlInsert, valuesInsert, (insertErr) => {
                      if (insertErr) {
                          console.error('Error executing insert query:', insertErr);
                          return res.status(500).json({ error: 'Internal Server Error' });
                      }
                      console.log('New record added to the database');
                      res.status(201).json({ device_id, status });
                  });

                  resolve();
              }
          });
      });
  } catch (error) {
      console.error('Error while publishing MQTT message:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

