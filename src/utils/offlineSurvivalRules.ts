/**
 * Offline rule-based survival assistant
 * Provides emergency responses when internet is unavailable
 */

interface SurvivalRule {
  keywords: string[];
  response: string;
}

const SURVIVAL_RULES: SurvivalRule[] = [
  // First Aid
  {
    keywords: ['bleed', 'bleeding', 'cut', 'wound'],
    response: '⚠️ BLEEDING:\n1. Apply direct pressure with clean cloth\n2. Elevate wound above heart if possible\n3. Maintain pressure for 10-15 minutes\n4. If severe, apply tourniquet only as last resort\n5. Seek medical help immediately'
  },
  {
    keywords: ['burn', 'burned', 'burning'],
    response: '🔥 BURN TREATMENT:\n1. Cool burn with cool (not ice cold) water for 10-20 minutes\n2. Remove jewelry/tight items before swelling\n3. Cover with sterile, non-stick bandage\n4. Do NOT apply ice, butter, or ointments\n5. Seek medical help for severe burns'
  },
  {
    keywords: ['cpr', 'cardiac', 'heart attack', 'not breathing'],
    response: '❤️ CPR BASICS:\n1. Call emergency services immediately\n2. Place hands center of chest\n3. Push hard and fast - 100-120 compressions/min\n4. Depth: 2 inches for adults\n5. Continue until help arrives or person breathes\nIf trained: 30 compressions, 2 rescue breaths'
  },
  {
    keywords: ['choke', 'choking', 'heimlich'],
    response: '🫁 CHOKING:\n1. Encourage coughing if they can\n2. If can\'t cough/speak: 5 back blows between shoulder blades\n3. Then 5 abdominal thrusts (Heimlich)\n4. Alternate until object dislodges\n5. Call emergency if unconscious'
  },
  {
    keywords: ['fracture', 'broken bone', 'sprain'],
    response: '🦴 FRACTURE/SPRAIN:\n1. Immobilize the injured area\n2. Apply ice wrapped in cloth (20 min on/off)\n3. Elevate above heart level\n4. Do NOT try to realign broken bones\n5. Seek medical attention'
  },
  
  // Fire Safety
  {
    keywords: ['fire', 'flames', 'smoke', 'escape'],
    response: '🔥 FIRE ESCAPE:\n1. Get low - crawl under smoke\n2. Feel doors before opening (if hot, use alternate exit)\n3. Close doors behind you to slow fire spread\n4. Never use elevators\n5. Once out, STAY OUT - call 911'
  },
  {
    keywords: ['fire extinguisher', 'put out fire', 'extinguish'],
    response: '🧯 FIRE EXTINGUISHER (PASS):\nP - Pull the pin\nA - Aim at base of fire\nS - Squeeze the handle\nS - Sweep side to side\nOnly fight small fires. If it spreads, evacuate immediately.'
  },
  
  // Water & Food
  {
    keywords: ['water', 'purify', 'purification', 'drink', 'clean water'],
    response: '💧 WATER PURIFICATION:\n1. Boil for 1 minute (3 min at high altitude)\n2. OR use water purification tablets\n3. OR filter through cloth + let settle 30 min\n4. Avoid stagnant water if possible\n5. In emergency: clear running water > murky water'
  },
  {
    keywords: ['food', 'eat', 'hungry', 'edible'],
    response: '🍎 FOOD SAFETY:\n1. Humans can survive 3 weeks without food (water is priority)\n2. Only eat plants you 100% recognize as safe\n3. Avoid mushrooms unless expert\n4. Cook all meat thoroughly\n5. Look for berries, nuts, roots (if you know them)'
  },
  
  // Shelter
  {
    keywords: ['shelter', 'cold', 'hypothermia', 'warmth'],
    response: '🏕️ EMERGENCY SHELTER:\n1. Find or create windbreak\n2. Insulate from ground (leaves, branches)\n3. Small shelter = warmer (conserve body heat)\n4. Stay dry - wet = hypothermia risk\n5. Layer: debris, plastic, more debris for insulation'
  },
  {
    keywords: ['hypothermia', 'freezing', 'too cold'],
    response: '❄️ HYPOTHERMIA:\n1. Move to shelter/warm area\n2. Remove wet clothing\n3. Warm center of body first (chest, neck, head)\n4. Warm drinks if conscious\n5. Seek medical help - can be fatal'
  },
  
  // Natural Disasters
  {
    keywords: ['earthquake', 'quake', 'shaking'],
    response: '🌍 EARTHQUAKE:\nDROP, COVER, HOLD ON\n1. Drop to hands and knees\n2. Cover head/neck under sturdy table\n3. Hold on until shaking stops\n4. If outside: move away from buildings\n5. After: Check for injuries, gas leaks, damage'
  },
  {
    keywords: ['flood', 'flooding', 'water rising'],
    response: '🌊 FLOOD SAFETY:\n1. Move to higher ground immediately\n2. Avoid walking/driving through flood water\n3. 6 inches of water = knock you down\n4. 1 foot of water = float a car\n5. Turn Around, Don\'t Drown - find alternate route'
  },
  {
    keywords: ['tornado', 'twister'],
    response: '🌪️ TORNADO:\n1. Go to lowest floor interior room\n2. No basement: bathroom/closet in center of building\n3. Get under sturdy furniture\n4. Protect head and neck with arms/blankets\n5. Stay away from windows'
  },
  
  // Signal & Rescue
  {
    keywords: ['signal', 'rescue', 'help', 'sos', 'lost'],
    response: '🆘 SIGNAL FOR RESCUE:\n1. Stay in one place (easier to find)\n2. Use SOS: 3 short, 3 long, 3 short signals (light/sound)\n3. Create large "X" or "SOS" visible from air\n4. Use mirror/reflective surface for signaling\n5. Make noise: whistle 3 times, pause, repeat'
  },
  
  // Default
  {
    keywords: ['help', 'emergency', 'what do i do'],
    response: '🚨 GENERAL EMERGENCY:\n1. Stay calm - assess the situation\n2. Call emergency services if possible (911 in US)\n3. Ensure your safety first\n4. Survival priorities: Shelter > Water > Food\n5. Ask specific questions for detailed help'
  }
];

