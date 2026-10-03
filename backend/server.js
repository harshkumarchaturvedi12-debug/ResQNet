const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// ==========================================
// DATABASE FILE
// ==========================================

const databasePath =
    path.join(__dirname, "database.json");

function readDatabase() {

    try {

        const data =
            fs.readFileSync(
                databasePath,
                "utf8"
            );

        return JSON.parse(data);

    } catch (error) {

        return {
            incidents: [],
            contacts: [],
            alerts: []
        };
    }
}

function writeDatabase(database) {

    fs.writeFileSync(
        databasePath,
        JSON.stringify(
            database,
            null,
            4
        )
    );
}

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

// ==========================================
// HOME
// ==========================================

app.get("/", function (req, res) {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "dashboard.html"
        )
    );
});

// ==========================================
// BACKEND STATUS
// ==========================================

app.get(
    "/api/status",
    function (req, res) {

        res.json({

            success: true,

            message:
                "ResQNet backend is running successfully.",

            project:
                "ResQNet Smart Emergency Assistance Platform",

            server:
                "Node.js + Express",

            database:
                "JSON File Database",

            status:
                "Active"
        });
    }
);

// ==========================================
// INCIDENTS - GET
// ==========================================

app.get(
    "/api/incidents",
    function (req, res) {

        const database =
            readDatabase();

        res.json({

            success: true,

            incidents:
                database.incidents
        });
    }
);

// ==========================================
// INCIDENTS - POST
// ==========================================

app.post(
    "/api/incidents",
    function (req, res) {

        const database =
            readDatabase();

        const incident = {

            id:
                Date.now(),

            type:
                req.body.type,

            location:
                req.body.location,

            date:
                req.body.date,

            description:
                req.body.description,

            createdAt:
                new Date().toISOString()
        };

        database.incidents.push(
            incident
        );

        writeDatabase(
            database
        );

        console.log(
            "New Incident Saved:",
            incident
        );

        res.status(201).json({

            success: true,

            message:
                "Incident saved successfully.",

            incident:
                incident
        });
    }
);

// ==========================================
// CONTACTS - GET
// ==========================================

app.get(
    "/api/contacts",
    function (req, res) {

        const database =
            readDatabase();

        res.json({

            success: true,

            contacts:
                database.contacts
        });
    }
);

// ==========================================
// CONTACTS - POST
// ==========================================

app.post(
    "/api/contacts",
    function (req, res) {

        const database =
            readDatabase();

        const contact = {

            id:
                Date.now(),

            name:
                req.body.name,

            phone:
                req.body.phone,

            createdAt:
                new Date().toISOString()
        };

        database.contacts.push(
            contact
        );

        writeDatabase(
            database
        );

        console.log(
            "New Emergency Contact Saved:",
            contact
        );

        res.status(201).json({

            success: true,

            message:
                "Emergency contact saved successfully.",

            contact:
                contact
        });
    }
);

// ==========================================
// EMERGENCY ALERT - POST
// ==========================================

app.post(
    "/api/emergency-alert",
    function (req, res) {

        const database =
            readDatabase();

        const alert = {

            id:
                Date.now(),

            type:
                req.body.type,

            location:
                req.body.location,

            date:
                req.body.date,

            description:
                req.body.description,

            alertTime:
                req.body.alertTime,

            createdAt:
                new Date().toISOString()
        };

        database.alerts.push(
            alert
        );

        writeDatabase(
            database
        );

        console.log(
            "Emergency Alert Saved:",
            alert
        );

        res.status(201).json({

            success: true,

            message:
                "Emergency alert saved successfully.",

            alert:
                alert
        });
    }
);

// ==========================================
// EMERGENCY ALERTS - GET
// ==========================================

app.get(
    "/api/emergency-alerts",
    function (req, res) {

        const database =
            readDatabase();

        res.json({

            success: true,

            alerts:
                database.alerts
        });
    }
);

// ==========================================
// DATABASE SUMMARY
// ==========================================

app.get(
    "/api/database",
    function (req, res) {

        const database =
            readDatabase();

        res.json({

            success: true,

            totalIncidents:
                database.incidents.length,

            totalContacts:
                database.contacts.length,

            totalAlerts:
                database.alerts.length
        });
    }
);

// ==========================================
// 404
// ==========================================

app.use(
    function (req, res) {

        res.status(404).json({

            success: false,

            message:
                "API route not found."
        });
    }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    "127.0.0.1",
    function () {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            "ResQNet Backend Server Started"
        );

        console.log(
            "=========================================="
        );

        console.log(
            "Server running at: http://localhost:5000"
        );

        console.log(
            "Dashboard: http://localhost:5000/dashboard.html"
        );

        console.log(
            "API Status: http://localhost:5000/api/status"
        );

        console.log(
            "Database: backend/database.json"
        );

        console.log(
            "=========================================="
        );

        console.log("");
    }
);