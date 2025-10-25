🧭 Alfie's Journey
A GPS-powered treasure hunt designed to be the new front door for Alpha Australia, engaging Gen Z by turning their city into a canvas for personal reflection.

This is a 5-hour hackathon prototype built with Next.js, React, and react-leaflet. It's a high-fidelity frontend-only mockup designed to demonstrate a new way to introduce Alpha's core ideas to young people.

Live Demo (Mockup): [Link to your Vercel deployment]

📖 About The Project
Alpha's mission to create a space for open conversation about life, faith, and meaning is timeless. But reaching the next generation (Gen Z) requires a new approach. This generation is digitally native, values authentic experiences, and is often hesitant to walk into a church.

Alfie's Journey is our answer. It's not a replacement for the Alpha course; it's the front door.

It's a "top-of-funnel" experience that meets young people where they are: on their phones and out in the world. It gamifies the first step of exploration, using GPS triggers to unlock compelling, Alpha-inspired video content in local parks, cafes, and city streets. It prompts them with a simple question—"What did you get from that?"—and encourages a moment of private reflection, a core part of the Alpha experience, in a way that feels natural and non-confrontational.

🎙️ The 5-Minute Pitch (for Alpha Australia)
(To be delivered by Paul)

[Slide 1: Title & The Big Question]

(Hook) "Good morning. We're all here because we believe in Alpha's mission. But we all face the same challenge: How do we get a 19-year-old, who spends 8 hours a day on their phone, to walk into an in-person Alpha course?

They're not searching for 'church.' They're searching for 'meaning,' 'community,' and 'purpose' on TikTok and YouTube.

[Slide 2: The Solution = A Bridge]

(Solution) "We need to build a bridge. That's why we built Alfie's Journey.

This isn't another content app. It's a gamified experience designed specifically to be the new front door for Alpha Australia.

It's a treasure hunt that uses technology to get young people off their couch and into the real world, interacting with Alpha's core questions in a way that feels like a game, not a lecture."

[Slide 3: The Demo - Video Starts]

(Demo) "Let me show you. [Jillian can speak] A user opens the app and sees a map of their city. We're using react-leaflet to show their location and these 'Alfie' markers.

They walk to a spot. When their GPS gets close, the content unlocks.

[Laurence can speak] A modal pops up, based on my wireframes. They watch a 60-second, high-impact video—think of it as a 'Life Essential' clip. Then, they're prompted with a single question: 'What did you get from that?'

They type a private reflection. This is the first step of their journey.

[Slide 4: Demo Continues - The Funnel]

(Demo) "After reflecting, they can see an anonymous gallery of what other people thought, creating a sense of shared, safe community.

[Ken can speak] As they complete spots, their score increases. We even prototyped a 'Fake AR' selfie to make it shareable. All this is built on a rock-solid Next.js and shadcn/ui stack, and it saves their progress to their phone.

This entire loop—Discover, Watch, Reflect—is designed to do one thing: build curiosity and trust."

[Slide 5: The Future & The Partnership]

(The Vision) "What you see is a 5-hour prototype. But imagine this fully realized, in partnership with Alpha Australia.

We can create custom 'Journeys' in every major city. And the final spot on the map? It's not a video. It's an invitation: 'Your journey continues. Here's an Alpha course starting next week, 300 meters from where you're standing.'

We're not just building an app. We're building the missing bridge between the digital world and your local Alpha community.

We are Alfie's Journey. Thank you."

✨ Core Features (5-Hour MVP)
GPS-Based Unlocking: Uses react-leaflet to check the user's distance to hard-coded coordinates.

Interactive Map: Shows all locations, the user's position, and completed spots (which change color).

Content Modals: A shadcn/ui dialog that displays an embedded video and a reflection prompt.

Reflection Form: A simple <textarea> that saves the user's reflection to localStorage.

Private Profile Page: A page (/profile) that reads from localStorage to display the user's score and a list of their own saved reflections.

Mock Community Gallery: A page (/gallery) that displays a static, faked list of community reflections from a JSON file.

"Fake AR" Selfie: A simple component that overlays a .png image of the "Alfie" character and uses the phone's camera (<input type="file" capture="user">).

Gamification: Tracks score and completed locations, all saved in localStorage.

🛠️ Tech Stack
Framework: Next.js (for routing, pages, and Vercel deployment)

Deployment: Vercel

UI Library: React

Components: shadcn/ui (for beautiful, accessible components out of the box)

Mapping & GPS: React-Leaflet

State: React Context (for simple global state)

Storage: Browser localStorage (to mock a database)

🚀 Getting Started
This is a Next.js project bootstrapped with create-next-app.

1. Clone the Repository
Bash

git clone https://github.com/[your-username]/alfie-journey.git
cd alfie-journey
2. Install Dependencies
Bash

npm install
3. Run the Development Server
Bash

npm run dev
Open http://localhost:3000 with your browser to see the result.

Note: The Geolocation API will ask for your permission. For testing location triggers, you can use your browser's developer tools to mock your GPS coordinates.

🧑‍💻 The Hackathon Team
Ken: Lead Developer (Next.js, shadcn/ui, Core Logic)

Jillian: Specialist Developer (react-leaflet, GPS Logic)

Laurence: UI/UX Designer (Wireframes, Visuals)

Paul: Project Manager (Pitch, Assets, Testing)