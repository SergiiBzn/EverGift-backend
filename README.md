# EverGift Backend

**EverGift Backend** is the core server-side API of the EverGift application — a smart gift management platform powered by modern Node.js technologies and AI integration.

---

## 🚀 Features

- **User Authentication & Authorization** – Secure login and registration using JWT and bcrypt  
- **Gift & Event Management** – CRUD operations for gifts, events, and user collections  
- **AI Integration** – Generate personalized gift ideas via Google Generative AI and OpenAI APIs  
- **Image Uploads** – Upload and manage images using Cloudinary and Multer  
- **Data Validation** – Strict schema validation with Zod  
- **Markdown Rendering** – Rich text support with PrismJS and Remark GFM  
- **Secure Cookies** – Managed sessions with cookie-parser  
- **Cross-Origin Access** – Configured via CORS  
- **Structured Logging** – Colorized console logs via Chalk  
- **MongoDB Database** – Efficient data handling with Mongoose  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js (v5) |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT + bcrypt |
| **File Storage** | Cloudinary + Multer |
| **AI / NLP** | Google Generative AI, OpenAI |
| **Validation** | Zod |
| **Markdown / Syntax Highlighting** | Remark GFM, PrismJS |
| **Utilities** | Chalk, cookie-parser, cors |

---

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/SergiiBzn/EverGift-backend.git
cd EverGift-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create an .env file**
```bash
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/evergift
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
```

4. **Run in development mode**

```bash
npm run dev
```

or for production:
```bash
npm run build
npm start
```