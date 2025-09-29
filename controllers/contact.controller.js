/** @format */

import { Contact, User } from "../models/index.js";
import { transformContacts } from "../utils/transformContact.js";

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
    profile:
      contact.contactType === "user"
        ? contact.linkedUserId.profile
        : contact.customProfile,
    wishList:
      contact.contactType === "user"
        ? contact.linkedUserId.wishList
        : contact.customWishList,
    slug: contact.slug,
  };
};

// get all contacts for a user
export const getAllContacts = async (req, res) => {
  const ownerId = req.userId;
  // const user = await User.findById(ownerId);
  const contacts = await Contact.find({ ownerId }).populate([
    { path: "linkedUserId", select: "profile wishList slug" },
  ]);
  const formatted = transformContacts(contacts);

  res.status(200).json(formatted);
};
//********** POST /contacts **********
// create a new contact or linked user
export const createContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactType, linkedUserId, customProfile } = req.body;

  const defaultAvatar =
    "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png";
  //! take the secure url from cloudinary
  const imageUrl = req.file?.secure_url;

  // The final avatar URL: prioritize the uploaded file, then the URL from the form, then a default.
  const finalAvatarUrl = imageUrl || customProfile?.avatar || defaultAvatar;

  let contact;

  // user as contact
  if (contactType === "user") {
    const user = await User.findById(ownerId).populate("contacts");

    // linkedUserId
    const linkedUser = await User.findById(linkedUserId);

    if (!linkedUser) {
      throw new Error("Linked user not found", { cause: 404 });
    }
    if (linkedUserId.toString() === ownerId.toString()) {
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
    /*  if (!customProfile?.name || !customProfile?.birthday) {
      throw new Error(
        "customProfile with name and birthday is required for contactType 'custom'",
        {
          cause: 400,
        }
      );
    } */

    /*  // If the avatar is an empty string, delete it so the Mongoose default is used.
    if (customProfile.avatar === "") {
      delete customProfile.avatar;
    } */

    // 4. Assemble the customProfile object with all the data

    const customProfileData = {
      ...customProfile,
      avatar: finalAvatarUrl,
    };

    contact = await Contact.create({
      ownerId,
      contactType,
      customProfile: customProfileData,
    });

    console.log("created contact", contact);
  } else {
    // TODO: contactType should be always added by creating
    throw new Error("Invalid contact type", {
      cause: 400,
    });
  }
  // add contact to user.contacts array
  await User.findByIdAndUpdate(ownerId, {
    $push: { contacts: contact._id },
  });

  // populate linkedUser for uniform respons
  await contact.populate({ path: "linkedUserId", select: "profile wishList" });

  res.status(201).json(formContact(contact));
};

//********** GET /contact/:id **********
// get a specific contact by ID
export const getContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  const contact = await Contact.findOne({ _id: contactId, ownerId }).populate([
    { path: "givenGifts", populate: { path: "gift", model: "Gift" } },
    { path: "events", populate: { path: "gift", model: "Gift" } },
    { path: "linkedUserId", select: "profile wishList slug" },
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
  ).populate({ path: "linkedUserId", select: "profile wishList slug" });

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.status(200).json(formContact(contact));
};

//==================== update a contact Profile by ID==========================
export const updateContactProfile = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  const contact = await Contact.findOne({ _id: contactId, ownerId });

  if (!contact) throw new Error("Contact not found", { cause: 404 });
  if (contact.contactType === "user") {
    throw new Error("Cannot update profile of a user contact", { cause: 400 });
  }
  contact.customProfile = { ...contact.customProfile, ...req.body };
  await contact.save();
  // populate linkedUser for uniform response
  await contact.populate({
    path: "linkedUserId",
    select: "profile wishList slug",
  });

  res.status(200).json(formContact(contact));
};

//==================== update a contact wishlist by ID==========================
export const updateContactWishList = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, ownerId },
    { $set: { customWishList: req.body } },
    { new: true }
  );

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.status(200).json(formContact(contact));
};

// delete a contact by ID

export const deleteContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  const contact = await Contact.findOneAndDelete({ _id: contactId, ownerId });

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  return res.status(204).json();
};
