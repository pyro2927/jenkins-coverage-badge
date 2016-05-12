#! /usr/bin/env node

var request = require('request')
var express = require('express')

var app = express()

var handleResponse = function(schema, req, res) {
  var jurl = req.params[0]
  var url = schema + '://' + jurl + '/lastSuccessfulBuild/cobertura/api/json/?depth=2'
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var elements = JSON.parse(body)['results']['elements']
      for (var i in elements) {
        if (elements[i]['name'] == 'Lines') {
          var cov = elements[i]['ratio'].toFixed(2)
          var color = function(cov) {
            if (cov < 20) {
              return 'red'
            } else if (cov < 80) {
              return 'yellow'
            } else {
              return 'brightgreen'
            }
          }(cov)
          var badge_url = 'https://img.shields.io/badge/coverage-' + cov.toString() + '%-' + color + '.svg'
          var style = req.param("style")
          if (typeof style != 'undefined') {
            badge_url += '?style=' + style
          }
          res.setHeader('Expires', 'Tue, 15 Apr 1980 12:00:00 GMT');
          res.setHeader('Cache-Control', 'no-cache');
          res.redirect(badge_url)
        }
      }
    } else {
      var badge_url = 'https://img.shields.io/badge/coverage-none-lightgrey.svg'
      res.redirect(badge_url)
    }
  })
}

app.get('/jenkins/c/http/*', function(req,res) {
	handleResponse('http', req, res)
})
app.get('/jenkins/c/https/*', function(req,res) {
	handleResponse('https', req, res)
})

var port = process.argv.slice(2)[0];
if (!port) port = 9913
  var server = app.listen(port, function() {
    console.log('Listening on port %d...', server.address().port)
  })
