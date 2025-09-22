import Contact from "../models/contact.model.js";

// get all contacts for a user
export const getAllContacts = async (req, res) => {
  const ownerId = req.userId;
  const contacts = await Contact.findAll({ ownerId });
  res.json(contacts);
};

// create a new contact or linked user
export const createContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactType, linkedUserId, customProfil } = req.body;

  const contact = await Contact.create({
    ownerId,
    contactType,
    linkedUserId,
    customProfil,
  });
  res.status(201).json(contact);
};

// get a specific contact by ID
export const getContact = async (req, res) => {
  const ownerId = req.userId;
  const { id } = req.params;

  const contact = await Contact.findOne({ _id: id, ownerId })
    .populate("givenGifts")
    .populate("eventList");

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.json(contact);
};

//==================== update a contact Profile by ID==========================
export const updateContactProfile = async (req, res) => {
  const ownerId = req.userId;
  const { id } = req.params;
  const { customProfil } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: id, ownerId },
    { customProfil },
    { new: true }
  );
  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.json(contact);
};

//==================== update a contact note by ID==========================
export const updateContactNote = async (req, res) => {
  const ownerId = req.userId;
  const { id } = req.params;
  const { note } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: id, ownerId },
    { note },
    { new: true }
  );
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  res.json(contact);
};

//==================== update a contact wishlist by ID==========================
export const updateContactWishList = async (req, res) => {
  const ownerId = req.userId;
  const { id } = req.params;
  const { wishList } = req.body;
  if (!Array.isArray(wishList)) {
    throw new Error("Wishlist must be an array", { cause: 400 });
  }
  const contact = await Contact.findOneAndUpdate(
    { _id: id, ownerId },
    { wishList },
    { new: true }
  );

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.json(contact.wishList);
};

// delete a contact by ID
export const deleteContact = async (req, res) => {
  const ownerId = req.userId;
  const { _id } = req.params;
  const contact = await Contact.findOne({ where: { _id, ownerId } });
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  await contact.destroy();
  res.json({ message: "Contact deleted" });
};
