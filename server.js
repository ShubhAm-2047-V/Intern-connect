const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data File Paths
const DATA_DIR = path.join(__dirname, 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Helper function to read/write JSON
const readData = (file) => {
    if (!fs.existsSync(file)) return [];
    try {
        const data = fs.readFileSync(file);
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", file, err);
        return [];
    }
};

const writeData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing file:", file, err);
    }
};

// Initialize Data Files if not exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(JOBS_FILE)) writeData(JOBS_FILE, [
    { id: 1, title: 'Frontend Developer Intern', company: 'TechSolutions Inc.', location: 'Remote', stipend: 'Paid', type: 'Programming', verified: true, skills: ['React', 'CSS'] },
    { id: 2, title: 'Data Science Intern', company: 'DataCorp', location: 'New York', stipend: 'Paid', type: 'Data', verified: true, skills: ['Python', 'SQL'] },
    { id: 3, title: 'UX Design Intern', company: 'CreativeAgency', location: 'Remote', stipend: 'Unpaid', type: 'Design', verified: false, skills: ['Figma'] }
]);
if (!fs.existsSync(APPLICATIONS_FILE)) writeData(APPLICATIONS_FILE, []);
if (!fs.existsSync(CONTACTS_FILE)) writeData(CONTACTS_FILE, []);


// --- API Routes ---

// Get all jobs
app.get('/api/jobs', (req, res) => {
    const jobs = readData(JOBS_FILE);
    res.json(jobs);
});

// Post a new job
app.post('/api/jobs', (req, res) => {
    const jobs = readData(JOBS_FILE);
    const newJob = {
        id: Date.now(),
        ...req.body,
        verified: false // New jobs need manual verification (logic)
    };
    jobs.push(newJob);
    writeData(JOBS_FILE, jobs);
    res.status(201).json(newJob);
});

// Apply for a job
app.post('/api/apply', (req, res) => {
    const applications = readData(APPLICATIONS_FILE);
    const newApplication = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'Pending',
        ...req.body
    };
    applications.push(newApplication);
    writeData(APPLICATIONS_FILE, applications);
    res.status(201).json({ message: 'Application submitted successfully!' });
});

// Get applications (for dashboard)
app.get('/api/applications', (req, res) => {
    const applications = readData(APPLICATIONS_FILE);
    res.json(applications);
});

// Contact Form
app.post('/api/contact', (req, res) => {
    const contacts = readData(CONTACTS_FILE);
    const newContact = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...req.body
    };
    contacts.push(newContact);
    writeData(CONTACTS_FILE, contacts);
    res.status(201).json({ message: 'Message received!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
