import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const PORT = 3000;
let allBlogs = [];
let flashMessage = null;
let IDCounter = 1;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(morgan("dev"));

app.post("/update/:id", (req,res) => {
    const id = req.params.id;
    const obj = getObject(id);

    if (obj.title === req.body["title"] && obj.body === req.body["body"]) {
        flashMessage = "No changes made, blog unchanged!";
        res.redirect("/");
        return;
    }

    obj.title = req.body["title"];
    obj.body = req.body["body"];

    flashMessage = "Blog updated successfully!";
    res.redirect("/");
});

app.get("/blogs/:id", (req, res) => {
    let id = req.params.id;
    let obj = getObject(id);
    console.log(obj);
    res.render("blog.ejs", {
        blog: obj
    });
});

app.post("/delete/:id", (req,res) => {
    let id = req.params.id;
    let obj = getObject(id);
    console.log(obj);
    allBlogs = allBlogs.filter((blog) => blog.id != obj.id);
    flashMessage = "Blog deleted successfully!";
    res.redirect("/");
});

app.get("/view", (req,res) => {
    res.render("viewBlogs.ejs", {
        allBlogs: allBlogs
    });
});

app.post("/create", (req,res) => {
    if (req.body["title"] === "" || req.body["body"] === "") {
        flashMessage = "Data cannot be empty";
        res.redirect("/");
        return;
    }

    let data = {
        title: req.body["title"],
        body: req.body["body"],
        id: IDCounter++
    };
    
    allBlogs.push(data);
    flashMessage = "Blog created successfully!";
    res.redirect("/");
});

app.get("/create", (req,res) => {
    res.render("createBlog.ejs");
});

app.get("/", (req,res) => {
    res.render("index.ejs", {
        flashMessage: flashMessage,
        allBlogs: allBlogs
    });
    flashMessage = null;
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

function getObject(id) {
    for (let i = 0; i < allBlogs.length; i++) {
        if(allBlogs[i]) {
            if (allBlogs[i].id === parseInt(id)) {
                return allBlogs[i];
            }
        }
    }
    return {};
}
