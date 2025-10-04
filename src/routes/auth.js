import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

router.get('/register', (req,res)=> res.render('auth/register'));
router.post('/register', async (req,res)=>{
  try {
    const {username, email, password} = req.body;
    const user = new User({username, email});
    await user.setPassword(password);
    await user.save();
    req.session.user = {id:user._id, username:user.username, role:user.role, avatar:user.avatar, email:user.email};
    res.redirect('/');
  } catch (e) {
    res.render('auth/register', {error: 'Registration failed: '+e.message});
  }
});

router.get('/login', (req,res)=> res.render('auth/login'));
router.post('/login', async (req,res)=>{
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user || !(await user.validatePassword(password))) {
    return res.render('auth/login', {error:'Invalid credentials'});
  }
  req.session.user = {id:user._id, username:user.username, role:user.role, avatar:user.avatar, email:user.email};
  res.redirect('/');
});

router.post('/logout', (req,res)=>{
  req.session.destroy(()=> res.redirect('/'));
});

// profile
router.get('/profile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = await User.findById(req.session.user.id);
  const posts = await Post.find({ author: req.session.user.id })
                          .sort({ createdAt: -1 })
                          .populate('author', 'username email');

  res.render('auth/profile', { user, posts, message: null });
});

router.post('/profile', async (req,res)=>{
  if (!req.session.user) return res.redirect('/login');
  const user = await User.findById(req.session.user.id);
  const {username,email,program,year,bio} = req.body;
  user.username=username; user.email=email; user.program=program; user.year=year; user.bio=bio;
  await user.save();
  req.session.user.username = username;
  req.session.user.email = email;
  const posts = await Post.find({ author: req.session.user.id })
                          .sort({ createdAt: -1 })
                          .populate('author', 'username email');

  res.render('auth/profile', { user, posts, message: 'อัปเดตโปรไฟล์แล้ว' });
});


export default router;
