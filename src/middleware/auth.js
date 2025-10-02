export const requireAuth = (req,res,next)=>{
  if (!req.session.user) return res.redirect('/login');
  next();
}
export const requireAdmin = (req,res,next)=>{
  if (!req.session.user || req.session.user.role!=='admin') return res.status(403).send('Forbidden');
  next();
}
