module.exports = function(allowed = []){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ msg: 'Not authenticated' });
    if(!Array.isArray(allowed)) allowed = [allowed];
    if(allowed.length && !allowed.includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden' });
    next();
  }
}
