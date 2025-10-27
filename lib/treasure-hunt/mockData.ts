import { Region, Collectible, AlphaVenue, UserProgress } from './types';

// Preset regions for treasure hunt
export const REGIONS: Region[] = [
    {
        key: 'cbd',
        name: 'Sydney CBD',
        center: { lat: -33.8688, lon: 151.2093 },
        radiusM: 2000,
    },
    {
        key: 'inner-west',
        name: 'Inner West',
        center: { lat: -33.888, lon: 151.156 },
        radiusM: 2500,
    },
    {
        key: 'north-shore',
        name: 'North Shore',
        center: { lat: -33.804, lon: 151.183 },
        radiusM: 3000,
    },
];

// Sample verses and reflection prompts
export const VERSES = [
    {
        ref: "John 3:16",
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    },
    {
        ref: "Psalm 23:1",
        text: "The Lord is my shepherd, I lack nothing.",
    },
    {
        ref: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    },
    {
        ref: "Philippians 4:13",
        text: "I can do all this through him who gives me strength.",
    },
    {
        ref: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    },
    {
        ref: "Matthew 5:16",
        text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",
    },
    {
        ref: "1 Corinthians 13:4",
        text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
    },
    {
        ref: "Proverbs 3:5-6",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    },
];

// Topic-specific reflection prompts for Alpha Youth Life Essentials themes
export const REFLECTION_PROMPTS_BY_THEME: Record<string, string[]> = {
    'Fame': [
        "When you imagine success, whose approval are you really chasing? Followers? Friends? Family? Or something deeper?",
        "If all your social media disappeared tomorrow, who would you be? What would give you significance?",
        "Have you ever felt 'famous' in a small way but still empty inside? What was missing?",
        "What if true significance isn't about being known BY many people, but being fully known BY someone who truly loves you?"
    ],
    'Labels': [
        "What labels do people stick on you? (Smart, popular, quiet, weird, athlete, nerd...) Which ones hurt most?",
        "What labels do you put on yourself? Are they helping you or holding you back?",
        "If God looked at you right now, what do you think He would call you? (Hint: try 'beloved', 'chosen', 'mine')",
        "What would it feel like to shed the labels that don't serve you and embrace an identity that can't be taken away?"
    ],
    'Stress': [
        "What's stressing you out most right now? School? Relationships? Your future? Family? Something else?",
        "How do you usually cope when stress hits? Does it actually help, or just numb the pain temporarily?",
        "What if your stress is actually revealing what you care about most deeply? What's it showing you?",
        "Have you ever experienced peace that doesn't make logical sense—calm in the middle of chaos? Where do you think that comes from?"
    ],
    'Originals': [
        "When do you feel most like yourself? When do you feel most fake?",
        "What parts of yourself do you hide because you're afraid people won't accept the real you?",
        "If you knew you were designed on purpose, for a purpose, by Someone who loves you—would that change how you see yourself?",
        "What would it look like to stop comparing your Chapter 1 to everyone else's highlight reel and just be YOU?"
    ],
    'Ghosting': [
        "Have you ever been ghosted? How did it feel to be left without explanation or closure?",
        "Have you ever ghosted someone? Why did you do it? What were you avoiding?",
        "Why is it so hard to have honest, difficult conversations? What are we really afraid of?",
        "Jesus promises to never leave you or ghost you—ever. What would relationships look like if we showed that kind of faithfulness to each other?"
    ],
    'Future': [
        "When you think about your future, what emotion comes up? Excitement? Anxiety? Confusion? Hope?",
        "What are you most afraid will happen in your future? What are you most hoping for?",
        "Do you feel like your future is in your control, or does it feel like everything's uncertain and out of your hands?",
        "What if Someone who loves you already knows your future and promises it's full of hope—not perfection, but purpose? How would that change today?"
    ],
    'Good & Evil': [
        "Do you believe in absolute right and wrong, or do you think it's all relative? Why?",
        "When have you felt the battle between good and evil in your own heart? What did you choose?",
        "Why is it so hard to do what we know is right sometimes? What gets in the way?",
        "If everyone has done wrong things (and we have), how do we become good? Can we fix ourselves, or do we need help from outside?"
    ],
    'Tribes': [
        "Who's your tribe? Who are the people you can be fully yourself around?",
        "Have you ever felt lonely even when surrounded by people? What makes real connection different from just being around others?",
        "What does healthy community look like? How do you know if your tribe is actually good for you?",
        "What if you were designed to belong to a tribe that doesn't just accept you as you are, but helps you become who you're meant to be?"
    ]
};

