
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after a short delay to ensure smooth transition
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {!isLoaded && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2 text-cyan-400">Loading Forest Spirit's Arrow Quest...</h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full animate-pulse"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      )}
      
      <iframe 
        src="/arcade.html" 
        className={`w-full h-screen border-0 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        title="Forest Spirit's Arrow Quest - 80s Arcade Edition"
        sandbox="allow-scripts allow-same-origin"
        loading="eager"
      />
    </div>
  );
};

export default Index;
