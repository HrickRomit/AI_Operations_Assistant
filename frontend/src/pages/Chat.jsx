import { useState } from "react";
import { sendMessage } from "../services/chat";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);

      const response = await sendMessage(input);

      const aiMessage = {
        role: "ai",
        text: response.answer || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error getting response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <h1 className="text-2xl font-semibold mb-4">AI Chat</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 border p-4 rounded-lg">
        {messages.length === 0 && (
          <p className="text-gray-400">
            Ask questions about your uploaded documents...
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-gray-400">AI is thinking...</p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 rounded-lg border outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;