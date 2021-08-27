const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Blog = require("../Models/Blog");
const Auth = require("../Middleware/Auth.js");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// cloudinary Config
cloudinary.config({
  cloud_name: "prathu0603",
  api_key: "288858815555214",
  api_secret: "dX0I77nqvDuGOCe15-Q_VlitlIc",
  // secure: true
});

router
  .route("/blog")
  // Get All Blog Details
  .get(async (request, response) => {
    let category = request.query.category;
    let blogs;
    try {
      if (category === "All") {
        blogs = await Blog.find();
      } else if (category) {
        blogs = await Blog.find({ category: category });
      } else {
        blogs = await Blog.find();
      }
      response.status(200).send(blogs);
    } catch (error) {
      response.status(500).send("Server Error");
    }
  })
  //Add Blog
  .post(async (request, response) => {
    try {
      //   Get File Data From Client
      const imageData = request.body.image;

      const { category, title, author, desc, ownerId } = request.body;

      // Upload Files To Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageData, {
        upload_preset: "dev_upload",
      });

      const blog = new Blog({
        category,
        title,
        author,
        desc,
        ownerId,
        imageUrl: imageUpload.secure_url,
      });

      await blog.save();
      response.status(200).send("Blog Created");
    } catch (error) {
      response.status(500).send({ message: "Server Error" });
    }
  });

router
  .route("/blog/:id")
  // Get Reuested Blog Info
  .get(async (request, response) => {
    try {
      const id = request.params.id;
      const blog = await Blog.findById(id);
      response.status(200).send(blog);
    } catch (error) {
      response.status(500).send({ message: "Server Error" });
    }
  })
  // Update the Blog
  .patch(async (request, response) => {
    try {
      const id = request.params.id;
      const blog = await Blog.findByIdAndUpdate(id, request.body);

      response.status(200).send("Blog Updated");
    } catch (error) {
      response.status(500).send({ message: "Server Error" });
    }
  })
  //  Delete The Blog
  .delete(async (request, response) => {
    try {
      const id = request.params.id;
      await Blog.deleteOne({ _id: id });
      response.status(200).send({ message: "User Deleted" });
    } catch (error) {
      response.status(500).send({ message: "Server Error" });
    }
  });

// User Data

// Signup
router.route("/signup").post(async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      return response.status(409).json({ error: "Email All Ready Exist" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      response.status(200).json({ message: "User Registered" });
    }
  } catch (error) {
    response.status(500).send({ message: "Server Error" });
    console.log(error);
  }
});

// Signin
router.route("/signin").post(async (request, response) => {
  try {
    const { email, password } = request.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return response.status(401).send({ message: "Invalid credentials" });
    } else if (findUser.password === password) {
      const genToken = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY);
      response.cookie("jwtToken", genToken, {
        expires: new Date(new Date().getTime() + 3600 * 1000),
        sameSite: "none",
        httpOnly: false,
        secure: true,
      });
      return response.status(200).send(findUser);
    } else {
      return response.status(401).send({ message: "Invalid credentials" });
    }
  } catch (err) {
    response.status(500).send(err);
  }
});

// Secured Routes
router.route("/home").get(Auth, (request, response) => {
  response.status(200).send(request.rootUser);
});

module.exports = router;
