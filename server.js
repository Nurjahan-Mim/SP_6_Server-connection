const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));


const db = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "", 
  database: "userauth", 
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); 
  }
  console.log("Connected to the database");
});


app.post("/add-user", (req, res) => {
  const { username, password } = req.body;

  
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Error adding user" });
      }
      res.json({ message: "User added successfully!" });
    });
  });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Login Attempt: Username: ${username}, Password: ${password}`);

  const query = `SELECT * FROM users WHERE username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length > 0) {
      const user = results[0];

      
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ message: "Error verifying password" });
        }

        if (isMatch) {
          res.json({ message: "Login successful!" });
        } else {
          res.status(401).json({ message: "Invalid username or password!" });
        }
      });
    } else {
      res.status(401).json({ message: "Invalid username or password!" });
    }
  });
});


app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
