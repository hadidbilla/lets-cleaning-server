const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParse = require("body-parser");
require("dotenv").config();
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zta4c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("letsCleaning").collection("services");
  const adminCollection = client.db("letsCleaning").collection("Admins");
  const reviewCollection = client.db("letsCleaning").collection("reviews");
  const bookServicesCollection = client
    .db("letsCleaning")
    .collection("bookServices");
  /*-----------(Add Review)------------*/
  app.post("/addReview", (req, res) => {
    const service = req.body;
    reviewCollection.insertOne(service).then((result) => {
      res.send(result.insertCount > 0);
    });
  });
  /*-----------(Show All Services)------------*/
  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  /*-----------(Show All REVIEW)------------*/
  app.get("/review", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  /*---------(Show the selected service)--------------*/
  app.get("/services/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });
  /*-----------(Add Booking with payment details)------------------*/
  app.post("/addBookService", (req, res) => {
    const booking = req.body;
    bookServicesCollection.insertOne(booking).then((result) => {
      console.log(result.insertCount > 0);
    });
  });
  /*-----------(Add Admin)------------------*/
  app.post("/insertAdmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) => {
      res.send(result.insertCount > 0);
    });
  });
  /*-----------(Add Service)------------------*/
  app.post("/addService", (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService).then((result) => {
      res.send(result.insertCount > 0);
    });
  });
  /*-----------(Show Book Services By mail)--------------------------*/
  app.get("/showBookingByMail", (req, res) => {
    bookServicesCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  /*-----------(Show Services)--------------------------*/
  app.get("/allServices", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  /*-----------(Show Review on home page)--------------------------*/
  app.get("/review", (req, res) => {
    reviewCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  /*-----------(Checked isAdmin Or not)--------------------------*/
  app.get("/isAdmin", (req, res) => {
    console.log(req.body.email);
    adminCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
        console.log(documents.length > 0);
      });
  });
  /*-----------(Show All Booking)--------------------------*/
  app.get("/allBooking", (req, res) => {
    bookServicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  /*-----------------(Delete Service)------------------------*/
  app.delete("/deleteService/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection
      .deleteOne({ _id: id })
      .then((result) => res.send(result));
  });
  /*-----------------(Update Status)------------------------*/
  app.patch("/updateStatus/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    const changeStatus = req.body.status;
    bookServicesCollection
      .updateOne(
        { _id: id },
        {
          $set: { status: changeStatus },
        }
      )
      .then((result) => res.send(result));
  });
});
app.get("/", (req, res) => {
  res.send("Yes! I am Working");
});

app.listen(process.env.PORT || port);
