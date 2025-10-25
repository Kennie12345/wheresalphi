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

export const REFLECTION_PROMPTS = [
    "How does this verse speak to your current situation?",
    "What does this passage teach you about God's character?",
    "How can you apply this truth in your daily life?",
    "What questions does this verse raise for you?",
    "How does this relate to your relationships with others?",
    "What does this teach you about faith?",
    "How can you share this truth with someone this week?",
    "What does this verse reveal about God's love?",
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

// Spot titles and themes
export const SPOT_THEMES = [
    'Sanctuary of Peace',
    'Garden of Reflection',
    'Lighthouse of Hope',
    'Bridge of Faith',
    'Harbor of Love',
    'Tower of Strength',
    'Crossroads of Wisdom',
    'Gateway of Grace',
];

// Historical and cultural information for each spot theme
export const SPOT_HISTORIES = [
    {
        theme: 'Sanctuary of Peace',
        title: 'The Sacred Ground',
        history: 'This location has been a place of quiet contemplation for generations. In the early 1800s, settlers would gather here for prayer meetings, finding respite from the harsh realities of colonial life. The area was known as a neutral ground where people of different backgrounds could come together in peace.',
        culturalSignificance: 'Indigenous Australians considered this a meeting place where conflicts were resolved through dialogue. The spirit of reconciliation continues to resonate here today.',
        interestingFact: 'Local historians discovered that during WWII, this spot was used as a secret meeting place for community leaders organizing support for soldiers and their families.',
        connections: 'The theme of peace found here connects directly to biblical teachings about being peacemakers and seeking reconciliation with others.'
    },
    {
        theme: 'Garden of Reflection',
        title: 'The Hidden Oasis',
        history: 'Originally designed in 1867 by landscape architect James Norton, this green space was created as a public garden to provide city workers with a place to escape the industrial smog and noise. The garden features heritage-listed fig trees that have witnessed over 150 years of city transformation.',
        culturalSignificance: 'Victorian-era workers called this "The Lungs of the City." It became a symbol of the balance between progress and preservation, reminding residents to pause and appreciate natural beauty.',
        interestingFact: 'Hidden beneath one of the oldest trees is a time capsule buried in 1888, containing letters from children describing their hopes for the future of Sydney.',
        connections: 'Gardens appear throughout scripture as places of encounter with God - from Eden to Gethsemane. This space invites similar moments of reflection and connection.'
    },
    {
        theme: 'Lighthouse of Hope',
        title: 'The Beacon Point',
        history: 'While not a physical lighthouse, this elevated location served as a crucial navigation point for early maritime traders in Sydney Harbour. A signal tower stood here from 1820-1890, guiding ships safely to port and saving countless lives from the treacherous rocks below.',
        culturalSignificance: 'Families of sailors would gather here to watch for returning ships, making it a place of hope and anticipation. The tradition of "keeping the light burning" became a metaphor for maintaining hope during difficult times.',
        interestingFact: 'During the 1918 Spanish Flu pandemic, health workers used this spot as a viewing point to signal ships about quarantine protocols, quite literally serving as a beacon of public health information.',
        connections: 'Scripture often uses light as a symbol of hope and divine guidance. Jesus called his followers to be "lights of the world," illuminating the path for others.'
    },
    {
        theme: 'Bridge of Faith',
        title: 'The Crossing Point',
        history: 'This site marks where early settlers built one of Sydney\'s first pedestrian bridges in 1835, connecting two previously isolated communities. The original wooden structure was replaced three times, each iteration representing the community\'s commitment to staying connected despite floods and setbacks.',
        culturalSignificance: 'The bridge became a powerful symbol of unity and perseverance. Interracial marriages in the 1950s and 60s often featured photographs taken at this bridge, representing the crossing of social divides.',
        interestingFact: 'An old tradition held that couples who walked across the bridge hand-in-hand while making a promise would have their bond strengthened. The tradition continues among some families today.',
        connections: 'Faith is described as a bridge between the human and divine, between what is seen and unseen. This physical bridge reminds us that faith connects us across divides we cannot cross alone.'
    },
    {
        theme: 'Harbor of Love',
        title: 'The Embrace',
        history: 'This waterfront location was historically known as "Welcome Cove," where immigrant ships arrived in the 1850s-1950s. Families separated by oceans would reunite here, creating scenes of joy and tears. The area became synonymous with love, reunion, and new beginnings.',
        culturalSignificance: 'Multiple cultures have blessed this spot with their reunion traditions - Greek families would break plates in celebration, Italian families would share bread, and Chinese families would light incense. It became a multicultural tapestry of love and welcome.',
        interestingFact: 'A bronze plaque installed in 1963 bears the inscription "Love Knows No Distance" in twelve languages, commemorating the millions of family reunions that occurred here.',
        connections: 'God\'s love is often described as a welcoming embrace, receiving us home regardless of how far we\'ve wandered. This harbor embodies that unconditional welcome.'
    },
    {
        theme: 'Tower of Strength',
        title: 'The Watchtower',
        history: 'From 1842-1912, a sandstone observation tower stood at this site, serving as a lookout post for approaching ships and potential threats. The tower withstood numerous storms, becoming a symbol of resilience. Though the structure was demolished, the foundation stones remain buried beneath the modern pavement.',
        culturalSignificance: 'Citizens referred to the tower as "Old Faithful" because it never fell despite weathering some of the worst storms in Sydney\'s history. It became a metaphor for endurance in the face of adversity.',
        interestingFact: 'During the Great Depression, unemployed workers would gather in the tower\'s shadow to share food and encouragement, transforming it from a defensive structure to a symbol of community strength.',
        connections: 'The Bible frequently uses towers and fortresses as metaphors for God\'s protective strength. "The name of the Lord is a strong tower; the righteous run to it and are safe."'
    },
    {
        theme: 'Crossroads of Wisdom',
        title: 'The Meeting of Ways',
        history: 'This intersection has existed since pre-colonial times as a convergence of Indigenous walking tracks. Later, it became a key junction where European settlers\' roads met, creating a natural gathering place. By the 1880s, it was known as "Speakers\' Corner" where philosophers, preachers, and activists would share ideas.',
        culturalSignificance: 'The crossroads represented choice and direction. Aboriginal elders would teach young people here about decision-making, while later generations gathered to debate social issues and share knowledge across cultures.',
        interestingFact: 'A famous incident in 1912 saw suffragette Rose Scott deliver an impassioned speech at this crossroads that helped turn public opinion toward women\'s rights in Australia.',
        connections: 'Biblical wisdom literature often speaks of standing at the crossroads, choosing the path of wisdom over folly. Every choice we make is a crossroads moment.'
    },
    {
        theme: 'Gateway of Grace',
        title: 'The Portal',
        history: 'This location marked the entrance to the historic Domain precinct, established in 1810. Ornate iron gates installed in 1871 welcomed visitors into the public gardens, regardless of social class - a revolutionary concept at the time. The gates bore the inscription "Free to All" in gold lettering.',
        culturalSignificance: 'The open gates symbolized democratic access and equal dignity. During the 1890s depression, the gates remained open 24/7 so homeless families could shelter in the gardens, embodying practical grace and hospitality.',
        interestingFact: 'When the original gates were damaged in a storm in 1924, citizens donated their own iron railings and jewelry to be melted down for repairs, determined to preserve this symbol of open access.',
        connections: 'Grace is God\'s unmerited favor - a free gift available to all who enter through faith. Like these gates, divine grace welcomes everyone, regardless of status or background.'
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