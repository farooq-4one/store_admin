"use client";

import { useState } from "react";
import FloatingButton from "./FloatingButton";
import ChatbotModal from "./ChatbotModal";

const Chat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <ChatbotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Chat;