// Legacy generic prompts (kept for backward compatibility)
export const REFLECTION_PROMPTS = [
    "How does this speak to your current situation?",
    "What does this teach you about purpose and meaning?",
    "How can you apply this in your daily life?",
    "What questions does this raise for you?",
    "How does this relate to your relationships with others?",
    "What does this teach you about faith?",
    "How can you share this with someone this week?",
    "What does this reveal about God's love?",
];

// Collectible cards that users earn
export const COLLECTIBLES: Collectible[] = [
    {
        id: 'love',
        name: 'Love',
        color: '#FF6B6B',
        thumbUrl: '/collectibles/love.png',
        description: 'God\'s unconditional love',
    },
    {
        id: 'peace',
        name: 'Peace',
        color: '#4ECDC4',
        thumbUrl: '/collectibles/peace.png',
        description: 'Peace that surpasses understanding',
    },
    {
        id: 'joy',
        name: 'Joy',
        color: '#FFD93D',
        thumbUrl: '/collectibles/joy.png',
        description: 'Joy in all circumstances',
    },
    {
        id: 'hope',
        name: 'Hope',
        color: '#6BCF7F',
        thumbUrl: '/collectibles/hope.png',
        description: 'Hope for the future',
    },
    {
        id: 'faith',
        name: 'Faith',
        color: '#4D96FF',
        thumbUrl: '/collectibles/faith.png',
        description: 'Faith to move mountains',
    },
    {
        id: 'wisdom',
        name: 'Wisdom',
        color: '#9775FA',
        thumbUrl: '/collectibles/wisdom.png',
        description: 'Wisdom from above',
    },
    {
        id: 'strength',
        name: 'Strength',
        color: '#F06292',
        thumbUrl: '/collectibles/strength.png',
        description: 'Strength in weakness',
    },
    {
        id: 'grace',
        name: 'Grace',
        color: '#FFB74D',
        thumbUrl: '/collectibles/grace.png',
        description: 'Amazing grace',
    },
];

// Sample Alpha venues for completion CTA
export const ALPHA_VENUES: AlphaVenue[] = [
    {
        id: 'hillsong-city',
        name: 'Hillsong City Campus',
        lat: -33.8688,
        lon: 151.2093,
        address: '88 George St, Sydney NSW 2000',
        startTimes: ['7:00 PM Tuesdays', '7:30 PM Wednesdays'],
        description: 'Join us for Alpha - a series exploring the Christian faith in a relaxed setting.',
    },
    {
        id: 'c3-pyrmont',
        name: 'C3 Church Pyrmont',
        lat: -33.8688,
        lon: 151.1957,
        address: '58 Pirrama Rd, Pyrmont NSW 2009',
        startTimes: ['7:00 PM Thursdays'],
        description: 'Discover faith, friendship and the meaning of life through Alpha.',
    },
    {
        id: 'st-andrews-cathedral',
        name: 'St Andrew\'s Cathedral',
        lat: -33.8715,
        lon: 151.2067,
        address: 'Sydney Square, Sydney NSW 2000',
        startTimes: ['6:30 PM Wednesdays'],
        description: 'Alpha course exploring life\'s big questions in the heart of Sydney.',
    },
];

// Spot titles and themes - Alpha Youth Life Essentials Series
export const SPOT_THEMES = [
    'Fame',
    'Labels',
    'Stress',
    'Originals',
    'Ghosting',
    'Future',
    'Good & Evil',
    'Tribes',
];