/**
 * Get offline survival advice based on user message
 */
export const getOfflineSurvivalAdvice = (userMessage: string): string => {
  const messageLower = userMessage.toLowerCase();
  
  // Find matching rule based on keywords
  for (const rule of SURVIVAL_RULES) {
    for (const keyword of rule.keywords) {
      if (messageLower.includes(keyword)) {
        return rule.response;
      }
    }
  }
  
  // Default response if no match
  return `📱 OFFLINE MODE - Limited responses available.

Ask about:
• First Aid (bleeding, burns, CPR, choking, fractures)
• Fire Safety (escape, extinguisher)
• Water (purification, drinking)
• Shelter (building, hypothermia)
• Natural Disasters (earthquake, flood, tornado)
• Signaling for Rescue

For detailed guides, check the Survival Guides section.`;
};

/**
 * Quick prompt suggestions for emergency scenarios
 */
export const QUICK_PROMPTS = [
  {
    icon: '🩹',
    label: 'First Aid',
    prompt: 'How do I stop severe bleeding?'
  },
  {
    icon: '🔥',
    label: 'Fire Escape',
    prompt: 'How do I escape a building fire?'
  },
  {
    icon: '💧',
    label: 'Water',
    prompt: 'How do I purify water in an emergency?'
  },
  {
    icon: '🏕️',
    label: 'Shelter',
    prompt: 'How do I build emergency shelter?'
  },
  {
    icon: '🌍',
    label: 'Earthquake',
    prompt: 'What do I do during an earthquake?'
  },
  {
    icon: '🆘',
    label: 'SOS Signal',
    prompt: 'How do I signal for rescue?'
  }
];
