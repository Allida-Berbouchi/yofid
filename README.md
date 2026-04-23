# Yofid Monorepo (Next + Express + Mongo)

## Requirements
- Node 18+ (or 20+)
- pnpm
- Docker (for Mongo)

## Setup
1) Copy envs
- apps/api/.env.example -> apps/api/.env
- apps/web/.env.example -> apps/web/.env

2) Start Mongo
```bash
docker compose up -d
```

3) Install deps
```bash
pnpm i
```

4) Build shared types
```bash
pnpm -C packages/shared build
```

5) Run dev (web + api)
```bash
pnpm dev
```

Access:
- Web: http://localhost:3000
- API: http://localhost:4000/health


## File Structure
```
yovid/
|-- main_Read.md
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
|-- README.md
|-- tsconfig.base.json
|-- apps/
|   |-- api/
|   |   |-- package.json
|   |   |-- test.http
|   |   `-- src/
|   |       |-- app.js
|   |       |-- server.js
|   |       |-- controllers/
|   |       |   |-- bookmark.js
|   |       |   |-- content.js
|   |       |   |-- flaggedContent.js
|   |       |   |-- playlist.js
|   |       |   |-- review.js
|   |       |   |-- upload.js
|   |       |   `-- User.js
|   |       |-- middleware/
|   |       |   |-- auth.js
|   |       |   `-- resourceAccess.js
|   |       |-- models/
|   |       |   |-- AuditLog.js
|   |       |   |-- Bookmark.js
|   |       |   |-- Content.js
|   |       |   |-- Course.js
|   |       |   |-- CreatorTrust.js
|   |       |   |-- FlaggedContent.js
|   |       |   |-- Playlist.js
|   |       |   |-- Review.js
|   |       |   |-- School.js
|   |       |   |-- User.js
|   |       |   `-- UserProgress.js
|   |       |-- queues/
|   |       |-- routes/
|   |       |   |-- bookmarkRoutes.js
|   |       |   |-- contentRoutes.js
|   |       |   |-- course.js
|   |       |   |-- flaggedContentRoutes.js
|   |       |   |-- playlistRoutes.js
|   |       |   |-- reviewRoutes.js
|   |       |   `-- userRoutes.js
|   |       `-- utils/
|   |           |-- jwt.js
|   |             `-- PassworHash.js
|   |   
|   `-- web/
|       |-- jsconfig.json
|       |-- next.config.js
|       |-- package.json
|       |-- postcss.config.mjs
|       |-- tailwind.config.js
|       |-- public/
|       `-- src/
|           |-- app/
|           |   |-- globals.css
|           |   |-- layout.jsx
|           |   |-- page.jsx
|           |   |-- contribute/
|           |   |   `-- page.jsx
|           |   |-- courses/
|           |   |   `-- page.jsx
|           |   |-- dashboard/
|           |   |   `-- page.jsx
|           |   |-- home/
|           |   |   `-- page.jsx
|           |   |-- login/
|           |   |   |-- page.css
|           |   |   `-- page.jsx
|           |   |-- my-learning/
|           |   |   `-- page.jsx
|           |   |-- profile/
|           |   |   |-- page.jsx
|           |   |   `-- readme.me
|           |   |-- register/
|           |   |   |-- page.css
|           |   |   `-- page.jsx
|           |   |-- resources/
|           |   |   `-- page.jsx
|           |   |-- Settings/
|           |   |   `-- page.jsx
|           |   |-- submit/
|           |   |   `-- ...
|           |   `-- support/
|           |-- components/
|           |   |-- Achievements.css
|           |   |-- Achievements.jsx
|           |   |-- AppLayout.jsx
|           |   |-- CardPreview.jsx
|           |   |-- CardProgress.css
|           |   |-- cardprogress.jsx
|           |   |-- Containcards.css
|           |   |-- containcards.jsx
|           |   |-- Header.jsx
|           |   |-- LearningActivity.jsx
|           |   |-- ModuleFilter.jsx
|           |   |-- Nav.css
|           |   |-- Nav.jsx
|           |   |-- ProfileCard.css
|           |   |-- ProfileCard.jsx
|           |   |-- ProgressBar.jsx
|           |   |-- ResourceViewer.jsx
|           |   |-- SearchBar.css
|           |   |-- SearchBar.jsx
|           |   |-- TechnicalExpertise.jsx
|           |   |-- Topbar.jsx
|           |   `-- VideoUpload.jsx
|           |-- lib/
|           |   |-- api.js
|           |   `-- auth.js
|          `````
|-- packages/
|   `-- shared/
|       |-- package.json
|       `-- src/
|           |-- index.js
|           |-- schemas/
|           |   |-- auth.js
|           |   `-- resources.js
|           `-- types/
|               `-- index.js
```

## support 

## video
- **MP4** (.mp4) 
- **WebM** (.webm) 
- **OGG** (.ogm, .ogg) 
- **MOV** (.mov) 

## files
   - **PDF**

   
## images