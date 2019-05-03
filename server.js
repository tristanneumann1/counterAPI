const express = require('express');
const parser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(parser());

const readFile = (id, category, cb) => {
  if(category && id) {
    fs.readFile(`./${id}/${category}.txt`,'utf8', cb)
  } else {
    cb('invalid request');
  }  
}


app.get('/api/balance/:category/:id', (req, res) => {
  console.log(req.params);
  const { category, id } = req.params;
  readFile(id, category, (err, response) => {
    if (err) {
      res.status(500).send(err)
    }
    res.send(response)
  })
});

app.post('/api/balance/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const { add } = req.body || 0;
  console.log(req.params, req.body);
  if(category && id && Number.isFinite(+add)) {
    const dir = `./${id}`
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    readFile(id, category, (err, response) => {
      if (err) {
        fs.writeFile(`./${id}/${category}.txt`, add, (err, response) => {
          if (err) {
            res.status(500).send(err)
          }
          res.send(response)
        })
      } else {
        fs.writeFile(`./${id}/${category}.txt`, +add + +response, (err, response) => {
          if (err) {
            res.status(500).send(err)
          }
          res.send(response)
        })
      }
    })
  } else {
    res.status(500).send('invalid request')
  }
});

app.listen(3000, () => {console.log('server online')})