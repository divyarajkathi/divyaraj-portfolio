import { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa";
import "./styles/ChatBot.css";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const parseMessageText = (text: string) => {
  // Matches markdown links: [Text](url), raw HTTP/S URLs, and email addresses
  const combinedRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = text.split(combinedRegex);

  return parts.map((part, index) => {
    // 1. Markdown link: [text](url)
    const mdMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdMatch) {
      return (
        <a key={index} href={mdMatch[2]} target="_blank" rel="noopener noreferrer">
          {mdMatch[1]}
        </a>
      );
    }

    // 2. Raw URL: https://...
    const urlMatch = part.match(/^(https?:\/\/[^\s]+)$/);
    if (urlMatch) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }

    // 3. Email: name@domain.com
    const emailMatch = part.match(/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
    if (emailMatch) {
      return (
        <a key={index} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }

    return part;
  });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "bot",
      text: "Hey! 👋 I'm Divyaraj - a Web Developer & Chatbot Specialist. I build custom websites, AI chat assistants, and automated WhatsApp bots using Python, Node, and PHP. Ask me anything! 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Tell me about yourself! 🚀",
    "Talk on WhatsApp 💬",
  ];

  // Auto-scroll messages list to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);



  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Direct WhatsApp redirection intercept
    if (text === "Talk on WhatsApp 💬") {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: "Let's chat directly on WhatsApp! 💬",
      };
      const botReplyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sure thing! Opening WhatsApp to connect you directly with me... 😊",
      };
      setMessages((prev) => [...prev, userMessage, botReplyMessage]);
      setInput("");

      const waPhone = import.meta.env.VITE_WHATSAPP_PHONE;
      const cleanPhone = waPhone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi Divyaraj, I'm visiting your website and would love to chat!")}`;

      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1200);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Read from environment variable
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_GROQ_API_KEY is not configured.");
      }

      const systemPrompt = `You are Divyaraj Varaniya, a Web Developer & Chatbot Specialist from Ahmedabad, India. You are chatting directly with a visitor on your portfolio website like a real human - friendly, warm, and natural.

      STRICT RULES:
      1. ALWAYS speak in first person ("I", "my", "me") - never say "Divyaraj does this"
      2. Talk like a real person on WhatsApp - casual, warm, enthusiastic
      3. Keep replies short - max 2-3 sentences, under 80 words
      4. Never sound like a robot or AI assistant
      5. If asked about projects or chatbots, mention you build automated systems (WhatsApp chatbots, custom AI widgets) in Python, Node.js, PHP, and WordPress.
      6. Add emojis naturally - not too many, just where it feels right
      7. If someone wants to hire or collaborate, guide them to email or LinkedIn warmly
      8. If a visitor asks for personal/sensitive details that are not provided in the YOUR DETAILS section below (e.g. private address, passwords, family details, phone numbers not listed), politely say you don't share that information. NEVER guess or send wrong/fake details.

      YOUR DETAILS:
      - Name: Divyaraj Varaniya
      - Gender: Male
      - Age: 21 (Date of Birth: 24-06-2005)
      - Relationship Status: Single
      - Title: Web Developer & Chatbot Specialist
      - Location: Ahmedabad, India
      - Education:
        * Schooling: Class 1 to 12 at Cambridge Academy, Junagadh
        * College: BCA (Bachelor of Computer Applications) at SSSDIIT, Junagadh (affiliated with BKNMU University, Junagadh)
      - Email: divyarajkathi11@gmail.com
      - GitHub: https://github.com/divyarajkathi
      - LinkedIn: https://www.linkedin.com/in/varaniya-divyaraj
      - Company: Evonex - I founded this in May 2025 to deliver IT services like websites, mobile apps, custom software, and custom automated chatbots for businesses.
      - Current Job: Web Developer at Lujayn Infoways since Aug 2025
      - Previous: Project Trainee at Lujayn Infoways from Apr 2025 to Aug 2025
      - Skills: WordPress, PHP, Laravel, Python, Node.js, HTML, CSS, JavaScript, MySQL, WhatsApp API, Groq AI.
      - I build fast, clean websites, custom AI chat widgets, and automated business workflows.

      EXAMPLE TONE:
      - Wrong: "Divyaraj Varaniya is a skilled developer who builds chatbots..."
      - Right: "Hey! I build custom websites and automated WhatsApp bots using Python, PHP, and Node.js - love automating things 🙌"
      - Wrong: "I can assist you with your query regarding chatbot development"
      - Right: "Oh for sure! Just drop me an email at divyarajkathi11@gmail.com and we can chat about building your bot! 😊"`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: text },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error payload:", errorText);
        throw new Error(`API returned error status: ${response.status}. Details: ${errorText}`);
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that response.";




      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botReply,
        },
      ]);
    } catch (error) {
      console.error("ChatBot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Sorry, I am having trouble connecting to the network right now. Please check your config or try again later!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portfolio-chatbot">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="chatbot-trigger"
          onClick={() => setIsOpen(true)}
          title="Chat with AI Assistant"
          data-cursor="disable"
        >
          <FaCommentDots />
        </button>
      )}

      {/* Chat window panel */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img src="/images/divyaraj_linkdlin_profile_photo.png" alt="Divyaraj Varaniya" />
              </div>
              <div className="chatbot-title">
                <h3>Divyaraj's AI</h3>
                <span>Online</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              data-cursor="disable"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages list */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                {parseMessageText(msg.text)}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions List */}
          <div className="chatbot-suggestions">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(suggestion)}
                disabled={isLoading}
                data-cursor="disable"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Text Input Form */}
          <form
            className="chatbot-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} data-cursor="disable">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
