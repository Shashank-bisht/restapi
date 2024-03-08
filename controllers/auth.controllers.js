import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username and email are required" });
    }   

     // Check if the username already exists
     const existingUser = await User.findOne({ username });

     if (existingUser) {
        // User with the same username or email already exists
        return res
          .status(400)
          .json({ message: "Username or email already in use" });
      }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
  
    try {
      await newUser.save();
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      next(error);
    }
}


export const login = async (req, res, next)=>{
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }   
  try{
    const validUser = await User.findOne({username});
    if(!username){
      res.status(400).json({ message: "Username does not exist" });
    }
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if(!validPassword){
      res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: validUser._id }, "shanky", {
      expiresIn: "1d",
    })
    const { password: hashedPassword, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true ,expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)})
      .status(200)
      .json({message: "logged in successfully"});
  } catch (error) {
    next(error);
  }
  }


  export const forgetpassword = async (req, res, next) => {
    const { email } = req.body;
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const token = jwt.sign({ id: user._id }, "shanky", {
        expiresIn: "1d",
      })
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shashankbisht53734@gmail.com',
          pass: 'iqklamzsddfulvip'
        }
      });
      
      var mailOptions = {
        from: 'shashankbisht53734@gmail.com',
        to: email,
        subject: 'Reset your Password',
        text: 'Click on the link below to reset your password. \n\n' + `http://localhost:8000/api/auth/reset-password/${user._id}/` + token
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
         return res.status(200).json({ message: "Email sent: " + info.response });
        }
      });
    })
  }
  
  export const resetPassword = async (req, res, next) => {
    const {id, token} = req.params
    const {password} = req.body
    jwt.verify(token, "shanky", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" })
      }else{
          bcryptjs.hash(password, 10).then(hashedPassword => {
          User.findOneAndUpdate({_id: id}, {password: hashedPassword}).then(()=>{
            res.status(200).json({message: "Password updated successfully"})
          }).catch(err => {
            next(err)
          })
        })
      }
    })
  }