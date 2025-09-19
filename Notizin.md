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
  },

  wishList:[]
  giftHistory:[
    {
      giftName: String
      from: ObjectId // ref Contacts
      fromName: String // custom
      date: Date
    }
  ]

 contacts: [ObjectId], // Referenz auf Contact Schema
}
```

### Contacts

```javascript
{
  owner:ObjectId // ref: 'User',
  // Contact Type
    ContactType: {
    type: String,
    enum: ['user', 'custom'],
    required: true
  },


  linkedUserId: {
    type: ObjectId //ref 'User',
    default: null
  },

  // （type:custom）
  customInfo: {
    name: String,
    avatar: String,
    birthday: Number,
    tags: [String],
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
  gift: String,
  date: Date,
  isRepeat: {String, enum ["yearly","none"] , default: "none"}
  isPinned: Boolean,
  // status: {String, enum ['activ',"completed","achieved"]} // ???

}
```

### GiftSchema

{ name:String, description: String date: Date }

### GiftHistory ???

```javascript
// {
//   _id: ObjectId,
//   contactId: ObjectId, // Referenz auf Contact Schema
//   eventId: ObjectId, // Referenz auf GiftEvent Schema (optional)
//   giftName: String,
//   description: String, // Optional
//   dateGiven: Date
// }
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
## Nächste Schritte

Sie können jetzt beginnen mit:

1. **Erstellen der Schemas in Mongoose.**
2. **Users Endpoints**

   - POST /users/register
   - POST/users/login
   - DELETE /users/logout
   - GET /users/me
   - PUT /users/me
   - DELETE /users/me

3. **receivedGifts Endpoints**, z.B.:

- GET /receivedGifts (Get receivedGifts)
- GET /receivedGifts/:id (Get receivedGift)
- POST /receivedGifts (receivedGift hinzufügen)
- PUT /receivedGifts/:id (Update receivedGift)
- DELETE /receivedGifts/:id (Delete receivedGift)

3. **givenGifts Endpoints**, z.B.:

- GET givenGifts (Get givenGifts)
- GET /givenGifts/:id (Get givenGift)
- POST /givenGifts (givenGift hinzufügen)
- PUT /givenGifts/:id (Update givenGift)
- DELETE /givenGifts/:id (Delete givenGift)

4. **Contacts Endpoints**, z.B.:

- GET /contacts (Get contacts)
- GET /contacts/:id (Get contact)
- POST /contacts (Kontakt hinzufügen) -> Middleware
- PUT /contacts/:id (Update contact) -> Middleware
- DELETE /contacts/:id (Delete contact) -> Middleware

---

- POST /contacts/:id/events (Event für Kontakt hinzufügen) -> Middleware
- GET /contacts/:id/events (Events für Kontakt erhalten)
- GET /contacts/:id/events/:id (Event für Kontakt erhalten)
- PUT /contacts/:id/events/:id (Event für Kontakt wechseln)
- DELETE /contacts/:id/events/:id (Event für Kontakt löschen)

---

- POST /contacts/:id/history (GiftHistory für Kontakt hinzufügen) -> Middleware
- GET /contacts/:id/history (GiftHistory für Kontakt erhalten)
- GET /contacts/:id/history/:id (GiftHistory für Kontakt erhalten)
- PUT /contacts/:id/history/:id (GiftHistory für Kontakt wechseln)
- DELETE /contacts/:id/history/:id (GiftHistory für Kontakt löschen)

5. **GiftEvents Endpoints**

   - GET /events
