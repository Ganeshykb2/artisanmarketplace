import rateLimit from 'express-rate-limit';

const artistViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window min *sec* milliseconds --> total milliseconds
  max: 100, // each IP to 100 requests per windowms
  message: 'Too many requests from this IP, please try again later.',
  keyGenerator: (req) => req.ip, // Use IP address for rate-limiting
});

export default artistViewLimiter;
