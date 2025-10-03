import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onStartChat={handleStartChat} />
      )}
      {currentView === 'chat' && (
        <ChatInterface onBack={handleBackToLanding} />
      )}
    </>
  );
};

export default Index;
