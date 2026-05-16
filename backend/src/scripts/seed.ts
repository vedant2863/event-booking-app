import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking';

// ── Inline schema copies (avoid circular imports) ────────────────────────────

const userSchema = new mongoose.Schema({
  username: String, email: String, password: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const eventSchema = new mongoose.Schema({
  title: String, description: String, venue: Object,
  category: String, date: Date, endDate: Date,
  organizer: mongoose.Schema.Types.ObjectId,
  banner: String, tags: [String],
  isPublished: { type: Boolean, default: true },
  isCancelled: { type: Boolean, default: false },
  totalSeats: Number, availableSeats: Number,
  minPrice: Number, maxPrice: Number,
}, { timestamps: true });
const Event = mongoose.model('Event', eventSchema);

const seatSchema = new mongoose.Schema({
  eventId: mongoose.Schema.Types.ObjectId,
  seatNumber: String, row: String, section: String,
  price: Number, status: { type: String, default: 'available' },
}, { timestamps: true });
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
const Seat = mongoose.model('Seat', seatSchema);

// ── Seed data ─────────────────────────────────────────────────────────────────

const DEMO_EVENTS = [
  {
    title: 'Arijit Singh Live in Concert',
    description: 'Experience the magic of Arijit Singh live! India\'s most beloved singer performs his greatest hits spanning two decades. An evening you will never forget.',
    category: 'music',
    venue: { name: 'MMRDA Grounds', address: 'Bandra-Kurla Complex', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 20000 },
    daysFromNow: 15,
    durationHours: 4,
    banner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    tags: ['bollywood', 'live-music', 'concert'],
    sections: [
      { name: 'Golden Pit', rows: ['A','B','C'], seatsPerRow: 20, price: 5000 },
      { name: 'Silver', rows: ['D','E','F','G','H'], seatsPerRow: 25, price: 3000 },
      { name: 'General', rows: ['I','J','K','L','M','N','O'], seatsPerRow: 30, price: 1500 },
    ],
  },
  {
    title: 'ReactConf India 2025',
    description: 'The premier React.js conference in India. Learn from top engineers, attend workshops on React 19, Server Components, Next.js App Router, and the future of web development.',
    category: 'tech',
    venue: { name: 'Bombay Exhibition Centre', address: 'NESCO, Goregaon', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 3000 },
    daysFromNow: 30,
    durationHours: 8,
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    tags: ['react', 'javascript', 'web-dev', 'conference'],
    sections: [
      { name: 'VIP Front', rows: ['A','B'], seatsPerRow: 15, price: 4999 },
      { name: 'Standard', rows: ['C','D','E','F','G','H','I','J'], seatsPerRow: 20, price: 1999 },
      { name: 'Balcony', rows: ['K','L','M'], seatsPerRow: 25, price: 999 },
    ],
  },
  {
    title: 'IPL 2025: MI vs CSK',
    description: 'The clash of titans! Mumbai Indians take on Chennai Super Kings in this high-voltage IPL encounter. Witness cricket at its finest.',
    category: 'sports',
    venue: { name: 'Wankhede Stadium', address: 'Marine Lines', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 33000 },
    daysFromNow: 7,
    durationHours: 5,
    banner: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    tags: ['cricket', 'ipl', 'mi', 'csk'],
    sections: [
      { name: 'Corporate Box', rows: ['A','B'], seatsPerRow: 12, price: 8000 },
      { name: 'North Stand', rows: ['C','D','E','F'], seatsPerRow: 20, price: 2500 },
      { name: 'East Stand', rows: ['G','H','I','J','K'], seatsPerRow: 25, price: 1200 },
      { name: 'General Stand', rows: ['L','M','N','O','P','Q'], seatsPerRow: 30, price: 600 },
    ],
  },
  {
    title: 'Zakir Khan: Haq Se Single',
    description: 'India\'s favourite "Sakht Launda" Zakir Khan returns with his brand new stand-up special. An evening of pure desi comedy, relatable stories, and non-stop laughter.',
    category: 'comedy',
    venue: { name: 'NCPA Tata Theatre', address: 'NCPA Marg, Nariman Point', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 1010 },
    daysFromNow: 21,
    durationHours: 2,
    banner: 'https://images.unsplash.com/photo-1525260579839-5478b265a2d1?w=800&q=80',
    tags: ['comedy', 'standup', 'hindi'],
    sections: [
      { name: 'Premium', rows: ['A','B','C'], seatsPerRow: 15, price: 2500 },
      { name: 'Standard', rows: ['D','E','F','G','H','I'], seatsPerRow: 18, price: 1200 },
    ],
  },
  {
    title: 'Kala Ghoda Arts Festival 2025',
    description: 'Mumbai\'s iconic annual arts festival returns for 9 days of art installations, live performances, food stalls, workshops, and cultural experiences across Kala Ghoda precinct.',
    category: 'art',
    venue: { name: 'Kala Ghoda Precinct', address: 'Kala Ghoda', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 5000 },
    daysFromNow: 45,
    durationHours: 10,
    banner: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80',
    tags: ['art', 'culture', 'festival', 'family'],
    sections: [
      { name: 'Day Pass', rows: ['A','B','C','D','E'], seatsPerRow: 20, price: 500 },
      { name: 'VIP All-Access', rows: ['F','G'], seatsPerRow: 10, price: 2000 },
    ],
  },
  {
    title: 'Masterchef Pop-Up: Coastal Flavours',
    description: 'A one-of-a-kind dining experience curated by MasterChef India alumni. Eight courses celebrating the coastal cuisine of India — from Kerala backwaters to Goan shores.',
    category: 'food',
    venue: { name: 'The Taj Mahal Palace', address: 'Apollo Bunder, Colaba', city: 'Mumbai', state: 'Maharashtra', country: 'India', capacity: 200 },
    daysFromNow: 12,
    durationHours: 3,
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    tags: ['food', 'dining', 'masterchef', 'gourmet'],
    sections: [
      { name: 'Dining Table', rows: ['T1','T2','T3','T4'], seatsPerRow: 8, price: 7500 },
      { name: 'Bar Seating', rows: ['B1'], seatsPerRow: 12, price: 4500 },
    ],
  },
];

// ── Main seeder ───────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Seat.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  const [adminUser, organizerUser, regularUser] = await User.insertMany([
    { username: 'admin', email: 'admin@demo.com', password: hashedPassword, role: 'admin', isVerified: true },
    { username: 'organizer', email: 'organizer@demo.com', password: hashedPassword, role: 'organizer', isVerified: true },
    { username: 'johndoe', email: 'user@demo.com', password: hashedPassword, role: 'user', isVerified: true },
  ]);
  console.log('👥 Created 3 demo users');

  // Create events with seats
  let totalSeatsCreated = 0;
  for (const eventData of DEMO_EVENTS) {
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

    const event = await Event.create({
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      venue: eventData.venue,
      date, endDate,
      organizer: organizerUser._id,
      banner: eventData.banner,
      tags: eventData.tags,
      isPublished: true,
      totalSeats,
      availableSeats: totalSeats,
      minPrice,
      maxPrice,
    });

    // Generate seats
    const seats: any[] = [];
    for (const section of eventData.sections) {
      for (const row of section.rows) {
        for (let i = 1; i <= section.seatsPerRow; i++) {
          seats.push({
            eventId: event._id,
            seatNumber: `${row}${i}`,
            row,
            section: section.name,
            price: section.price,
            status: 'available',
          });
        }
      }
    }
    await Seat.insertMany(seats);
    totalSeatsCreated += seats.length;
    console.log(`  🎭 "${event.title}" — ${seats.length} seats`);
  }

  console.log(`\n✅ Seeded ${DEMO_EVENTS.length} events with ${totalSeatsCreated} total seats`);
  console.log('\n🔑 Demo credentials:');
  console.log('   Admin:     admin@demo.com     / password123');
  console.log('   Organizer: organizer@demo.com / password123');
  console.log('   User:      user@demo.com      / password123');

  await mongoose.disconnect();
  console.log('\n🎉 Seeding complete!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
