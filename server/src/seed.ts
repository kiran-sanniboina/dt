import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from './config/db';
import { User } from './models/User';
import { Year } from './models/Year';
import { Section } from './models/Section';
import { Team } from './models/Team';
import { Project } from './models/Project';
import { Rating } from './models/Rating';

dotenv.config();

export const seedDatabase = async (force: boolean = false) => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !force) {
      console.log('[Seed] Database already contains records. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Initializing seed data...');
    if (force) {
      await User.deleteMany({});
      await Year.deleteMany({});
      await Section.deleteMany({});
      await Team.deleteMany({});
      await Project.deleteMany({});
      await Rating.deleteMany({});
    }

    // 1. Create Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await User.create({
      name: 'Dr. Ramesh Naidu (CSE Faculty)',
      email: 'teacher@rguktsklm.ac.in',
      password: teacherPassword,
      role: 'TEACHER',
    });

    // 2. Create Academic Year
    const year2026 = await Year.create({
      year: '2026',
      isActive: true,
    });

    // 3. Create Sections
    const sectionA = await Section.create({
      yearId: year2026._id,
      name: 'CSE-A',
    });
    const sectionB = await Section.create({
      yearId: year2026._id,
      name: 'CSE-B',
    });

    // 4. Create Teams with credentials
    const teamPasswordHash = await bcrypt.hash('password123', 10);

    const team1 = await Team.create({
      yearId: year2026._id,
      sectionId: sectionA._id,
      name: 'Team Alpha',
      members: ['Rahul Kumar', 'Akash Varma', 'Sai Krishna', 'Kiran Teja'],
      teamLeadName: 'Rahul Kumar',
      teamLeadEmail: 'rahul@rguktsklm.ac.in',
      password: teamPasswordHash,
      isSubmitted: true,
    });

    const team2 = await Team.create({
      yearId: year2026._id,
      sectionId: sectionA._id,
      name: 'Team Beta',
      members: ['Priya Sharma', 'Ananya Roy', 'Divya Reddy'],
      teamLeadName: 'Priya Sharma',
      teamLeadEmail: 'priya@rguktsklm.ac.in',
      password: teamPasswordHash,
      isSubmitted: true,
    });

    const team3 = await Team.create({
      yearId: year2026._id,
      sectionId: sectionB._id,
      name: 'Team Gamma',
      members: ['Suresh Raina', 'Manoj Kumar', 'Ravi Shankar'],
      teamLeadName: 'Suresh Raina',
      teamLeadEmail: 'suresh@rguktsklm.ac.in',
      password: teamPasswordHash,
      isSubmitted: false, // Ready for fresh submission testing
    });

    // 5. Create Projects
    const project1 = await Project.create({
      teamId: team1._id,
      yearId: year2026._id,
      sectionId: sectionA._id,
      title: 'Smart Campus IoT Navigation System',
      description: 'An automated campus indoor navigation and resource locator using BLE beacons, real-time map tracking, and room occupancy sensors for university students and visitors.',
      liveUrl: 'https://example-project.vercel.app',
      status: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 86400000 * 2),
    });

    const project2 = await Project.create({
      teamId: team2._id,
      yearId: year2026._id,
      sectionId: sectionA._id,
      title: 'Automated Exam Seat Allocation Portal',
      description: 'A web application to optimize classroom allocation, prevent malpractice by shuffling student roll numbers across branches, and generating attendance hall slips with instant barcode verification.',
      liveUrl: 'https://exam-portal.vercel.app',
      status: 'RATED',
      submittedAt: new Date(Date.now() - 86400000 * 4),
    });

    // 6. Create Rating for Project 2
    const rating = await Rating.create({
      projectId: project2._id,
      teacherId: teacher._id,
      criteria: {
        technicalApproach: 14,
        uiUxDesign: 13,
        designThinking: 9,
        functionality: 18,
        innovation: 13,
        projectQuality: 9,
        problemSolving: 13,
      },
      totalScore: 89,
      feedback: 'Exceptional architecture and algorithmic distribution of seats. Clean UI and great responsive layout across devices.',
      evaluatedAt: new Date(),
    });

    project2.ratingId = rating._id as any;
    await project2.save();

    console.log('\n=============================================================');
    console.log('🎉 INITIAL DEMO DATA LOADED SUCCESSFULLY!');
    console.log('-------------------------------------------------------------');
    console.log('👨‍🏫 Teacher Portal   : teacher@rguktsklm.ac.in / teacher123');
    console.log('👨‍🎓 Team Beta (Rated): priya@rguktsklm.ac.in   / password123');
    console.log('👨‍🎓 Team Alpha (Pending): rahul@rguktsklm.ac.in / password123');
    console.log('👨‍🎓 Team Gamma (Ready to Submit): suresh@rguktsklm.ac.in / password123');
    console.log('=============================================================\n');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
  }
};

// If run directly via CLI
if (require.main === module) {
  connectDB().then(async () => {
    await seedDatabase(true);
    await closeDB();
  });
}
