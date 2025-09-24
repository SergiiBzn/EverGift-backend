import { Contact } from '../models/index.js';

const checkContact = async (req, res, next) => {
  try {
    const ownerId = req.userId;
    const { contactId } = req.params;

    const contact = await Contact.findOne({ _id: contactId, ownerId });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    req.contact = contact;
    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to verify contact ownership',
      error: err.message,
    });
  }
};

export default checkContact;
