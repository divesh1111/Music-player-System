# 🎵 Music Player System

A full-stack music streaming application built with modern web technologies. Stream, organize, and enjoy your favorite music with an intuitive interface and powerful backend infrastructure.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎶 **Music Streaming** - Stream your favorite songs with smooth playback
- 👤 **User Authentication** - Secure login and registration with JWT tokens
- 🎼 **Music Library Management** - Browse artists, albums, genres, and tracks
- 📝 **Playlist Creation** - Create and manage custom playlists
- 🔍 **Advanced Search** - Search by song title, artist, or genre
- 📊 **Music Analytics** - View statistics about your music library
- 🎨 **Modern UI** - Responsive design with smooth animations using Framer Motion
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 15.1.3 - React-based framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript (77.1% of codebase)
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) 4 - Utility-first CSS framework
  - [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Custom styles (8% of codebase)
- **Libraries**:
  - [React](https://react.dev/) 19.2.0 - UI library
  - [Framer Motion](https://www.framer.com/motion/) 11.15.0 - Animation library
  - [Recharts](https://recharts.org/) 3.5.1 - Charts and visualization
- **Development**: ESLint for code quality

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) 5.1.0
- **Language**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (14.9% of codebase)
- **Database**: [SQLite3](https://www.sqlite.org/) 6.0.1
- **Authentication**: [JWT](https://jwt.io/) with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) 9.0.3
- **Security**: [bcrypt](https://www.npmjs.com/package/bcrypt) 6.0.0 for password hashing
- **File Upload**: [Multer](https://www.npmjs.com/package/multer) 2.1.1
- **CORS**: [cors](https://www.npmjs.com/package/cors) 2.8.5 for cross-origin requests
- **Environment**: [dotenv](https://www.npmjs.com/package/dotenv) 16.6.1 for configuration
- **Development**: [Nodemon](https://nodemon.io/) for auto-reloading

### Database
- **Type**: SQLite3
- **ORM**: Direct SQL queries

## 📂 Project Structure

```
Music-player-System/
├── frontend/                    # Next.js frontend application
│   ├── src/                     # Source files
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   └── tsconfig.json            # TypeScript configuration
├── backend/                     # Express.js backend server
│   ├── server.js               # Main server entry point
│   ├── package.json            # Backend dependencies
│   └── routes/                 # API routes
├── database.sql                # Database schema and initial data
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/divesh1111/Music-player-System.git
cd Music-player-System
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Setup

1. **Create `.env` file in the backend directory**
```bash
cd backend
touch .env
```

2. **Configure environment variables** (`.env` template):
```
PORT=5000
DB_PATH=./music.db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Database Setup

1. **Initialize the database**
```bash
# SQLite database will be created automatically on first run
# Or import the schema from database.sql
```

2. **Database includes**:
   - Artists table
   - Albums table
   - Tracks table
   - Genres table
   - Playlists table
   - Playlist_Tracks junction table

## ▶️ Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### Start Frontend Application
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm start
```

## 📡 API Documentation

The backend provides RESTful API endpoints for:

- **Authentication**: User registration, login, token validation
- **Artists**: CRUD operations for artist data
- **Albums**: Manage album information
- **Tracks**: Upload, retrieve, and manage music tracks
- **Genres**: Browse available music genres
- **Playlists**: Create and manage user playlists
- **Search**: Query music library by various criteria

### Example Request
```bash
# Get all tracks
curl http://localhost:5000/api/tracks

# Search by artist
curl http://localhost:5000/api/search?artist=Arijit+Singh

# Upload a track
curl -X POST -F "file=@song.mp3" http://localhost:5000/api/tracks/upload
```

## 📊 Database Schema

### Key Tables

**Artists**
- artist_id (Primary Key)
- name
- country

**Tracks**
- track_id (Primary Key)
- title
- album_id (Foreign Key)
- genre_id (Foreign Key)
- duration (in seconds)
- song_url

**Playlists**
- playlist_id (Primary Key)
- name

**Playlist_Tracks** (Many-to-Many)
- playlist_id (Foreign Key)
- track_id (Foreign Key)

### Useful Queries

```sql
-- Get all songs with artist and genre info
SELECT t.title AS Song, a.name AS Artist, g.genre_name AS Genre
FROM Tracks t
JOIN Albums al ON t.album_id = al.album_id
JOIN Artists a ON al.artist_id = a.artist_id
JOIN Genres g ON t.genre_id = g.genre_id;

-- Count songs per genre
SELECT g.genre_name, COUNT(*) AS total_songs
FROM Tracks t
JOIN Genres g ON t.genre_id = g.genre_id
GROUP BY g.genre_name;

-- Most popular artist
SELECT a.name, COUNT(*) AS total_tracks
FROM Tracks t
JOIN Albums al ON t.album_id = al.album_id
JOIN Artists a ON al.artist_id = a.artist_id
GROUP BY a.name
ORDER BY total_tracks DESC;
```

## 📈 Development

### Code Statistics
- **TypeScript**: 77.1% - Primary language for frontend type safety
- **JavaScript**: 14.9% - Backend and utilities
- **CSS**: 8% - Styling

### Code Quality
- ESLint configuration for code consistency
- TypeScript strict mode for type safety
- Tailwind CSS for maintainable styling

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📧 Contact

For questions or feedback, please reach out to [divesh1111](https://github.com/divesh1111).

---

**Happy Listening! 🎶**

Made with ❤️ by [divesh1111](https://github.com/divesh1111)
