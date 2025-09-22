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
2. **Controllers ** 
   CRUD:
   Auth
   Contact
   Event
   receivedGift
   givenGifts

   
4. **Users Router**

   - POST /users/register
   - POST/users/login
   - DELETE /users/logout
   - GET /users/me
   - PUT /users/me
   - DELETE /users/me

-GET /users/:id/receivedGifts (Get receivedGifts)
- GET /users/:id/receivedGifts/:id (Get receivedGift)
- POST /users/:id/receivedGifts (receivedGift hinzufügen)
- PUT /users/:id/receivedGifts/:id (Update receivedGift)
- DELETE /users/:id/receivedGifts/:id (Delete receivedGift)

- - GET /users/:id/events


4. **Contacts Router**, z.B.:

- GET /contacts (Get contacts)
- GET /contacts/:id (Get contact)
- POST /contacts (Kontakt hinzufügen) -> Middleware
- PUT /contacts/:id (Update contact) -> Middleware
- DELETE /contacts/:id (Delete contact) -> Middleware
  
---
- GET /contacts/:id/givenGifts (Get givenGifts)
- GET /contacts/:id/givenGifts/:id (Get givenGift)
- POST /contacts/:id/givenGifts (givenGift hinzufügen)
- PUT /contacts/:id/givenGifts/:id (Update givenGift)
- DELETE /contacts/:id/givenGifts/:id (Delete givenGift)
---

- POST /contacts/:id/events (Event für Kontakt hinzufügen) -> Middleware
- GET /contacts/:id/events (Events für Kontakt erhalten)
- GET /contacts/:id/events/:id (Event für Kontakt erhalten)
- PUT /contacts/:id/events/:id (Event für Kontakt wechseln)
- DELETE /contacts/:id/events/:id (Event für Kontakt löschen)

---

