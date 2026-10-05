import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { prisma } from '../shared/database/prisma';

dotenv.config();

export interface SeedEventItem {
  title: string;
  description: string;
  category: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    capacity: number;
  };
  daysFromNow: number;
  durationHours: number;
  banner: string;
  tags: string[];
  sections: {
    name: string;
    rows: string[];
    seatsPerRow: number;
    price: number;
  }[];
}

const BOOKMYSHOW_EVENTS: SeedEventItem[] = [
  // =========================================================================
  // MONTH 1 (Days 1 - 30): Immediate & Upcoming This Month
  // =========================================================================

  // 1. Movies
  {
    title: 'Kalki 2898 AD (IMAX 3D)',
    description:
      'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu descends to Earth to protect humanity from dark forces. Starring Prabhas, Amitabh Bachchan, Kamal Haasan, and Deepika Padukone.',
    category: 'movie',
    venue: {
      name: 'PVR: INORBIT Mall',
      address: 'Link Road, Malad West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 350,
    },
    daysFromNow: 1,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    tags: ['Action', 'Sci-Fi', 'Mythology', 'IMAX 3D', 'Hindi', 'Telugu'],
    sections: [
      { name: 'RECLINER LUXURY', rows: ['A', 'B'], seatsPerRow: 12, price: 650 },
      { name: 'PRIME PLUS', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 18, price: 350 },
      { name: 'CLASSIC EXECUTIVE', rows: ['G', 'H', 'I', 'J'], seatsPerRow: 20, price: 220 },
    ],
  },
  {
    title: 'Dune: Part Two (IMAX 2D)',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Directed by Denis Villeneuve, starring Timothée Chalamet and Zendaya.',
    category: 'movie',
    venue: {
      name: 'INOX: Megaplex',
      address: 'Phoenix Marketcity, Kurla West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 400,
    },
    daysFromNow: 2,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    tags: ['Sci-Fi', 'Adventure', 'Drama', 'IMAX', 'English'],
    sections: [
      { name: 'RECLINER LUXURY', rows: ['A', 'B'], seatsPerRow: 12, price: 700 },
      { name: 'PRIME PLUS', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 18, price: 380 },
      { name: 'CLASSIC EXECUTIVE', rows: ['G', 'H', 'I'], seatsPerRow: 20, price: 250 },
    ],
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    description:
      'After the events of Stree, the town of Chanderi is haunted again by a new headless monster named Sarkata. Starring Shraddha Kapoor, Rajkummar Rao, and Pankaj Tripathi.',
    category: 'movie',
    venue: {
      name: "PVR Director's Cut",
      address: 'Ambience Mall, Vasant Kunj',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 280,
    },
    daysFromNow: 3,
    durationHours: 2.5,
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    tags: ['Horror', 'Comedy', 'Blockbuster', 'Hindi'],
    sections: [
      { name: 'VIP RECLINER', rows: ['A', 'B'], seatsPerRow: 10, price: 600 },
      { name: 'CLUB', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 16, price: 320 },
      { name: 'EXECUTIVE', rows: ['G', 'H', 'I'], seatsPerRow: 18, price: 200 },
    ],
  },
  {
    title: 'Devara: Part 1 (Dolby Cinema)',
    description:
      'Man of Masses Jr NTR stars in Koratala Siva’s coastal high-octane spectacle alongside Janhvi Kapoor and Saif Ali Khan. Anirudh’s thumping background score!',
    category: 'movie',
    venue: {
      name: 'Prasads Multiplex (Large Screen)',
      address: 'NTR Gardens, Khairatabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      capacity: 550,
    },
    daysFromNow: 5,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    tags: ['Action', 'Thriller', 'Telugu', 'Hindi', 'Mass'],
    sections: [
      { name: 'VIP RECLINER', rows: ['A', 'B'], seatsPerRow: 14, price: 500 },
      { name: 'PREMIUM BALCONY', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 22, price: 295 },
      { name: 'STANDARD', rows: ['G', 'H', 'I', 'J'], seatsPerRow: 25, price: 175 },
    ],
  },

  // 2. Month 1 Standup Comedy
  {
    title: 'Kenny Sebastian: Professor of Logic Live',
    category: 'comedy',
    description:
      'Kenny Sebastian brings his guitar, quirky observations, and sharp wit to Bengaluru for a two-hour special.',
    venue: {
      name: 'Chowdiah Memorial Hall',
      address: '16th Cross, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      capacity: 1000,
    },
    daysFromNow: 6,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    tags: ['Standup Comedy', 'English', 'Musical Comedy'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 14, price: 2000 },
      { name: 'BALCONY', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 1000 },
    ],
  },
  {
    title: 'Zakir Khan: Live Standup Comedy Special',
    category: 'comedy',
    description:
      'India\'s favorite "Sakht Launda" Zakir Khan takes the stage with brand new observations, desi family anecdotes, and hilarious life lessons.',
    venue: {
      name: 'NCPA Tata Theatre',
      address: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 1000,
    },
    daysFromNow: 8,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1525260579839-5478b265a2d1?w=800&q=80',
    tags: ['Standup Comedy', 'Hindi', 'Humor', 'Live Show'],
    sections: [
      { name: 'VIP FRONT ROWS', rows: ['A', 'B', 'C'], seatsPerRow: 16, price: 2500 },
      { name: 'PREMIUM BALCONY', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 20, price: 1200 },
    ],
  },
  {
    title: 'Bassam Shaka & Friends: Live Comedy Fest',
    category: 'comedy',
    description:
      'Top standup comics from North India gather for an evening of side-splitting laughter and uncensored observational comedy.',
    venue: {
      name: 'Siri Fort Auditorium',
      address: 'August Kranti Marg, Siri Fort',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 1800,
    },
    daysFromNow: 9,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    tags: ['Standup Comedy', 'Hindi', 'Delhi Jokes'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 15, price: 1800 },
      { name: 'EXECUTIVE', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 999 },
    ],
  },
  {
    title: 'Rahul Subramanian: Who Are You? Live',
    category: 'comedy',
    description:
      'Brand new crowd-work and solo special by master improviser Rahul Subramanian at Shilpakala Vedika.',
    venue: {
      name: 'Shilpakala Vedika',
      address: 'Hitec City, Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      capacity: 2500,
    },
    daysFromNow: 11,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    tags: ['Comedy', 'Crowd Work', 'Humor'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 16, price: 2000 },
      { name: 'PREMIUM', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1200 },
    ],
  },

  // 3. Month 1 Sports & Theatre
  {
    title: 'IPL 2025: Delhi Capitals vs Royal Challengers Bengaluru',
    category: 'sports',
    description:
      'Rishabh Pant and the Delhi Capitals host Virat Kohli and RCB in an electrifying evening clash at Kotla.',
    venue: {
      name: 'Arun Jaitley Stadium',
      address: 'Feroz Shah Kotla, Bahadur Shah Zafar Marg',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 35000,
    },
    daysFromNow: 10,
    durationHours: 4.5,
    banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    tags: ['Cricket', 'IPL 2025', 'DC vs RCB'],
    sections: [
      { name: 'PLATINUM CORPORATE', rows: ['A', 'B'], seatsPerRow: 14, price: 8500 },
      { name: 'CLUB STAND', rows: ['C', 'D', 'E'], seatsPerRow: 22, price: 3200 },
      { name: 'GENERAL STAND', rows: ['F', 'G', 'H', 'I'], seatsPerRow: 28, price: 1200 },
    ],
  },
  {
    title: 'Mughal-E-Azam: The Grand Musical',
    category: 'theatre',
    description:
      "Feroz Abbas Khan's Broadway-style musical adaptation of K. Asif's timeless classic. Grand sets, Manish Malhotra costumes, and live Kathak dancers.",
    venue: {
      name: 'The Grand Theatre, NMACC',
      address: 'BKC, Bandra East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 2000,
    },
    daysFromNow: 12,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&q=80',
    tags: ['Theatre', 'Musical', 'Broadway', 'Culture'],
    sections: [
      { name: 'ROYAL DIAMOND BOX', rows: ['A', 'B'], seatsPerRow: 10, price: 8500 },
      { name: 'PLATINUM ORCHESTRA', rows: ['C', 'D', 'E'], seatsPerRow: 16, price: 5000 },
      { name: 'GOLD BALCONY', rows: ['F', 'G', 'H', 'I'], seatsPerRow: 20, price: 2500 },
    ],
  },
  {
    title: 'IPL 2025: Mumbai Indians vs Chennai Super Kings',
    category: 'sports',
    description:
      'The El Clásico of T20 Cricket! Rohit Sharma and the Mumbai Indians battle MS Dhoni and the Chennai Super Kings at the iconic Wankhede Stadium.',
    venue: {
      name: 'Wankhede Stadium',
      address: 'Marine Lines, Churchgate',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 33000,
    },
    daysFromNow: 13,
    durationHours: 5,
    banner: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    tags: ['Cricket', 'IPL 2025', 'MI vs CSK', 'Stadium Live'],
    sections: [
      { name: 'CORPORATE HOSPITALITY BOX', rows: ['A', 'B'], seatsPerRow: 12, price: 9500 },
      { name: 'GARWARE PAVILION', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 20, price: 3500 },
      { name: 'NORTH STAND', rows: ['G', 'H', 'I', 'J', 'K'], seatsPerRow: 25, price: 1500 },
      { name: 'EAST GENERAL STAND', rows: ['L', 'M', 'N', 'O', 'P'], seatsPerRow: 30, price: 800 },
    ],
  },

  // 4. Month 1 Concerts & Festivals
  {
    title: 'Coldplay: Music of the Spheres World Tour',
    category: 'music',
    description:
      'The biggest global stadium band of our generation returns to India! Experience Chris Martin and Coldplay live at DY Patil Stadium with lasers, LED wristbands, and timeless anthems.',
    venue: {
      name: 'DY Patil Stadium',
      address: 'Sector 7, Nerul, Navi Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 50000,
    },
    daysFromNow: 14,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['Concert', 'Live Band', 'International', 'Stadium'],
    sections: [
      { name: 'STANDING LOUNGE PIT', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 6500 },
      { name: 'LEVEL 1 PREMIUM', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 4500 },
      { name: 'LEVEL 2 GENERAL', rows: ['H', 'I', 'J', 'K', 'L'], seatsPerRow: 30, price: 2500 },
    ],
  },
  {
    title: 'Arijit Singh: Soulful Symphony Live Delhi',
    category: 'music',
    description:
      'Experience the magic of Arijit Singh with a 50-piece international grand orchestra at Jawaharlal Nehru Stadium, Delhi.',
    venue: {
      name: 'Jawaharlal Nehru Stadium',
      address: 'Pragati Vihar, Lodhi Road',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 40000,
    },
    daysFromNow: 16,
    durationHours: 3.5,
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    tags: ['Concert', 'Romantic', 'Live Music', 'Arijit Singh'],
    sections: [
      { name: 'FAN PIT (FRONT)', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 6999 },
      { name: 'GOLD SEATS', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 3999 },
      { name: 'SILVER STAND', rows: ['H', 'I', 'J', 'K'], seatsPerRow: 30, price: 1999 },
    ],
  },
  {
    title: 'Sunburn Arena: Alan Walker Walkerworld Tour',
    category: 'music',
    description:
      'Global EDM titan Alan Walker returns to India’s tech and party capital with his chart-topping hits Faded, Alone, and Spectacular laser show.',
    venue: {
      name: 'Manpho Convention Center',
      address: 'Nagavara, Manyata Tech Park Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      capacity: 15000,
    },
    daysFromNow: 18,
    durationHours: 5,
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    tags: ['EDM', 'Sunburn', 'Alan Walker', 'Dance'],
    sections: [
      { name: 'VIP ARENA PIT', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 4999 },
      { name: 'GA PHASE 1', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 2499 },
    ],
  },
  {
    title: 'Diljit Dosanjh: Dil-Luminati Tour India',
    category: 'music',
    description:
      'Pan-India sensation Diljit Dosanjh brings his monumental Dil-Luminati Tour to Mumbai! Non-stop bhangra, soulful Punjabi ballads, and arena energy.',
    venue: {
      name: 'MMRDA Grounds',
      address: 'Bandra Kurla Complex (BKC)',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 25000,
    },
    daysFromNow: 20,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    tags: ['Punjabi', 'Concert', 'Mega Tour', 'Live Music'],
    sections: [
      { name: 'FAN PIT FRONT', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 7500 },
      { name: 'GOLD TIER', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 3800 },
      { name: 'SILVER TIER', rows: ['H', 'I', 'J', 'K', 'L'], seatsPerRow: 30, price: 1999 },
    ],
  },
  {
    title: 'Anirudh Ravichander: Hukum World Tour Live',
    category: 'music',
    description:
      'Rockstar Anirudh brings his unmatched high-energy concert to Hyderabad! Badass anthems, bass drops, and stadium frenzy.',
    venue: {
      name: 'GMR Arena',
      address: 'Rajiv Gandhi Intl Airport Road, Shamshabad',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      capacity: 30000,
    },
    daysFromNow: 22,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    tags: ['Concert', 'Anirudh', 'Hukum', 'Rockstar'],
    sections: [
      { name: 'HUKUM FAN PIT', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 5999 },
      { name: 'GOLD ARENA', rows: ['D', 'E', 'F'], seatsPerRow: 24, price: 2999 },
      { name: 'SILVER STAND', rows: ['G', 'H', 'I', 'J'], seatsPerRow: 30, price: 1499 },
    ],
  },
  {
    title: 'India Art Fair 2025: Contemporary Masters',
    category: 'art',
    description:
      'South Asia’s leading platform for modern and contemporary art showcasing world-renowned galleries, sculptures, and interactive digital installations.',
    venue: {
      name: 'NSIC Exhibition Grounds',
      address: 'Okhla Industrial Estate Phase III',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 5000,
    },
    daysFromNow: 25,
    durationHours: 6,
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    tags: ['Art Exhibition', 'Contemporary', 'Galleries', 'Culture'],
    sections: [
      { name: 'VIP PREVIEW ACCESS', rows: ['A', 'B'], seatsPerRow: 15, price: 2500 },
      { name: 'GENERAL DAY PASS', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 25, price: 799 },
    ],
  },
  {
    title: "The Grub Fest: Premier Food & Music Carnival",
    category: 'food',
    description:
      "India's biggest food festival featuring 80+ artisan culinary pop-ups, celebrity masterchefs, craft cocktails, and sunset acoustic concerts.",
    venue: {
      name: 'JLN Stadium Grounds',
      address: 'Gate No. 2, Lodhi Road',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 8000,
    },
    daysFromNow: 28,
    durationHours: 8,
    banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    tags: ['Food Festival', 'Gourmet', 'Live Bands', 'Carnival'],
    sections: [
      { name: 'GOURMET ALL-ACCESS PASS', rows: ['A', 'B'], seatsPerRow: 16, price: 1999 },
      { name: 'GENERAL TASTING ENTRY', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 24, price: 599 },
    ],
  },

  // =========================================================================
  // MONTH 2 (Days 31 - 60): Next Month Hits & Big Arenas
  // =========================================================================
  {
    title: 'Pushpa 2: The Rule (IMAX Premiere Screenings)',
    description:
      'Allu Arjun returns as the iconic Pushpa Raj in Sukumar’s explosive saga. Witness the clash between Pushpa and Bhanwar Singh Shekhawat in immersive IMAX.',
    category: 'movie',
    venue: {
      name: 'AMB Cinemas: Gachibowli',
      address: 'Sarath City Capital Mall, Kondapur',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      capacity: 450,
    },
    daysFromNow: 35,
    durationHours: 3.2,
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    tags: ['Action', 'Blockbuster', 'Pushpa 2', 'Allu Arjun', 'Telugu', 'Hindi'],
    sections: [
      { name: 'PLATINUM VIP', rows: ['A', 'B'], seatsPerRow: 12, price: 600 },
      { name: 'GOLD CLASS', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 350 },
      { name: 'SILVER', rows: ['F', 'G', 'H'], seatsPerRow: 20, price: 200 },
    ],
  },
  {
    title: 'Bryan Adams: So Happy It Hurts India Tour',
    category: 'music',
    description:
      'Legendary rock icon Bryan Adams performs Summer of 69, Everything I Do, and Run to You live in Bengaluru!',
    venue: {
      name: 'Jayamahal Palace Grounds',
      address: 'Near Cantonment Railway Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      capacity: 18000,
    },
    daysFromNow: 40,
    durationHours: 3.5,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['Rock', 'Classic Rock', 'Bryan Adams', 'Live Concert'],
    sections: [
      { name: 'FRONT ROCK PIT', rows: ['A', 'B', 'C'], seatsPerRow: 18, price: 6499 },
      { name: 'GOLD SEATS', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 22, price: 3999 },
      { name: 'GENERAL ADMISSION', rows: ['H', 'I', 'J', 'K'], seatsPerRow: 28, price: 1999 },
    ],
  },
  {
    title: 'Anubhav Singh Bassi: Kisi Ko Batana Mat',
    category: 'comedy',
    description:
      'Anubhav Singh Bassi is back with brand new rib-tickling lawyer stories, college shenanigans, and relatable hostel misadventures.',
    venue: {
      name: 'Tagore Theatre',
      address: 'Sector 18',
      city: 'Chandigarh',
      state: 'Punjab',
      country: 'India',
      capacity: 900,
    },
    daysFromNow: 44,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1525260579839-5478b265a2d1?w=800&q=80',
    tags: ['Standup Comedy', 'Hindi', 'Bassi Live'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 14, price: 1999 },
      { name: 'BALCONY', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 999 },
    ],
  },
  {
    title: 'ISL 2025 Kolkata Derby: Mohun Bagan SG vs East Bengal FC',
    category: 'sports',
    description:
      'The grandest football rivalry in Asian sports history! 60,000+ passionate supporters light up Salt Lake Stadium for the iconic Kolkata Derby clash.',
    venue: {
      name: 'Salt Lake Stadium (VYBK)',
      address: 'Sector III, Bidhannagar',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      capacity: 68000,
    },
    daysFromNow: 48,
    durationHours: 2.5,
    banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    tags: ['Football', 'ISL', 'Derby', 'Kolkata Football'],
    sections: [
      { name: 'VIP HOSPITALITY TIER', rows: ['A', 'B'], seatsPerRow: 15, price: 3500 },
      { name: 'CLUB STAND MIDDLE', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 25, price: 1200 },
      { name: 'GENERAL STAND NORTH/SOUTH', rows: ['G', 'H', 'I', 'J'], seatsPerRow: 30, price: 400 },
    ],
  },
  {
    title: 'Cirque Du Soleil: BAZZAR Extravaganza',
    category: 'theatre',
    description:
      'World-famous Cirque Du Soleil brings breathtaking acrobatics, dazzling contortionists, and theatrical marvels under the Grand Chapiteau in Mumbai.',
    venue: {
      name: 'MMRDA Exhibition Grounds',
      address: 'BKC, Bandra East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 3500,
    },
    daysFromNow: 52,
    durationHours: 2.5,
    banner: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    tags: ['Circus', 'Theatre', 'Acrobatics', 'International'],
    sections: [
      { name: 'VIP ROUGE EXPERIENCE', rows: ['A', 'B'], seatsPerRow: 14, price: 8999 },
      { name: 'PREMIUM ORCHESTRA', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 5499 },
      { name: 'STANDARD TIER', rows: ['F', 'G', 'H'], seatsPerRow: 24, price: 2999 },
    ],
  },
  {
    title: 'The Great Indian Craft Beer & Gourmet Festival',
    category: 'food',
    description:
      'Over 40 artisanal microbreweries from Bengaluru, Pune, and Goa meet signature street eats, live jazz ensembles, and sundowner party vibes.',
    venue: {
      name: 'Jayamahal Palace Grounds',
      address: 'Near Cantonment, Millers Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      capacity: 6000,
    },
    daysFromNow: 58,
    durationHours: 7,
    banner: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    tags: ['Food & Drink', 'Craft Beer', 'Live Music', 'Bengaluru Weekend'],
    sections: [
      { name: 'UNLIMITED TASTING PASS', rows: ['A', 'B'], seatsPerRow: 16, price: 2499 },
      { name: 'GENERAL TICKET + 2 BREWS', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 25, price: 899 },
    ],
  },

  // =========================================================================
  // MONTH 3 (Days 61 - 90): Mid-Term Global Tours & Premieres
  // =========================================================================
  {
    title: 'Gladiator II (4DX / IMAX Special Screenings)',
    description:
      'Ridley Scott directs the legendary return to ancient Rome. Paul Mescal and Denzel Washington deliver epic arena combat in sensory 4DX motion seats.',
    category: 'movie',
    venue: {
      name: 'SPI Palazzo: The Forum Vijaya Mall',
      address: 'Vadapalani',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      capacity: 380,
    },
    daysFromNow: 65,
    durationHours: 2.8,
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    tags: ['Action', 'Epic', '4DX', 'IMAX', 'Hollywood'],
    sections: [
      { name: '4DX MOTION RECLINER', rows: ['A', 'B'], seatsPerRow: 12, price: 750 },
      { name: 'PREMIUM CINEMA', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 380 },
      { name: 'STANDARD', rows: ['F', 'G', 'H'], seatsPerRow: 20, price: 220 },
    ],
  },
  {
    title: 'Ed Sheeran: + - = ÷ x Mathematical Stadium Tour',
    category: 'music',
    description:
      'Global pop phenomenon Ed Sheeran takes center stage with his iconic loop pedal, Shape of You, Perfect, and Bad Habits live under the stars.',
    venue: {
      name: 'Mahalaxmi Racecourse',
      address: 'Dr E Moses Marg, Mahalaxmi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 45000,
    },
    daysFromNow: 72,
    durationHours: 3.5,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['Pop', 'Ed Sheeran', 'Concert', 'Mega Tour'],
    sections: [
      { name: 'MATHEMATICS FRONT CIRCLE', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 7999 },
      { name: 'GOLD GRANDSTAND', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 4999 },
      { name: 'SILVER LAWN', rows: ['H', 'I', 'J', 'K', 'L'], seatsPerRow: 30, price: 2499 },
    ],
  },
  {
    title: 'Vir Das: Mind Fool World Tour India',
    category: 'comedy',
    description:
      'International Emmy Award winner Vir Das returns home with his biggest global arena tour yet. Witty, observational, and unapologetic.',
    venue: {
      name: 'Bal Gandharva Ranga Mandir',
      address: 'JM Road, Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      capacity: 1200,
    },
    daysFromNow: 78,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    tags: ['Comedy', 'Emmy Winner', 'Vir Das', 'Live Tour'],
    sections: [
      { name: 'VIP ORCHESTRA', rows: ['A', 'B'], seatsPerRow: 16, price: 2499 },
      { name: 'BALCONY', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1299 },
    ],
  },
  {
    title: 'Pro Kabaddi League 2025 Grand Finals',
    category: 'sports',
    description:
      'The ultimate clash of power, speed, and raids! The two finest franchises battle for the prestigious Pro Kabaddi Trophy at the state-of-the-art arena.',
    venue: {
      name: 'The Arena by TransStadia',
      address: 'Near Kankaria Lake',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      capacity: 10000,
    },
    daysFromNow: 84,
    durationHours: 3.5,
    banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    tags: ['Kabaddi', 'PKL 2025', 'Finals', 'High Energy'],
    sections: [
      { name: 'COURTSIDE VIP', rows: ['A', 'B'], seatsPerRow: 12, price: 4500 },
      { name: 'PREMIUM STAND', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1800 },
      { name: 'GENERAL TIER', rows: ['F', 'G', 'H', 'I'], seatsPerRow: 25, price: 600 },
    ],
  },
  {
    title: 'Taj Vivanta Food & Wine Masterclass by Chef Ranveer Brar',
    category: 'food',
    description:
      'An intimate masterclass and 5-course gourmet tasting dinner hosted by celebrity Chef Ranveer Brar pairing artisanal wine with modern Indian fine dining.',
    venue: {
      name: 'Taj Lands End',
      address: 'Bandstand, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 120,
    },
    daysFromNow: 88,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    tags: ['Fine Dining', 'Masterclass', 'Chef Ranveer Brar', 'Wine Tasting'],
    sections: [
      { name: 'CHEF TABLE VIP TICKET', rows: ['A'], seatsPerRow: 10, price: 8500 },
      { name: 'DELUXE TASTING TICKET', rows: ['B', 'C'], seatsPerRow: 15, price: 5000 },
    ],
  },

  // =========================================================================
  // MONTH 4 (Days 91 - 120): Long-Range Mega Events
  // =========================================================================
  {
    title: 'Avatar: Fire and Ash (Early Preview IMAX 3D)',
    description:
      'James Cameron invites you back to Pandora to explore the volcanic Ash People. Breathtaking visual effects that redefine cinema technology.',
    category: 'movie',
    venue: {
      name: 'PVR: Forum Mall (IMAX)',
      address: 'Hosur Road, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      capacity: 420,
    },
    daysFromNow: 95,
    durationHours: 3.3,
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    tags: ['Sci-Fi', 'Avatar', 'James Cameron', 'IMAX 3D', 'Spectacle'],
    sections: [
      { name: 'LUXURY RECLINER', rows: ['A', 'B'], seatsPerRow: 12, price: 800 },
      { name: 'PRIME LOUNGE', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 450 },
      { name: 'CLASSIC TIER', rows: ['F', 'G', 'H'], seatsPerRow: 20, price: 280 },
    ],
  },
  {
    title: 'AR Rahman: Marakkuma Nenjam Symphony',
    category: 'music',
    description:
      'The Mozart of Madras, double Oscar winner AR Rahman, performs an unforgettable 4-hour live symphonic concert featuring legendary singers and musicians.',
    venue: {
      name: 'YMCA Nandanam Grounds',
      address: 'Anna Salai, Nandanam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      capacity: 35000,
    },
    daysFromNow: 105,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    tags: ['Concert', 'AR Rahman', 'Symphony', 'Tamil', 'Hindi', 'Oscar Winner'],
    sections: [
      { name: 'MAESTRO PLATINUM PIT', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 7500 },
      { name: 'GOLD CHAIRS', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 4200 },
      { name: 'SILVER STAND', rows: ['H', 'I', 'J', 'K'], seatsPerRow: 30, price: 2000 },
    ],
  },
  {
    title: 'Biswa Kalyan Rath: Moody Thoughts Solo Special',
    category: 'comedy',
    description:
      'Biswa brings his eccentric philosophical deconstructions, hilarious anger bursts, and sharp storytelling to Kolkata for an exclusive comedy night.',
    venue: {
      name: 'Kala Mandir Auditorium',
      address: 'Shakespeare Sarani',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      capacity: 1100,
    },
    daysFromNow: 112,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    tags: ['Comedy', 'Biswa', 'Solo Show', 'Standup'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 14, price: 1800 },
      { name: 'BALCONY TIER', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 899 },
    ],
  },
  {
    title: 'Macbeth: Royal Shakespeare Company Live in India',
    category: 'theatre',
    description:
      'Direct from Stratford-upon-Avon, the prestigious Royal Shakespeare Company brings William Shakespeare’s tragic masterpiece Macbeth to Delhi.',
    venue: {
      name: 'Kamani Auditorium',
      address: 'Copernicus Marg, Mandi House',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 800,
    },
    daysFromNow: 118,
    durationHours: 2.7,
    banner: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&q=80',
    tags: ['Theatre', 'Shakespeare', 'Drama', 'Classics'],
    sections: [
      { name: 'ROYAL STALLS', rows: ['A', 'B'], seatsPerRow: 14, price: 3500 },
      { name: 'DRESS CIRCLE', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 2000 },
    ],
  },

  // =========================================================================
  // MONTH 5 (Days 121 - 150): Mid-Year Mega Festivals
  // =========================================================================
  {
    title: "Marvel's Fantastic Four: First Steps (IMAX 3D)",
    description:
      'Marvel Studios brings Marvel’s First Family into the MCU. Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach journey through the cosmos.',
    category: 'movie',
    venue: {
      name: 'Maison PVR: Jio World Drive (IMAX)',
      address: 'BKC, Bandra East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 350,
    },
    daysFromNow: 128,
    durationHours: 2.5,
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    tags: ['Marvel', 'MCU', 'Fantastic Four', 'IMAX 3D', 'Superhero'],
    sections: [
      { name: 'VIP COUCH RECLINER', rows: ['A', 'B'], seatsPerRow: 10, price: 850 },
      { name: 'PRIME EXECUTIVE', rows: ['C', 'D', 'E'], seatsPerRow: 16, price: 420 },
      { name: 'CLASSIC', rows: ['F', 'G', 'H'], seatsPerRow: 18, price: 260 },
    ],
  },
  {
    title: 'Post Malone: Twelve Carat Tour Live India',
    category: 'music',
    description:
      'Multi-platinum recording star Post Malone brings his genre-bending smash hits Circles, Sunflower, and Rockstar to India for a monumental stadium night.',
    venue: {
      name: 'Indira Gandhi Indoor Arena',
      address: 'Near ITO, Vikram Nagar',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 22000,
    },
    daysFromNow: 135,
    durationHours: 3.5,
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    tags: ['Hip-Hop', 'Pop', 'Post Malone', 'International Live'],
    sections: [
      { name: 'FAN PIT STANDING', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 8500 },
      { name: 'GOLD CHAIRS', rows: ['D', 'E', 'F'], seatsPerRow: 24, price: 5500 },
      { name: 'SILVER STAND', rows: ['G', 'H', 'I', 'J'], seatsPerRow: 30, price: 2800 },
    ],
  },
  {
    title: "Sunburn Goa 2025: Asia's Biggest EDM Festival",
    category: 'music',
    description:
      '3 Days, 5 Stages, 120+ International DJs, and thousands of dance music lovers on the beaches of Goa. An iconic year-end electronic festival experience.',
    venue: {
      name: 'Vagator Beach Arena',
      address: 'Vagator, North Goa',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
      capacity: 35000,
    },
    daysFromNow: 142,
    durationHours: 10,
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    tags: ['EDM', 'Sunburn', 'Festival', 'Goa', 'Dance'],
    sections: [
      { name: '3-DAY VIP FESTIVAL PASS', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 12000 },
      { name: '3-DAY GA FESTIVAL PASS', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 6500 },
      { name: 'SINGLE DAY PASS', rows: ['H', 'I', 'J', 'K'], seatsPerRow: 30, price: 2999 },
    ],
  },
  {
    title: 'Indian Badminton Open World Tour Super 750 Finals',
    category: 'sports',
    description:
      'The globe’s elite shuttlers including Viktor Axelsen, PV Sindhu, and Lakshya Sen battle in high-speed badminton action for the coveted Super 750 crown.',
    venue: {
      name: 'K.D. Jadhav Indoor Hall',
      address: 'IG Stadium Complex, ITO',
      city: 'Delhi-NCR',
      state: 'Delhi',
      country: 'India',
      capacity: 12000,
    },
    daysFromNow: 148,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    tags: ['Badminton', 'BWF Super 750', 'PV Sindhu', 'Championship'],
    sections: [
      { name: 'COURTSIDE PREMIUM', rows: ['A', 'B'], seatsPerRow: 14, price: 4000 },
      { name: 'TIER 1 SEATS', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1800 },
      { name: 'TIER 2 GENERAL', rows: ['F', 'G', 'H'], seatsPerRow: 25, price: 750 },
    ],
  },

  // =========================================================================
  // MONTH 6 (Days 151 - 180): Horizon Headliners (Up to 6 Months Available)
  // =========================================================================
  {
    title: 'Interstellar (10th Anniversary IMAX 70mm Re-release)',
    description:
      'Christopher Nolan’s cosmic masterpiece returns in grand 70mm IMAX format. Follow Cooper and Brand through the wormhole with Hans Zimmer’s organ score.',
    category: 'movie',
    venue: {
      name: 'Palladium IMAX: Thaltej',
      address: 'Sarkhej - Gandhinagar Hwy',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      capacity: 400,
    },
    daysFromNow: 155,
    durationHours: 3.2,
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    tags: ['IMAX 70mm', 'Christopher Nolan', 'Sci-Fi', 'Classic', 'Re-Release'],
    sections: [
      { name: 'IMAX VIP RECLINER', rows: ['A', 'B'], seatsPerRow: 12, price: 750 },
      { name: 'PRIME EXECUTIVE', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 18, price: 400 },
      { name: 'STANDARD TIER', rows: ['G', 'H', 'I'], seatsPerRow: 20, price: 250 },
    ],
  },
  {
    title: 'Lollapalooza India 2025: Multi-Genre Global Fest',
    category: 'music',
    description:
      '4 massive stages, 40+ global & homegrown artists covering rock, pop, indie, and hip-hop over 2 iconic days of nonstop festival celebrations in Mumbai.',
    venue: {
      name: 'Mahalaxmi Grounds',
      address: 'Mahalaxmi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 50000,
    },
    daysFromNow: 165,
    durationHours: 12,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['Festival', 'Lollapalooza', 'Multi-Genre', 'International', 'Rock', 'Pop'],
    sections: [
      { name: '2-DAY PLATINUM VIP TICKET', rows: ['A', 'B', 'C'], seatsPerRow: 20, price: 14999 },
      { name: '2-DAY GA REGULAR PASS', rows: ['D', 'E', 'F', 'G'], seatsPerRow: 25, price: 6999 },
    ],
  },
  {
    title: 'Samay Raina & Friends: Unfiltered Comedy Marathon',
    category: 'comedy',
    description:
      'Chess, roast battles, and unfiltered comedy! Samay Raina headlines a hilarious 3-hour stadium comedy night alongside top guest comedians.',
    venue: {
      name: 'Pandit Dindayal Upadhyay Auditorium',
      address: 'Behind Rajpath Club, Bodakdev',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      capacity: 1500,
    },
    daysFromNow: 170,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1525260579839-5478b265a2d1?w=800&q=80',
    tags: ['Comedy', 'Samay Raina', 'Roast', 'Standup Marathon'],
    sections: [
      { name: 'VIP FRONT ROWS', rows: ['A', 'B'], seatsPerRow: 16, price: 2200 },
      { name: 'BALCONY SEATS', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1100 },
    ],
  },
  {
    title: 'Kochi-Muziris Biennale: International Contemporary Art',
    category: 'art',
    description:
      'The biggest contemporary art festival in Asia! Hundreds of artists from 40+ countries showcase paintings, site-specific sculptures, and heritage architecture.',
    venue: {
      name: 'Aspinwall House & Heritage Pavilions',
      address: 'River Road, Fort Kochi',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
      capacity: 4000,
    },
    daysFromNow: 175,
    durationHours: 6,
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    tags: ['Art Exhibition', 'Biennale', 'Heritage', 'Culture', 'International'],
    sections: [
      { name: 'SEASON CURATOR PASS', rows: ['A', 'B'], seatsPerRow: 14, price: 2500 },
      { name: 'DAY VISITOR ENTRY', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 25, price: 499 },
    ],
  },
  {
    title: 'ICC World Championship Trophy Super-Clash',
    category: 'sports',
    description:
      'The ultimate international cricket championship clash at the world’s biggest cricket stadium! 130,000 roar for glory under the floodlights in Ahmedabad.',
    venue: {
      name: 'Narendra Modi Stadium',
      address: 'Stadium Road, Motera',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      capacity: 132000,
    },
    daysFromNow: 180,
    durationHours: 8,
    banner: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    tags: ['Cricket', 'World Championship', 'Grand Final', 'Ahmedabad Stadium'],
    sections: [
      { name: 'PRESIDENTIAL SUITE & CLUB', rows: ['A', 'B'], seatsPerRow: 14, price: 15000 },
      { name: 'PREMIUM PAVILION TIER 1', rows: ['C', 'D', 'E'], seatsPerRow: 22, price: 6500 },
      { name: 'MID-TIER STANDS', rows: ['F', 'G', 'H', 'I'], seatsPerRow: 28, price: 2500 },
      { name: 'UPPER GENERAL STAND', rows: ['J', 'K', 'L', 'M', 'N'], seatsPerRow: 35, price: 999 },
    ],
  },
];

