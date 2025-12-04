// Pre-loaded survival guide content for offline use
import { Guide } from './database';

export const SURVIVAL_GUIDES: Guide[] = [
  {
    id: 'first-aid-basics',
    title: 'First Aid Basics',
    category: 'Medical',
    description: 'Essential first aid procedures for common emergencies',
    priority: 'critical',
    icon: '🏥',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Assess the Situation',
        content: 'Check for danger to yourself and the victim. Ensure the area is safe before approaching.',
        warning: 'Do not put yourself in danger. If unsafe, call for professional help immediately.'
      },
      {
        stepNumber: 2,
        title: 'Check Responsiveness',
        content: 'Gently shake the person and ask loudly "Are you okay?" Check for normal breathing.',
        tips: ['Look for chest movement', 'Listen for breathing sounds', 'Feel for breath on your cheek']
      },
      {
        stepNumber: 3,
        title: 'Call for Help',
        content: 'If unresponsive or not breathing normally, call emergency services immediately (911 in US).',
        warning: 'Time is critical. Don\'t delay calling for help.'
      },
      {
        stepNumber: 4,
        title: 'Control Bleeding',
        content: 'Apply direct pressure to any bleeding wounds using a clean cloth. Maintain pressure for at least 10 minutes.',
        tips: ['Use gloves if available', 'Elevate the wound above heart level if possible', 'Do not remove embedded objects']
      },
      {
        stepNumber: 5,
        title: 'Monitor Vital Signs',
        content: 'Keep checking breathing and consciousness until help arrives. Keep the person warm and comfortable.',
        tips: ['Note any changes in condition', 'Keep talking to conscious victims', 'Do not give food or water']
      }
    ]
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & Escape',
    category: 'Fire',
    description: 'How to safely escape a fire and prevent fire hazards',
    priority: 'critical',
    icon: '🔥',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Alert Everyone',
        content: 'Immediately alert everyone in the building. Shout "FIRE!" and activate fire alarms if available.',
        warning: 'Every second counts. Do not gather belongings.'
      },
      {
        stepNumber: 2,
        title: 'Stay Low',
        content: 'Drop to hands and knees. Smoke and heat rise, so cleaner air is near the floor.',
        tips: ['Cover mouth with cloth if possible', 'Feel doors before opening - if hot, use alternate route']
      },
      {
        stepNumber: 3,
        title: 'Find Nearest Exit',
        content: 'Use the nearest safe exit. If primary route is blocked, use your secondary escape route.',
        warning: 'Never use elevators during a fire. Always use stairs.'
      },
      {
        stepNumber: 4,
        title: 'Close Doors Behind You',
        content: 'Close doors as you escape to slow fire spread. Do not lock them.',
        tips: ['Close but don\'t waste time locking doors', 'This helps contain the fire']
      },
      {
        stepNumber: 5,
        title: 'Get Out and Stay Out',
        content: 'Once outside, move away from the building. Go to your designated meeting point. Call 911.',
        warning: 'Never go back inside a burning building for any reason.'
      },
      {
        stepNumber: 6,
        title: 'If Trapped',
        content: 'Close door to room. Seal cracks with cloth. Signal for help from window. Stay low.',
        tips: ['Call 911 and give your location', 'Wave bright cloth from window', 'Stay calm and breathe slowly']
      }
    ]
  },
  {
    id: 'earthquake-safety',
    title: 'Earthquake Safety',
    category: 'Natural Disaster',
    description: 'What to do during and after an earthquake',
    priority: 'critical',
    icon: '🌍',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Drop, Cover, Hold On',
        content: 'DROP to your hands and knees. Take COVER under a sturdy desk or table. HOLD ON until shaking stops.',
        warning: 'Do not run outside during shaking. Falling debris is a major danger.'
      },
      {
        stepNumber: 2,
        title: 'If Indoors',
        content: 'Stay inside. Move away from windows, mirrors, and heavy objects that could fall.',
        tips: ['Protect your head and neck', 'If no table, crouch against interior wall', 'Stay away from doorways']
      },
      {
        stepNumber: 3,
        title: 'If Outdoors',
        content: 'Move to open area away from buildings, power lines, trees, and streetlights.',
        tips: ['Drop to ground to avoid being knocked over', 'Watch for falling debris']
      },
      {
        stepNumber: 4,
        title: 'If In Vehicle',
        content: 'Pull over safely, away from overpasses and power lines. Stay inside with seatbelt on.',
        warning: 'Do not stop under overpasses, bridges, or near buildings.'
      },
      {
        stepNumber: 5,
        title: 'After Shaking Stops',
        content: 'Check for injuries. Look for hazards like gas leaks, damaged wiring, or structural damage.',
        tips: ['Expect aftershocks', 'Turn off utilities if damaged', 'Use flashlight, not candles']
      },
      {
        stepNumber: 6,
        title: 'Evacuate If Necessary',
        content: 'If building is damaged or you smell gas, evacuate immediately. Take emergency kit if accessible.',
        warning: 'Do not use elevators. Watch for falling debris during evacuation.'
      }
    ]
  },
  {
    id: 'water-purification',
    title: 'Water Purification',
    category: 'Water',
    description: 'How to purify water for safe drinking',
    priority: 'important',
    icon: '💧',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Filter Large Debris',
        content: 'Strain water through clean cloth or coffee filter to remove large particles and sediment.',
        tips: ['Use multiple layers of cloth for better filtration', 'This is not enough to make water safe - continue to next steps']
      },
      {
        stepNumber: 2,
        title: 'Boiling Method (Most Reliable)',
        content: 'Bring water to rolling boil for at least 1 minute (3 minutes at high altitude). Let cool before drinking.',
        warning: 'Boiling kills bacteria, viruses, and parasites. This is the most reliable method.'
      },
      {
        stepNumber: 3,
        title: 'Chemical Treatment',
        content: 'If boiling impossible, use purification tablets or household bleach. Follow product instructions carefully.',
        tips: ['Regular bleach: 2 drops per liter, wait 30 min', 'Double if water is cloudy', 'Use unscented bleach only']
      },
      {
        stepNumber: 4,
        title: 'UV Light Treatment',
        content: 'If you have UV purifier, expose clear water to UV light per device instructions. Usually 60-90 seconds.',
        warning: 'Only works on clear water. Filter first if cloudy.'
      },
      {
        stepNumber: 5,
        title: 'Storage',
        content: 'Store purified water in clean, covered containers. Label with date. Use within 6 months.',
        tips: ['Use food-grade containers', 'Keep in cool, dark place', 'Rotate stock regularly']
      }
    ]
  },
  {
    id: 'flood-safety',
    title: 'Flood Safety',
    category: 'Natural Disaster',
    description: 'How to stay safe during and after flooding',
    priority: 'critical',
    icon: '🌊',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Move to Higher Ground',
        content: 'At first sign of flooding, move to higher ground immediately. Do not wait for official orders.',
        warning: 'Flash floods can occur in minutes. Six inches of moving water can knock you down.'
      },
      {
        stepNumber: 2,
        title: 'Avoid Floodwater',
        content: 'Never walk, swim, or drive through floodwater. Turn around, don\'t drown.',
        warning: 'Just 12 inches of water can carry away most vehicles. Floodwater may be contaminated or electrified.'
      },
      {
        stepNumber: 3,
        title: 'Stay Away from Power Lines',
        content: 'Keep away from downed power lines and electrical wires. Report them to authorities.',
        tips: ['Assume all wires are live', 'Stay at least 35 feet away']
      },
      {
        stepNumber: 4,
        title: 'Listen to Authorities',
        content: 'Monitor emergency broadcasts on battery radio. Follow evacuation orders immediately.',
        tips: ['Have multiple ways to receive alerts', 'Follow designated evacuation routes']
      },
      {
        stepNumber: 5,
        title: 'After the Flood',
        content: 'Return home only when authorities say it\'s safe. Document damage with photos for insurance.',
        warning: 'Check for structural damage before entering. Wear protective gear.'
      },
      {
        stepNumber: 6,
        title: 'Clean Up Safely',
        content: 'Throw out contaminated food and materials. Disinfect everything that got wet. Dry out building.',
        tips: ['Wear rubber boots and gloves', 'Use fans to dry', 'Watch for mold within 24-48 hours']
      }
    ]
  },
  {
    id: 'shelter-building',
    title: 'Emergency Shelter',
    category: 'Shelter',
    description: 'How to build emergency shelter in various conditions',
    priority: 'important',
    icon: '🏕️',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Choose Location',
        content: 'Find dry, flat ground away from water, dead trees, and animal paths. Consider wind direction.',
        tips: ['Look for natural windbreaks', 'Avoid low areas where cold air settles', 'Stay visible if rescue likely']
      },
      {
        stepNumber: 2,
        title: 'Insulation from Ground',
        content: 'Create barrier between you and ground using leaves, pine needles, or branches. Ground steals body heat.',
        warning: 'Ground insulation is critical. You lose more heat to cold ground than cold air.'
      },
      {
        stepNumber: 3,
        title: 'Build Frame',
        content: 'Use fallen branches to create A-frame or lean-to structure. Make it only big enough for your body.',
        tips: ['Smaller shelters are easier to heat with body warmth', 'Secure frame against wind']
      },
      {
        stepNumber: 4,
        title: 'Add Covering',
        content: 'Layer branches, leaves, bark, or evergreen boughs for waterproofing and insulation. Make thick layers.',
        tips: ['Start from bottom and overlap like shingles', 'Aim for 12+ inches of insulation', 'Leave small vent hole']
      },
      {
        stepNumber: 5,
        title: 'Create Entrance',
        content: 'Make entrance small and on downwind side. Create door with branches or pack.',
        tips: ['Door should be closeable', 'Small entrance retains heat better']
      },
      {
        stepNumber: 6,
        title: 'Improve Over Time',
        content: 'Add more insulation, reflector wall near entrance, or windbreak as time allows.',
        tips: ['Reflect heat from fire with rock wall', 'Add more ground insulation', 'Mark shelter location if leaving']
      }
    ]
  },
  // Medical Emergencies
  {
    id: 'cpr-guide',
    title: 'CPR & Choking Response',
    category: 'Medical Emergencies',
    description: 'Cardiopulmonary resuscitation and Heimlich maneuver',
    priority: 'critical',
    icon: '❤️',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Check Responsiveness',
        content: 'Tap shoulders and shout. Check for normal breathing (not gasping).',
        warning: 'If unresponsive and not breathing normally, start CPR immediately.'
      },
      {
        stepNumber: 2,
        title: 'Call Emergency Services',
        content: 'Call 911 or have someone else call. Put phone on speaker.',
        tips: ['Get AED if available', 'Don\'t leave victim alone unless absolutely necessary']
      },
      {
        stepNumber: 3,
        title: 'Hand Position',
        content: 'Place heel of hand on center of chest between nipples. Place other hand on top, interlace fingers.',
        tips: ['Keep arms straight', 'Position shoulders directly over hands']
      },
      {
        stepNumber: 4,
        title: 'Chest Compressions',
        content: 'Push hard and fast, at least 2 inches deep, 100-120 compressions per minute. Count out loud.',
        warning: 'Don\'t stop compressions. If tired, switch with another person.'
      },
      {
        stepNumber: 5,
        title: 'Rescue Breaths (if trained)',
        content: 'After 30 compressions, give 2 rescue breaths. Tilt head back, lift chin, pinch nose, seal mouth.',
        tips: ['Each breath should make chest rise', 'Continue 30:2 ratio until help arrives']
      },
      {
        stepNumber: 6,
        title: 'Choking (Heimlich)',
        content: 'Stand behind person, make fist above navel, grab fist with other hand. Give quick upward thrusts.',
        warning: 'If unconscious, lower to ground and begin CPR.'
      }
    ]
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding Control',
    category: 'Medical Emergencies',
    description: 'Stop life-threatening bleeding',
    priority: 'critical',
    icon: '🩸',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Ensure Safety',
        content: 'Protect yourself with gloves or plastic bags. Don\'t risk exposure to blood.',
        warning: 'Your safety comes first. Use barrier protection.'
      },
      {
        stepNumber: 2,
        title: 'Apply Direct Pressure',
        content: 'Place clean cloth directly on wound and press firmly with both hands. Don\'t peek.',
        tips: ['Use gauze, towel, or shirt', 'Maintain constant pressure for 10+ minutes']
      },
      {
        stepNumber: 3,
        title: 'Add More Dressings',
        content: 'If blood soaks through, add more cloth on top. Don\'t remove original dressing.',
        warning: 'Removing dressings disrupts clotting. Keep adding layers.'
      },
      {
        stepNumber: 4,
        title: 'Use Pressure Points',
        content: 'If direct pressure insufficient, press on artery between wound and heart (brachial or femoral).',
        tips: ['Brachial: inside upper arm', 'Femoral: groin crease']
      },
      {
        stepNumber: 5,
        title: 'Tourniquet (Life-Threatening Only)',
        content: 'If limb bleeding won\'t stop and life-threatening, apply tourniquet 2-3 inches above wound. Note time.',
        warning: 'Last resort only. May cause limb loss. Note exact time applied.'
      }
    ]
  },
  {
    id: 'burn-treatment',
    title: 'Burn Treatment',
    category: 'Medical Emergencies',
    description: 'First aid for burns of varying severity',
    priority: 'important',
    icon: '🔥',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Stop the Burning',
        content: 'Remove from heat source. Remove hot/burned clothing unless stuck to skin. Remove jewelry.',
        warning: 'Don\'t pull off clothing stuck to skin. Cut around it.'
      },
      {
        stepNumber: 2,
        title: 'Cool the Burn',
        content: 'Run cool (not ice cold) water over burn for 10-20 minutes. Or apply clean, cool, wet compress.',
        tips: ['Don\'t use ice - can cause more damage', 'Cool water reduces pain and swelling']
      },
      {
        stepNumber: 3,
        title: 'Assess Severity',
        content: '1st degree (red, painful). 2nd degree (blisters). 3rd degree (white/charred, may not hurt).',
        warning: '3rd degree burns require immediate hospital care. Cover and transport.'
      },
      {
        stepNumber: 4,
        title: 'Cover Burn',
        content: 'Cover with sterile, non-stick bandage or clean cloth. Don\'t use fluffy cotton.',
        tips: ['Don\'t pop blisters', 'Change dressing daily', 'Watch for infection signs']
      },
      {
        stepNumber: 5,
        title: 'Pain Management',
        content: 'Give over-the-counter pain reliever. Keep burn elevated above heart level if possible.',
        warning: 'Seek medical care for: burns on face/hands/feet/genitals, large burns, chemical/electrical burns.'
      }
    ]
  },
  // Natural Disasters
  {
    id: 'tornado-safety',
    title: 'Tornado Safety',
    category: 'Natural Disasters',
    description: 'Survive a tornado and aftermath',
    priority: 'critical',
    icon: '🌪️',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Recognize Warning Signs',
        content: 'Dark greenish sky, large hail, loud roar (like freight train), rotating cloud base.',
        warning: 'Tornado can form in minutes. Don\'t wait for siren.'
      },
      {
        stepNumber: 2,
        title: 'Get to Safe Space',
        content: 'Go to basement or lowest floor interior room (bathroom, closet, hallway). Get under sturdy furniture.',
        tips: ['Avoid windows', 'Put as many walls between you and outside as possible', 'Avoid large rooms']
      },
      {
        stepNumber: 3,
        title: 'Protect Your Body',
        content: 'Crouch low, hands over head and neck. Use cushions, mattress, or blankets for protection.',
        warning: 'Flying debris is the biggest killer. Protect head and vital organs.'
      },
      {
        stepNumber: 4,
        title: 'If In Vehicle',
        content: 'DO NOT try to outrun tornado. Get out and lie flat in ditch or low area. Cover head.',
        warning: 'Never shelter under overpass - creates wind tunnel effect.'
      },
      {
        stepNumber: 5,
        title: 'After Tornado',
        content: 'Stay alert for more tornadoes. Check for injuries. Turn off utilities if damaged. Watch for hazards.',
        tips: ['Use flashlight, not candles', 'Avoid downed power lines', 'Document damage']
      }
    ]
  },
  {
    id: 'hurricane-prep',
    title: 'Hurricane Preparedness',
    category: 'Natural Disasters',
    description: 'Prepare for and survive a hurricane',
    priority: 'critical',
    icon: '🌀',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare Emergency Kit',
        content: '7 days water (1 gal/person/day), non-perishable food, medications, documents, cash, battery radio.',
        tips: ['Waterproof containers for documents', 'Full tank of gas', 'Charge all devices']
      },
      {
        stepNumber: 2,
        title: 'Secure Property',
        content: 'Board windows, secure outdoor items, trim trees, clear drains. Turn fridge to coldest setting.',
        warning: 'Do this BEFORE hurricane watch issued. Don\'t wait for warning.'
      },
      {
        stepNumber: 3,
        title: 'Know Evacuation Route',
        content: 'Identify evacuation routes and shelters. Plan multiple routes. Know when to leave.',
        tips: ['Evacuate if ordered', 'Leave early to avoid traffic', 'Bring emergency kit']
      },
      {
        stepNumber: 4,
        title: 'During Hurricane',
        content: 'Stay indoors in interior room away from windows. Monitor weather. Stay away from floodwater.',
        warning: 'Eye of storm brings calm - it\'s NOT over. More wind comes from opposite direction.'
      },
      {
        stepNumber: 5,
        title: 'After Hurricane',
        content: 'Wait for all-clear. Avoid floodwater and downed lines. Document damage. Only return when safe.',
        tips: ['Use generator outside only', 'Check food safety', 'Beware of wildlife displaced by storm']
      }
    ]
  },
  {
    id: 'wildfire-escape',
    title: 'Wildfire Evacuation',
    category: 'Natural Disasters',
    description: 'Escape from wildfires safely',
    priority: 'critical',
    icon: '🔥',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Monitor Conditions',
        content: 'Watch for smoke, register for alerts, monitor air quality. Have go-bag ready.',
        tips: ['Know evacuation routes', 'Keep car fueled', 'Have N95 masks ready']
      },
      {
        stepNumber: 2,
        title: 'Prepare to Evacuate',
        content: 'Close windows/vents, turn on lights (visibility for firefighters), move combustibles away from house.',
        warning: 'Don\'t wait for evacuation order if you feel unsafe. Leave early.'
      },
      {
        stepNumber: 3,
        title: 'Evacuation',
        content: 'Leave immediately when ordered. Take pets. Use headlights. Roll up windows. Have masks available.',
        tips: ['Don\'t go back', 'Avoid canyon roads', 'Stay on marked evacuation routes']
      },
      {
        stepNumber: 4,
        title: 'If Trapped',
        content: 'Stay in car, park away from vegetation, close windows/vents, lie on floor covered with blanket.',
        warning: 'Call 911 and give location. Stay in vehicle - you\'re more visible to rescuers.'
      },
      {
        stepNumber: 5,
        title: 'After Fire',
        content: 'Return only when authorities allow. Watch for ash pits, smoldering debris, damaged trees.',
        tips: ['Wear protective gear', 'Document damage', 'Wet down debris before handling']
      }
    ]
  },
  // Urban Survival
  {
    id: 'power-outage',
    title: 'Extended Power Outage',
    category: 'Urban Survival',
    description: 'Survive days without electricity',
    priority: 'important',
    icon: '⚡',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Immediate Actions',
        content: 'Turn off major appliances to prevent damage from power surge. Keep fridge/freezer closed.',
        tips: ['Fridge stays cold 4 hours', 'Full freezer: 48 hours', 'Half full: 24 hours']
      },
      {
        stepNumber: 2,
        title: 'Alternative Power',
        content: 'Use battery radio, flashlights (not candles). Charge devices in car. Use generator safely outside.',
        warning: 'NEVER use generator indoors or in garage - carbon monoxide is deadly.'
      },
      {
        stepNumber: 3,
        title: 'Keep Warm/Cool',
        content: 'Layer clothing, close off unused rooms, use blankets. For heat: avoid carbon monoxide sources.',
        tips: ['One room for family', 'Weatherstrip doors', 'Battery-powered fans for summer']
      },
      {
        stepNumber: 4,
        title: 'Food Safety',
        content: 'Use perishables first, then fridge items, then freezer. Throw out if above 40°F for 2+ hours.',
        warning: 'When in doubt, throw it out. Foodborne illness is serious.'
      },
      {
        stepNumber: 5,
        title: 'Water Supply',
        content: 'If water treatment affected, boil water. Fill bathtub for non-drinking uses.',
        tips: ['Store 1 gallon per person per day', 'Know location of public water distribution']
      }
    ]
  },
  {
    id: 'active-shooter',
    title: 'Active Threat Response',
    category: 'Urban Survival',
    description: 'Run, Hide, Fight protocol',
    priority: 'critical',
    icon: '🚨',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'RUN - Evacuate If Possible',
        content: 'Have escape route in mind. Leave belongings. Help others if possible. Prevent others from entering.',
        warning: 'Trust your instincts. Leave immediately if safe path available.'
      },
      {
        stepNumber: 2,
        title: 'HIDE - If Escape Not Possible',
        content: 'Hide in area out of view. Lock/block door. Silence phone. Turn off lights. Stay quiet.',
        tips: ['Hide behind large objects', 'Spread out if with others', 'Don\'t trap yourself']
      },
      {
        stepNumber: 3,
        title: 'Call 911 When Safe',
        content: 'Give location, number of people, injuries, suspect description. Stay on line if possible.',
        warning: 'If can\'t speak, leave line open so dispatcher can hear.'
      },
      {
        stepNumber: 4,
        title: 'FIGHT - Last Resort Only',
        content: 'Only when life in imminent danger. Act with physical aggression. Use improvised weapons. Commit fully.',
        warning: 'Fight as last resort. Use any objects: fire extinguisher, scissors, chairs.'
      },
      {
        stepNumber: 5,
        title: 'When Police Arrive',
        content: 'Keep hands visible and empty. Follow commands. Don\'t point or scream. Expect to be treated as suspect initially.',
        tips: ['No sudden movements', 'Don\'t grab officers', 'Provide information calmly']
      }
    ]
  },
  {
    id: 'gas-leak',
    title: 'Gas Leak Emergency',
    category: 'Urban Survival',
    description: 'Detect and respond to gas leaks',
    priority: 'critical',
    icon: '💨',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Recognize Signs',
        content: 'Rotten egg smell, hissing sound, dead plants, white cloud, dust blowing near gas line.',
        warning: 'Natural gas is odorless - sulfur smell is added for detection.'
      },
      {
        stepNumber: 2,
        title: 'Evacuate Immediately',
        content: 'Leave building quickly. Don\'t turn lights on/off. Don\'t use phones inside. Leave door open.',
        warning: 'ANY spark can ignite gas. No phones, lights, appliances, or garage doors.'
      },
      {
        stepNumber: 3,
        title: 'Warn Others',
        content: 'Alert neighbors. Move to safe distance upwind. Account for all occupants.',
        tips: ['Go to designated meeting point', 'Stay at least 100 feet away']
      },
      {
        stepNumber: 4,
        title: 'Call for Help',
        content: 'From safe location, call 911 and gas company emergency number. Don\'t return until cleared.',
        warning: 'Don\'t investigate yourself. Let professionals handle it.'
      },
      {
        stepNumber: 5,
        title: 'Prevention',
        content: 'Install gas detectors. Know shutoff location. Annual professional inspections. Never use gas to heat home.',
        tips: ['Shutoff valve near meter', 'Turn clockwise to close', 'Keep wrench nearby']
      }
    ]
  },
  // Wilderness Skills
  {
    id: 'finding-water',
    title: 'Finding Water Sources',
    category: 'Wilderness Skills',
    description: 'Locate and collect water in wilderness',
    priority: 'critical',
    icon: '💧',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Look for Water Signs',
        content: 'Follow animal tracks, bird flight patterns at dawn/dusk, green vegetation, sound of running water.',
        tips: ['Bees fly within 3-4 miles of water', 'Ants make trails to water', 'Flies within 100 yards of water']
      },
      {
        stepNumber: 2,
        title: 'Check Low Areas',
        content: 'Water flows downhill. Check valleys, base of cliffs, under rocks in dry streambeds.',
        warning: 'Never drink unpurified water unless desperate. Even clear water may be contaminated.'
      },
      {
        stepNumber: 3,
        title: 'Collect Morning Dew',
        content: 'Tie cloth around ankles, walk through grass at dawn. Wring out into container. Repeat.',
        tips: ['Can collect 1 liter per hour in good conditions', 'Use absorbent cloth']
      },
      {
        stepNumber: 4,
        title: 'Rainwater Collection',
        content: 'Use tarps, leaves, containers. Direct into clean vessel. Cleanest water source.',
        tips: ['Let first rain wash debris', 'Rainwater generally safe to drink', 'Store in clean containers']
      },
      {
        stepNumber: 5,
        title: 'Solar Still',
        content: 'Dig hole, place container in center, cover with plastic, place rock in center, collect condensation.',
        tips: ['Slow but reliable', 'Add vegetation for more moisture', 'Check every few hours']
      },
      {
        stepNumber: 6,
        title: 'Always Purify',
        content: 'Boil for 1 minute, use purification tablets, or filter. Prevent illness in survival situation.',
        warning: 'Diarrhea and vomiting in survival = life threatening. Always purify if possible.'
      }
    ]
  },
  {
    id: 'fire-starting',
    title: 'Fire Starting Techniques',
    category: 'Wilderness Skills',
    description: 'Start fire without matches',
    priority: 'important',
    icon: '🔥',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Gather Materials',
        content: 'Tinder (dry grass, bark, lint), kindling (twigs), fuel (larger sticks/logs). Keep dry.',
        tips: ['Tinder: catches spark', 'Kindling: pencil to thumb thickness', 'Fuel: arm thickness']
      },
      {
        stepNumber: 2,
        title: 'Build Fire Structure',
        content: 'Teepee or log cabin arrangement. Place tinder in center, kindling around, fuel on outside.',
        warning: 'Clear area to bare soil. Keep water nearby. Know local fire regulations.'
      },
      {
        stepNumber: 3,
        title: 'Friction Method',
        content: 'Bow drill or hand drill. Spin spindle in notched fireboard to create ember in tinder bundle.',
        tips: ['Dry softwood works best', 'Practice before emergency', 'Protect ember from wind']
      },
      {
        stepNumber: 4,
        title: 'Flint and Steel',
        content: 'Strike steel against flint at angle over tinder bundle. Char cloth helps catch spark.',
        tips: ['Strike forcefully', 'Have tinder ready', 'Multiple strikes may be needed']
      },
      {
        stepNumber: 5,
        title: 'Transfer and Build',
        content: 'Transfer ember to tinder bundle. Blow gently. Add kindling when flaming. Gradually add larger fuel.',
        warning: 'Don\'t smother new fire. Add fuel gradually. Never leave fire unattended.'
      },
      {
        stepNumber: 6,
        title: 'Maintain Fire',
        content: 'Keep dry fuel ready. Protect from wind/rain. Maintain proper size. Fully extinguish when done.',
        tips: ['Douse with water', 'Stir ashes', 'Feel for heat', 'Repeat until completely cold']
      }
    ]
  },
  {
    id: 'navigation-without-compass',
    title: 'Natural Navigation',
    category: 'Wilderness Skills',
    description: 'Find direction without compass',
    priority: 'important',
    icon: '🧭',
    lastUpdated: new Date(),
    steps: [
      {
        stepNumber: 1,
        title: 'Sun Method',
        content: 'Sun rises in East, sets in West. At noon (Northern hemisphere), sun is due South.',
        tips: ['Watch sun position hourly', 'Use shadow to mark direction', 'More accurate at equinoxes']
      },
      {
        stepNumber: 2,
        title: 'Shadow Stick Method',
        content: 'Plant stick upright. Mark shadow tip. Wait 15 min, mark new shadow tip. Line = East-West.',
        tips: ['First mark = West', 'Second mark = East', 'Works anywhere on Earth']
      },
      {
        stepNumber: 3,
        title: 'Stars (Northern Hemisphere)',
        content: 'Find North Star: Locate Big Dipper, follow two end stars of cup upward 5x distance to North Star.',
        tips: ['North Star always indicates true North', 'Other stars rotate around it']
      },
      {
        stepNumber: 4,
        title: 'Stars (Southern Hemisphere)',
        content: 'Southern Cross: Draw line through long axis, extend 4.5x. Point roughly toward South Pole.',
        warning: 'No South Pole star exists. Southern Cross method is approximation.'
      },
      {
        stepNumber: 5,
        title: 'Natural Indicators',
        content: 'Moss (Northern hemisphere): grows on North side in some climates. Tree rings: wider on South side.',
        warning: 'Natural indicators unreliable alone. Use multiple methods to confirm.'
      },
      {
        stepNumber: 6,
        title: 'Watch Method',
        content: 'Point hour hand at sun. Bisect angle between hour hand and 12. That line points South.',
        tips: ['Only works with analog watch', 'Use in Northern hemisphere', 'Adjust for daylight saving']
      }
    ]
  }
];
