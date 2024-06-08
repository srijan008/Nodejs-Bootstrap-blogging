require('dotenv').config()
const express = require('express');
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookiePaser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const path = require("path");

const Blog = require('./models/blog')

const app = express();
const port = process.env.PORT || 8000;



mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))

    
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended: false}));
app.use(cookiePaser());

app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {    
    const allBlogs = await Blog.find({})
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/users", userRoute);
app.use("/blog", blogRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


