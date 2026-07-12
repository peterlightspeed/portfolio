/**
 * Peter Lightspeed Chatbot
 * A simple JavaScript chatbot for the portfolio website
 */

// Chat configuration
const botConfig = (function() {
    const defaultConfig = {
        name: "Peter Assistant",
        initialMessage: "Hi! I'm Peter's AI assistant. Peter is an AI developer, data engineer, and founder of PLS TechCompany based in Nigeria.<br><br>I can help you with:<br>• <b>AI & Machine Learning</b> services<br>• <b>Data Engineering & BI</b> projects<br>• <b>Web Development</b> work<br>• <b>PLS TechCompany products</b><br><br>What are you looking for?",
        typingSpeed: 40,
        responseDelay: 400,
        botAvatar: "images/logos/peter-logo.png",
        knowledgeBase: {
            // General information
            "who is peter": "Peter Lightspeed (Eluwade Peter Toluwanimi) is the founder of <b>PLS TechCompany</b> — an AI, data engineering, and web development professional based in Lagos, Nigeria. With over 4 years of experience, he builds intelligent systems, data pipelines, Python automation, and machine learning solutions for businesses. Want to see his <a href='services.html'>services</a> or <a href='projects.html'>projects</a>?",
            "what services": "Peter offers a full range of AI, data, and web services:<br><br><b>AI & Technical:</b><br>• AI Development & LLM Integration<br>• Machine Learning Solutions<br>• Python Automation<br>• Business Intelligence & Dashboards<br>• Data Engineering & ETL Pipelines<br>• Chatbot Development<br><br><b>Web & Digital:</b><br>• Web Development<br>• Graphic Design<br>• Content Creation<br>• Digital Marketing<br><br><a href='services.html'>View full Services page</a>",
            "contact": "You can contact Peter via email at petereluwade55@gmail.com or through WhatsApp at +234 810 882 1809. Alternatively, you can use the contact form on the Contact page of this website for a prompt response.",
            "social media handles": "You can connect with Peter on social media:<br><br>• Twitter/X: <a href='https://x.com/peterlightspeed' target='_blank'>@peterlightspeed</a><br>• Instagram: <a href='https://www.instagram.com/eluwadepeter' target='_blank'>@eluwadepeter</a><br>• TikTok: <a href='https://www.tiktok.com/@eluwadepeter' target='_blank'>@eluwadepeter</a><br>• Music/Saxophone: <a href='https://www.instagram.com/peterphonist' target='_blank'>@peterphonist</a><br><br>Follow for updates on his work and creative content!",
            "handles": "You can find Peter on social media: Twitter/X (@peterlightspeed), Instagram (@eluwadepeter), TikTok (@eluwadepeter), and his music handle is @peterphonist. Connect with him to stay updated!",
            "location": "Peter is based in Nigeria but provides remote services to clients worldwide. His virtual assistance knows no geographical boundaries, allowing him to serve clients across different time zones effectively.",
            "pls techcompany": "PLS TechCompany is Peter Eluwade's software company based in Lagos, Nigeria. It focuses on building AI-powered data tools, Python automation systems, and business intelligence platforms for Nigerian SMBs. Current products: <b>PLS Nigerian SMB Data Sanitizer</b> and <b>PLS Business Intelligence Suite</b>. <a href='products.html'>View Products</a>",
            "products": "PLS TechCompany currently has two professional software products:<br><br><b>PLS Nigerian SMB Data Sanitizer</b> — Cleans messy Nigerian business data (phones, addresses, currencies). Community Edition is available now on GitHub. Pro &amp; Web Editions coming September 2026.<br><br><b>PLS Business Intelligence Suite</b> — BI platform for Nigerian SMBs. All editions coming in 2026.<br><br><a href='products.html'>View full product details &amp; roadmap</a>",
            "data sanitizer": "The <b>PLS Nigerian SMB Data Sanitizer</b> is a Python/Pandas toolkit that normalises Nigerian phone numbers, addresses, names, and currencies in seconds. It has 3 editions:<br>• Community (Available on GitHub now)<br>• Pro Edition (Coming Sep 2026)<br>• Web Edition (Coming Sep 2026)<br><br><a href='products.html#smb-sanitizer'>See full details</a>",
            "business intelligence": "Peter offers <b>Business Intelligence</b> services — KPI dashboards, automated reports, Power BI solutions, and sales analytics. He is also building the <b>PLS Business Intelligence Suite</b>, a dedicated BI platform for Nigerian SMBs coming in 2026. <a href='services.html#business-intelligence'>View BI Service</a> | <a href='products.html#bi-suite'>View BI Product</a>",
            "ai development": "Peter builds custom AI applications including LLM integrations, intelligent chatbots, document processing systems, and AI-powered automation workflows. He works with OpenAI APIs, Python, and machine learning frameworks. <a href='services.html#ai-development'>View AI Development Service</a>",
            "machine learning": "Peter develops machine learning models for predictive analytics, classification, anomaly detection, and trend forecasting. His ML solutions are built with Python (Scikit-learn, TensorFlow) and deployed for real business use. <a href='services.html#machine-learning'>View ML Service</a>",
            "python": "Peter is a Python developer specialising in automation, data engineering, machine learning, and AI development. He builds CLI tools, REST APIs, data pipelines, and automation scripts. <a href='services.html#python-automation'>View Python Automation Service</a>",
            "data engineering": "Peter designs and builds data pipelines, ETL workflows, and data cleaning systems. The PLS Nigerian SMB Data Sanitizer is one of his data engineering products. <a href='services.html#data-engineering'>View Data Engineering Service</a>",
            "chatbot": "Peter builds custom chatbots for websites, WhatsApp, and business portals — like the assistant you're chatting with right now! He integrates AI to handle customer queries, lead capture, and FAQ automation. <a href='services.html#chatbot-development'>View Chatbot Development Service</a>",
            "roadmap": "PLS TechCompany's 2026 product roadmap:<br><br><b>Q3 2026 (Jul–Sep):</b><br>• PLS Nigerian SMB Data Sanitizer Pro<br>• PLS Nigerian SMB Data Sanitizer Web<br>• PLS Business Intelligence Suite Community<br><br><b>Q4 2026 (Oct–Dec):</b><br>• PLS Business Intelligence Suite Pro<br>• PLS Business Intelligence Suite Web<br><br><a href='products.html#roadmap'>View full roadmap</a>",
            "hire peter": "Peter is available for AI development, data engineering, machine learning, and web development projects. Email: <a href='mailto:petereluwade55@gmail.com'>petereluwade55@gmail.com</a> | WhatsApp: +234 810 882 1809<br><a href='contact.html'>Use the Contact Form</a>",
            "experience": "Peter has over 4 years of experience in AI development, data engineering, Python automation, machine learning, web development, and business intelligence. He has worked on 50+ projects across different industries and built software products under PLS TechCompany. Want to see his <a href='projects.html'>portfolio</a>?",
            
            // Services information
            "web development": "Peter offers professional web development services including responsive website design, e-commerce solutions, website maintenance, and custom web applications. His websites are mobile-friendly, SEO-optimized, and built with modern technologies like HTML5, CSS3, JavaScript, and various frameworks. He ensures that each website not only looks great but also performs excellently across all devices.",
            "graphic design": "Peter provides comprehensive graphic design services including logo design, branding materials, social media graphics, banners, flyers, and digital illustrations. He creates visually appealing designs that help businesses stand out in today's competitive market. His design philosophy focuses on clean, modern aesthetics that effectively communicate your brand message.",
            "social media": "Peter offers comprehensive social media management services including content creation, scheduling, community engagement, and analytics reporting. He helps businesses build their online presence and engage with their audience effectively across platforms like Facebook, Instagram, Twitter, LinkedIn, and more. His strategies are tailored to reach your target audience and achieve your specific goals.<br><br>Connect with Peter: Twitter/X (@peterlightspeed), Instagram (@eluwadepeter), TikTok (@eluwadepeter).",
            "data entry": "Peter provides accurate and efficient data entry services, including spreadsheet management, database updates, document processing, and form filling. He ensures data accuracy, confidentiality, and timely delivery. His attention to detail makes him perfect for handling large volumes of data with precision.",
            "content creation": "Peter creates engaging content for websites, blogs, and social media. His content writing services include SEO-optimized articles, product descriptions, and marketing copy that resonates with target audiences. He researches thoroughly to ensure the content is not only engaging but also valuable to readers and optimized for search engines.",
            "digital marketing": "Peter offers digital marketing services including SEO, social media marketing, email campaigns, and content marketing strategies to help businesses increase their online visibility and attract more customers. He analyzes market trends and competitor strategies to develop effective marketing plans that deliver measurable results.",
            
            // Projects information
            "projects": "Peter has worked on various projects including e-commerce websites, business portfolios, blogs, and social media campaigns. His portfolio includes websites for small businesses, content creation for blogs, graphic design for marketing materials, and comprehensive social media management for growing brands. You can view his portfolio on the Projects page to see examples of his work.",
            "portfolio": "You can view Peter's portfolio on the Projects page of this website. It showcases his best work across web development, graphic design, and digital marketing projects. Each project demonstrates his technical skills, creativity, and ability to deliver solutions that meet client objectives.",
            
            // Pricing information
            "pricing": "Pricing varies depending on project requirements and scope. Peter offers competitive rates and flexible packages designed to accommodate different budgets. Please contact him directly for a personalized quote based on your specific needs and project details.",
            "rates": "Peter's rates are competitive and based on project complexity, timeline, and specific requirements. He offers both fixed-price packages and hourly rates depending on the nature of the work. Contact him for a custom quote tailored to your project needs.",
            
            // Availability information
            "availability": "Peter is available 24/7 for client communication. He understands the importance of timely responses and maintains excellent communication throughout projects. Project timelines are discussed and agreed upon before starting any work to ensure clear expectations.",
            "turnaround time": "Turnaround time depends on the project scope and complexity. Peter always provides estimated completion times before starting work and strives to deliver on or before deadlines. For urgent requests, he offers expedited services when available.",
            
            // About information
            "about": "Peter Lightspeed is a dedicated virtual assistant and web developer with a passion for creating digital solutions that help businesses grow. With expertise in web development, graphic design, and digital marketing, he provides comprehensive services to clients worldwide. His approach combines technical skills with creativity to deliver results that exceed client expectations.",
            "education": "Peter is currently in school to earn a degree in Bachelor of Science in Computer Science from the University of Lagos, Nigeria. He has also completed various certifications in web development, digital marketing, and graphic design to stay updated with the latest industry trends and technologies.",
            "skills": "Peter's core skills include:<br><b>AI & Data:</b> Python, Machine Learning, Data Engineering, ETL Pipelines, Business Intelligence, Pandas, SQL, OpenAI API<br><b>Web:</b> HTML5, CSS3, JavaScript, Bootstrap, WordPress<br><b>Design & Marketing:</b> Graphic Design (Adobe Suite), Social Media Management, Content Creation, SEO",
            
            // Personal information
            "background": "Peter developed an interest in technology at a young age and has been honing his skills ever since. His journey began with learning basic programming and gradually expanded to include web development, design, and digital marketing. His diverse skill set allows him to offer comprehensive solutions to his clients.",
            "interests": "Beyond his professional work, Peter is passionate about technology trends, continuous learning, and helping businesses establish a strong online presence. He enjoys exploring new tools and techniques that can enhance his service offerings.",
            "languages": "Peter is fluent in English and has basic knowledge of a few programming languages including JavaScript, PHP, and Python. His communication skills enable him to explain technical concepts clearly to clients from non-technical backgrounds.",
            
            // Specialties
            "specialties": "Peter specializes in creating responsive websites, developing brand identities, managing social media accounts for growth, and implementing effective digital marketing strategies. His holistic approach ensures that all aspects of your online presence work together cohesively.",
            "industries": "Peter has experience working with clients from various industries including e-commerce, education, healthcare, real estate, hospitality, and professional services. This diverse experience allows him to understand the unique needs of different business sectors.",
            
            // Process
            "process": "Peter follows a structured process for all projects: 1) Initial consultation to understand requirements, 2) Research and planning, 3) Design and development, 4) Review and revisions, 5) Final delivery, and 6) Ongoing support as needed. This ensures clear communication and quality results.",
            "collaboration": "Peter believes in collaborative work with clients. He maintains regular communication throughout projects, provides progress updates, and welcomes feedback at every stage to ensure the final deliverable meets your expectations.",
            
            // Tools
            "tools": "Peter uses industry-standard tools and software including Adobe Creative Suite for design, WordPress and custom coding for websites, various social media management platforms, and analytics tools to track performance and optimize strategies.",
            "technologies": "Peter works with various technologies including HTML5, CSS3, JavaScript, PHP, WordPress, WooCommerce, Shopify, Adobe Creative Suite, and social media APIs. He continuously updates his technical knowledge to incorporate the latest advancements.",
            
            // Navigation hints
            "navigate": "Here are the main pages on this site:<br><a href='index.html'>Home</a> — Overview<br><a href='projects.html'>Projects</a> — Portfolio<br><a href='services.html'>Services</a> — All services<br><a href='products.html'>Products</a> — PLS TechCompany software<br><a href='about.html'>About</a> — Peter's background<br><a href='contact.html'>Contact</a> — Hire Peter",
            "show me": "Sure! Here's where to find things:<br>• AI/Data services → <a href='services.html#ai-development'>Services page</a><br>• Software products → <a href='products.html'>Products page</a><br>• Portfolio work → <a href='projects.html'>Projects page</a><br>• Hire Peter → <a href='contact.html'>Contact page</a>",

            // Fallback responses
            "default": "I didn't quite catch that. Try asking about:<br>• <b>Peter's services</b> (AI, ML, Python, Web)<br>• <b>PLS TechCompany products</b><br>• <b>How to hire Peter</b><br>• <b>His projects or experience</b><br><br>Or type <b>\"show me\"</b> for a quick site guide.",
            "greeting": "Hi there! I'm Peter's AI assistant. Ask me about his AI development services, data engineering work, PLS TechCompany products, or how to hire him.",
            "wassup": "Hello! How can I assist you today? I'm here to answer questions about Peter's services and expertise.",
            "how far": "i dey boss, how you dey? Shey you get any questions about Peter's services and expertise.",
            "no": "no problem, if you have any question, do not hesitate to chat me in lightspeed.",
            "okay": "if you have any question about peter, do not hesitate to ask me, if you have any questions i can not answer, you can send him a message using the contact form ",
            "kk": "if you have any question about peter, do not hesitate to ask me, if you have any questions i can not answer, you can send him a message using the contact form ",
            "ok": "if you have any question about peter, do not hesitate to ask me, if you have any questions i can not answer, you can send him a message using the contact form ",
            "nah": "no problem, if you have any question, do not hesitate to meet me in lightspeed.",
            "no boss": "no wahala, if you get any question, no hesitate to chat me in lightspeed.",
            "no wahala": "yes boss, feel free to chat me up anytime",
            "no problem": "thanks, i am always here to reply in lightspeed",
            "you are welcome": "no problem, i am always here to answer your questions",
            "goodbye": "Thank you for chatting! If you need any further assistance, feel free to contact Peter directly at petereluwade55@gmail.com or through the Contact page.",
            'thanks': "You're welcome! Is there anything else I can help you with regarding Peter's services or expertise?",
            'thank you': "You're welcome! Is there anything else I can help you with regarding Peter's services or expertise?",
            "hire": "Great! To discuss working with Peter, please send an email to petereluwade55@gmail.com or use the Contact form on the website. Please include details about your project for a prompt response."
        }
    };
    
    // Try to get from localStorage
    const storedConfig = localStorage.getItem('botConfig');
    if (storedConfig) {
        try {
            const parsedConfig = JSON.parse(storedConfig);
            
            // Get knowledge base separately
            const storedKnowledgeBase = localStorage.getItem('botKnowledgeBase');
            if (storedKnowledgeBase) {
                try {
                    parsedConfig.knowledgeBase = JSON.parse(storedKnowledgeBase);
                } catch (error) {
                    console.error('Error parsing knowledge base:', error);
                    parsedConfig.knowledgeBase = defaultConfig.knowledgeBase;
                }
            } else {
                parsedConfig.knowledgeBase = defaultConfig.knowledgeBase;
            }
            
            // Ensure the bot avatar is set
            if (!parsedConfig.botAvatar) {
                parsedConfig.botAvatar = defaultConfig.botAvatar;
            }
            
            return parsedConfig;
        } catch (error) {
            console.error('Error parsing bot config:', error);
        }
    }
    
    return defaultConfig;
})();

