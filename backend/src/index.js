const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://mttmxr.github.io',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Utility functions
async function getOrCreateUser(telegramId, userData = {}) {
  let user = await prisma.user.findUnique({
    where: { telegramId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
    });
  }

  return user;
}

// API Routes

// Get all user data
app.get('/api/user/:telegramId/data', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        productData: true,
        audienceData: true,
        casesData: true,
        personalityLite: true,
        personalityPro: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      },
      data: {
        product: user.productData,
        audience: user.audienceData,
        cases: user.casesData,
        personalityLite: user.personalityLite,
        personalityPro: user.personalityPro
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update product data
app.post('/api/user/:telegramId/product', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { productName, targetAudience, uniqueValue, mainBenefits } = req.body;

    const user = await getOrCreateUser(telegramId);

    const productData = await prisma.productData.upsert({
      where: { userId: user.id },
      update: {
        productName,
        targetAudience,
        uniqueValue,
        mainBenefits
      },
      create: {
        userId: user.id,
        productName,
        targetAudience,
        uniqueValue,
        mainBenefits
      }
    });

    res.json({ success: true, data: productData });
  } catch (error) {
    console.error('Error saving product data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update audience data
app.post('/api/user/:telegramId/audience', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { ageLocation, familyStatus, interests, mainProblems, solutionSteps, yourSolutions } = req.body;

    const user = await getOrCreateUser(telegramId);

    const audienceData = await prisma.audienceData.upsert({
      where: { userId: user.id },
      update: {
        ageLocation,
        familyStatus,
        interests,
        mainProblems,
        solutionSteps,
        yourSolutions
      },
      create: {
        userId: user.id,
        ageLocation,
        familyStatus,
        interests,
        mainProblems,
        solutionSteps,
        yourSolutions
      }
    });

    res.json({ success: true, data: audienceData });
  } catch (error) {
    console.error('Error saving audience data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update cases data
app.post('/api/user/:telegramId/cases', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { cases } = req.body; // Array of cases

    const user = await getOrCreateUser(telegramId);

    // Delete existing cases
    await prisma.casesData.deleteMany({
      where: { userId: user.id }
    });

    // Create new cases
    const casesData = await prisma.casesData.createMany({
      data: cases.map(case_ => ({
        userId: user.id,
        clientName: case_.clientName,
        howFoundOut: case_.howFoundOut,
        goals: case_.goals,
        problems: case_.problems,
        results: case_.results,
        whatHelped: case_.whatHelped
      }))
    });

    res.json({ success: true, count: casesData.count });
  } catch (error) {
    console.error('Error saving cases data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update personality lite data
app.post('/api/user/:telegramId/personality-lite', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { interestingTopics, frequentQuestions, personalExperience, explainToBeginner, transformation, communicationStyle } = req.body;

    const user = await getOrCreateUser(telegramId);

    const personalityLite = await prisma.personalityLite.upsert({
      where: { userId: user.id },
      update: {
        interestingTopics,
        frequentQuestions,
        personalExperience,
        explainToBeginner,
        transformation,
        communicationStyle
      },
      create: {
        userId: user.id,
        interestingTopics,
        frequentQuestions,
        personalExperience,
        explainToBeginner,
        transformation,
        communicationStyle
      }
    });

    res.json({ success: true, data: personalityLite });
  } catch (error) {
    console.error('Error saving personality lite data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/Update personality pro data
app.post('/api/user/:telegramId/personality-pro', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { clientProblem, uniqueApproach, commonMistakes, contentFormat, expertMission } = req.body;

    const user = await getOrCreateUser(telegramId);

    const personalityPro = await prisma.personalityPro.upsert({
      where: { userId: user.id },
      update: {
        clientProblem,
        uniqueApproach,
        commonMistakes,
        contentFormat,
        expertMission
      },
      create: {
        userId: user.id,
        clientProblem,
        uniqueApproach,
        commonMistakes,
        contentFormat,
        expertMission
      }
    });

    res.json({ success: true, data: personalityPro });
  } catch (error) {
    console.error('Error saving personality pro data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get aggregated data for OpenAI
app.get('/api/user/:telegramId/summary', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        productData: true,
        audienceData: true,
        casesData: true,
        personalityLite: true,
        personalityPro: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Aggregate data for OpenAI
    const summary = {
      user: {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Пользователь',
        telegramId: user.telegramId
      },
      product: user.productData ? {
        name: user.productData.productName,
        targetAudience: user.productData.targetAudience,
        uniqueValue: user.productData.uniqueValue,
        mainBenefits: user.productData.mainBenefits
      } : null,
      audience: user.audienceData ? {
        ageLocation: user.audienceData.ageLocation,
        familyStatus: user.audienceData.familyStatus,
        interests: user.audienceData.interests,
        mainProblems: user.audienceData.mainProblems,
        solutionSteps: user.audienceData.solutionSteps,
        yourSolutions: user.audienceData.yourSolutions
      } : null,
      cases: user.casesData.map(case_ => ({
        clientName: case_.clientName,
        howFoundOut: case_.howFoundOut,
        goals: case_.goals,
        problems: case_.problems,
        results: case_.results,
        whatHelped: case_.whatHelped
      })),
      personalityLite: user.personalityLite ? {
        interestingTopics: user.personalityLite.interestingTopics,
        frequentQuestions: user.personalityLite.frequentQuestions,
        personalExperience: user.personalityLite.personalExperience,
        explainToBeginner: user.personalityLite.explainToBeginner,
        transformation: user.personalityLite.transformation,
        communicationStyle: user.personalityLite.communicationStyle
      } : null,
      personalityPro: user.personalityPro ? {
        clientProblem: user.personalityPro.clientProblem,
        uniqueApproach: user.personalityPro.uniqueApproach,
        commonMistakes: user.personalityPro.commonMistakes,
        contentFormat: user.personalityPro.contentFormat,
        expertMission: user.personalityPro.expertMission
      } : null
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 