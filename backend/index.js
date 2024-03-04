const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const Image =require('./models/upload')
const FriendRequest=require('./models/FriendRequest')
const cors =require("cors")
const app = express();
const multer = require('multer');

const PORT = 3002;
app.use(express.json());
 app.use(cors())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://faizanbutt707:Oia4ZBTMRNmeBV6k@socialapptesting.kmzn6md.mongodb.net/?retryWrites=true&w=majority&appName=socialapptesting');
  console.log("Connected to MongoDB");
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});
app.post('/friendRequests', async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const friendRequest = new FriendRequest({ sender, receiver });
    await friendRequest.save();
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get all FriendRequests
app.get('/friendRequests', async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find().populate('sender receiver');
    res.json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});
const upload = multer({ storage: storage });


app.post('/upload', upload.single('image'), async (req, res) => {
  try {
      const newImage = new Image({
          name: req.file.originalname,
          path: req.file.path
      });
      await newImage.save();
      res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to upload image' });
  }
});
app.get('/upload', async (req, res) => {
  try {
      const images = await Image.find();
      res.json(images);
  } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve images' });
  }
});


// Create a new user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