// Chat state
let chatState = {
    isOpen: false,
    isTyping: false,
    chatHistory: [],
    hasInitialMessage: false
};

// DOM Elements
let chatbotWidget;
let chatArea;
let chatForm;
let userInput;
let sendButton;
let openChatButton;
let closeChatButton;
let notificationBadge;
let chatbotAvatar;

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot elements if they don't exist
    createChatbotElements();
    
    // Get references to DOM elements
    chatbotWidget = document.getElementById('chatbot-widget');
    chatArea = document.getElementById('chat-area-widget');
    chatForm = document.getElementById('chat-form');
    userInput = document.getElementById('user-input-widget');
    sendButton = document.getElementById('send-button-widget');
    openChatButton = document.getElementById('open-chat-button');
    closeChatButton = document.getElementById('close-chat');
    notificationBadge = document.getElementById('notification-badge');
    chatbotAvatar = document.getElementById('chatbot-avatar-img');
    
    // Set bot avatar
    if (chatbotAvatar) {
        chatbotAvatar.src = botConfig.botAvatar;
    }
    
    // Set up event listeners
    openChatButton.addEventListener('click', openChat);
    closeChatButton.addEventListener('click', closeChat);
    chatForm.addEventListener('submit', handleUserMessage);
    
    // Load chat history from local storage
    loadChatHistory();
    
    // Show notification after a delay
    setTimeout(() => {
        if (!chatState.isOpen && !chatState.hasInitialMessage) {
            showNotification();
        }
    }, 5000);
});