async function main() {
  console.log('🔄 Connecting to PostgreSQL...');
  await prisma.$connect();
  console.log('✅ Connected to PostgreSQL');

  // Clear existing records in reverse relation order
  console.log('🗑️  Clearing existing tables...');
  await prisma.payment.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleared tables');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      username: 'organizer',
      email: 'organizer@demo.com',
      password: hashedPassword,
      role: 'organizer',
      isVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'user@demo.com',
      password: hashedPassword,
      role: 'user',
      isVerified: true,
    },
  });

  console.log('👥 Created 3 demo users (admin, organizer, user)');

  // Seed events with multi-tier seating spanning up to 6 months
  let totalSeatsCreated = 0;
  for (let i = 0; i < BOOKMYSHOW_EVENTS.length; i++) {
    const eventData = BOOKMYSHOW_EVENTS[i];
    const now = new Date();
    const date = new Date(now.getTime() + eventData.daysFromNow * 24 * 60 * 60 * 1000);
    const endDate = new Date(date.getTime() + eventData.durationHours * 60 * 60 * 1000);
    // Stagger createdAt so newer events show first when ordered by newest
    const createdAt = new Date(now.getTime() - (BOOKMYSHOW_EVENTS.length - i) * 30 * 60 * 1000);

    let totalSeats = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    for (const s of eventData.sections) {
      totalSeats += s.rows.length * s.seatsPerRow;
      if (s.price < minPrice) minPrice = s.price;
      if (s.price > maxPrice) maxPrice = s.price;
    }

    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        venue: eventData.venue,
        date,
        endDate,
        organizerId: organizerUser.id,
        banner: eventData.banner,
        tags: eventData.tags,
        isPublished: true,
        totalSeats,
        availableSeats: totalSeats,
        minPrice,
        maxPrice,
        createdAt,
      },
    });

    const seats = [];
    for (const section of eventData.sections) {
      for (const row of section.rows) {
        for (let sIdx = 1; sIdx <= section.seatsPerRow; sIdx++) {
          seats.push({
            eventId: event.id,
            seatNumber: `${row}${sIdx}`,
            row,
            section: section.name,
            price: section.price,
            status: 'available',
          });
        }
      }
    }

    await prisma.seat.createMany({
      data: seats,
      skipDuplicates: true,
    });

    totalSeatsCreated += seats.length;
    console.log(
      `  🎟️  [Day +${eventData.daysFromNow}] "${event.title}" [${eventData.venue.city}] (${eventData.category}) seeded with ${seats.length} seats (₹${minPrice} - ₹${maxPrice})`
    );
  }

  const summary = {
    eventsCount: BOOKMYSHOW_EVENTS.length,
    totalSeats: totalSeatsCreated,
    message: `Seeded ${BOOKMYSHOW_EVENTS.length} BookMyShow events spanning up to 6 months (180 days) across major Indian cities with ${totalSeatsCreated} total seats into PostgreSQL!`,
  };

  console.log(`\n🎉 ${summary.message}`);
  console.log('\n🔑 Demo credentials:');
  console.log('   Admin:     admin@demo.com     / password123');
  console.log('   Organizer: organizer@demo.com / password123');
  console.log('   User:      user@demo.com      / password123\n');

  return summary;
}

export { main as seedDatabase };

if (process.argv[1]?.includes('seed')) {
  main()
    .catch((e) => {
      console.error('❌ Seeding error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

