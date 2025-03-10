
import P5Sketch from '@/components/P5Sketch';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <P5Sketch />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h1 className="text-5xl font-bold mb-4 text-white">Interactive Particles</h1>
          <p className="text-xl text-gray-200 mb-6">Move your mouse to interact with the particles</p>
          <p className="text-sm text-gray-300 mb-4">Created with p5.js</p>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try the 3D Bear Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
