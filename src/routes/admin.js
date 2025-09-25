import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Thread from '../models/Thread.js';

const router = express.Router();

router.use(requireAdmin);

// dashboard summary
router.get('/', async (req,res)=>{
  const users = await User.countDocuments();
  const posts = await Post.countDocuments();
  const pendingReportsPosts = await Post.aggregate([{$project:{cnt:{$size:'$reports'}}}]);
  const pendingReportsThreads = await Thread.aggregate([{$project:{cnt:{$size:'$reports'}}}]);
  const totalReports = pendingReportsPosts.reduce((a,b)=>a+b.cnt,0) + pendingReportsThreads.reduce((a,b)=>a+b.cnt,0);
  res.render('admin/dashboard', {users, posts, totalReports});
});

// manage users
router.get('/users', async (req,res)=>{
  const users = await User.find().sort({createdAt:-1});
  res.render('admin/users', {users});
});
router.post('/users/:id/role', async (req,res)=>{
  const u = await User.findById(req.params.id);
  u.role = req.body.role;
  await u.save();
  res.redirect('/admin/users');
});
router.post('/users/:id/delete', async (req,res)=>{
  await User.deleteOne({_id:req.params.id});
  res.redirect('/admin/users');
});

// reports list (posts + threads)
router.get('/reports', async (req,res)=>{
  const posts = await Post.find({'reports.0': {$exists:true}}).select('title slug reports');
  const threads = await Thread.find({'reports.0': {$exists:true}}).select('title reports');
  res.render('admin/reports', {posts, threads});
});

router.post('/reports/post/:slug/:idx/status', async (req,res)=>{
  const {slug, idx} = req.params;
  const p = await Post.findOne({slug});
  p.reports[idx].status = req.body.status;
  await p.save();
  res.redirect('/admin/reports');
});
router.post('/reports/thread/:id/:idx/status', async (req,res)=>{
  const t = await Thread.findById(req.params.id);
  t.reports[req.params.idx].status = req.body.status;
  await t.save();
  res.redirect('/admin/reports');
});

// admin can delete any post/thread
router.post('/posts/:slug/delete', async (req,res)=>{
  const p = await Post.findOne({slug:req.params.slug});
  if (p) await Post.deleteOne({_id:p._id});
  res.redirect('/admin/reports');
});
router.post('/threads/:id/delete', async (req,res)=>{
  await Thread.deleteOne({_id:req.params.id});
  res.redirect('/admin/reports');
});

export default router;
