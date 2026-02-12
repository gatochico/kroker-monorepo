var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET callgraphs listing. */
router.get('/vistests/callgraph/:dataset', function(req, res) {
  const dataset = req.params.dataset;
  fs.readFile(`routes/datasets/Spark_${dataset}/callgraph/callgraph.json`, "utf8", function(err, data){
    if (err) {
      res.json({})
      return;
    };
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

/* GET linecoverage listing. */
router.get('/vistests/linecoverage/:dataset', function(req, res) {
  const dataset = req.params.dataset;
  fs.readFile(`routes/datasets/Spark_${dataset}/linecoverage/linecoverage.json`, "utf8", function(err, data){
    if (err) {
      res.json({})
      return;
    };
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

/* GET methodlimits listing. */
router.get('/vistests/methodlimits/:dataset', function(req, res) {
  const dataset = req.params.dataset;
  fs.readFile(`routes/datasets/Spark_${dataset}/methodlimits/methodlimits.json`, "utf8", function(err, data){
    if (err) {
      res.json({})
      return;
    };
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

/* GET methodlimits (tests) listing. */
router.get('/vistests/testmethodlimits/:dataset', function(req, res) {
  const dataset = req.params.dataset;
  fs.readFile(`routes/datasets/Spark_${dataset}/methodlimits/testmethodlimits.json`, "utf8", function(err, data){
    if (err) {
      res.json({})
      return;
    };
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

/* GET testoptions listing. */
router.get('/vistests/testoptions/:dataset', function(req, res) {
  const dataset = req.params.dataset;
  fs.readFile(`routes/datasets/Spark_${dataset}/testoptions/testoptions.json`, "utf8", function(err, data){
    if (err) {
      res.json({})
      return;
    };
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

module.exports = router;
