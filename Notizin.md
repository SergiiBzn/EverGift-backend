## Datenbank Schema Design

### Users

```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  profil:{
  name: String,
  avatar: String, // img,link
  birthday: Date,
  tags: []
  wishList:[]
  giftHistory:[
    {
      giftName: String
      from: ObjectId // ref Contacts
      fromName: String // custom
      date: Date
    }
  ]
  }

  contacts: [ObjectId], // Referenz auf Contact Schema
}
```

### Contacts

```javascript
{
  owner:ObjectId // ref: 'User',
  // Contact Type
    type: {
    type: String,
    enum: ['user', 'custom'],
    required: true
  },


  linkedUserId: {
    type: ObjectId//ref 'User',
    default: null
  },

  // 自定义联系人信息（仅当type为custom时使用）
  customInfo: {
    name: String,
    avatar: String,
    age: Number,
    interests: [String],

  },
  wishList: [String],
  giftHistory:[{}]
  eventList :[objectId]


  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'accepted' // custom contact default: accepted
  },

}
```

### contactRequestSchema (later)

```javascript
const contactRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    maxlength: 200,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  respondedAt: Date,
});
```

### notification(later)

```javascript
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["contact_request", "gift_reminder", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    relatedData: {
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactRequest",
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GiftEvent",
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);
```

### GiftEvents

```javascript
{
  _id: ObjectId,
  ownerId: ObjectId, // ref user
  contactId: ObjectId, // Referenz auf Contact Schema
  title: String, // z.B. "Geburtstag", "Weihnachten", "Einschulung"
  date: Date,
  isRepeat: {String, enum ["yearly","none"] , default: "none"}
  isPinned: Boolean,
  status: {String, enum ['activ',"completed","achieved"]},

}
```

### GiftHistory ???

```javascript
{
  _id: ObjectId,
  contactId: ObjectId, // Referenz auf Contact Schema
  eventId: ObjectId, // Referenz auf GiftEvent Schema (optional)
  giftName: String,
  description: String, // Optional
  dateGiven: Date
}
```

### 5. GiftRecommendation (KI)

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referenz auf User Schema
  contactID: ObjectId, // Referenze auf ContactSchema
  histories:[]
}
```

---
