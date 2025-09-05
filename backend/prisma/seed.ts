import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bizfundraiser.com' },
    update: {},
    create: {
      email: 'admin@bizfundraiser.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      kycCompleted: true,
      phone: '+2348000000000',
      address: 'Lagos, Nigeria',
      idNumber: 'ADM001',
    },
  });

  // Create admin wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 0,
    },
  });

  // Create investor users
  const investorPassword = await bcrypt.hash('investor123', 10);
  const investors = [];
  
  for (let i = 1; i <= 5; i++) {
    const investor = await prisma.user.upsert({
      where: { email: `investor${i}@example.com` },
      update: {},
      create: {
        email: `investor${i}@example.com`,
        password: investorPassword,
        firstName: `Investor`,
        lastName: `${i}`,
        role: UserRole.INVESTOR,
        kycCompleted: true,
        phone: `+234800000000${i}`,
        address: `Lagos, Nigeria`,
        idNumber: `INV00${i}`,
      },
    });

    // Create investor wallet with some balance
    await prisma.wallet.upsert({
      where: { userId: investor.id },
      update: {},
      create: {
        userId: investor.id,
        balance: 100000 + (i * 50000), // Different starting balances
      },
    });

    investors.push(investor);
  }

  // Create business users
  const businessPassword = await bcrypt.hash('business123', 10);
  const businesses = [];
  
  const businessData = [
    {
      name: 'TechStart Solutions',
      email: 'business1@example.com',
      description: 'AI-powered mobile app development',
    },
    {
      name: 'GreenEnergy Ltd',
      email: 'business2@example.com',
      description: 'Renewable energy solutions',
    },
    {
      name: 'AgriTech Innovations',
      email: 'business3@example.com',
      description: 'Smart farming technology',
    },
  ];

  for (let i = 0; i < businessData.length; i++) {
    const business = await prisma.user.upsert({
      where: { email: businessData[i].email },
      update: {},
      create: {
        email: businessData[i].email,
        password: businessPassword,
        firstName: `Business`,
        lastName: `${i + 1}`,
        role: UserRole.BUSINESS,
        kycCompleted: true,
        phone: `+23480000000${i + 1}0`,
        address: `Lagos, Nigeria`,
        idNumber: `BUS00${i + 1}`,
        businessName: businessData[i].name,
        cacNumber: `CAC${i + 1}234567`,
        taxId: `TAX${i + 1}234567`,
        businessAddress: `Lagos, Nigeria`,
      },
    });

    // Create business wallet
    await prisma.wallet.upsert({
      where: { userId: business.id },
      update: {},
      create: {
        userId: business.id,
        balance: 0,
      },
    });

    businesses.push(business);
  }

  // Create sample projects
  const projects = [];
  
  const projectData = [
    {
      title: 'AI-Powered Mobile Banking App',
      description: 'Revolutionary mobile banking application with AI-driven financial insights and automated investment recommendations.',
      amountRequested: 5000000,
      duration: 12,
      expectedROI: 25,
      businessId: businesses[0].id,
    },
    {
      title: 'Solar Panel Manufacturing Plant',
      description: 'Establishment of a modern solar panel manufacturing facility to meet growing demand for renewable energy.',
      amountRequested: 15000000,
      duration: 18,
      expectedROI: 30,
      businessId: businesses[1].id,
    },
    {
      title: 'Smart Irrigation System',
      description: 'IoT-based smart irrigation system for smallholder farmers to optimize water usage and increase crop yield.',
      amountRequested: 3000000,
      duration: 8,
      expectedROI: 20,
      businessId: businesses[2].id,
    },
    {
      title: 'E-commerce Platform for SMEs',
      description: 'Comprehensive e-commerce platform designed specifically for small and medium enterprises in Nigeria.',
      amountRequested: 8000000,
      duration: 15,
      expectedROI: 35,
      businessId: businesses[0].id,
    },
    {
      title: 'Electric Vehicle Charging Network',
      description: 'Nationwide network of electric vehicle charging stations to support the growing EV market.',
      amountRequested: 20000000,
      duration: 24,
      expectedROI: 28,
      businessId: businesses[1].id,
    },
  ];

  for (const projectInfo of projectData) {
    const project = await prisma.project.create({
      data: {
        ...projectInfo,
        status: Math.random() > 0.3 ? ProjectStatus.APPROVED : ProjectStatus.PENDING,
        documents: [
          'https://example.com/business-plan.pdf',
          'https://example.com/financial-projections.pdf',
          'https://example.com/team-profile.pdf',
        ],
      },
    });
    projects.push(project);
  }

  // Create some sample investments for approved projects
  const approvedProjects = projects.filter(p => p.status === ProjectStatus.APPROVED);
  
  for (const project of approvedProjects) {
    // Randomly select 2-4 investors to invest in this project
    const numInvestors = Math.floor(Math.random() * 3) + 2;
    const selectedInvestors = investors.slice(0, numInvestors);
    
    let totalInvested = 0;
    const maxInvestment = Number(project.amountRequested) * 0.8; // Max 80% of requested amount
    
    for (const investor of selectedInvestors) {
      const investmentAmount = Math.floor(Math.random() * (maxInvestment / numInvestors)) + 100000;
      const expectedReturn = (investmentAmount * project.expectedROI) / 100;
      
      await prisma.investment.create({
        data: {
          investorId: investor.id,
          projectId: project.id,
          amount: investmentAmount,
          expectedReturn,
        },
      });
      
      totalInvested += investmentAmount;
      
      // Update investor wallet balance (deduct investment)
      await prisma.wallet.update({
        where: { userId: investor.id },
        data: {
          balance: {
            decrement: investmentAmount,
          },
        },
      });
    }
    
    // Update project with amount raised
    await prisma.project.update({
      where: { id: project.id },
      data: {
        amountRaised: totalInvested,
        status: totalInvested >= Number(project.amountRequested) ? ProjectStatus.FUNDED : ProjectStatus.APPROVED,
        fundedAt: totalInvested >= Number(project.amountRequested) ? new Date() : null,
      },
    });
  }

  // Create some sample transactions
  for (const investor of investors) {
    // Create some deposit transactions
    for (let i = 0; i < 3; i++) {
      await prisma.transaction.create({
        data: {
          userId: investor.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: 50000 + (i * 25000),
          description: `Initial deposit ${i + 1}`,
          reference: `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          completedAt: new Date(),
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Created ${investors.length} investors`);
  console.log(`🏢 Created ${businesses.length} businesses`);
  console.log(`📋 Created ${projects.length} projects`);
  console.log(`💰 Created sample investments and transactions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });