import Contact from "../models/Contact.js";
const checkCustomContact = async (req, res, next) => {
  const { _id } = req.params;
  const ownerId = req.userId;
  const contact = await Contact.findOne({ where: { _id, ownerId } });
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  if (contact.contactType !== "custom")
    throw new Error("Operation not allowed for linked user", { cause: 403 });
  req.contact = contact;
  next();
};
export default checkCustomContact;
