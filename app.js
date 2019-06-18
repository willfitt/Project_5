const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class User {
    constructor(id, fName, lName, email, age) {
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.age = age;
    }
}
class Users {
    constructor() {
        this.userArray = [];
    }

    addUser(user) {
        this.userArray.push(user)
    }
}

new Users();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.get('/createUser', (req, res) => {
    res.render('createUser')
});
app.get('/userList', (req, res) => {
    res.render('changeRole')
});
app.get('/editUser', (req, res) => {
    res.render('deleteUser')
});

//Create --new document
app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.send(`done ${data}`);
    });
});// test this with`curl --data "name=Peter&role=Student" http://localhost:8080/newUser`
//Read --find a document
app.get('/user/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({ name: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} role : ${data.role}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});

//Update --find one and then update the document
app.post('/updatedRole', (req, res) => {
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    user.findOneAndUpdate({ name: matchedName }, { role: newrole },
        { new: true }, //return the updated version instead of the pre-updated document
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${data.role}`)
            let returnMsg = `user name : ${matchedName} New role : ${data.role}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
});// test this with: `curl --data "name=Mike&role=TA" http://localhost:8080/updateUserRole`


//Delete --find one and then remove the document
app.post('/removeUser', (req, res) => {
    console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    user.findOneAndDelete(
        { name: matchedName },
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${JSON.stringify(data)}`)
            let returnMsg = `user name : ${matchedName}, removed data : ${data}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});