import express from 'express';
import {  createContactSubmission, 
    getAllContactSubmissions,
    deleteContactSubmission  } from '../controllers/contactController.js';
import adminAuth from '../middlewares/adminAuth.js';
const router = express.Router();

router.post('/', createContactSubmission);
router.get('/',adminAuth, getAllContactSubmissions);
router.delete('/delete/:id',adminAuth, deleteContactSubmission);

export default router;