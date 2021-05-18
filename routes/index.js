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
    let assignType = parseInt(req.query.assignType) || 0;
    let id = req.query.id || 0;
    let unAssigned = await objectModel.findOneAndUpdate({
      id: id
    }, {
      assignType: assignType
    })
    console.log(unAssigned)
    if(unAssigned){
      console.log("updated")
    }
    return res.json({
      status: 0,
      message: "Group is chnaged Successfully.",
      data: []
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
router.get('/detials', async function (req, res, next) {
  try {
    let assignType = req.query.assignType || null;
    let id_filters = await objectModel.find({
      assignType: assignType
    }).select('id');
    let id_filter = [];
    console.log("working....")
    id_filters.map((item) => {
      id_filter = [...id_filter, `${item.id}`]
    })
    request({
      uri: 'https://fleetapi.geeksapi.app/api/statisticsByPeriod?api_token=01a7e2aa1e56ab03c56b7f2aa0580e5af63958fcdaa0a1e7e59ce14803f2&timeBegin=1615006800&timeEnd=1615050000&objectType=0&aggregate=0',
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);
        var arrOfObj = [];
        Object.keys(body.statistics).map((item) => {
          if (id_filter.indexOf(item) !== -1) {
            body.statistics[item].id= item;
            arrOfObj = [...arrOfObj, 
              body.statistics[item]
            ]
          }
        });
        res.json({
          status: 0,
          message: "Object details is fetched Successfully.",
          data: {
            arrOfObj
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
router.get('/map', async function (req, res, next) {
  try {
    let assignType = req.query.assignType || null;
    let id_filters = await objectModel.find({
      assignType: assignType
    }).select('id');
    // let id_filter = [];
    let mapArry = [];
    // id_filters.map((item)=>{
    //   id_filter = [...id_filter, `${item.id}`]
    // })
    id_filters.map((item, index) => {
      request({
        uri: `https://fleetapi.geeksapi.app/api/currentObjectState?api_token=01a7e2aa1e56ab03c56b7f2aa0580e5af63958fcdaa0a1e7e59ce14803f2&objectId=${item.id}`,
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          body = JSON.parse(body)
          mapArry = [...mapArry, body]
          console.log(body)
          console.log("values" ,id_filters.length , index)
          if (index === 0) {
            res.json({
              status: 1,
              message: "map data is fetched successfuly",
              data: mapArry
            })
          }
        }
      }) // end of request
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