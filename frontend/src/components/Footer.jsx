import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-6">
      <div className="max-w-4xl mx-auto px-4 py-5 text-center text-sm text-gray-500">
        <div className="flex justify-center flex-wrap gap-4 pb-4">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <p>&copy; 2025 NCTBA - Agraharam NC. All rights reserved.</p>
      </div>
    </footer>
  );
}