// Video URLs for each theme - from Alpha Life Essentials series
// Source: https://alphaone.io/life-essentials
export const SPOT_VIDEOS: Record<string, string> = {
    'Fame': 'https://vimeo.com/808208490',          // How Ridiculous
    'Labels': 'https://vimeo.com/808220378',        // Twice Blessed
    'Stress': 'https://vimeo.com/731343973',        // Ria Panditha
    'Originals': 'https://vimeo.com/731374634',     // Nicola Olyslagers
    'Ghosting': 'https://vimeo.com/732898870',      // Adam Przytula
    'Future': 'https://vimeo.com/808215003',        // How Ridiculous
    'Good & Evil': 'https://vimeo.com/732842667',   // Isaiah Simmons
    'Tribes': 'https://vimeo.com/808212945',        // Sam Thompson
};

// Historical and cultural information for each spot theme - Alpha Youth Life Essentials Series
export const SPOT_HISTORIES = [
    {
        theme: 'Fame',
        title: 'The Spotlight Square',
        history: 'This plaza has been Sydney\'s unofficial performance hub since the 1920s. Street performers, aspiring musicians, and artists have used this spot to chase their dreams of recognition. Many famous Australian entertainers began their careers here, busking for coins and hoping someone would notice their talent.',
        culturalSignificance: 'The square represents the universal human desire to be seen and valued. In the social media age, this historic performance space reminds us that the hunger for recognition isn\'t new—but the platforms have changed.',
        interestingFact: 'A famous incident in 1978 saw a young musician perform here for 8 hours straight. No one paid attention—until years later when he became an international star. He returned to leave a plaque: "Fame is fleeting, impact is forever."',
        connections: 'Jesus spoke about seeking praise from people versus seeking God\'s approval. True significance isn\'t found in how many people know your name, but in knowing whose you are and living with purpose beyond the spotlight.'
    },
    {
        theme: 'Labels',
        title: 'The Identity Wall',
        history: 'This brick wall dates back to 1890 and once displayed colonial-era trade signs labeling businesses and social classes. In the 1960s, activists covered it with protest posters challenging societal labels. Today, it stands as a reminder of how labels—both imposed and chosen—shape our sense of self.',
        culturalSignificance: 'Throughout history, this wall has reflected society\'s tendency to categorize and label people. From "working class" to "bohemian" to modern identity markers, it shows how labels evolve but the human need to define ourselves remains constant.',
        interestingFact: 'During the 1980s punk movement, young people would write their "real" names beside their given names on this wall, claiming the right to self-definition. The tradition continues with visitors adding sticky notes about labels they\'re shedding.',
        connections: 'Scripture reminds us that our true identity comes from being created in God\'s image. Labels from society, family, or even ourselves don\'t define us—God calls us "chosen," "beloved," and "His own." That\'s the label that matters most.'
    },
    {
        theme: 'Stress',
        title: 'The Breathing Room',
        history: 'During the 1918 Spanish Flu pandemic and later the Great Depression, this sheltered courtyard became an unofficial "recovery space" where exhausted workers would pause. City planners preserved it in the 1950s, recognizing the need for urban calm amidst growing city stress.',
        culturalSignificance: 'Mental health advocates in the 1970s turned this into Sydney\'s first public "stress-free zone," where worried residents could sit without judgment. The space symbolizes the timeless need to acknowledge and address life\'s pressures.',
        interestingFact: 'Recent studies found that sitting in this courtyard for just 10 minutes measurably reduces stress hormones. Something about the design—the acoustics, the airflow, the light—creates a physiological calming effect.',
        connections: 'Jesus invites the stressed and weary to find rest in Him (Matthew 11:28). Paul writes that God\'s power is made perfect in weakness—when we\'re stressed and struggling, that\'s when we can experience divine strength beyond our own. Our weakness reveals God\'s strength.'
    },
    {
        theme: 'Originals',
        title: 'The Maker\'s Market',
        history: 'Established in 1856, this was Sydney\'s first artisan market where craftspeople sold handmade, original goods. No mass production—only unique, one-of-a-kind creations. The market became a symbol of authenticity in an increasingly industrialized world.',
        culturalSignificance: 'The phrase "Accept No Copies" was the market\'s unofficial motto. In a world of conformity and mass production, this space celebrated individuality and original expression. Each item told the story of its maker\'s unique vision.',
        interestingFact: 'A tradition holds that young apprentices would present their first original work here to receive their mentor\'s blessing. The ceremony symbolized their transition from imitator to creator, from copy to original.',
        connections: 'Psalm 139 celebrates how God knit each person together uniquely in the womb. You are God\'s original creation—not a copy, not a mistake. Embracing your authentic self means accepting how God designed you, without comparing yourself to others\' highlight reels.'
    },
    {
        theme: 'Ghosting',
        title: 'The Vanishing Point',
        history: 'This transit station dates to 1885 when it served as a major departure point. Families would say goodbye here—some farewells were temporary, but many were permanent as people disappeared into new lives overseas, leaving loved ones without word for years or decades.',
        culturalSignificance: 'The station became associated with the pain of sudden absence and unresolved goodbyes. Letters would arrive addressed to people who\'d "vanished" without explanation. The emotional cost of disappearing—whether forced or chosen—resonates through history.',
        interestingFact: 'A memorial bench installed in 1963 bears names of people who left through this station and were never heard from again. Families added their names hoping for reunion, creating an unintentional monument to the pain of being left without closure.',
        connections: 'Scripture values honest communication and reconciliation. "Ghosting" might be modern terminology, but the hurt of abandonment is ancient. Jesus never ghosts us—He promises to never leave or forsake us. We\'re called to show that same faithfulness in our relationships.'
    },
    {
        theme: 'Future',
        title: 'The Forward Observatory',
        history: 'Built in 1874, this site housed Sydney\'s first weather observatory, helping people predict and prepare for what was coming. The building represented humanity\'s desire to see beyond the present moment and make wise decisions about the future.',
        culturalSignificance: 'Citizens would gather here during uncertain times—economic crashes, approaching storms, wartime—seeking information about what lay ahead. The observatory became a symbol of hope that the future, while unknown, doesn\'t have to be feared if we prepare wisely.',
        interestingFact: 'During WWII, an astronomer working here kept a journal titled "Beyond Tomorrow." He wrote daily entries imagining a peaceful future, reminding himself and others that present darkness doesn\'t determine future outcomes. That journal inspired thousands.',
        connections: 'Jeremiah 29:11 reminds us that God has plans to give us hope and a future. While we can\'t predict every detail, we can trust the One who holds tomorrow. Living with confidence about the future means trusting God\'s character and promises, taking wise risks guided by faith.'
    },
    {
        theme: 'Good & Evil',
        title: 'The Justice Steps',
        history: 'These sandstone steps led to Sydney\'s first courthouse, built in 1820. Every day, people climbed these steps seeking justice—some guilty, some innocent, all facing judgment. The worn stone bears witness to centuries of moral decisions and the eternal tension between right and wrong.',
        culturalSignificance: 'The steps symbolize the upward struggle toward justice and morality. Aboriginal elders would sit on these steps teaching young people about moral choices. Later, civil rights activists stood here demanding justice. The space represents humanity\'s universal moral consciousness.',
        interestingFact: 'A tradition emerged where people making difficult ethical decisions would walk up and down these steps while contemplating. The physical ascent symbolized the moral "high ground" they were seeking. Many report finding clarity during these walks.',
        connections: 'Romans 3:23 reminds us that all have sinned and fallen short of God\'s glory. The battle between good and evil isn\'t just "out there"—it\'s within each human heart. Only through God\'s transforming grace can we choose good over evil, light over darkness.'
    },
    {
        theme: 'Tribes',
        title: 'The Gathering Ground',
        history: 'For thousands of years before European settlement, this was a meeting place for Indigenous tribes who would gather for ceremony, trade, and relationship-building. Post-colonization, it became a community hub where immigrant groups established cultural associations, creating new "tribes" of belonging.',
        culturalSignificance: 'The ground represents humanity\'s fundamental need for community and belonging. Every generation has gathered here seeking connection—from ancient tribal ceremonies to modern community groups. We are hardwired for tribe, for people who know us and have our backs.',
        interestingFact: 'An anthropologist studying the site in 1925 noted that every culture that gathered here had the same ritual: sharing food together as a sign of welcome and acceptance. From Indigenous corroborees to immigrant potlucks, breaking bread created belonging.',
        connections: 'Ecclesiastes 4:9-10 teaches that two are better than one—if one falls, the other lifts them up. The early church thrived as a tribe of believers who shared life together. God designed us for community, and finding your tribe means finding people who point you toward Him and walk alongside you in faith.'
    }
];

