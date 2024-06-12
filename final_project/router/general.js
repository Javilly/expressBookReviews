const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    response = books
  return res.status(300).json(response);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(300).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  response = {}

  for (const [key, value] of Object.entries(books)) {
    console.log(value.author, req.params.author);
    if(value.author == req.params.author){
        response[key] = value
    }
  }

  return res.status(300).json(response);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    response = {}

    for (const [key, value] of Object.entries(books)) {
      if(value.title == req.params.title){
          response[key] = value
      }
    }
  
    return res.status(300).json(response);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(300).json(books[req.params.isbn].reviews);
});



// Task 10
async function getBooks() {
    let books = []
    try {
      ;({ data: books } = await axios({
        method: 'GET',
        url: `http://localhost:5000`,
      }))
    } catch (error) {
      console.log(error);
    }

    console.log(books);
}

// Task 11
async function getBooksByISBN(isbn) {
  let books = []
  try {
    ;({ data: books } = await axios({
      method: 'GET',
      url: `http://localhost:5000/isbn/${isbn}`,
    }))
  } catch (error) {
    console.log(error);
  }

  console.log(books);
}

// Task 12
async function getBooksByAuthor(author) {
  let books = []
  try {
    ;({ data: books } = await axios({
      method: 'GET',
      url: `http://localhost:5000/author/${author}`,
    }))
  } catch (error) {
    console.log(error);
  }

  console.log(books);
}

// Task 13
async function getBooksByTitle(title) {
  let books = []
  try {
    ;({ data: books } = await axios({
      method: 'GET',
      url: `http://localhost:5000/title/${title}`,
    }))
  } catch (error) {
    console.log(error);
  }

  console.log(books);
}

module.exports.general = public_users;
