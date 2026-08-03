// ===== SAXOPHONIST CHATBOT JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Chatbot state management
    const chatState = {
        isOpen: false,
        hasUnread: false,
        context: 'saxophone' // Default context
    };

    // DOM elements
    const chatbotWidget = document.getElementById('chatbot-widget');
    const openChatButton = document.getElementById('open-chat-button');
    const closeChatButton = document.getElementById('close-chat');
    const chatAreaWidget = document.getElementById('chat-area-widget');
    const chatForm = document.getElementById('chat-form');
    const userInputWidget = document.getElementById('user-input-widget');
    const sendButtonWidget = document.getElementById('send-button-widget');
    const notificationBadge = document.getElementById('notification-badge');

    // Knowledge base for saxophone services
    const saxophoneKnowledgeBase = [
        {
            keywords: ['price', 'cost', 'pricing', 'how much', 'charge', 'fee', 'rate'],
            response: "My performance pricing starts from ₦30,000+ per event, but this is negotiable based on the event type, duration, and location. All payments and bookings are handled via direct message (DM) through WhatsApp, X (Twitter), or Instagram. Contact me directly for a personalized quote!"
        },
        {
            keywords: ['book', 'booking', 'hire', 'reserve', 'schedule', 'availability'],
            response: "I'd love to perform at your event! To book me, please send me a direct message (DM) via WhatsApp (+234 810 882 1809), X (Twitter @peterphonist), or Instagram. Let me know your event details including date, time, location, and type of event. I'll respond within 24 hours!"
        },
        {
            keywords: ['church', 'worship', 'ministry', 'gospel', 'service'],
            response: "For church services and worship events, I have a special policy: I joyfully serve at churches and don't accept cash payments. The church may sponsor my transportation (T-fare) if needed. This is my way of giving back to the community through music ministry. Contact me via DM to discuss church event details!"
        },
        {
            keywords: ['wedding', 'marriage', 'couple', 'bride', 'groom'],
            response: "Congratulations on your upcoming wedding! I provide beautiful saxophone music for ceremonies, receptions, and dinner. My performances include wedding processional music, first dance accompaniment, and romantic dinner ambiance. Pricing is negotiable - DM me with your wedding date and location for availability!"
        },
        {
            keywords: ['birthday', 'party', 'celebration', 'anniversary'],
            response: "Birthdays and celebrations are my specialty! I bring energy and excitement with lively saxophone performances that get everyone in the party mood. I can perform birthday songs, party favorites, and custom playlists. DM me to discuss your celebration details and create the perfect musical experience!"
        },
        {
            keywords: ['concert', 'performance', 'show', 'gig', 'live'],
            response: "I'm available for concerts and live performances! My services include solo performances, ensemble collaborations, live band work, and custom arrangements. Whether it's a large venue or intimate setting, I bring professional energy and musicianship. DM me for booking and availability!"
        },
        {
            keywords: ['conference', 'corporate', 'business', 'event', 'networking'],
            response: "For conferences and corporate events, I provide sophisticated entertainment that adds elegance and energy to business gatherings. I perform opening/closing acts, networking session music, and dinner entertainment. Professional and punctual service guaranteed. DM me to discuss your corporate event needs!"
        },
        {
            keywords: ['style', 'genre', 'music', 'songs', 'repertoire', 'play'],
            response: "I perform a wide variety of musical styles including smooth jazz, contemporary pop, gospel, worship music, R&B, and popular classics. I can also learn specific songs for your event! My repertoire is versatile to match any occasion - from romantic wedding music to energetic party vibes. DM me with your song preferences!"
        },
        {
            keywords: ['equipment', 'gear', 'instrument', 'sound'],
            response: "I come fully equipped with professional-grade saxophone and sound equipment. I coordinate with your venue's sound system and can provide my own if needed. My equipment is high-quality and well-maintained for the best sound experience. No extra equipment needed from your end!"
        },
        {
            keywords: ['contact', 'reach', 'message', 'call', 'phone', 'email'],
            response: "Here are all the ways to reach me:\n\n• WhatsApp: +234 810 882 1809\n• X (Twitter): @peterphonist\n• Instagram: @peterphonist\n• YouTube: @peterphonist\n• Facebook: Peterphonist\n• TikTok: @peterphonist\n\nFor fastest response, send me a WhatsApp message! I typically respond within 24 hours."
        },
        {
            keywords: ['time', 'duration', 'long', 'hours'],
            response: "Performance duration is flexible based on your event needs! I can perform for 30 minutes to several hours depending on your requirements. For most events, 1-2 hours is typical, but we can discuss what works best for your schedule and budget. DM me to customize your performance duration!"
        },
        {
            keywords: ['location', 'area', 'where', 'travel'],
            response: "I'm based in Nigeria and available for events nationwide! For events outside my immediate area, travel arrangements can be discussed during booking. Transportation costs are factored into the overall pricing. DM me your event location for specific availability and travel arrangements!"
        },
        {
            keywords: ['experience', 'about', 'bio', 'background'],
            response: "I'm Peterphonist - a professional saxophonist with years of experience in live performance. I specialize in creating memorable musical experiences for all types of events, from intimate gatherings to grand celebrations. My style blends soul, rhythm, and creativity through powerful tunes and expressive performances. Check out my performances on YouTube @peterphonist!"
        },
        {
            keywords: ['services', 'offer', 'provide', 'do', 'events'],
            response: "Here are the events I cover:\n\n• Concerts & Live Performances\n• Weddings (ceremonies & receptions)\n• Birthday Parties\n• Conferences & Corporate Events\n• Church Services (special policy)\n• Anniversaries\n• Product Launches\n• Private Parties\n• And any celebration needing music!\n\nDM me to discuss your specific event!"
        },
        {
            keywords: ['hello', 'hi', 'hey', 'start', 'begin'],
            response: "Hello! Welcome to Peterphonist's virtual assistant! I'm here to help you with any questions about saxophone services, bookings, performances, pricing, and more. What would you like to know today?"
        },
        {
            keywords: ['help', 'assist', 'support'],
            response: "I'm here to help! You can ask me about:\n\n• Pricing and booking information\n• Types of events I perform at\n• My musical styles and repertoire\n• Equipment and setup\n• Contact information\n• Church performance policy\n• Wedding, birthday, and concert services\n• And anything else about my saxophone services!\n\nWhat would you like to know?"
        }
    ];

    // Check for tech-related questions and redirect
    const techKeywords = ['tech', 'web', 'development', 'coding', 'programming', 'app', 'software', 'website', 'developer', 'coding', 'programming', 'portfolio', 'projects', 'frontend', 'backend'];

    // Find the best response based on keywords
    function findResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Check for tech-related questions first
        for (const keyword of techKeywords) {
            if (input.includes(keyword)) {
                return {
                    response: "It sounds like you're interested in Peter Lightspeed's tech and web development services! For tech-related inquiries, web development projects, and digital solutions, please visit the main website at peterlightspeed.github.io/portfolio or contact Peter Lightspeed directly. I'm specifically here to help with saxophone services, bookings, and music-related questions! Would you like me to provide more information about my saxophone services instead?",
                    context: 'tech'
                };
            }
        }
        
        // Search through saxophone knowledge base
        for (const entry of saxophoneKnowledgeBase) {
            for (const keyword of entry.keywords) {
                if (input.includes(keyword.toLowerCase())) {
                    return {
                        response: entry.response,
                        context: 'saxophone'
                    };
                }
            }
        }
        
        // Default response if no match found
        return {
            response: "I'm not sure I understand that question. I can help you with information about my saxophone services, bookings, pricing, events I perform at, and more. Try asking about pricing, booking, wedding services, church performances, or contact information! Or check out my YouTube channel @peterphonist to see my performances.",
            context: 'saxophone'
        };
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message ${isUser ? 'user-message' : 'bot-message'}">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatAreaWidget.appendChild(messageDiv);
        chatAreaWidget.scrollTop = chatAreaWidget.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span class="typing-dots"></span>';
        chatAreaWidget.appendChild(typingDiv);
        chatAreaWidget.scrollTop = chatAreaWidget.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Handle user message
    function handleUserMessage(message) {
        if (!message.trim()) return;
        
        // Add user message
        addMessage(message, true);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate thinking time
        setTimeout(() => {
            removeTypingIndicator();
            
            // Find appropriate response
            const response = findResponse(message);
            chatState.context = response.context;
            
            // Add bot response
            addMessage(response.response);
            
            // Update context
            if (response.context === 'tech') {
                chatState.context = 'tech';
            }
        }, 1000);
    }

    // Toggle chatbot visibility
    function toggleChatbot() {
        chatState.isOpen = !chatState.isOpen;
        
        if (chatState.isOpen) {
            chatbotWidget.classList.remove('chatbot-hidden');
            openChatButton.classList.add('d-none');
            
            // Remove notification badge
            notificationBadge.classList.add('d-none');
            chatState.hasUnread = false;
            
            // Focus input
            setTimeout(() => {
                userInputWidget.focus();
            }, 300);
        } else {
            chatbotWidget.classList.add('chatbot-hidden');
            openChatButton.classList.remove('d-none');
        }
    }

    // Event Listeners
    openChatButton.addEventListener('click', toggleChatbot);
    
    closeChatButton.addEventListener('click', toggleChatbot);
    
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInputWidget.value.trim();
        if (message) {
            handleUserMessage(message);
            userInputWidget.value = '';
        }
    });
    
    // Auto-open chat after 5 seconds (with notification)
    setTimeout(() => {
        if (!chatState.isOpen) {
            notificationBadge.classList.remove('d-none');
            notificationBadge.textContent = '1';
            chatState.hasUnread = true;
        }
    }, 5000);

    // Console message
    console.log('Peterphonist Chatbot initialized');
    console.log('Ready to answer questions about saxophone services');
});

// ===== CHATBOT UTILITY FUNCTIONS =====
const ChatbotUtils = {
    // Format message with emojis
    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    },
    
    // Simulate typing effect
    typeText(element, text, speed = 30) {
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    },
    
    // Check if message contains questions
    isQuestion(text) {
        return text.includes('?') || 
               ['what', 'how', 'when', 'where', 'why', 'who', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does']
               .some(word => text.toLowerCase().startsWith(word));
    }
};