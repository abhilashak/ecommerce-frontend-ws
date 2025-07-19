import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <div className="p-8 text-center"><h1 className="text-3xl font-bold">Home</h1></div>;
}

function About() {
  return <div className="p-8 text-center"><h1 className="text-3xl font-bold">About</h1></div>;
}

export default function AppRoutes() {
  return (
    <Router>
      <nav className="bg-gray-900 text-white p-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
