const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let userId = 1
let stream = fs.createWriteStream('userList.log');

class User {
    constructor(id, fName, lName, email, age) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.age = age;
    }
}

class UserService {
    constructor() {
        this.userArray = [];
    }

    addUser(user) {
        this.userArray.push(user)
        console.log(`new user save: ${JSON.stringify(user)}`);
        stream.write(`added: ${JSON.stringify(user)}\n`);
    }

    editUser(){

    }
}

let userService = new UserService();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('createUser')
});
app.get('/userList', (req, res) => {
    res.render('userListing', {userArray: userService.userArray})
});
app.get('/user/edit/:req.params.id', (req, res) => {
    res.render('editUser', {user: userService.userArray[req.params.id]})
});

//Create --new user
app.post('/createUser', (req, res) => {
    console.log(`POST /createUser: ${JSON.stringify(req.body)}`);
    const newUser = new User(userId++, req.body.fName, req.body.lName, req.body.Email, req.body.Age)
    userService.addUser(newUser)
    res.redirect('/userList')
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});
