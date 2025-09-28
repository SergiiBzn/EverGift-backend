// utils/transformContact.js

/**
 * 将 Contact Convert the document into a simplified structure { _id, name, avatar }
 * @param {Object} contact
 * @returns {Object} simplified contact
 */
export const transformContact = (contact) => {
  if (!contact || !contact._id) return null;

  if (contact.contactType === "custom") {
    return {
      _id: contact._id,
      name: contact.customProfile?.name || "",
      avatar: contact.customProfile?.avatar || "",
      slug: contact.slug,
    };
  }

  if (contact.contactType === "user" && contact.linkedUserId) {
    return {
      _id: contact._id,
      name: contact.linkedUserId.profile?.name || "",
      avatar: contact.linkedUserId.profile?.avatar || "",
      slug: contact.slug,
    };
  }

  return { _id: contact._id, name: "", avatar: "", slug: contact.slug };
};

/**
 * batch convert contacts
 * @param {Array} contacts - Contact Array
 * @returns {Array} simplified contacts
 */
export const transformContacts = (contacts = []) => {
  return contacts.map(transformContact).filter(Boolean);
};
