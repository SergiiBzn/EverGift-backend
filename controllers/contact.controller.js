import { Contact, GivenGift, Event } from "../models/index.js";

// get all contacts for a user
export const getAllContacts = async (req, res) => {
  const ownerId = req.userId;
  const contacts = await Contact.find({ ownerId });
  res.json(contacts);
};

// create a new contact or linked user
export const createContact = async (req, res) => {
  const ownerId = req.userId;
  let contact;
  const { contactType, linkedUserId, customProfil } = req.body;
  if (contactType === "user" && !linkedUserId) {
    throw new Error("linkedUserId is required for contactType 'user'", {
      cause: 400,
    });
  }
  if (
    contactType === "custom" &&
    (!customProfil?.name || !customProfil?.birthday)
  ) {
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
    linkedUserId: contactType === "user" ? linkedUserId : undefined,
    customProfil: contactType === "custom" ? customProfil : undefined,
  });
  res.status(201).json(contact);
};

// get a specific contact by ID
export const getContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;

  if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("Invalid contact ID format", { cause: 400 });
  }

  if (contactId === ownerId) {
    throw new Error("Cannot get user as contact", { cause: 400 });
  }

  const contact = await Contact.findOne({ _id: contactId, ownerId });
  if (!contact) throw new Error("Contact not found", { cause: 404 });

  const populations = [{ path: "givenGifts" }, { path: "eventList" }];
  if (contact.contactType === "user" && contact.linkedUserId) {
    populations.push({
      path: "linkedUserId",
      select: "email profil wishList",
    });
  }
  await contact.populate(populations);

  res.json(contact);
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
  );
  if (!contact) throw new Error("Contact not found", { cause: 404 });
  res.json(contact);
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

  res.json(contact);
};

//==================== update a contact wishlist by ID==========================
export const updateContactWishList = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;
  const { wishItem } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, ownerId },
    { $addToSet: { wishList: wishItem } },
    { new: true }
  );

  if (!contact) throw new Error("Contact not found", { cause: 404 });

  res.json(contact.wishList);
};

// ==================== update a contact by ID==========================
// exports.updateContact = async (req, res) => {
//   const { contactId } = req.params;
//   const { customProfil, note, wishList } = req.body;
//   const ownerId = req.userId;

//   try {
//     const contact = await Contact.findOne({ _id: contactId, ownerId });

//     if (!contact) {
//       return res.status(404).json({ message: "Contact not found" });
//     }

//     const updateOps = {
//       $set: {},
//     };

//     // note 可以在任何类型的联系人上更新
//     if (note !== undefined) {
//       updateOps.$set.note = note;
//     }

//     // profil 和 wishlist 只能在 "custom" 类型的联系人上更新
//     if (contact.contactType === "custom") {
//       if (customProfil) {
//         for (const key in customProfil) {
//           if (Object.prototype.hasOwnProperty.call(customProfil, key)) {
//             updateOps.$set[`customProfil.${key}`] = customProfil[key];
//           }
//         }
//       }
//       if (wishList) {
//         if (!Array.isArray(wishList)) {
//           return res
//             .status(400)
//             .json({ message: "wishList must be an array of items to add" });
//         }
//         updateOps.$addToSet = { wishList: { $each: wishList } };
//       }
//     } else {
//       if (customProfil || wishList) {
//         return res.status(400).json({
//           message:
//             "Profile and wishlist can only be updated for custom contacts.",
//         });
//       }
//     }

//     if (Object.keys(updateOps.$set).length === 0) {
//       delete updateOps.$set;
//     }

//     if (Object.keys(updateOps).length === 0) {
//       return res.json(contact);
//     }

//     const updatedContact = await Contact.findByIdAndUpdate(
//       contactId,
//       updateOps,
//       { new: true, runValidators: true }
//     );

//     res.json(updatedContact);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// delete a contact by ID
export const deleteContact = async (req, res) => {
  const ownerId = req.userId;
  const { contactId } = req.params;
  const deleted = await Contact.findOneAndDelete({ _id: contactId, ownerId });
  if (!deleted) throw new Error("Contact not found", { cause: 404 });
  if (deleted.givenGifts?.length) {
    // delete all givenGifts associated with the contact
    await Promise.all(
      deleted.givenGifts.map((givenGiftId) =>
        GivenGift.findByIdAndDelete(givenGiftId)
      )
    );
  }
  if (deleted.eventList?.length) {
    // delete all events associated with the contact
    await Promise.all(
      deleted.eventList.map((eventId) => Event.findByIdAndDelete(eventId))
    );
  }
  res.json({ message: "Contact deleted" });
};