// Create chatbot elements if they don't exist
function createChatbotElements() {
    // Check if elements already exist
    if (document.getElementById('chatbot-widget')) {
        return;
    }
    
    // Create chatbot widget
    const chatbotHTML = `
        <div id="chatbot-widget" class="chatbot-hidden">
            <div class="chatbot-header">
                <div class="d-flex align-items-center">
                    <div class="chatbot-avatar me-2">
                        <img id="chatbot-avatar-img" src="${botConfig.botAvatar}" alt="Peter Assistant">
                    </div>
                    <div>
                        <span class="fw-semibold d-block">${botConfig.name}</span>
                        <small class="chatbot-status">
                            <span class="status-dot"></span>
                            Online
                        </small>
                    </div>
                </div>
                <button id="close-chat" class="btn btn-sm text-white">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div id="chat-area-widget"></div>
            <div class="chat-form-container">
                <form id="chat-form">
                    <div class="d-flex">
                        <input id="user-input-widget" type="text" placeholder="Type your message..." class="form-control">
                        <button id="send-button-widget" type="submit" class="btn btn-primary">
                            <i class="bi bi-send-fill"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <button id="open-chat-button">
            <i class="bi bi-chat-dots-fill"></i>
            <span id="notification-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">1</span>
        </button>
    `;
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Chatbot Widget Styles */
        #chatbot-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
            transition: all 0.3s ease;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
        }

        #chatbot-widget.chatbot-visible {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        .chatbot-hidden {
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
        }

        .chatbot-header {
            background-color: #0d6efd;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background-color: #fff;
        }

        .chatbot-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .chatbot-status {
            font-size: 0.8rem;
            opacity: 0.8;
            display: flex;
            align-items: center;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background-color: #4CAF50;
            border-radius: 50%;
            margin-right: 5px;
            display: inline-block;
        }

        #chat-area-widget {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background-color: #f8f9fa;
        }

        .chat-form-container {
            padding: 10px;
            border-top: 1px solid #e9ecef;
            background-color: #fff;
        }

        #chat-form {
            display: flex;
        }

        #user-input-widget {
            flex: 1;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 20px 0 0 20px;
            outline: none;
        }

        #send-button-widget {
            border-radius: 0 20px 20px 0;
        }

        .message {
            margin-bottom: 15px;
            max-width: 80%;
            word-wrap: break-word;
        }

        .user-message {
            margin-left: auto;
            background-color: #0d6efd;
            color: white;
            padding: 10px 15px;
            border-radius: 15px 15px 0 15px;
        }

        .bot-message {
            margin-right: auto;
            background-color: #e9ecef;
            color: #212529;
            padding: 10px 15px;
            border-radius: 15px 15px 15px 0;
        }

        .message-time {
            font-size: 0.7rem;
            margin-top: 5px;
            opacity: 0.7;
            text-align: right;
        }

        .typing-indicator {
            display: flex;
            padding: 10px 15px;
            background-color: #e9ecef;
            border-radius: 15px 15px 15px 0;
            margin-right: auto;
            margin-bottom: 15px;
            width: 60px;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #6c757d;
            border-radius: 50%;
            margin: 0 2px;
            animation: typing-animation 1.5s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.5s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 1s;
        }

        @keyframes typing-animation {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
            }
            100% {
                transform: translateY(0);
            }
        }

        /* Floating Chat Button */
        #open-chat-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: #0d6efd;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 999;
            transition: all 0.3s ease;
        }

        #open-chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }

        #notification-badge {
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
            #chatbot-widget {
                width: 90%;
                height: 70vh;
                bottom: 80px;
                right: 5%;
            }
        }
    `;
    
    // Append style to head
    document.head.appendChild(styleElement);
    
    // Create container for chatbot
    const chatbotContainer = document.createElement('div');
    chatbotContainer.innerHTML = chatbotHTML;
    
    // Append to body
    document.body.appendChild(chatbotContainer);
}

// Open chat widget
function openChat() {
    chatState.isOpen = true;
    chatbotWidget.classList.add('chatbot-visible');
    chatbotWidget.classList.remove('chatbot-hidden');
    openChatButton.style.display = 'none';
    
    // Hide notification badge
    notificationBadge.classList.add('d-none');
    
    // If it's the first time opening, show welcome message
    if (!chatState.hasInitialMessage) {
        chatState.hasInitialMessage = true;
        
        // Add welcome message with typing effect
        addBotMessageWithTypingEffect(botConfig.initialMessage);
    }
    
    // Focus on input field
    setTimeout(() => {
        userInput.focus();
    }, 300);
    
    // Scroll to bottom of chat
    scrollToBottom();
    
    // Save chat state
    saveChatState();
}

// Close chat widget
function closeChat() {
    chatState.isOpen = false;
    chatbotWidget.classList.remove('chatbot-visible');
    chatbotWidget.classList.add('chatbot-hidden');
    openChatButton.style.display = 'flex';
    
    // Save chat state
    saveChatState();
}

// Show notification badge
function showNotification() {
    if (!chatState.isOpen) {
        notificationBadge.textContent = '1';
        notificationBadge.classList.remove('d-none');
    }
}

// Handle user message submission
function handleUserMessage(e) {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    userInput.value = '';
    
    // Process message and get response
    const botResponse = getBotResponse(message);
    
    // Show typing indicator and then bot response
    showTypingIndicator();
    
    // Calculate typing time based on response length
    const typingTime = Math.min(
        botResponse.length * botConfig.typingSpeed / 10, // Divide by 10 to make it faster
        3000 // Cap at 3 seconds max
    );
    
    setTimeout(() => {
        removeTypingIndicator();
        addBotMessageWithTypingEffect(botResponse);
    }, botConfig.responseDelay + Math.random() * 500); // Add some randomness
    
    // Focus on input field
    userInput.focus();
}

// Add user message to chat
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = getCurrentTime();
    
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timeElement);
    
    chatArea.appendChild(messageContainer);
    
    // Add to chat history
    chatState.chatHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save chat history
    saveChatHistory();
    
    // Scroll to bottom
    scrollToBottom();
}

// Add bot message to chat with typing effect
function addBotMessageWithTypingEffect(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = getCurrentTime();
    
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timeElement);
    
    chatArea.appendChild(messageContainer);
    
    // Process markdown-like formatting
    message = processMessageFormatting(message);
    
    // Type out the message
    let i = 0;
    const typingSpeed = botConfig.typingSpeed / 2; // Make it faster
    const typeWriter = () => {
        if (i < message.length) {
            messageElement.innerHTML = message.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Typing complete
            messageElement.innerHTML = message;
            
            // Add to chat history
            chatState.chatHistory.push({
                role: 'assistant',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            // Save chat history
            saveChatHistory();
            
            // Scroll to bottom
            scrollToBottom();
        }
    };
    
    typeWriter();
}

// Add bot message to chat immediately (no typing effect)
function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    
    // Process markdown-like formatting
    message = processMessageFormatting(message);
    
    messageElement.innerHTML = message;
    
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = getCurrentTime();
    
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timeElement);
    
    chatArea.appendChild(messageContainer);
    
    // Add to chat history
    chatState.chatHistory.push({
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save chat history
    saveChatHistory();
    
    // Scroll to bottom
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    chatState.isTyping = true;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }
    
    chatArea.appendChild(typingIndicator);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    chatState.isTyping = false;
    
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get bot response based on user message
function getBotResponse(userMessage) {
    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|howdy|hola|wassup|good morning)/i)) {
        return botConfig.knowledgeBase.greeting;
    }
    
    // Check for goodbyes
    if (message.match(/^(bye|goodbye|see you|farewell)/i)) {
        return botConfig.knowledgeBase.goodbye;
    }
    
    // Check for thanks
    if (message.match(/^(thanks|thank you|appreciate it|thanks a lot)/i)) {
        return botConfig.knowledgeBase.thanks;
    }
    
    // Check for hiring/contact intent
    if (message.match(/(hire|contact|get in touch|reach|email|call|quote|proposal)/i)) {
        return botConfig.knowledgeBase.hire;
    }
    
    // Check for specific topics in knowledge base
    for (const [key, response] of Object.entries(botConfig.knowledgeBase)) {
        // Skip special entries like 'default', 'greeting', etc.
        if (['default', 'greeting', 'goodbye', 'thanks', 'hire'].includes(key)) {
            continue;
        }
        
        // Check if the message contains this key phrase
        if (message.includes(key)) {
            return response;
        }
    }
    
    // More specific checks for common questions
    if (message.match(/(who|what|about).*peter/i)) {
        return botConfig.knowledgeBase["who is peter"];
    }
    
    if (message.match(/(service|offer|provide|do you do)/i)) {
        return botConfig.knowledgeBase["what services"];
    }
    
    if (message.match(/(contact|reach|email|phone|whatsapp)/i)) {
        return botConfig.knowledgeBase.contact;
    }
    
    if (message.match(/(where|location|based|country)/i)) {
        return botConfig.knowledgeBase.location;
    }
    
    if (message.match(/(experience|background|history|worked)/i)) {
        return botConfig.knowledgeBase.experience;
    }
    
    if (message.match(/(web|website|development|developer)/i)) {
        return botConfig.knowledgeBase["web development"];
    }
    
    if (message.match(/(graphic|design|logo|branding)/i)) {
        return botConfig.knowledgeBase["graphic design"];
    }
    
    if (message.match(/(social media|facebook|instagram|twitter)/i)) {
        return botConfig.knowledgeBase["social media"];
    }
    
    if (message.match(/(data entry|typing|spreadsheet|excel)/i)) {
        return botConfig.knowledgeBase["data entry"];
    }
    
    if (message.match(/(content|writing|blog|article)/i)) {
        return botConfig.knowledgeBase["content creation"];
    }
    
    if (message.match(/(marketing|digital marketing|seo|promotion)/i)) {
        return botConfig.knowledgeBase["digital marketing"];
    }
    
    if (message.match(/(project|portfolio|work|example)/i)) {
        return botConfig.knowledgeBase.projects;
    }
    
    if (message.match(/(price|cost|fee|charge|how much)/i)) {
        return botConfig.knowledgeBase.pricing;
    }
    
    if (message.match(/(available|when|schedule|booking)/i)) {
        return botConfig.knowledgeBase.availability;
    }
    
    if (message.match(/(time|long|duration|deadline|how long does it take|does he take time)/i)) {
        return botConfig.knowledgeBase["turnaround time"];
    }
    
    if (message.match(/(education|degree|study|learn|school|university)/i)) {
        return botConfig.knowledgeBase.education;
    }
    
    if (message.match(/(skill|ability|capable|can you|expertise)/i)) {
        return botConfig.knowledgeBase.skills;
    }
    
    if (message.match(/(tool|software|program|platform)/i)) {
        return botConfig.knowledgeBase.tools;
    }
    
    if (message.match(/(technology|tech|framework|language|code)/i)) {
        return botConfig.knowledgeBase.technologies;
    }
    
    if (message.match(/(process|approach|methodology|work flow)/i)) {
        return botConfig.knowledgeBase.process;
    }
    
    if (message.match(/(collaborate|work together|communication)/i)) {
        return botConfig.knowledgeBase.collaboration;
    }
    
    if (message.match(/(industry|sector|field|niche)/i)) {
        return botConfig.knowledgeBase.industries;
    }
    
    if (message.match(/(specialize|specialty|focus|expertise)/i)) {
        return botConfig.knowledgeBase.specialties;
    }
    
    if (message.match(/(language|speak|communication|languages)/i)) {
        return botConfig.knowledgeBase.languages;
    }
    
    if (message.match(/(interest|hobby|passion)/i)) {
        return botConfig.knowledgeBase.interests;
    }
    
    // If no match found, return default response
    return botConfig.knowledgeBase.default;
}

// Process message formatting (simple markdown-like)
function processMessageFormatting(message) {
    // Convert URLs to links
    message = message.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Convert **bold** to <strong>
    message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert numbered lists
    message = message.replace(/(\d+\))\s(.*?)(?=\n\d+\)|$)/g, '<li>$2</li>');
    if (message.includes('<li>')) {
        message = '<ol>' + message + '</ol>';
    }
    
    // Convert line breaks to <br>
    message = message.replace(/\n/g, '<br>');
    
    return message;
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Scroll chat to bottom
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Save chat history to local storage
function saveChatHistory() {
    // Limit history to last 50 messages to prevent storage issues
    const limitedHistory = chatState.chatHistory.slice(-50);
    localStorage.setItem('chatHistory', JSON.stringify(limitedHistory));
}

// Save chat state to local storage
function saveChatState() {
    localStorage.setItem('chatState', JSON.stringify({
        isOpen: chatState.isOpen,
        hasInitialMessage: chatState.hasInitialMessage
    }));
}

// Load chat history from local storage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    const savedState = localStorage.getItem('chatState');
    
    if (savedHistory) {
        try {
            chatState.chatHistory = JSON.parse(savedHistory);
            
            // Display up to last 10 messages
            const displayHistory = chatState.chatHistory.slice(-10);
            
            // Clear chat area
            chatArea.innerHTML = '';
            
            // Add messages to chat area
            displayHistory.forEach(msg => {
                if (msg.role === 'user') {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message user-message';
                    messageElement.textContent = msg.content;
                    
                    const timeElement = document.createElement('div');
                    timeElement.className = 'message-time';
                    timeElement.textContent = formatTimestamp(msg.timestamp);
                    
                    const messageContainer = document.createElement('div');
                    messageContainer.appendChild(messageElement);
                    messageContainer.appendChild(timeElement);
                    
                    chatArea.appendChild(messageContainer);
                } else if (msg.role === 'assistant') {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message bot-message';
                    messageElement.innerHTML = processMessageFormatting(msg.content);
                    
                    const timeElement = document.createElement('div');
                    timeElement.className = 'message-time';
                    timeElement.textContent = formatTimestamp(msg.timestamp);
                    
                    const messageContainer = document.createElement('div');
                    messageContainer.appendChild(messageElement);
                    messageContainer.appendChild(timeElement);
                    
                    chatArea.appendChild(messageContainer);
                }
            });
        } catch (error) {
            console.error('Error loading chat history:', error);
            chatState.chatHistory = [];
        }
    }
    
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            chatState.hasInitialMessage = state.hasInitialMessage || false;
            
            // Only open the chat if it was previously open
            if (state.isOpen) {
                setTimeout(() => {
                    openChat();
                }, 500);
            }
        } catch (error) {
            console.error('Error loading chat state:', error);
        }
    }
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
        return getCurrentTime();
    }
}








