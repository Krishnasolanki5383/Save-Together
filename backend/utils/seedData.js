const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Society = require('../models/Society');
const Request = require('../models/Request');
const Poll = require('../models/Poll');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/savetogether';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Society.deleteMany({});
    await Request.deleteMany({});
    await Poll.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing database records.');

    // 1. Create Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 2. Create Admin User
    const adminUser = await User.create({
      name: 'Priya Sharma (Admin)',
      email: 'admin@greenvalley.com',
      password: hashedPassword,
      phone: '9876543210',
      flatNumber: 'A-402',
      buildingBlock: 'Tower A',
      role: 'ADMIN',
      totalSavings: 3450,
      joinedActivitiesCount: 12,
      createdRequestsCount: 5,
      completedDealsCount: 9,
    });

    // 3. Create Society "Green Valley Society"
    const society = await Society.create({
      name: 'Green Valley Society',
      city: 'Mumbai',
      locality: 'Powai',
      address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai',
      inviteCode: 'GV426X',
      createdBy: adminUser._id,
      memberCount: 426,
      totalSocietySavings: 78500,
    });

    // Assign society to admin
    adminUser.societyId = society._id;
    await adminUser.save();

    // 4. Create Member Users
    const memberUser1 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@greenvalley.com',
      password: hashedPassword,
      phone: '9812345678',
      flatNumber: 'B-104',
      buildingBlock: 'Tower B',
      societyId: society._id,
      role: 'MEMBER',
      totalSavings: 2450,
      joinedActivitiesCount: 8,
      createdRequestsCount: 3,
      completedDealsCount: 6,
    });

    const memberUser2 = await User.create({
      name: 'Ananya Patel',
      email: 'ananya@greenvalley.com',
      password: hashedPassword,
      phone: '9898989898',
      flatNumber: 'C-701',
      buildingBlock: 'Tower C',
      societyId: society._id,
      role: 'MEMBER',
      totalSavings: 1800,
      joinedActivitiesCount: 5,
      createdRequestsCount: 1,
      completedDealsCount: 4,
    });

    // 5. Create Service Requests
    const req1 = await Request.create({
      societyId: society._id,
      createdBy: adminUser._id,
      createdByName: adminUser.name,
      createdByFlat: 'Tower A - A-402',
      title: 'AC Servicing & Gas Top-up',
      category: 'AC Service',
      description: 'Looking for residents who need AC servicing and deep filter cleaning before summer heat peak.',
      targetMembers: 20,
      participantCount: 18,
      participants: [
        { userId: adminUser._id, name: adminUser.name, flatNumber: adminUser.flatNumber },
        { userId: memberUser1._id, name: memberUser1.name, flatNumber: memberUser1.flatNumber },
        { userId: memberUser2._id, name: memberUser2.name, flatNumber: memberUser2.flatNumber },
      ],
      preferredDate: 'This Saturday',
      preferredTime: 'Morning (10:00 AM - 1:00 PM)',
      estimatedIndividualPrice: 800,
      estimatedGroupPrice: 550,
      status: 'COLLECTING_MEMBERS',
      isHighDemand: true,
      quotes: [
        { providerName: 'CoolAir Services', pricePerPerson: 550, rating: 4.7, votes: [adminUser._id, memberUser1._id] },
        { providerName: 'Urban Tech Repairs', pricePerPerson: 580, rating: 4.5, votes: [memberUser2._id] },
      ],
      structuredComments: [
        {
          userId: memberUser1._id,
          userName: memberUser1.name,
          flatNumber: memberUser1.flatNumber,
          presetText: 'Saturday morning works best for me',
        },
        {
          userId: memberUser2._id,
          userName: memberUser2.name,
          flatNumber: memberUser2.flatNumber,
          presetText: 'Count me in for group booking',
        },
      ],
    });

    const req2 = await Request.create({
      societyId: society._id,
      createdBy: memberUser1._id,
      createdByName: memberUser1.name,
      createdByFlat: 'Tower B - B-104',
      title: 'Fridge Repair & Servicing',
      category: 'Appliance Repair',
      description: 'My refrigerator is making unusual noise and cooling slowly. Looking for neighbors who need appliance repair.',
      targetMembers: 15,
      participantCount: 14,
      participants: [
        { userId: memberUser1._id, name: memberUser1.name, flatNumber: memberUser1.flatNumber },
        { userId: memberUser2._id, name: memberUser2.name, flatNumber: memberUser2.flatNumber },
      ],
      preferredDate: 'This Weekend',
      preferredTime: 'Afternoon (2:00 PM - 5:00 PM)',
      estimatedIndividualPrice: 750,
      estimatedGroupPrice: 450,
      status: 'COLLECTING_MEMBERS',
      isHighDemand: true,
    });

    const req3 = await Request.create({
      societyId: society._id,
      createdBy: memberUser2._id,
      createdByName: memberUser2.name,
      createdByFlat: 'Tower C - C-701',
      title: 'Home Deep Cleaning & Sanitize',
      category: 'Cleaning',
      description: 'Professional 3BHK / 2BHK balcony & bathroom deep cleaning. Bulk discount offered for 20+ flats.',
      targetMembers: 25,
      participantCount: 23,
      participants: [
        { userId: memberUser2._id, name: memberUser2.name, flatNumber: memberUser2.flatNumber },
        { userId: adminUser._id, name: adminUser.name, flatNumber: adminUser.flatNumber },
      ],
      preferredDate: 'Next Sunday',
      preferredTime: 'Full Day Slot',
      estimatedIndividualPrice: 1200,
      estimatedGroupPrice: 850,
      status: 'TARGET_REACHED',
      isHighDemand: true,
    });

    const req4 = await Request.create({
      societyId: society._id,
      createdBy: adminUser._id,
      createdByName: adminUser.name,
      createdByFlat: 'Tower A - A-402',
      title: 'Society Pest Control Drive',
      category: 'Pest Control',
      description: 'Herbal cockroach and mosquito pest control treatment for individual apartments.',
      targetMembers: 30,
      participantCount: 31,
      participants: [
        { userId: adminUser._id, name: adminUser.name, flatNumber: adminUser.flatNumber },
        { userId: memberUser1._id, name: memberUser1.name, flatNumber: memberUser1.flatNumber },
      ],
      preferredDate: 'Sunday, 20 Sept',
      preferredTime: 'Morning 9:00 AM',
      estimatedIndividualPrice: 900,
      estimatedGroupPrice: 600,
      finalPrice: 580,
      selectedProvider: 'SafeHome Herbal Pest Control',
      status: 'DEAL_CONFIRMED',
      isHighDemand: true,
    });

    // 6. Create Poll
    await Poll.create({
      societyId: society._id,
      createdBy: adminUser._id,
      createdByName: adminUser.name,
      requestId: req1._id,
      question: 'Which day should we schedule the AC service group technician visit?',
      options: [
        { text: 'Saturday Morning (10 AM - 1 PM)', voteCount: 48, votes: [adminUser._id, memberUser1._id] },
        { text: 'Saturday Evening (4 PM - 7 PM)', voteCount: 25, votes: [memberUser2._id] },
        { text: 'Sunday Morning (10 AM - 1 PM)', voteCount: 20, votes: [] },
        { text: 'Sunday Evening (4 PM - 7 PM)', voteCount: 7, votes: [] },
      ],
      totalVotes: 100,
      voterIds: [adminUser._id, memberUser1._id, memberUser2._id],
      status: 'OPEN',
    });

    // 7. Create Announcement
    await Announcement.create({
      societyId: society._id,
      createdBy: adminUser._id,
      createdByName: adminUser.name,
      title: 'Water Tank Cleaning Scheduled',
      content: 'Overhead & underground water tank cleaning scheduled for this Sunday. Water supply will be paused from 10 AM to 2 PM.',
      eventDate: 'Sunday, 20 September',
      eventTime: '10:00 AM - 2:00 PM',
      location: 'Society Main Tanks',
      acknowledgements: [memberUser1._id, memberUser2._id],
      ackCount: 142,
    });

    // 8. Create Notifications
    await Notification.create({
      userId: memberUser1._id,
      societyId: society._id,
      type: 'REQUEST',
      title: '🔥 High Demand Alert',
      body: '18 residents are interested in AC servicing. Join to save up to ₹250/person!',
      relatedId: req1._id,
    });

    await Notification.create({
      userId: memberUser1._id,
      societyId: society._id,
      type: 'POLL',
      title: 'New Society Poll Created',
      body: 'Priya Sharma created a poll: "Which day should we schedule AC service?"',
      relatedId: req1._id,
    });

    await Notification.create({
      userId: memberUser1._id,
      societyId: society._id,
      type: 'DEAL',
      title: '🎉 Target Reached for Deep Cleaning',
      body: '23 residents joined Deep Cleaning. Bulk deal unlocked!',
      relatedId: req3._id,
    });

    console.log('✅ Database seeded successfully with Green Valley Society sample data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
