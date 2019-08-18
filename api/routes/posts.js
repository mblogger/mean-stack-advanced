const express = require('express');
const router = express.Router();
const multer = require('multer');

const Post = require('../models/post');
const authCheck = require('../middleware/check-auth');

const MIME_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    if (isValid) {
      error = null;
    }

    cb(error, 'api/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('',
  authCheck,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(result => {
      res.status(201).json({
        message: 'Post added successfully!',
        post: {
          ...result,
          id: result._id,
        }
      });
    });
});

router.get('',
  (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }

    postQuery
      .then(documents => {
        fetchedPosts = documents;
        return Post.estimatedDocumentCount();
      })
      .then(count => {
        res.status(200).json({
          message: 'Posts fetched successfully!',
          posts: fetchedPosts,
          maxPosts: count
        });
      });
});

router.get('/:id',
  (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!'});
      }
    })
});

router.put('/:id',
  authCheck,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Update successful!' });
    });
});

router.delete('/:id',
  authCheck,
  (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Post deleted!'});
  });
});

module.exports = router;
