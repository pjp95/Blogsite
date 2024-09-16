import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {dirname} from "path"; // these are just for the path
import  {fileURLToPath} from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const PORT = 3000;

app.use(express.static('public')); // allows usage of static css files
app.use(morgan('tiny')); // gives me status info in terminal
app.use(bodyParser.urlencoded({extended: true})); // encodes and parses the form inputs

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});


// POST CREATION
var posts = [];
var edit = false;
var editNumber = 0;

app.post("/submit", (req, res) => {
    const action = req.body.action;
    if (action === 'submitPost') { // SUBMIT POST BUTTON PRESSED
        const postTitle = req.body.postTitle;
        const postAuthor = req.body.postAuthor;
        const postContent = req.body.postContent;
        const postDate = new Date();
        //console.log("Post data retrieved successfuly");       
        const createdPost = {   // post object
            title: postTitle,
            author: postAuthor,
            content: postContent,
            date: postDate
            };
        if (edit) {
            posts[editNumber] = createdPost;        
        } else {
            posts.push(createdPost);
        }
        edit = false;
        res.redirect('/');  // return to homepage
    } else if (action === 'editPost') { // EDIT BUTTON PRESSED
        console.log("editmode meow");
        const postNumber = req.body.postNumber;
        edit = true;
        editNumber = postNumber;

        res.redirect('/newpost.ejs');
    } else if (action === 'deletePost') { // DELETE BUTTON PRESSED
        console.log("deleted");
        const postNumber = req.body.postNumber; 
        posts.splice(postNumber, 1); // remove post from array

        res.redirect('/');
    } else {
        res.redirect('/');
    }
});


// HOME PAGE ROUTE
app.get("/", (req, res) => {
    res.render('index.ejs', { posts: posts }); // send homepage ejs file, and make the post data available
});
// NEWPOST PAGE ROUTE
app.get('/newpost.ejs', (req, res) => {
    res.render('newpost.ejs', {edit: edit, editNumber: editNumber, posts: posts});
});