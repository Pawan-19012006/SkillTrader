const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mock Database
const sessions = [
    {
        id: 'session_1',
        title: "Recursion Explained Simply",
        guide: "Sarah Chen",
        cost: 50,
        meetLink: "https://meet.google.com/abc-defg-hij" // This will be hidden until booking
    },
    {
        id: 'session_2',
        title: "Advanced Framer Motion",
        guide: "Sarah Chen",
        cost: 150,
        meetLink: "https://meet.google.com/uvw-xyz-123"
    }
];

const bookings = new Set(); // Simple set to track user bookings: "userId:sessionId"

/**
 * GET /sessions
 * Returns sessions without exposing private meet links
 */
app.get('/sessions', (req, res) => {
    const { userId } = req.query;
    
    const safeSessions = sessions.map(session => {
        const isBooked = bookings.has(`${userId}:${session.id}`);
        return {
            ...session,
            meetLink: isBooked ? session.meetLink : null,
            isLocked: !isBooked
        };
    });
    
    res.json(safeSessions);
});

/**
 * POST /book-session
 * Records a booking and returns the now-unlocked link
 */
app.post('/book-session', async (req, res) => {
    const { userId, conceptId, conceptName, guideName } = req.body;

    console.log(`Booking request received: ${conceptName} for user ${userId}`);

    // Find the session
    const session = sessions.find(s => s.title === conceptName || s.id === conceptId);
    
    // Simulate booking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (session) {
        bookings.add(`${userId}:${session.id}`);
        
        return res.json({
            success: true,
            meetLink: session.meetLink,
            message: 'Session successfully synchronized. Link unlocked.',
            session: {
                ...session,
                userId,
                status: 'booked'
            }
        });
    }

    res.status(404).json({
        success: false,
        message: 'Session protocol not found.'
    });
});

app.listen(PORT, () => {
    console.log(`ConceptSwap Backend running on port ${PORT}`);
    console.log('Creator-managed meeting link system active (Local Sync).');
});
