const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const db = require("../db");
const fs = require("fs");

router.post("/", async (req, res) => {
  const newCar = {
    name: req.body.name,
    model: req.body.model,
    type: req.body.type,
    class: req.body.class,
  };
  if (!req.files || Object.keys(req.files).length === 0) {
    newCar.img_url = "";
  } else {
    imgFile = req.files.img_url;
    uploadPath = "./public/img/" + imgFile.name;

    try {
      await imgFile.mv(uploadPath);
      newCar.img_url = imgFile.name;
    } catch (err) {
      console.log(err);
      res.redirect("back");
    }
    // imgFile.mv(uploadPath, function(err) {
    //   if(err) {
    //     console.log(err);
    //     res.redirect('back');
    //   }
    //   else{
    //     newCar.img_url = imgFile.name;
    //   }
    // });
  }
  await db.instance().insertOne(newCar);
  res.redirect("back");
});

router.get("/", async (req, res) => {
  const { query } = req;
  const model = query.model;
  const type = query.type;
  let cars = await db.instance().find().toArray();

  if (model) {
    cars = cars.filter((car) => car.model.includes(model));
  }

  if (type) {
    cars = cars.filter((car) => car.type.includes(type));
  }

  res.render("cars.hbs", {
    carsArr: cars,
  });
});

router.get("/:id", async (req, res) => {
  let car = await db.instance().findOne({
    _id: ObjectId(req.params.id),
  });
  res.render("car.hbs", {
    car,
  });
});

router.get("/:id/edit", async (req, res) => {
  let car = await db.instance().findOne({
    _id: ObjectId(req.params.id),
  });

  res.render("editCar.hbs", {
    car,
  });
});

router.put("/:id", async (req, res) => {
  let newCar = {
    name: req.body.name,
    model: req.body.model,
    type: req.body.type,
    class: req.body.class,
    img_url: null,
  };

  const car = await db.instance().findOne({
    _id: ObjectId(req.params.id),
  });

  if (car.img_url != '') {
    let imgPath = "./public/img/" + car.img_url;
    fs.unlink(imgPath, (err) => {
      if (err) console.log(err);
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    newCar.img_url = "";
  } else {
    imgFile = req.files.img_url;
    uploadPath = "./public/img/" + imgFile.name;

    try {
      await imgFile.mv(uploadPath);
      newCar.img_url = imgFile.name;
    } catch (err) {
      console.log(err);
    }
  }

  await db.instance().updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: newCar,
    }
  );
  res.redirect('/cars/'+ req.params.id)
});

router.delete("/:id", async (req, res) => {
  await db.instance().deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.redirect("/cars");
});

db.connect();

module.exports = router;
