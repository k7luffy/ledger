# Personal Ledger - Frontend

A simple and easy-to-use personal accounting tool built with React and Vite.

## Features

- 📊 Dashboard with income/expense statistics
- 💰 Add transactions (income/expense)
- 📝 Transaction history
- 🏷️ Category management
- 💾 Data persistence with JSON Server
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

#### Option 1: Run both frontend and backend together

```bash
npm run dev:full
```

#### Option 2: Run separately

Terminal 1 - Start JSON Server (Backend):

```bash
npm run server
```

Terminal 2 - Start React app (Frontend):

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start React development server
- `npm run server` - Start JSON Server API
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

The JSON Server provides the following API endpoints:

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddTransactionForm.jsx
│   ├── CustomSelect.jsx
│   ├── StatsCards.jsx
│   ├── TransactionHeader.jsx
│   └── TransactionList.jsx
├── pages/              # Page components
│   └── Dashboard.jsx
├── hooks/              # Custom React hooks
│   └── useTransactions.js
├── services/           # API services
│   └── api.js
├── data/               # Data types and constants
│   └── types.js
└── App.jsx             # Main app component
```

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **JSON Server** - Mock backend API
- **CSS Modules** - Scoped styling
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## Development Notes

- The app uses JSON Server as a mock backend for development
- Data is persisted in `db.json` file
- The app falls back to localStorage if the API is unavailable
- All components use CSS Modules for styling
- The app is fully responsive and works on mobile devices
