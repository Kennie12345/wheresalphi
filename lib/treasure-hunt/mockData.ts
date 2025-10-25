import { Region, Collectible, AlphaVenue } from './types';

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