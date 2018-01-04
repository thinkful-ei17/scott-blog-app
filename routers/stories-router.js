'use strict';

const express = require('express');
const router = express.Router();
// const knex = require('knex');
// const pg = require('pg');
var data = require('../db/dummy-data');
const bodyParser = require('body-parser');
const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

router.use(bodyParser.json());

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  knex.select('id', 'title', 'content')
    .from('stories')
    .then(results => res.json(results))
    .catch(err => {
      next(err);
    });

});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  knex.select('id', 'title', 'content')
    .from('stories')
    .where('id', req.params.id)
    .then(function(results){
      if(results.length === 0){
        next();
      }
      else {
        res.json(results[0]);
      }
    })  
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res, next) => {
  
  const required = ['title', 'content'];

  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  });

  knex('stories')
    .insert({
      title: req.body.title, 
      content: req.body.content
    })
    .returning(['id', 'title', 'content']) 
    .then(results => res.location(`/stories/${results.id}`).status(201).json(results[0]))
    .catch(next);
});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res, next) => {

  const required = ['title', 'content'];

  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  });

  knex('stories')
    .where('id', req.params.id)
    .update({
      title: req.body.title,
      content: req.body.content
    })
    .returning(['id', 'title', 'content'])
    .then(function (results) {
      if (results.length === 0) {
        res.status(404).json(`The id ${req.params.id} doesn't exist`);
      }
      else {
        res.json(results[0]);
      }
    })
    .catch(next);
});
     

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res, next) => {
  
  knex('stories')
    .where('id', req.params.id)
    .del()
    .then(res.status(204).end())
    .catch(next);
});  

module.exports = router;