import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { Search, Plus, MessageCircle, Send, Mic, Paperclip } from 'lucide-react'

const Dashboard = () => {
  const chat = useChat()
  const { user } = useSelector(state => state.auth)
  
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(false)

  const suggestions = [
    'MERN Stack',
    'LangChain Agents',
    'WebRTC',
    'AI Integration'
  ]

  useEffect(() => {
    chat.initializeSocketConnection()
  }, []) 

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    setLoading(true)
    try {
      setMessages([...messages, { id: Date.now(), content: messageInput, role: 'user' }])
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
    setLoading(false)
  }

  if (messages.length === 0) {
    return (
      <div className='h-screen w-full flex bg-black overflow-hidden relative'>
        {/* Background with overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black'></div>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-br from-slate-950 via-transparent to-transparent blur-3xl'></div>
        </div>

        {/* SIDEBAR */}
        <aside className='w-64 bg-black/40 backdrop-blur-xl border-r border-slate-700/30 flex flex-col relative z-20'>
          {/* Header */}
          <div className='p-4 border-b border-slate-700/30'>
            <input
              type='text'
              placeholder='Search'
              className='w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-lg focus:outline-none focus:border-slate-600 placeholder-slate-500'
            />
          </div>

          {/* Chat List */}
          <div className='flex-1 overflow-y-auto p-3 space-y-2'>
            <div className='text-premium-xs uppercase text-slate-500'>Chats</div>
            <button className='w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800/50 rounded-lg transition text-sm font-medium font-inter'>
              <Plus size={16} /> New Chat
            </button>
            
            {chats.length === 0 ? (
              <div className='text-center py-8'>
                {/* Empty state */}
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all text-premium-sm font-inter ${
                    currentChatId === chat.id
                      ? 'bg-slate-700/60 text-slate-100'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  {chat.title}
                </div>
              ))
            )}
          </div>

          {/* Recent */}
          <div className='p-4 border-t border-slate-700/30 space-y-2'>
            <div className='text-premium-xs uppercase text-slate-500'>Recent</div>
            <div className='text-premium-sm text-slate-400 space-y-1 font-medium'>
              <div className='hover:text-slate-200 cursor-pointer'>Briefing Assistant</div>
              <div className='hover:text-slate-200 cursor-pointer'>Creative Assistant</div>
              <div className='text-emerald-400 hover:text-emerald-300 cursor-pointer'>View All</div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className='flex-1 flex flex-col items-center justify-center relative z-10 px-6'>
          {/* Logo */}
          <div className='mb-24 text-center'>
            <h1 
              className='text-8xl font-inter tracking-tighter leading-none'
              style={{
                fontWeight: 300,
                color: '#e5e7eb',
                textShadow: `
                  0 0 1px rgba(255, 255, 255, 0.3),
                  0 0 2px rgba(255, 255, 255, 0.2)
                `,
                letterSpacing: '-0.04em',
                lineHeight: 1.2,
                filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.15))'
              }}
            >
              perplexity
            </h1>
          </div>

          {/* Search Input */}
          <div className='w-full max-w-2xl mb-8'>
            <form onSubmit={handleSendMessage} className='relative group'>
              {/* Focus glow background */}
              <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/10 group-focus-within:via-emerald-500/5 group-focus-within:to-emerald-500/10 rounded-2xl blur transition-all duration-300'></div>
              
              <div className='relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 group-focus-within:border-emerald-500/50 rounded-2xl p-4 shadow-lg transition-all duration-300'>
                {/* Middle - Input */}
                <div className='mb-3'>
                  <input
                    type='text'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder='Ask anything...'
                    className='w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-inter cursor-text'
                    style={{ caretColor: '#10b981' }}
                    disabled={loading}
                  />
                </div>

                {/* Bottom - Action buttons */}
                <div className='flex items-center justify-between'>
                  {/* Plus button on left */}
                  <button
                    type='button'
                    className='p-1.5 hover:bg-slate-700/60 hover:text-emerald-400 rounded-lg transition-all duration-200 text-slate-400 flex-shrink-0'
                  >
                    <Plus size={18} />
                  </button>

                  {/* Send and Mic buttons on right */}
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className='p-1.5 hover:bg-slate-700/60 hover:text-emerald-400 rounded-lg transition-all duration-200 text-slate-400 flex-shrink-0'
                    >
                      <Mic size={18} />
                    </button>

                    <button
                      type='submit'
                      disabled={loading || !messageInput.trim()}
                      className='p-1.5 bg-emerald-600/70 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-slate-700/30 rounded-lg text-white disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0'
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Suggestion Pills */}
          <div className='w-full max-w-2xl'>
            <div className='flex flex-wrap justify-center gap-2'>
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => setMessageInput(text)}
                  className='px-3 py-1 bg-slate-800/30 border border-slate-700/50 text-slate-300 text-xs font-medium font-inter rounded-full hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:text-emerald-200 transition-all duration-200'
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Unified chat view - same UI as home but with messages
  return (
    <div className='h-screen w-full flex bg-black overflow-hidden relative'>
      {/* Background with overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black'></div>
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-br from-slate-950 via-transparent to-transparent blur-3xl'></div>
      </div>

      {/* SIDEBAR */}
      <aside className='w-64 bg-black/40 backdrop-blur-xl border-r border-slate-700/30 flex flex-col relative z-20'>
        {/* Header */}
        <div className='p-4 border-b border-slate-700/30'>
          <input
            type='text'
            placeholder='Search'
            className='w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-white text-sm rounded-lg focus:outline-none focus:border-slate-600 placeholder-slate-500'
          />
        </div>

        {/* Chat List */}
        <div className='flex-1 overflow-y-auto p-3 space-y-2'>
          <div className='text-premium-xs uppercase text-slate-500'>Chats</div>
          <button className='w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800/50 rounded-lg transition text-sm font-medium font-inter'>
            <Plus size={16} /> New Chat
          </button>
          
          {chats.length === 0 ? (
            <div className='text-center py-8'>
              {/* Empty state */}
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all text-premium-sm font-inter ${
                  currentChatId === chat.id
                    ? 'bg-slate-700/60 text-slate-100'
                    : 'text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                {chat.title}
              </div>
            ))
          )}
        </div>

        {/* Recent */}
        <div className='p-4 border-t border-slate-700/30 space-y-2'>
          <div className='text-premium-xs uppercase text-slate-500'>Recent</div>
          <div className='text-premium-sm text-slate-400 space-y-1 font-medium'>
            <div className='hover:text-slate-200 cursor-pointer'>Briefing Assistant</div>
            <div className='hover:text-slate-200 cursor-pointer'>Creative Assistant</div>
            <div className='text-emerald-400 hover:text-emerald-300 cursor-pointer'>View All</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className='flex-1 flex flex-col relative z-10 px-6'>
        {/* Logo */}
        <div className='pt-12 pb-10 text-center'>
          <h1 
            className='text-5xl font-inter tracking-tighter leading-none'
            style={{
              fontWeight: 300,
              color: '#e5e7eb',
              textShadow: `
                0 0 1px rgba(255, 255, 255, 0.3),
                0 0 2px rgba(255, 255, 255, 0.2)
              `,
              letterSpacing: '-0.04em',
              lineHeight: 1.2,
              filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.15))'
            }}
          >
            perplexity
          </h1>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto px-6 space-y-4 mb-8'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-lg px-4 py-2 rounded-2xl text-sm ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/60 text-slate-100'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className='flex justify-start'>
              <div className='bg-slate-800/60 px-4 py-2 rounded-2xl'>
                <div className='flex space-x-2'>
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'></div>
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100'></div>
                  <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200'></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Input at Bottom */}
        <div className='w-full max-w-2xl mx-auto mb-12'>
          <form onSubmit={handleSendMessage} className='relative group'>
            {/* Focus glow background */}
            <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/10 group-focus-within:via-emerald-500/5 group-focus-within:to-emerald-500/10 rounded-2xl blur transition-all duration-300'></div>
            
            <div className='relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 group-focus-within:border-emerald-500/50 rounded-2xl p-4 shadow-lg transition-all duration-300'>
              {/* Middle - Input */}
              <div className='mb-3'>
                <input
                  type='text'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder='Ask anything...'
                  className='w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-inter cursor-text'
                  style={{ caretColor: '#10b981' }}
                  disabled={loading}
                />
              </div>

              {/* Bottom - Action buttons */}
              <div className='flex items-center justify-between'>
                {/* Plus button on left */}
                <button
                  type='button'
                  className='p-1.5 hover:bg-slate-700/60 hover:text-emerald-400 rounded-lg transition-all duration-200 text-slate-400 flex-shrink-0'
                >
                  <Plus size={18} />
                </button>

                {/* Send and Mic buttons on right */}
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    className='p-1.5 hover:bg-slate-700/60 hover:text-emerald-400 rounded-lg transition-all duration-200 text-slate-400 flex-shrink-0'
                  >
                    <Mic size={18} />
                  </button>

                  <button
                    type='submit'
                    disabled={loading || !messageInput.trim()}
                    className='p-1.5 bg-emerald-600/70 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 disabled:bg-slate-700/30 rounded-lg text-white disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0'
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Suggestion Pills */}
          <div className='w-full'>
            <div className='flex flex-wrap justify-center gap-2'>
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => setMessageInput(text)}
                  className='px-3 py-1 bg-slate-800/30 border border-slate-700/50 text-slate-300 text-xs font-medium font-inter rounded-full hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:text-emerald-200 transition-all duration-200'
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard