/* Import Models */
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User'); // Adjust the path as necessary

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/profile-pictures');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

async function uploadUser(req, res) {
    const { name, email, password, phoneNumber, universityID } = req.body;

    console.log('Request body:', req.body); // Debugging: Check the request body
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const exists = await User.find({ email: email });

    if (exists.length === 0) {
        const numUsers = await User.countDocuments();
        const newUserID = 20001 + parseInt(numUsers);

        try {
            const newUser = await User.create({
                userID: newUserID.toString(),
                name: name,
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                universityID: universityID,
                profilePicture: req.file ? "/profile-pictures/" + req.file.filename : "/profile-pictures/default.png",
                enrollmentProof: '',
                isVerifiedPassenger: false,
                isVerifiedDriver: false,
                balance: 0,
                driverLicense: '',
                carMake: '',
                carModel: '',
                carPlate: '',
            });

            if (newUser) {
                console.log('Registered an Account Successfully!');
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Error saving user data');
        }
    } else {
        console.log('Registration failed. Email already exists.');
        res.redirect('/auth/register');
    }
}


async function logout(req, res) {
    // Create a new form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout?_method=DELETE'; // Action URL for logout
    
    // Append the form to the document body and submit
    document.body.appendChild(form);
    form.submit();
}

async function verifyEmail(req, res) {}

module.exports = {
    uploadUser,
    logout,
    verifyEmail
}
