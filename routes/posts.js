
var express = require('express');
const db = require('../database/connexion');
var router = express.Router();

const { nanoid } = require('nanoid')

/* Get posts */
router.get('/', function(req, res, next) {
    let query = 'SELECT * FROM posts ORDER BY CreatedAt';

    if (req.headers.userdata) {
        db.all(query, [], (err, rows) => {
            if (err) {
                console.log(err.message);
                throw err;
            }
            res.status(200).json(rows);
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
});

/* Add new post */
router.post('/', function(req, res, next) {

    let query = 'INSERT INTO posts(Id, Content, ImgUrl, CreatedAt, UpdatedAt) VALUES(?, ?, ?, ?, ?)';
    if (req.headers.userdata) {
        let createdAt = Date.now();
        let post = {
            Id: nanoid(),
            Content: req.body.Content,
            ImgUrl: req.body.ImgUrl,
            CreatedAt: createdAt,
            UpdatedAt: createdAt
        };
        
        db.run(query, objectToArray(post), (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(post);
                console.log('Post has been saved.');
            }
        });
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
});

function objectToArray(obj) {
    let array = [];
    for ( const [key, value] of Object.entries(obj)) {
        array.push(value);
    } // --
    return array;
}

module.exports = router;