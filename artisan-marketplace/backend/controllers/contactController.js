// backend/controllers/contactController.js
import Contact from '../models/Contact.js';

export const createContactSubmission = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact submission
    const newContact = new Contact({
      name,
      email,
      message
    });

    // Save the contact submission
    await newContact.save();

    res.status(201).json({
      message: 'Contact submission received successfully!',
      data: newContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "No contact submissions found" });
    }
    
    res.status(200).json({
      message: "Contact submissions retrieved successfully",
      data: contacts,
      total: contacts.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params; // Assuming 'id' is passed as a route parameter

    // Find and delete the contact submission by the custom 'id' field
    const contact = await Contact.findOneAndDelete({ id: id });

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.status(200).json({ message: 'Contact submission deleted successfully', data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
