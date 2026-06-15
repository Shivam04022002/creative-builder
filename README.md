# HTML Creative Builder

A full-stack HTML creative builder application with drag-and-drop canvas editing, animations, image upload, analytics, and standalone HTML export capabilities.

## Features

* Creative CRUD
* HTML-based Canvas Editor
* Text Layers
* Image Layers
* Drag & Resize
* Layer Ordering
* Animations
* Preview Mode
* Impression Tracking
* Analytics Dashboard
* Standalone HTML Export

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Recharts
* React Moveable

### Backend

* Node.js
* Express
* MongoDB
* Cloudinary

## Installation

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creative-builder

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Supported Canvas Sizes

* 320x480
* 300x600
* 300x250

## Supported Animations

* Fade In
* Fade In Left
* Fade In Right
* Zoom In

## Export

Creative can be exported as a standalone HTML file and opened independently in any browser.

## API Endpoints

### Creatives
- `GET /api/creatives` - List all creatives
- `POST /api/creatives` - Create new creative
- `GET /api/creatives/:id` - Get creative by ID
- `PUT /api/creatives/:id` - Update creative
- `DELETE /api/creatives/:id` - Delete creative

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Impressions
- `POST /api/impressions` - Track creative impression

### Analytics
- `GET /api/analytics/:creativeId/total` - Total impressions count
- `GET /api/analytics/:creativeId/hourly` - Hourly breakdown (24h)
- `GET /api/analytics/:creativeId/daily` - Daily breakdown (30d)
- `GET /api/analytics/:creativeId/range` - Custom date range

### Export
- `GET /api/export/:creativeId` - Download HTML file

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## License

MIT
