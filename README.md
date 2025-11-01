A Twitter‑style feed and social app built with Next.JS, NextAuth, MongoDB and Tailwind CSS—developed as part of ReDI School’s Fullstack Development Bootcamp curriculum.

Live Demo: https://redilink.vercel.app/

## 🚀 Features

* **User Authentication** via NextAuth (email/password credentials)
* **Create, Read & List Tweets**
* **User Profiles** with their own tweet feeds
* **Responsive UI** using Tailwind CSS
* **Server‑side API routes** in Next.js
* **Database ORM** powered by Mongoose

## 🛠️ Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Framework      | Next.js 14 (App Router)     |
| Styling        | Tailwind CSS                |
| Authentication | NextAuth.js                 |
| ORM / Database | Mongoose (MongoDB)          |
| Language       | JavaScript                  |
| Deployment     | Vercel                      |

## 📦 Installation

1. **Fork & clone** this repo:

   ```bash
   git clone https://github.com/priyoarman/anothertwitter.git
   cd anothertwitter
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

3. **Environment variables**
   Create a `.env.local` file at the project root and add:

   ```env
   MONGODB_URI="mongodb+srv://..."
   NEXTAUTH_SECRET="a-long-random-string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   If you use OAuth providers (e.g. GitHub, Google), also add:

   ```env
   GITHUB_ID="…"
   GITHUB_SECRET="…"
   ```

4. **Run mongoose migrations** (if you're using MongoDB):

   ```bash
   npm install mongoose
   ```

5. **Start the dev server**:

   ```bash
   npm run dev
   # then open http://localhost:3000 in your browser
   ```

## 🧪 Scripts

| Command          | Description                 |
| ---------------- | --------------------------- |
| `npm run dev`    | Run in development mode     |
| `npm run build`  | Build for production        |
| `npm run start`  | Start the production server |
| `npm run lint`   | Run ESLint                  |
| `npm run format` | Run Prettier                |

## 📈 Deploy

This app deploys seamlessly to **Vercel**:

1. Push your code to GitHub.
2. Import the repo in Vercel.
3. Add the same environment variables in Vercel’s dashboard.
4. Deploy!

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more info.