// Mock data for Alphi's journey - a complete treasure hunt experience
export const ALPHI_JOURNEY: UserProgress = {
    seed: 'alphi-demo-2024',
    regionKey: 'cbd',
    completedSpotIds: ['spot-1', 'spot-2', 'spot-3', 'spot-4', 'spot-5', 'spot-6', 'spot-7', 'spot-8'],
    collectibles: ['love', 'peace', 'joy', 'hope', 'faith', 'wisdom', 'strength', 'grace'],
    reflections: [
        {
            spotId: 'spot-1',
            text: 'Standing at the Sanctuary of Peace, I felt a deep calm wash over me. In the midst of the busy city, this quiet corner reminded me that God\'s peace isn\'t dependent on my circumstances. The verse about being peacemakers really challenged me - am I actively pursuing peace in my relationships, or just avoiding conflict? I want to be someone who brings reconciliation, not division. This is just the beginning of my journey, and I\'m already sensing God speaking to my heart.',
            createdAt: '2024-10-15T09:30:00.000Z',
        },
        {
            spotId: 'spot-2',
            text: 'The Garden of Reflection was absolutely stunning. Those heritage fig trees have witnessed so much history, and it made me think about how God has been faithful through generations. The verse reminded me to slow down and actually see the beauty around me. I\'m always rushing, always busy - but what am I missing when I don\'t take time to reflect? I sat on a bench for 20 minutes and just prayed. It felt uncomfortable at first, but then... peaceful. I think I needed this.',
            createdAt: '2024-10-15T14:45:00.000Z',
        },
        {
            spotId: 'spot-3',
            text: 'Lighthouse of Hope - what a powerful name! Learning about how this spot saved sailors\' lives from dangerous rocks hit me hard. I\'ve been feeling lost lately, like I\'m navigating in the dark. But this reminded me that Jesus is my lighthouse, guiding me safely home. The families who kept watch here, hoping for their loved ones to return - that\'s how God watches for us. Always hoping, always ready to welcome us back. I don\'t want to keep drifting in the fog anymore.',
            createdAt: '2024-10-16T10:15:00.000Z',
        },
        {
            spotId: 'spot-4',
            text: 'The Bridge of Faith is exactly where I needed to be today. I\'ve been struggling with doubt, questioning everything I believed as a kid. But this bridge, rebuilt three times after floods and setbacks - that\'s what faith looks like. It\'s not avoiding the hard times, it\'s choosing to rebuild, to keep connecting. The verse about faith being the bridge between seen and unseen really resonated. I can\'t see God, but I can see the evidence of His work. I can see changed lives. Maybe that\'s enough for now.',
            createdAt: '2024-10-17T11:00:00.000Z',
        },
        {
            spotId: 'spot-5',
            text: 'Harbor of Love - I actually got emotional at this spot. Reading about the immigrant families reuniting here after being separated by oceans... it made me think of the prodigal son story. God\'s love is like that - welcoming us home no matter how far we\'ve wandered. I\'ve wandered pretty far. Made choices I\'m not proud of. But standing here, I felt this overwhelming sense that it\'s never too late to come home. God\'s arms are open. That phrase "Love Knows No Distance" - it\'s true.',
            createdAt: '2024-10-18T15:30:00.000Z',
        },
        {
            spotId: 'spot-6',
            text: 'The Tower of Strength stood through every storm - that\'s the testimony I want to have. During the Depression, people gathered here to encourage each other, transforming a defensive structure into a symbol of community strength. I realized I\'ve been trying to be strong on my own, but real strength comes from community and from God. The verse "The Lord is my strong tower" - I need to actually run to Him when I\'m struggling, not just push through alone. I\'m learning so much on this journey.',
            createdAt: '2024-10-19T09:00:00.000Z',
        },
        {
            spotId: 'spot-7',
            text: 'Crossroads of Wisdom - every choice is a crossroads moment. That hit me hard. The history of Indigenous elders teaching young people about decision-making here, then later generations debating social issues - it\'s all about choosing wisely. I\'m at a crossroads in my life right now (new job offer, relationship decisions, where to live). The verse about standing at the crossroads and choosing wisdom over folly - I prayed for wisdom. Real, practical wisdom for the decisions I\'m facing. I feel like God is guiding me.',
            createdAt: '2024-10-20T13:20:00.000Z',
        },
        {
            spotId: 'spot-8',
            text: 'Gateway of Grace - the final stop, and what a perfect way to end this journey. Those gates that said "Free to All" - that\'s the gospel in three words. Grace is free. It\'s available to everyone. No prerequisites, no earning it. Just receive. This whole treasure hunt has been like walking through the gospel: finding peace, reflecting on beauty, discovering hope, crossing bridges of faith, being welcomed by love, finding strength, gaining wisdom, and finally... receiving grace. I\'m different than I was 8 spots ago. I\'m ready for what comes next. I think I\'m ready for Alpha.',
            createdAt: '2024-10-21T16:45:00.000Z',
        },
    ],
    startedAt: '2024-10-15T09:00:00.000Z',
};

