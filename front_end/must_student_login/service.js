const express = require('express');

const port = 3000;
const mysql = require('mysql2');
const path = require('path');
const app = express();

//middleware
app.use(express.urlencoded(
    {
        extended: true
    }
));
app.use(express.json());
app.use(express.static('public'));
//Routes for Pages
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'));
});
//Myswl connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '11nal12@',
    database: 'library_management'
});
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to database');
    }
});
//Resgistration
app.post('/signup',(req,res)=>{
    const{name,email,password}=req.body;
    if(!name || !email || !password){
        return res.send('All fields are required');
    }
    const sql="INSERT INTO register_user(name,email,password) VALUES(?,?,?)";
    db.query(sql,[name,email,password],(err,result)=>{
        if(err){
            console.log(err);
            return res.send("Registration failed");
        }
        else{
            res.sendFile(path.join(__dirname,'public','login.html'));
            console.log('User registered successfully');
        }
    });
});
//login user in library
app.post('/login',(req,res)=>{
    const{email,password}=req.body;
    if(!email || !password){
        return res.send('All fields are required');
    }
    const sql="SELECT * FROM register_user WHERE email=? AND password=?";
    db.query(sql,[email,password],(err,result)=>{
        if(err){
            console.log(err);
            return res.send("Login failed");
        }
        else{
            res.sendFile(path.join(__dirname,'public','login.html'));
            console.log('User logged in successfully');
        }
    });
});

app.listen(3000, () => {
    console.log(`Server running on port http://localhost:3000`);
});