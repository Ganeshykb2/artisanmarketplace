import artistAuth from "./artistAuth.js";
import { checkAuth } from "./authMiddleware.js";

export default function artistOrCustomerAuth(req, res, next) {
    artistAuth(req, res, (err) => {
      if (!err) return next(); // If artist authentication succeeds, proceed
      checkAuth(req, res, (err) => {
        if (!err) return next(); // If customer authentication succeeds, proceed
        res.status(401).json({ message: 'Unauthorized' }); // If both fail
      });
    });
  }