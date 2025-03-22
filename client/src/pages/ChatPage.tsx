import React, { useState } from "react";
import { IconMessage, IconSend, IconHome, IconSettings, IconUser, IconLogout } from "@tabler/icons-react";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, isUser: true }]);
      setInputText("");

      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "I'm not functional yet!", isUser: false },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="h-[48rem] w-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-500 to-cyan-600 text-white p-6 shadow-lg flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <IconMessage size={28} className="text-white" />
          <h2 className="text-2xl font-semibold">Chatbot</h2>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1">
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <span>What are NFTs?</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <span>Python multithreading</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <span>Golang basics</span>
          </a>
        </nav>

        {/* Logout Button */}
        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-600 transition-colors">
          <IconLogout size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-100">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-xl ${
                  message.isUser
                    ? "bg-zinc-200 text-gray-800 shadow-sm"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-zinc-100">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-l from-green-400 to-cyan-500 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <IconSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;