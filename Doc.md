# EverGift-Doc

## Projektinhalt und Funktionsarchitektur

### Benutzersystem (Auth)

```
- Registrierung / Login / Logout
- Passwort vergessen (optional)
```

### Dashboard

```
- Übersicht (kommende Geschenk-Erinnerungen)
- Schnelles Hinzufügen von Kontakten / Events
- Anzeige von Geschenkempfehlungen
```

### Friends & Family Verwaltung (People)

```
- Kontakte hinzufügen / bearbeiten / löschen
- Kontaktinformationen festlegen:
    - Name / Spitzname
    - Alter / Geschlecht
    - Interessen-Tags (mehrfach auswählbar)/ input
- Kontakt-Detailseite:
    - Geschenk-Historie (gegeben + gewünscht)
    - Feiertage & besondere Anlässe
    - Wunschliste (einfache Aufzeichnung von Dingen, die sie erwähnt haben)
```

### Geschenk-Kalender (Gift Calendar)

```
- Geschenk-Termine hinzufügen (Geburtstag, Feiertag, besonderer Anlass wie Einschulung etc.)
- Erinnerung einstellen (Standard oder individuell einstellbar, z.B. 3 Monate/1 Monat/15 Tage vorher)
- „Geschenk vorbereitet“ markieren
```

### Erinnerungssystem (Reminders)

```
- Anzeige kommender Erinnerungen
- Archivierung abgeschlossener Erinnerungen
- Logik innerhalb der Seite + regelmäßige Backend-Prüfung
```

### Geschenk-Empfehlungen (Recommendation)

```
- **KI-gestützte Empfehlungen:** Basierend auf Alter, Interessen, Wunschliste, Geschenk-Historie, Preis etc.
- Anzeige der Empfehlungsliste (einfache Logik oder KI-Integration)
- Markierungen: „Interessant / Gekauft“ (optional)
```

### Einstellungen / Konto

```
- Ändern des Benutzernamens / Passworts (optional)
```

---

## Wochen Plan (Drei-Wochen-Entwicklungsplan)

### **Woche 1: Basis und Kernfunktionen**

**Ziel:** Grundgerüst erstellen, Datenbank entwerfen, Kernfunktionen
implementieren.

**Aufgaben:**

- GitHub-Repository anlegen, React-Frontend + Node/Express-Backend
  initialisieren.
- Datenbankmodell entwerfen (User, Contact, GiftEvent, GiftRecord, Optional:
  GiftRecommendation).
- Basis-APIs für CRUD (Kontakte, Events) implementieren.
- **Benutzersystem:** Registrierung, Login, Logout implementieren (z.B. mit JWT
  oder Sessions).
- **Figma: Low-Fidelity Wireframes** (Dashboard, Modal, Login-Seite).

**Ergebnis:**

- Grundstruktur des Projekts steht.
- Basis-APIs für Kontakte und Events sind funktionsfähig.
- Grundlegendes Layout in Figma ist vorhanden.

---

### **Woche 2: Event-Management, Erinnerungen und Kontaktverwaltung**

**Ziel:** Geschäftslogik für Events und Erinnerungen umsetzen, Kontaktmanagement
ausbauen.

**Aufgaben:**

- **Kontaktverwaltung:** Formulare zum Hinzufügen/Bearbeiten von Kontakten mit
  Tag-Auswahl implementieren.
- **GiftEvent Logik:** Datum für wichtige Tage (Geburtstag, Feiertag etc.)
  hinzufügen und verwalten.
- **Erinnerungslogik:** Erinnerungszeiträume (3 Monate, 1 Monat, 15 Tage vorher)
  implementieren.
- **Gift History:** Anzeigen und Verwalten der Geschenk-Historie für Kontakte.
- **Figma: High-Fidelity Design** (Farben, Icons, einheitliche Komponenten).

**Ergebnis:**

- Benutzer können Kontakte und wichtige Daten für sie verwalten.
- Erinnerungslogik ist implementiert und bereit für die Anzeige.
- Fertiges Design für die weitere Implementierung vorhanden.

---

### **Woche 3: Dashboard, Erinnerungen, Empfehlungen und Optimierung**

**Ziel:** User Experience verbessern, KI-Empfehlungen integrieren,
Projektpräsentation fertigstellen.

**Aufgaben:**

- **Dashboard Integration:** Anzeige kommender Erinnerungen und
  Geschenkempfehlungen im Dashboard.
- **Erinnerungssystem UI:** Anzeige und Archivierung von Erinnerungen. Funktion
  „Geschenk vorbereitet“ hinzufügen und Reminder deaktivieren.
- **Geschenkempfehlungen:** Implementierung der einfachen Logik oder Integration
  einer externen KI-API für Empfehlungen basierend auf Alter, Interessen,
  Historie.
