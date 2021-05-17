var express = require('express');
var router = express.Router();
var objectModel = require('../models/objects')
var request = require('request');


/* save Object data. */
router.post('/add', async function (req, res, next) {
  try {
    // const {
    //   garageNumber,
    //   id,
    //   mnfID,
    //   objectName,
    //   objectType,
    //   phone,
    //   groupList
    // } = req.body;
    // console.log(req.body)
    // return res.send(req.body)
    await objectModel.insertMany(req.body)

    return res.json({
      status: 0,
      message: "Object data is saved Successfully.",
      data: []
    })
  } catch (err) {
    res.json({
      status: 1,
      message: "Internal Server Error",
      data: []
    })
  }
});


/* get Object data. */
router.get('/get', async function (req, res, next) {
  try {
    let unAssigned = await objectModel.find({
      assignType: 0
    })
    let QC1 = await objectModel.find({
      assignType: 1
    })
    let QC2 = await objectModel.find({
      assignType: 2
    })
    let QC3 = await objectModel.find({
      assignType: 3
    })
    let QC4 = await objectModel.find({
      assignType: 4
    })
    let landSide = await objectModel.find({
      assignType: 5
    })
    let houseKeeping = await objectModel.find({
      assignType: 6
    })
    let Rail = await objectModel.find({
      assignType: 7
    })

    return res.json({
      status: 0,
      message: "Object data is fetched Successfully.",
      data: {
        unAssigned: unAssigned,
        QC1,
        QC2,
        QC3,
        QC4,
        landSide,
        houseKeeping,
        Rail
      }
    })
  } catch (err) {
    res.json({
      status: 1,
      message: "Internal Server Error",
      data: []
    })
  }
});
/* update  group. */
router.put('/', async function (req, res, next) {
  try {
    let assignType = req.query || 0;
    let id = req.id || 0;
    let unAssigned = await objectModel.findOneAndUpdate({
      id: id
    }, {
      assignType: assignType
    })
    return res.json({
      status: 0,
      message: "Group is chnaged Successfully.",
      data: []
    })
  } catch (err) {
    res.json({
      status: 1,
      message: "Internal Server Error",
      data: []
    })
  }
});
router.get('/detials', async function (req, res, next) {
  try {
    request({
      uri: 'https://fleetapi.geeksapi.app/api/statisticsByPeriod?api_token=01a7e2aa1e56ab03c56b7f2aa0580e5af63958fcdaa0a1e7e59ce14803f2&timeBegin=1615006800&timeEnd=1615050000&objectType=0&aggregate=0',
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log(body);
        body = JSON.parse(body);
        body = [body]
        var id_filter = ["216000270", "216000272", "216000275"];
        console.log(Object.keys(body))
        var filtered = Object.keys(body).filter(function (item) {
          console.log(item.statistics);
          
          return id_filter.indexOf(item.key) !== -1 ;
        });
        res.json({
          status: 0,
          message: "Object details is fetched Successfully.",
          data: {
            filtered
          }
        });
      } else {
        res.json(error);
      }
    })
  } catch (err) {
    console.log(err)
    res.json({
      status: 1,
      message: "Internal Server Error",
      data: [err]
    })
  }
});



module.exports = router;