// Mock community reflections that could appear on Alphi's journey progress page
export const ALPHI_COMMUNITY_REFLECTIONS = [
    {
        spotId: 'spot-1',
        userName: 'Marcus Lee',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
        rating: 5,
        text: 'This sanctuary became my weekly retreat. Every Tuesday morning I come here before work to pray and journal. The peace is tangible.',
        createdAt: '2024-10-10T07:30:00.000Z',
        likes: 24,
    },
    {
        spotId: 'spot-2',
        userName: 'Priya Sharma',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        rating: 5,
        text: 'The historical significance of this garden is incredible. I brought my grandmother here and she told me stories about visiting this exact spot as a child. Connecting generations through faith and history.',
        createdAt: '2024-10-12T14:20:00.000Z',
        likes: 31,
    },
    {
        spotId: 'spot-3',
        userName: 'Daniel Foster',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel',
        rating: 5,
        text: 'I was going through a really dark time when I found this spot. The metaphor of a lighthouse guiding ships to safety literally saved me. I reached out for help that day.',
        createdAt: '2024-10-08T19:45:00.000Z',
        likes: 47,
    },
    {
        spotId: 'spot-4',
        userName: 'Sophie Chen',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
        rating: 4,
        text: 'My husband and I were struggling in our marriage. We came here together, held hands like the old tradition, and talked honestly for the first time in months. The bridge symbolism is powerful.',
        createdAt: '2024-10-14T11:00:00.000Z',
        likes: 38,
    },
    {
        spotId: 'spot-5',
        userName: 'James Robertson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        rating: 5,
        text: 'As an immigrant myself, reading about Welcome Cove moved me to tears. My family\'s reunion story is part of this place\'s legacy. God\'s love truly knows no distance.',
        createdAt: '2024-10-11T16:30:00.000Z',
        likes: 52,
    },
    {
        spotId: 'spot-6',
        userName: 'Rachel Kim',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel',
        rating: 5,
        text: 'The Depression-era story of community gathering here inspired me to start a support group at my church. We need to be towers of strength for each other.',
        createdAt: '2024-10-13T10:15:00.000Z',
        likes: 29,
    },
    {
        spotId: 'spot-7',
        userName: 'Alex Nguyen',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        rating: 4,
        text: 'I made a major life decision while standing at this crossroads. Prayed for wisdom and felt such clarity. Six months later, I can confirm - it was the right choice.',
        createdAt: '2024-10-09T13:40:00.000Z',
        likes: 33,
    },
    {
        spotId: 'spot-8',
        userName: 'Emily Watson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        rating: 5,
        text: 'Free to All - these words changed my life. I grew up thinking I had to earn God\'s love. Standing at this gateway, I finally understood grace. I cried. I\'m free.',
        createdAt: '2024-10-16T15:00:00.000Z',
        likes: 61,
    },
];