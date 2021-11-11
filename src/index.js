require("./db/mongoose");
const express = require("express");
const User = require("./models/users");
const router = express.Router();
const path = require("path");

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

const app = express();

app.set("views", viewsPath);
app.set("view engine", "html");

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setting of app
// app.set("views", path.join(__dirname, "../views"));

const port = process.env.PORT || 3000;

// Automatically parses incoming JSON as an object for our use\

router.get("/login", (req, res) => {
  console.log("HI");
  res.sendFile(path.join(__dirname, "../views/login.html"));
});
router.get("/signup", (req, res) => {
  console.log("HI");
  res.sendFile(path.join(__dirname, "../views/signup.html"));
});
router.get("/homepage", (req, res) => {
  console.log("HI");
  res.sendFile(path.join(__dirname, "../views/homepage.html"));
});
router.get("/compiler", (req, res) => {
  console.log("HI");
  res.sendFile(path.join(__dirname, "../views/homepage.html"));
});

router.post("/users", async (req, res) => {
  console.log("HERE");
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();
    // res.send({user: user.getPublicProfile(),token})  This is one way of hiding private data
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.use("/", router);
app.listen(port, () => {
  console.log("Server is listening on " + port);
});
