# Decision Assignment

A full-stack application for managing decisions with categories, priorities, and todos.

## 🎯 Project Overview

This project provides a complete solution for decision management with:
- Backend API built with C# .NET Core
- Frontend UI built with React + TypeScript
- Modern UI with Tailwind CSS
- Full CRUD operations for Categories and Priorities
- Todo management system

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Decision Assignment                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   Frontend (React)   │         │  Backend (.NET)      │  │
│  │                      │         │                      │  │
│  │  - React Router      │◄──────►│  - Entity Framework  │  │
│  │  - Context API       │   API  │  - SQL Database      │  │
│  │  - Tailwind CSS      │         │  - RESTful Endpoints │  │
│  │  - TypeScript        │         │                      │  │
│  │                      │         │                      │  │
│  └──────────────────────┘         └──────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Decision Assignment/
├── backend/                   # .NET Core Backend
│   ├── Controllers/          # API endpoints
│   ├── Services/             # Business logic
│   ├── Models/               # Data models
│   ├── DTOs/                 # Data transfer objects
│   ├── Repositories/         # Data access
│   ├── Migrations/           # Database migrations
│   ├── Data/                 # DbContext
│   └── Program.cs            # Configuration
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   ├── services/         # API services
│   │   ├── interfaces/       # TypeScript types
│   │   ├── routes/           # Route definitions
│   │   └── App.tsx           # Root component
│   └── package.json          # Dependencies
│
├── SETUP_SUMMARY.md          # Complete setup guide
├── FRONTEND_STRUCTURE.md     # Frontend details
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- .NET 8.0+ (for backend)
- Node.js 18+ (for frontend)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
cp env.example env
# Edit env file with your database credentials
dotnet build
dotnet run
```
Backend runs on `http://localhost:5255`

### 2. Frontend Setup

```bash
cd frontend
cp env.example env
# env is pre-configured to connect to http://localhost:5255/api
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## ⚙️ Environment Configuration

### Backend (`backend/env`)
- **DB_SERVER**: MySQL database host (default: localhost)
- **DB_PORT**: MySQL port (default: 3306)
- **DB_NAME**: Database name (default: decision_todo_db)
- **DB_USER**: Database user (default: root)
- **DB_PASSWORD**: Database password
- **API_PORT**: Backend API port (default: 5255)
- **ASPNETCORE_ENVIRONMENT**: Development or Production
- **CORS_ALLOWED_ORIGINS**: Frontend URLs allowed to access the API

### Frontend (`frontend/env`)
- **VITE_API_BASE_URL**: Backend API URL (default: http://localhost:5255/api)
- **VITE_APP_NAME**: Application name
- **VITE_DEBUG**: Enable debug mode (default: true)

---

## 📚 Documentation

### Comprehensive Guides
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Complete overview of everything setup
- **[FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)** - Detailed frontend structure
- **[frontend/SETUP.md](./frontend/SETUP.md)** - Frontend installation guide
- **[frontend/FRONTEND_SETUP.md](./frontend/FRONTEND_SETUP.md)** - Frontend detailed docs

---

## ✨ Features

### Dashboard
- 📊 Overview statistics
- 📈 Data visualization
- 🎯 Quick metrics

### Category Management
- ✅ Create categories
- 📝 Update category names
- 🗑️ Delete categories
- 🔍 Search categories

### Priority Management
- ✅ Create priorities
- 📝 Update priority levels
- 🗑️ Delete priorities
- 🔍 Search priorities

### Todo Management
- 📋 View all todos
- 🏷️ Associate with categories
- ⚠️ Set priorities
- 📅 Track completion

### Navigation
- 🎯 Sidebar menu (Dashboard, Category, Priority, Todo)
- 📱 Responsive design
- ⚡ Quick navigation

---

## 🔌 API Endpoints

### Categories
```
GET    /api/category              # List all
GET    /api/category/search       # Search by name
POST   /api/category              # Create
PUT    /api/category/{id}         # Update
DELETE /api/category/{id}         # Delete
```

### Priorities
```
GET    /api/priority              # List all
GET    /api/priority/search       # Search by name
POST   /api/priority              # Create
PUT    /api/priority/{id}         # Update
DELETE /api/priority/{id}         # Delete
```

### Todos
```
GET    /api/todo                  # List all
POST   /api/todo                  # Create
PUT    /api/todo/{id}             # Update
DELETE /api/todo/{id}             # Delete
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET Core 8
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **API**: RESTful with ASP.NET Core
- **Language**: C#

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Router**: React Router v7
- **Styling**: Tailwind CSS
- **Build**: Vite
- **State**: Context API
- **Icons**: Lucide React
- **HTTP**: Fetch API

---

## 🎨 UI Components

### Layout
- **Navbar** - Top navigation bar
- **Sidebar** - Left menu with navigation
- **Layout** - Main layout wrapper

### Reusable Components
- **Button** - Variants: primary, secondary, danger, success
- **Card** - Content containers
- **Input** - Form inputs with validation
- **Table** - Data tables with actions

### Pages
- **Dashboard** - Statistics overview
- **Category** - Category management
- **Priority** - Priority management
- **Todo** - Todo list view

---

## 📋 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Check code quality
npm run preview         # Preview production build
```

### Backend Development
```bash
cd backend
dotnet build            # Build project
dotnet run             # Run application
dotnet test            # Run tests
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Decision Assignment
```

### Backend (appsettings.json)
Configure database connection and other settings.

---

## 💡 Code Examples

### Using Context API
```tsx
import { useApp } from './context/useApp';

function MyComponent() {
  const { categories, loadCategories, addCategory } = useApp();
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  return (
    <div>
      {categories.map(cat => (
        <Card key={cat.id} title={cat.name} />
      ))}
    </div>
  );
}
```

### Using Components
```tsx
import { Button, Card, Input } from './components/UI';

export function MyPage() {
  return (
    <Card title="Create Item">
      <Input placeholder="Name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### API Integration
```tsx
import { categoryService } from './services/categoryService';

async function handleCreate() {
  const newCategory = await categoryService.create({ 
    name: 'New Category' 
  });
}
```

---

## 📖 Learning Path

1. **Start**: Read [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)
2. **Setup**: Follow [frontend/SETUP.md](./frontend/SETUP.md)
3. **Explore**: Check [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)
4. **Code**: Start with Dashboard component
5. **Learn**: Review Category component for full CRUD example
6. **Build**: Extend with your own features

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend is running on correct port
- Check browser console for errors

### Build errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Check Node.js version (18+)

### Port already in use
- Frontend: Vite uses next available port
- Backend: Change port in `appsettings.json`

---

## 📞 Support

### Resources
- [React Docs](https://react.dev)
- [.NET Docs](https://learn.microsoft.com/en-us/dotnet)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

### Documentation
See individual README files in frontend/ and backend/ folders.

---

## 📜 License

This project is private and confidential.

---

## 🎉 Status

✅ Backend CRUD endpoints complete
✅ Frontend structure complete
✅ UI components ready
✅ State management setup
✅ API integration ready

### Next Phase
- 🔲 Additional backend features
- 🔲 Enhanced UI/UX
- 🔲 Advanced filtering
- 🔲 User authentication
- 🔲 Deployment

---

## 📝 Notes

- All frontend code uses TypeScript
- All components are functional components with hooks
- State is managed globally via Context API
- API calls are centralized in services
- Styling uses Tailwind CSS utility classes

---

**Happy Coding!** 🚀

For detailed instructions, see the documentation files listed above.
