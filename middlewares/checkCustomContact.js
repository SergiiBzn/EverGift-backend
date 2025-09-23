import { Contact } from "../models/index.js";
const checkCustomContact = async (req, res, next) => {
  const { contactId } = req.params;
  const ownerId = req.userId;
  const contact = await Contact.findOne({ _id: contactId, ownerId });
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  if (contact.contactType !== "custom")
    throw new Error("Operation not allowed for linked user", { cause: 403 });
  req.contact = contact;
  next();
};
export default checkCustomContact;
