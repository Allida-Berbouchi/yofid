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
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
|-- README.md
|-- apps/
|   |-- package.json
|   |-- api/
|   |   |-- package.json
|   |   |-- test.http
|   |   |-- src/
|   |   |   |-- app.js
|   |   |   |-- loadEnv.js
|   |   |   |-- server.js
|   |   |   |-- controllers/
|   |   |   |   |-- achievementController.js
|   |   |   |   |-- bookmark.js
|   |   |   |   |-- content.js
|   |   |   |   |-- Course.js
|   |   |   |   |-- flaggedContent.js
|   |   |   |   |-- playlist.js
|   |   |   |   |-- review.js
|   |   |   |   |-- upload.js
|   |   |   |   `-- User.js
|   |   |   |-- middleware/
|   |   |   |   |-- auth.js
|   |   |   |   `-- resourceAccess.js
|   |   |   |-- models/
|   |   |   |   |-- Achievement.js
|   |   |   |   |-- AchievementEvent.js
|   |   |   |   |-- AuditLog.js
|   |   |   |   |-- Bookmark.js
|   |   |   |   |-- Comment.js
|   |   |   |   |-- Content.js
|   |   |   |   |-- Course.js
|   |   |   |   |-- CreatorTrust.js
|   |   |   |   |-- FlaggedContent.js
|   |   |   |   |-- Playlist.js
|   |   |   |   |-- Review.js
|   |   |   |   |-- School.js
|   |   |   |   |-- User.js
|   |   |   |   |-- UserAchievement.js
|   |   |   |   `-- UserProgress.js
|   |   |   |-- routes/
|   |   |   |   |-- achievementRoutes.js
|   |   |   |   |-- bookmarkRoutes.js
|   |   |   |   |-- contentRoutes.js
|   |   |   |   |-- courseRoutes.js
|   |   |   |   |-- flaggedContentRoutes.js
|   |   |   |   |-- playlistRoutes.js
|   |   |   |   |-- reviewRoutes.js
|   |   |   |   `-- userRoutes.js
|   |   |   |-- services/
|   |   |   |   |-- achievementCatalog.js
|   |   |   |   `-- achievementEngine.js
|   |   |   `-- utils/
|   |   |       |-- asyncHandler.js
|   |   |       |-- cloudinary.js
|   |   |       |-- jwt.js
|   |   |       `-- PassworHash.js
|   |   `-- uploads/
|   |       |-- files/
|   |       |-- images/
|   |       `-- videos/
|   |-- web/
|   |   |-- jsconfig.json
|   |   |-- package.json
|   |   |-- public/
|   |   `-- src/
|   |       |-- app/
|   |       |   |-- globals.css
|   |       |   |-- layout.jsx
|   |       |   |-- page.jsx
|   |       |   |-- contribute/
|   |       |   |-- courses/
|   |       |   |-- dashboard/
|   |       |   |-- home/
|   |       |   |-- login/
|   |       |   |-- my-learning/
|   |       |   |-- register/
|   |       |   |-- resources/
|   |       |   |-- search/
|   |       |   |-- Settings/
|   |       |   |-- submit/
|   |       |   |-- support/
|   |       |   |-- Test/
|   |       |   |-- user-management/
|   |       |   `-- watch/
|   |       |-- components/
|   |       |   |-- achievementIconTypes.js
|   |       |   |-- Achievements.css
|   |       |   |-- Achievements.jsx
|   |       |   |-- AppLayout.jsx
|   |       |   |-- CardPreview.jsx
|   |       |   |-- CardProgress.css
|   |       |   |-- CardProgress.jsx
|   |       |   |-- Containcards.css
|   |       |   |-- ContainCards.jsx
|   |       |   |-- CourseCard.jsx
|   |       |   |-- Header.jsx
|   |       |   |-- LearningActivity.jsx
|   |       |   |-- ModuleFilter.jsx
|   |       |   |-- Nav.css
|   |       |   |-- Nav.jsx
|   |       |   |-- navbar.jsx
|   |       |   |-- PremiumAchievementIcon.jsx
|   |       |   |-- ProfileCard.css
|   |       |   |-- ProfileCard.jsx
|   |       |   |-- ProgressBar.jsx
|   |       |   |-- ResourceInteraction.css
|   |       |   |-- ResourceInteraction.jsx
|   |       |   |-- ResourceViewer.jsx
|   |       |   |-- SearchBar.css
|   |       |   |-- SearchBar.jsx
|   |       |   |-- TechnicalExpertise.jsx
|   |       |   |-- Topbar.jsx
|   |       |   `-- (additional components...)
|   |       `-- lib/
|   |           `-- (utilities...)
`-- packages/
    `-- shared/
        |-- package.json
        `-- src/
            |-- index.js
            |-- schemas/
            `-- types/
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