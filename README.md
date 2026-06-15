# Focused — v1 DSA Learning Platform

> A distraction-free platform to learn Data Structures & Algorithms from the best free educators on the internet — without YouTube pulling you away.

🔗 **Live:** [focused-dsa.vercel.app](https://focused-dsa.vercel.app)

---

## The Problem

Most CS students learn DSA from YouTube. But YouTube isn't built for learning — it's built for watching. You open a lecture with full intention, and 10 minutes later you're watching something completely unrelated.

There's also no structure. Playlists exist but there's no clear path, no notes alongside, no assignments, no progress tracking. The good structured experience exists in paid courses — but not everyone can afford that.

**Focused** fixes this.

---

## What is Focused?

Focused takes complete DSA courses from top free educators and organises them into one clean, structured, distraction-free environment.

No YouTube sidebar. No recommendations. No autoplay rabbit holes. Just the content, organised the way a paid course would be — completely free.

---

## Courses Available

|   Educator     |         Course            | Lectures | Topics |
|----------------|---------------------------|----------|--------|
| Kunal Kushwaha | DSA Bootcamp (Java)       |    69    |   18   |
| Shradha Khapra | DSA in C++ — Apna College |    136   |   17   |
| CodeWithHarry  | Java + DSA Wing           |    205   |   14   |
| CodeWithHarry  | C++ + DSA Wing            |    166   |   13   |
|----------------|---------------------------|----------|--------|
**Total: 576+ lectures across 3 educators**

---

## Features

- 📚 **Topic-wise lecture organisation** — Arrays, Searching, Sorting, Recursion, Linked Lists, Trees, Graphs and more
- 📝 **Notes per lecture** — GitHub-linked study materials alongside every topic
- ✅ **Assignments** — Practice problems built into each lecture, mark as complete
- 📊 **Progress tracking** — Always know how many lectures are done
- 🔓 **Guest mode** — No signup needed to explore
- 📱 **Mobile-first** — Designed for how students actually study
- 🚫 **Zero distractions** — No YouTube sidebar, no recommendations

---

## Coming Soon

- 🔥 Striver's A2Z DSA Sheet — Raj Vikramaditya (450+ problems)
- 💡 NeetCode 150 — Blind 75 expanded

---

## Tech Stack

|      Layer     |     Technology                  |
|----------------|---------------------------------|
| Frontend       | React, TypeScript, Tailwind CSS |
| Framework      | TanStack Start (SSR)            |
| Backend / Auth | Supabase                        |
| Deployment     | Vercel                          |
| Build Tool     | Vite                            |
|----------------|---------------------------------|

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/NaharVidulkar2208/focused-dsa.git

# Navigate into the project
cd focused-dsa

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Add your Supabase keys to .env

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
YOUTUBE_API_KEY=your_youtube_api_key
```

---

## Project Structure

```
focused-dsa/
├── src/
│   ├── routes/          # TanStack Start page routes
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities, data, API helpers
│   └── styles/          # Global styles
├── public/              # Static assets
├── supabase/            # Supabase config and migrations
└── scripts/             # Build and utility scripts
```

---

## Built By

**Nahar Vidulkar** — CSE Undergraduate, YCCE Nagpur (Batch of 2029)

Built at the end of my first year of engineering. Learned through building — hitting real errors, debugging deployment issues, and figuring things out as I went.

Currently learning DSA in Java. Always working on the next thing.

🔗 [LinkedIn](https://www.linkedin.com/in/nahar-vidulkar) · [Live App](https://focused-dsa.vercel.app)

---

## License

This project is open source and available under the [MIT License](LICENSE).
