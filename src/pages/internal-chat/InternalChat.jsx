import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Users, MessageSquare, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

export default function InternalChat() {
  const { chatMessages, sendMessage, currentUser, staff } = useApp();

  const [activeChannel, setActiveChannel] = useState('All Staff');
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef(null);

  // Channels to chat with
  const channels = ['All Staff', 'Doctors', 'Nurses', 'Administration', 'Pharmacy Dept', 'Lab Dept'];

  // Filter messages based on active channel
  const filteredMessages = chatMessages.filter(msg => {
    if (activeChannel === 'All Staff') {
      return msg.recipient === 'All' || msg.recipient === 'All Staff';
    }
    return msg.recipient === activeChannel;
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    sendMessage(
      currentUser?.name || 'Anonymous Staff',
      typedMessage,
      activeChannel === 'All Staff' ? 'All' : activeChannel
    );
    setTypedMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChannel]);

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Sidebar - Channels / Departments */}
      <div className="w-64 border-r border-border bg-border/5 flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-xs text-text uppercase tracking-wider">Hosp Channels</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map((chan) => (
            <button
              key={chan}
              onClick={() => setActiveChannel(chan)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeChannel === chan
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'text-text-muted hover:bg-border/20 hover:text-text'
              }`}
            >
              # {chan}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-text">#{activeChannel}</h3>
            <span className="text-[10px] text-text-muted block mt-0.5">Staff Broadcast & Internal Messaging Channel</span>
          </div>
        </div>

        {/* Message Ledger */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              const isSelf = msg.sender === currentUser?.name;
              return (
                <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-text">{msg.sender}</span>
                    <span className="text-[9px] text-text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isSelf
                        ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10'
                        : 'bg-border/30 text-text rounded-tl-none border border-border/30'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-2">
              <MessageSquare className="h-10 w-10 text-text-muted opacity-40 animate-bounce" />
              <h4 className="text-xs font-bold text-text-muted">No messages posted in #{activeChannel}</h4>
              <p className="text-[10px] text-text-muted">Post a question, duty update or consultation request below.</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-4 border-t border-border bg-border/5 flex gap-2">
          <input
            type="text"
            placeholder={`Message #${activeChannel}...`}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs text-text focus:outline-none focus:border-primary"
            required
          />
          <Button type="submit" variant="primary" className="p-2.5 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