- **UI/UX Optimierung:** Farben, Icons, Tags vereinheitlichen, die
  Benutzerfreundlichkeit verbessern.
- **Figma: Feinschliff**, Export von finalen Icons/Illustrationen.
- **Ergebnis:**

- Fertige, präsentierbare Anwendung mit Kernfunktionen und grundlegenden
  Empfehlungen.
- ***

## Technische Empfehlungen

- **Frontend:** React + React Router + State Management (Context API).
- **Backend:** Node.js + Express.js (
- **Datenbank:** MongoDB (mit Mongoose ODM für einfache Schema-Definition und
  Interaktion).
- **Erinnerungslogik:**
  - **Einfachste Implementierung:** Frontend zeigt Differenz zwischen aktueller
    Zeit und Event-Datum. Logik zur Anzeige von Erinnerungen läuft im Frontend.
  - **Fortgeschrittene Implementierung:** Node.js Backend verwendet Bibliotheken
    wie node-cron für regelmäßige Datenbank-Scans und das Senden von
    Benachrichtigungen (z.B. E-Mail, In-App-Benachrichtigungen).
- **KI-Empfehlungen:**
  - Beginnen Sie mit einer einfachen Logik basierend auf Tags und
    Alter.[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEZnPzJ5jfNuZnQ7a0sLpsh83-epO7w4DMJAY0tazldj7LcHYg3uPn4nsgqXfstC2pQdRs7sfVmUpzSrXz2IqDYesrG30DlmzDyyxQ9n6U9wMn1bYOUsAta435Homh-ucxqo46ED7DeFV8HTA%3D%3D)][[2](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHP2SR-BpCqBH_PhL_Cv_uX6yCelACUFpuTItaja5kIeUivSAu_ykOn8CgRHGfq99c5wdYqtAUIp-ZOGBgY3SLCv4SVQHGwpKIuAb4plQ2s9a4Yt1N33Qxh0huon1PNkcFJhqUJFf4N_g%3D%3D)]
  - Für fortgeschrittene KI-Integration: Recherche von externen KI-APIs (z.B.
    OpenAI für Text-basierte Empfehlungen, oder spezifische
    Geschenkempfehlungs-APIs, falls verfügbar) und deren
    Integration.[[3](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGrADIhrmU_-67nmuHmCeOsHgdtNE5rHjRvkwOwpaVYsAO3MMnh1cowEVX4qVM_O8scno_m-OkaNlUE5WkQj70k6Pr3GFundCyPI4LH1ns%3D)]

---

## Datenbank Schema Design

### Users

```
{
  _id: ObjectId,
  username: String,
  avatar: String, // img,link
  email: String,
  passwordHash: String,
  createdAt: Date,
  contacts: [ObjectId], // Referenz auf Contact Schema
}
```

### Contacts

```
{
  _id: ObjectId,
  userId: ObjectId, // Referenz auf User Schema
  name: String,
  birthday: Date,
  gender: String,
  tags: [String], // z.B. ["Lego", "Kochen", "Marvel"]
  events: [ObjectId], // Referenz auf GiftEvent Schema
  giftHistory: [ObjectId], // Referenz auf GiftHistory Schema
  wishlist: [String], // Einfache Aufzeichnung von gewünschten Dingen
}
```

### GiftEvents

```
{
  _id: ObjectId,
  contactId: ObjectId, // Referenz auf Contact Schema
  title: String, // z.B. "Geburtstag", "Weihnachten", "Einschulung"
  date: Date,
  favorite: Boolean,
  isGiftReady: Boolean,
  createdAt: Date
}
```

### GiftHistory

```
<!-- {
  _id: ObjectId,
  contactId: ObjectId, // Referenz auf Contact Schema
  eventId: ObjectId, // Referenz auf GiftEvent Schema (optional)
  giftName: String,
  description: String, // Optional
  dateGiven: Date
} -->
```

### 5. GiftRecommendation (KI)

```
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
- POST /receivedGifts (receivedGifts hinzufügen)
- PUT /receivedGifts/:id (Update receivedGifts)
- DELETE /receivedGifts/:id (Delete receivedGifts)

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

6. **GiftHistory???**

   - ?

7. **GiftRecommendation**

   - KI?

8. **Testen der Dateninteraktion** mit Tools wie Postman oder durch die
   Frontend-Entwicklung.
9. **Frontend-Entwicklung und API-Integration:**
   - Aufbau der UI-Komponenten für jeden Funktionsbereich.
   - Implementierung der Logik zum Aufrufen der erstellten APIs vom Frontend aus
     (mit fetch ).
   - Verarbeitung der Daten vom Backend und Anzeige in der Benutzeroberfläche.
   - Sicherstellung einer reibungslosen Datenkommunikation und
     Benutzererfahrung.
10. **Testen der Dateninteraktion** mit Tools wie Postman und durch umfassendes
    End-to-End-Testing der Anwendung.
