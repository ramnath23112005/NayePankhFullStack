const conversationHistory = [];

const aiResponses = [
  'Thank you for reaching out to NayePankh! How can I assist you with your volunteering journey today?',
  'That\'s great to hear! NayePankh always welcomes passionate volunteers. Would you like to know about upcoming events?',
  'Internships at NayePankh provide hands-on experience in community outreach, fundraising, marketing, IT, and more. Would you like details on any specific department?',
  'Your contribution as a volunteer makes a real difference. We have workshops, outreach programs, and fundraisers coming up!',
  'To get started, please complete your volunteer profile. This helps us match you with the right opportunities.',
  'NayePankh is committed to empowering communities through education, healthcare, and sustainable development. Every bit of help counts!',
  'Would you like to know more about our current projects? We work across multiple domains including child education, women empowerment, and environmental conservation.',
  'You can track all your volunteering hours and certificates from your personal dashboard once you\'re registered.',
  'Our training sessions help volunteers develop new skills while making a positive impact. Check the events page for upcoming training!',
  'Feel free to ask me anything about the registration process, event schedules, or how to get more involved with NayePankh!',
  'We believe in the power of collective action. Even a few hours of your time can create lasting change in someone\'s life.',
  'Looking for a specific type of volunteering? We have opportunities in teaching, healthcare, environmental work, and administrative support.',
  'Your dedication helps us reach more communities. Thank you for being part of the NayePankh family!',
  'The internship program includes mentorship, real-world projects, and a certificate upon completion. It\'s a great way to build your career while giving back.',
  'Stay tuned to our events page for the latest workshops and community programs. We regularly update with new opportunities!'
];

const postMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const userMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      userId: req.user?._id
    };

    conversationHistory.push(userMessage);

    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    const reply = aiResponses[randomIndex];

    const botMessage = {
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString()
    };

    conversationHistory.push(botMessage);

    if (conversationHistory.length > 100) {
      conversationHistory.splice(0, conversationHistory.length - 100);
    }

    res.json({
      success: true,
      data: {
        reply,
        timestamp: botMessage.timestamp,
        conversationId: conversationHistory.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getConversationHistory = async (req, res) => {
  try {
    const userHistory = conversationHistory.filter(
      msg => !msg.userId || msg.userId.toString() === req.user?._id?.toString()
    );

    res.json({
      success: true,
      data: userHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { postMessage, getConversationHistory };
