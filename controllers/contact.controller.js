/** @format */

import { Contact, GivenGift, Event, User, Gift } from "../models/index.js";
/**
 * Helper: Format the contact output and unify the front-end structure
 */
const formContact = (contact) => {
  return {
    id: contact._id,
    contactType: contact.contactType,
    note: contact.note,
    givenGifts: contact.givenGifts,
    events: contact.events,
    profil:
      contact.contactType === "user"
        ? contact.linkedUserId.profil
        : contact.customProfil,
    wishList:
      contact.contactType === "user"
        ? contact.linkedUserId.wishList
        : contact.customWishList,
  };
};

// get all contacts for a user
export const getAllContacts = async (req, res) => {
  const ownerId = req.userId;
  // const user = await User.findById(ownerId);
  const contacts = await Contact.find({ ownerId }).populate([
    { path: "linkedUserId", select: "profil wishList" },
  ]);
  const formatted = contacts.map(formContact);
  res.status(200).json(formatted);
};

// create a new contact or linked user
export const createContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactType, linkedUserId, customProfil } = req.body;

  let contact;

  // user as contact
  if (contactType === "user") {
    const user = await User.findById(ownerId).populate("contacts");

    // linkedUserId
    const linkedUser = await User.findById(linkedUserId);

    if (!linkedUser) {
      throw new Error("Linked user not found", { cause: 404 });
    }
    if (linkedUserId === ownerId) {
      throw new Error("Cannot add yourself as a contact", { cause: 400 });
    }
    const alreadyContact = user.contacts.some(
      (c) =>
        c.contactType === "user" &&
        c.linkedUserId?.toString() === linkedUserId.toString()
    );
    if (alreadyContact) {
      throw new Error("This user is already in your contacts", { cause: 400 });
    }

    contact = await Contact.create({
      ownerId,
      contactType,
      linkedUserId,
    });
  }

  // =========================== custom contact ==========================
  else if (contactType === "custom") {
    if (!customProfil?.name || !customProfil?.birthday) {
      throw new Error(
        "customProfil with name and birthday is required for contactType 'custom'",
        {
          cause: 400,
        }
      );
    }
    contact = await Contact.create({
      ownerId,
      contactType,
      customProfil,
    });
  } else {
    throw new Error("Invalid contact type", {
      cause: 400,
    });
  }
  // add contact to user.contacts array
  await User.findByIdAndUpdate(ownerId, {
    $push: { contacts: contact._id },
  });

  // populate linkedUser for uniform respons
  await contact.populate({ path: "linkedUserId", select: "profil wishList" });
  console.log(contact);

  res.status(201).json(formContact(contact));
};

// get a specific contact by ID
export const getContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  // if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
  //   throw new Error("Invalid contact ID format", { cause: 400 });
  // }

  const contact = await Contact.findOne({ _id: contactId, ownerId }).populate([
    { path: "givenGifts", populate: { path: "gift", model: "Gift" } },
    { path: "events", populate: { path: "gift", model: "Gift" } },
    { path: "linkedUserId", select: "profil wishList" },
  ]);

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.status(200).json(formContact(contact));
};

//==================== update a contact note by ID==========================
export const updateContactNote = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;
  const { note } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, ownerId },
    { note },
    { new: true }
  ).populate({ path: "linkedUserId", select: "profil wishList" });
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  res.status(200).json(formContact(contact));
};

//==================== update a contact Profile by ID==========================
export const updateContactProfile = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;
  const { customProfil } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, ownerId },
    { customProfil },
    { new: true }
  );

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.status(200).json(formContact(contact));
};

//==================== update a contact wishlist by ID==========================
export const updateContactWishList = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;
  const { wishItem } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, ownerId },
    { $addToSet: { customWishList: wishItem } },
    { new: true }
  );

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.status(200).json(formContact(contact));
};

// delete a contact by ID
export const deleteContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  const contact = await Contact.findOne({ _id: contactId, ownerId });
  if (!contact) throw new Error("Contact not found", { cause: 404 });

  // remove all givenGifts
  if (contact.givenGifts?.length) {
    await GivenGift.deleteMany({ _id: { $in: contact.givenGifts } });
  }

  // remove all events and associated gifts
  if (contact.events?.length) {
    const eventsToDelete = await Event.find({ _id: { $in: contact.events } });

    const giftIds = eventsToDelete
      .map((event) => event.gift)
      .filter((giftId) => giftId !== null); // array of gift ids to delete

    // delete all events and gifts associated with the contact
    await Gift.deleteMany({ _id: { $in: giftIds } });
    await Event.deleteMany({ _id: { $in: contact.events } });

    // // update user's events array
    await User.findByIdAndUpdate(contact.ownerId, {
      $pull: { events: { $in: contact.events } },
    });
  }
  // remove contact from user's contacts array
  await User.findByIdAndUpdate(ownerId, {
    $pull: { contacts: contactId },
  });
  // finally delete the contact
  await Contact.findByIdAndDelete(contactId);
  return res.status(204).json();
};
