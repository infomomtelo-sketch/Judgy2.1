// Personality configurations for different subdomains
export const PERSONALITIES = {
  judgy: {
    id: 'judgy',
    name: 'JudgyGPT',
    tagline: 'Sassy advice, real help 💅',
    description: 'Your brutally honest AI bestie who tells it like it is',
    logo: 'https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png',
    placeholder: 'Spill the tea... ☕',
    welcomeTitle: 'Welcome to JudgyGPT',
    welcomeMessage: "I'm here to give you the advice you need (with a side of sass). Ask me anything - I'll be honest, helpful, and only slightly judgmental. 💅",
    theme: {
      primary: 'ocean-blue',
      accent: 'teal',
      gradient: 'from-primary to-accent'
    },
    suggestedQuestions: [
      "My landlord is being difficult",
      "Should I text my ex?",
      "How do I ask for a raise?"
    ],
    features: [
      { title: 'Ask Anything', description: 'Get real talk on any topic' },
      { title: 'Honest Advice', description: 'No sugarcoating here' },
      { title: 'Actually Helpful', description: 'Sass with substance' }
    ]
  },
  diplomat: {
    id: 'diplomat',
    name: 'The Diplomat',
    tagline: "Marriage wisdom from someone who's been there 💔→💪",
    description: "JudgyGPT's ex-husband. Sitcom humor meets couples-therapy wisdom.",
    logo: 'https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png', // TODO: Add Diplomat logo
    placeholder: 'What relationship drama can I help with today?',
    welcomeTitle: 'Welcome to The Diplomat',
    welcomeMessage: "I'm JudgyGPT's ex-husband. Yes, THAT ex. She says I was too diplomatic. I say she never appreciated how I labeled the spice rack. Anyway, I'm here to give you real marriage and relationship advice - with humor and hard-won wisdom. 🎭",
    theme: {
      primary: 'warm-amber',
      accent: 'burgundy', 
      gradient: 'from-amber-500 to-rose-600'
    },
    suggestedQuestions: [
      "How do I repair trust after a fight?",
      "My partner and I can't communicate",
      "Should we stay together or part ways?"
    ],
    features: [
      { title: 'Real Marriage Advice', description: 'From someone who tried (and learned)' },
      { title: 'Communication Skills', description: 'That actually work' },
      { title: 'Hard Truths', description: 'With compassion and humor' }
    ]
  }
};

// Detect which personality to use based on hostname
export const detectPersonality = () => {
  const hostname = window.location.hostname;
  
  if (hostname.startsWith('diplomat.') || hostname.includes('diplomat')) {
    return PERSONALITIES.diplomat;
  }
  
  if (hostname.startsWith('judgy.') || hostname.includes('judgy')) {
    return PERSONALITIES.judgy;
  }
  
  // Default to judgy for main domain or localhost
  return PERSONALITIES.judgy;
};

// Check if we're on the main hub (chooser page)
export const isHubPage = () => {
  const hostname = window.location.hostname;
  const path = window.location.pathname;
  
  // Main domain without subdomain, or explicit /choose path
  return (
    hostname === 'judgygptonline.com' ||
    hostname === 'www.judgygptonline.com' ||
    path === '/choose' ||
    path === '/'
  );
};

// Get the current personality ID for API calls
export const getCurrentPersonalityId = () => {
  const personality = detectPersonality();
  return personality.id;
};
