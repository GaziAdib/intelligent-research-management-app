import AIChatComponent from "../components/AIChatComponent";

const AiChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">AI Chat</h1>
        <p className="text-gray-400 mt-2">
          Interact with our AI to get insights and answers.
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          {/* AIChatComponent */}
          <AIChatComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center mt-10 text-gray-400">
        <p>© 2023 AI Chat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AiChatPage;