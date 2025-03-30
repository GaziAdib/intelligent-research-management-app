"use client";

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen bg-[#0f021e] flex flex-col items-center text-center px-6 py-20">
        {/* <nav className="absolute top-6 w-full flex justify-between items-center px-8 md:px-16">
          <h1 className="text-3xl font-bold text-pink-400">Adib.</h1>
          <div className="space-x-6 text-white hidden md:flex">
            <a href="#" className="hover:text-pink-400 transition">Home</a>
            <a href="#" className="hover:text-pink-400 transition">Portfolio</a>
            <a href="#" className="hover:text-pink-400 transition">Projects</a>
            <a href="#" className="hover:text-pink-400 transition">Blogs</a>
          </div>
          <button className="border border-pink-400 px-5 py-2 rounded-lg text-pink-400 hover:bg-pink-500 hover:text-white transition font-medium">
            Login / Register
          </button>
        </nav> */}
        
        <div className="mt-28 md:mt-40">
          <h2 className="text-5xl md:text-7xl font-extrabold text-pink-400">Adib</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-pink-500 mt-2">AI Engineer</h3>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
            A dedicated AI Engineer specializing in designing, developing, and deploying artificial intelligence systems.
            Passionate about machine learning, deep learning, and natural language processing, transforming ideas into reality.
          </p>
          <button className="mt-8 border border-pink-400 px-8 py-3 rounded-lg text-pink-400 hover:bg-pink-500 hover:text-white transition text-lg font-medium">
            Hire Me
          </button>
        </div>
        
        <div className="mt-12 relative w-full max-w-xl">
          <div className="absolute inset-0 -rotate-6 bg-gradient-to-r from-pink-400 to-pink-600 w-full h-56 md:h-72 rounded-xl"></div>
          <div className="relative z-10 bg-gray-900 p-5 rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D" 
              alt="AI Engineer" 
              className="rounded-xl w-full" 
            />
          </div>
        </div>
        
        <div className="mt-14 text-center">
          <h4 className="text-4xl font-extrabold text-pink-400">Hi,</h4>
          <p className="text-gray-300 max-w-xl mx-auto leading-relaxed text-lg">
            I'm Adib, an AI Engineer with a passion for building cutting-edge AI applications.
            From neural networks to NLP models, I bring innovative solutions to complex problems.
          </p>
          <button className="mt-8 border border-pink-400 px-8 py-3 rounded-lg text-pink-400 hover:bg-pink-500 hover:text-white transition text-lg font-medium">
            Know More
          </button>
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  