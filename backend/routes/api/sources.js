const express = require('express');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const db = require('../../db/models');

router.get('/', asyncHandler(async(req, res) => {
  const sources = await db.Source.findAll();
  res.json(sources)
}))

router.get('/:sourceEncoded/articles',
  asyncHandler(async (req, res) => {
    const { sourceEncoded } = req.params;
    const articles = await db.Article.findAll({ 
      where: { sourceId: sourceEncoded },
      order: [['publishedAt', 'DESC']]
    });
    res.json(articles);
}))



module.exports = router;