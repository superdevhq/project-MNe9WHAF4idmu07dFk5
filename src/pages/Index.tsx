
import P5Sketch from '@/components/P5Sketch';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <P5Sketch />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <h1 className="text-5xl font-bold mb-4 text-white">Interactive Particles</h1>
          <p className="text-xl text-gray-200 mb-6">Move your mouse to interact with the particles</p>
          <p className="text-sm text-gray-300">Created with p5.js</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
