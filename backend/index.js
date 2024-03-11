const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); 
const Image =require('./models/upload')
const FriendRequest=require('./models/FriendRequest')
const Notification =require('./models/Notifications')
const Friend =require("./models/Friends")
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
app.post('/notifications', async (req, res) => {
  const { senderName, receiver } = req.body;

  try {
    const notification = new Notification({
      userId: receiver,
      message: `You have a new friend request from ${senderName}.`
    });
    await notification.save();
    res.status(200).json({ notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/notifications/:id', async (req, res) => {
  const { id } = req.params; // Corrected typo here
  
  try {
    const notifications = await Notification.find({ userId: id });

    const response = {
      notifications
    };

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/friendRequests', async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Create friend request
    const friendRequest = new FriendRequest({ sender, receiver });
    await friendRequest.save();


    res.status(200).json({ friendRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});



app.get('/friendRequests/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const friendRequests = await FriendRequest.find({ receiver: id }).populate('sender receiver');


    const response = {
      friendRequests,
      
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});
app.put('/friendRequests/:requestId', async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;

  try {
    const updatedRequest = await FriendRequest.findByIdAndUpdate(requestId, { status: status }, { new: true }).populate({path :"sender",select:"name"}).populate({path :"receiver",select:"name"});
    console.log(updatedRequest)
    if (status === 'accept') {
      const newFriend = await Friend.create({ 
        user: updatedRequest.sender,
        friend: updatedRequest.receiver,
        friendName: updatedRequest.receiver.name // Add friend's name
      });

      const newFriendReverse = await Friend.create({
        user: updatedRequest.receiver,
        friend: updatedRequest.sender,
        friendName: updatedRequest.sender.name // Add friend's name
      });

      // Create notifications for both the sender and the receiver
      const senderNotification = new Notification({
        userId: updatedRequest.sender._id, // Use _id to get the ObjectId
        message: `Your friend request to ${updatedRequest.receiver.name} has been accepted by ${updatedRequest.sender.name}.` // Add sender's name
      });
      await senderNotification.save();

      const receiverNotification = new Notification({
        userId: updatedRequest.receiver._id, // Use _id to get the ObjectId
        message: `You are now friends with ${updatedRequest.sender.name}.` // Add sender's name
      });
      await receiverNotification.save();
    }

    res.status(200).json({ success: true, message: 'Friend request status updated successfully' });
  } catch (error) {
    console.error("Error updating friend request status:", error);
    res.status(500).json({ success: false, message: 'Failed to update friend request status' });
  }
});



// Assuming you have a User model with the necessary schema and methods

app.get('/friends/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch friends of the logged-in user
    const friends = await Friend.find({ user: userId }).populate('friend', 'name');

    res.status(200).json({ success: true, friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
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
