const { Inngest } = require('inngest');

// Create a client to send and receive events
const inngest = new Inngest({ id: "employee-management" });

module.exports = inngest;
