import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ProductList } from '../components';

function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to E-Commerce Admin</h1>
      <p className="text-xl text-gray-600 mb-8">
        Manage your products, inventory, and orders from one central location.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link 
          to="/products" 
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Products</h3>
          <p className="text-blue-100">Manage your product catalog</p>
        </Link>
        <Link 
          to="/about" 
          className="bg-gray-600 text-white p-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-100">Learn more about this app</p>
        </Link>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About E-Commerce Admin</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-4">
          This is a modern e-commerce administration interface built with React and TypeScript, 
          powered by a Ruby on Rails API backend.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Product management with full CRUD operations</li>
          <li>Advanced search and filtering capabilities</li>
          <li>Real-time inventory tracking</li>
          <li>Responsive design with Tailwind CSS</li>
          <li>RESTful API integration</li>
        </ul>
      </div>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              E-Commerce Admin
            </Link>
          </div>
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
