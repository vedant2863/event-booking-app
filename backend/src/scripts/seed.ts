import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const BOOKMYSHOW_EVENTS = [
  // --- Blockbuster Movies (Screening across all cities) ---
  {
    title: 'Kalki 2898 AD (IMAX 3D)',
    description:
      'Set in a post-apocalyptic world in the year 2898 AD, a modern avatar of Vishnu descends to Earth to protect the world from dark forces. Starring Prabhas, Amitabh Bachchan, Kamal Haasan, and Deepika Padukone.',
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
      'After the events of Stree, the town of Chanderi is being haunted again by a new headless monster named Sarkata. Starring Shraddha Kapoor, Rajkummar Rao, Pankaj Tripathi, and Abhishek Banerjee.',
    category: 'movie',
    venue: {
      name: 'Cinépolis: Grand Central',
      address: 'Seawoods, Navi Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 320,
    },
    daysFromNow: 3,
    durationHours: 2.5,
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    tags: ['Horror', 'Comedy', 'Blockbuster', 'Hindi'],
    sections: [
      { name: 'VIP RECLINER', rows: ['A', 'B'], seatsPerRow: 10, price: 550 },
      { name: 'CLUB', rows: ['C', 'D', 'E', 'F'], seatsPerRow: 16, price: 300 },
      { name: 'EXECUTIVE', rows: ['G', 'H', 'I'], seatsPerRow: 18, price: 180 },
    ],
  },

  // --- Mumbai Live Shows ---
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
    title: 'IPL 2025: Mumbai Indians vs Chennai Super Kings',
    category: 'sports',
    description:
      'The El Clásico of T20 Cricket! Rohit Sharma, Hardik Pandya and the Mumbai Indians battle MS Dhoni and the Chennai Super Kings at the iconic Wankhede Stadium.',
    venue: {
      name: 'Wankhede Stadium',
      address: 'Marine Lines, Churchgate',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      capacity: 33000,
    },
    daysFromNow: 10,
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

  // --- Delhi-NCR Live Shows ---
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
    daysFromNow: 6,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    tags: ['Standup Comedy', 'Hindi', 'Delhi Jokes'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 15, price: 1800 },
      { name: 'EXECUTIVE', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 999 },
    ],
  },
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
    daysFromNow: 9,
    durationHours: 4.5,
    banner: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    tags: ['Cricket', 'IPL 2025', 'DC vs RCB'],
    sections: [
      { name: 'PLATINUM CORPORATE', rows: ['A', 'B'], seatsPerRow: 14, price: 8500 },
      { name: 'CLUB STAND', rows: ['C', 'D', 'E'], seatsPerRow: 22, price: 3200 },
      { name: 'GENERAL STAND', rows: ['F', 'G', 'H', 'I'], seatsPerRow: 28, price: 1200 },
    ],
  },

  // --- Bengaluru Live Shows ---
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
    daysFromNow: 5,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    tags: ['Standup Comedy', 'English', 'Musical Comedy'],
    sections: [
      { name: 'VIP ROWS', rows: ['A', 'B'], seatsPerRow: 14, price: 2000 },
      { name: 'BALCONY', rows: ['C', 'D', 'E'], seatsPerRow: 18, price: 1000 },
    ],
  },

  // --- Hyderabad Live Shows ---
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
    daysFromNow: 7,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    tags: ['Comedy', 'Crowd Work', 'Humor'],
    sections: [
      { name: 'VIP FRONT', rows: ['A', 'B'], seatsPerRow: 16, price: 2000 },
      { name: 'PREMIUM', rows: ['C', 'D', 'E'], seatsPerRow: 20, price: 1200 },
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

  // Seed events with multi-tier seating
  let totalSeatsCreated = 0;
  for (const eventData of BOOKMYSHOW_EVENTS) {
    const now = new Date();
    const date = new Date(now.getTime() + eventData.daysFromNow * 24 * 60 * 60 * 1000);
    const endDate = new Date(date.getTime() + eventData.durationHours * 60 * 60 * 1000);

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
      },
    });

    const seats = [];
    for (const section of eventData.sections) {
      for (const row of section.rows) {
        for (let i = 1; i <= section.seatsPerRow; i++) {
          seats.push({
            eventId: event.id,
            seatNumber: `${row}${i}`,
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
      `  🎟️  "${event.title}" [${eventData.venue.city}] seeded with ${seats.length} seats (Min: ₹${minPrice}, Max: ₹${maxPrice})`
    );
  }

  console.log(
    `\n🎉 Seeded ${BOOKMYSHOW_EVENTS.length} BookMyShow events across major Indian cities with ${totalSeatsCreated} total seats into PostgreSQL!`
  );
  console.log('\n🔑 Demo credentials:');
  console.log('   Admin:     admin@demo.com     / password123');
  console.log('   Organizer: organizer@demo.com / password123');
  console.log('   User:      user@demo.com      / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
