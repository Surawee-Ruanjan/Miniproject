const express = require("express"),
  app = express(),
  passport = require("passport"),
  port = process.env.PORT || 80,
  cors = require("cors"),
  cookie = require("cookie");

const bcrypt = require("bcrypt");

const db = require("./database.js");
let users = db.users;

require("./passport.js");

const router = require("express").Router(),
  jwt = require("jsonwebtoken");

app.use("/api", router);
router.use(cors({ origin: "http://localhost:3000", credentials: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("Login: ", req.body, user, err, info);
    if (err) return next(err);
    if (user) {
      if (req.body.remember == true) {
        time_exp = "7d";
      } else time_exp = "1d";
      const token = jwt.sign(user, db.SECRET, {
        expiresIn: time_exp,
      });
      var decoded = jwt.decode(token);
      let time = new Date(decoded.exp * 1000);
      console.log(new Date(decoded.exp * 1000));
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      res.statusCode = 200;
      return res.json({ user, token });
    } else return res.status(422).json(info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: -1,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  return res.json({ message: "Logout successful" });
});

/* GET user profile. */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send(req.user);
  }
);
/* GET user foo. */
router.get(
  "/houseedit",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({ message: "house" });
  }
);

router.post(
  "/register", async (req, res) => {
    try {
      const SALT_ROUND = 10;
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.json({ message: "Cannot register with empty string" });
      if (db.checkExistingUser(username) !== db.NOT_FOUND)
        return res.json({ message: "Duplicated user" });

      let id = users.users.length ? users.users[users.users.length - 1].id + 1 : 1;
      hash = await bcrypt.hash(password, SALT_ROUND);
      users.users.push({ id, username, password: hash, email });
      res.status(200).json({ message: "Register success" });
    } catch {
      res.status(422).json({ message: "Cannot register" });
    }
  });

router.get("/alluser", (req, res) => res.json(db.users.users));

router.get("/", (req, res, next) => {
  res.send("Respond without authentication");
});

let houses = {
  list: [
    { "id": 1, "name": "Somchai", "age": 1, "date": "24/02", "date2": "28/02","price": 1000 },
    { "id": 2, "name": "Srinuar", "age": 2, "date": "12/05", "date2": "20/05", "price": 2000 },
    ]
}


router
  .route("/houses")
  .get((req, res) => {
    res.send(houses);
  })
  .post((req, res) => {
    console.log(req.body);
    let newhouse = {};
    newhouse.id = houses.list.length ? houses.list[houses.list.length - 1].id + 1 : 1;
    newhouse.name = req.body.name;
    newhouse.age = req.body.age;
    newhouse.date = req.body.date;
    newhouse.date2 = req.body.date2;
    newhouse.price = req.body.price;
    houses = { list: [...houses.list, newhouse] };
    res.json(houses);
  });

router
  .route("/houses/:houseid")
  .get((req, res) => {
    let id = houses.list.findIndex((item) => +item.id == +req.params.houseid)
    res.json(houses.list[id]);
  })
  .put((req, res) => {
    let id = houses.list.findIndex((item) => item.id == +req.params.houseid);
    houses.list[id].name = req.body.name;
    houses.list[id].age = req.body.age;
    houses.list[id].date = req.body.date;
    houses.list[id].date2 = req.body.date2;
    newhouse.price = req.body.price;
    res.json(houses.list);
  })
  .delete((req, res) => {
    houses.list = houses.list.filter((item) => +item.id !== +req.params.houseid);
    res.json(houses.list);
  });


router.route("/purchase/:houseId")
  .post((req, res) => {
    let id = houses.list.findIndex((item) => +item.id == +req.params.houseId)
    if (id == -1) {
      res.json({ message: "House not found" })
    }
    else {
      houses.list = houses.list.filter((item) => +item.id !== +req.params.houseId);
      res.json(houses.list);
    }
  })

// Error Handler
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`));