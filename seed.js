require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test user
  const email = 'testuser@example.com';
  const password = await bcrypt.hash('testpassword', 10);
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, password });
    console.log('Test user created:', email);
  } else {
    console.log('Test user already exists:', email);
  }

  // Random data helpers
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Sara', 'Michael', 'Olivia', 'David', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lee'];
  const companies = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Stark Industries', 'Wayne Enterprises', 'Wonka Inc', 'Cyberdyne', 'Hooli'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Miami', 'Dallas', 'Seattle', 'Boston', 'Denver'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'FL', 'WA', 'MA', 'CO', 'GA'];

  function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomEmail(first, last, i) { return `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`; }
  function randomPhone() { return `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`; }

  // Seed 120 leads
  const leads = [];
  for (let i = 1; i <= 120; i++) {
    const first_name = randomItem(firstNames);
    const last_name = randomItem(lastNames);
    leads.push({
      first_name,
      last_name,
      email: randomEmail(first_name, last_name, i),
      phone: randomPhone(),
      company: randomItem(companies),
      city: randomItem(cities),
      state: randomItem(states),
      source: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'][i % 6],
      status: ['new', 'contacted', 'qualified', 'lost', 'won'][i % 5],
      score: Math.floor(Math.random() * 101),
      lead_value: Math.floor(Math.random() * 10000),
      last_activity_at: new Date(Date.now() - Math.random() * 1000000000),
      is_qualified: Math.random() > 0.5,
      created_at: new Date(Date.now() - Math.random() * 1000000000),
      updated_at: new Date(),
    });
  }
  await Lead.deleteMany({});
  await Lead.insertMany(leads);
  console.log('Seeded 120 random leads');
  process.exit();
}

seed();
