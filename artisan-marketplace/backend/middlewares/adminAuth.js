import jwt from 'jsonwebtoken';
import Admin from '../models/Admins.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ id: decoded.adminId });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate as admin.' });
  }
};

export default adminAuth;
