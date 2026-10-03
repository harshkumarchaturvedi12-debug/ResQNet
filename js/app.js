// ==========================================
// RESQNET FRONTEND + BACKEND CONNECTION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("ResQNet application loaded successfully.");

    const API_URL = "http://127.0.0.1:5000/api";

    // ==========================================
    // LOCAL STORAGE FUNCTIONS
    // ==========================================

    function getIncidents() {
        return JSON.parse(
            localStorage.getItem("resqnetIncidents")
        ) || [];
    }

    function saveIncidents(incidents) {
        localStorage.setItem(
            "resqnetIncidents",
            JSON.stringify(incidents)
        );
    }

    function getContacts() {
        return JSON.parse(
            localStorage.getItem("resqnetContacts")
        ) || [];
    }

    function saveContacts(contacts) {
        localStorage.setItem(
            "resqnetContacts",
            JSON.stringify(contacts)
        );
    }

    // ==========================================
    // BACKEND CONNECTION TEST
    // ==========================================

    async function testBackendConnection() {

        try {

            const response =
                await fetch(`${API_URL}/status`);

            const data =
                await response.json();

            console.log(
                "Backend Status:",
                data
            );

        } catch (error) {

            console.error(
                "Backend connection failed:",
                error
            );

        }
    }

    testBackendConnection();

    // ==========================================
    // DASHBOARD COUNTS
    // ==========================================

    const totalIncidentsElement =
        document.getElementById("totalIncidents");

    const totalContactsElement =
        document.getElementById("totalContacts");

    function updateDashboardCounts() {

        const incidents =
            getIncidents();

        const contacts =
            getContacts();

        if (totalIncidentsElement) {

            totalIncidentsElement.textContent =
                incidents.length;
        }

        if (totalContactsElement) {

            totalContactsElement.textContent =
                contacts.length;
        }
    }

    updateDashboardCounts();

    // ==========================================
    // DATE FORMAT
    // ==========================================

    function formatDate(dateString) {

        if (!dateString) {

            return "Date not available";
        }

        const date =
            new Date(dateString + "T00:00:00");

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }

    // ==========================================
    // INCIDENT ICON
    // ==========================================

    function getIconClass(type) {

        if (type === "Road Accident") {

            return "accident";
        }

        if (type === "Medical Assistance") {

            return "medical";
        }

        if (type === "Fire Emergency") {

            return "fire";
        }

        return "safety";
    }

    function getIcon(type) {

        if (type === "Road Accident") {

            return "!";
        }

        if (type === "Medical Assistance") {

            return "+";
        }

        if (type === "Fire Emergency") {

            return "!";
        }

        return "✓";
    }

    // ==========================================
    // CREATE INCIDENT CARD
    // ==========================================

    function createIncidentCard(incident) {

        const card =
            document.createElement("div");

        card.className =
            "incident-card";

        card.innerHTML = `

            <div class="incident-icon ${getIconClass(incident.type)}">
                ${getIcon(incident.type)}
            </div>

            <div class="incident-details">

                <span>
                    ${incident.type.toUpperCase()}
                </span>

                <h2>
                    ${incident.type}
                </h2>

                <p>
                    ${incident.description}
                </p>

                <div class="incident-meta">

                    <span>
                        📅 ${formatDate(incident.date)}
                    </span>

                    <span>
                        📍 ${incident.location}
                    </span>

                </div>

            </div>

            <span class="status recorded">
                Recorded
            </span>
        `;

        return card;
    }

    // ==========================================
    // INCIDENT FORM
    // ==========================================

    const incidentForm =
        document.getElementById("incidentForm");

    const incidentList =
        document.getElementById("incidentList");

    if (incidentForm && incidentList) {

        const savedIncidents =
            getIncidents();

        savedIncidents
            .slice()
            .reverse()
            .forEach(function (incident) {

                const card =
                    createIncidentCard(
                        incident
                    );

                incidentList.appendChild(card);
            });

        incidentForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const incident = {

                    type:
                        document.getElementById(
                            "incidentType"
                        ).value,

                    location:
                        document.getElementById(
                            "incidentLocation"
                        ).value.trim(),

                    date:
                        document.getElementById(
                            "incidentDate"
                        ).value,

                    description:
                        document.getElementById(
                            "incidentDescription"
                        ).value.trim()
                };

                // SAVE LOCALLY
                let incidents =
                    getIncidents();

                incidents.push(incident);

                saveIncidents(
                    incidents
                );

                // SEND TO BACKEND
                try {

                    const response =
                        await fetch(
                            `${API_URL}/incidents`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        incident
                                    )
                            }
                        );

                    const data =
                        await response.json();

                    console.log(
                        "Backend Incident Response:",
                        data
                    );

                } catch (error) {

                    console.error(
                        "Incident backend error:",
                        error
                    );
                }

                const card =
                    createIncidentCard(
                        incident
                    );

                incidentList.prepend(card);

                incidentForm.reset();

                updateDashboardCounts();

                alert(
                    "Incident recorded successfully."
                );
            }
        );
    }

    // ==========================================
    // CONTACT CARD
    // ==========================================

    function createContactCard(contact) {

        const card =
            document.createElement("div");

        card.className =
            "contact-card saved-contact-card";

        card.innerHTML = `

            <div class="contact-icon support">
                ✓
            </div>

            <div class="contact-info">

                <span>
                    TRUSTED CONTACT
                </span>

                <h2>
                    ${contact.name}
                </h2>

                <p>
                    ${contact.phone}
                </p>

            </div>

            <a
                href="tel:${contact.phone}"
                class="call-btn"
            >
                Call
            </a>
        `;

        return card;
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================

    const contactForm =
        document.getElementById("contactForm");

    const contactList =
        document.getElementById("contactList");

    if (contactForm && contactList) {

        const savedContacts =
            getContacts();

        if (savedContacts.length > 0) {

            const emptyMessage =
                contactList.querySelector(
                    ".empty-contact"
                );

            if (emptyMessage) {

                emptyMessage.remove();
            }

            savedContacts
                .slice()
                .reverse()
                .forEach(function (contact) {

                    const card =
                        createContactCard(
                            contact
                        );

                    contactList.prepend(card);
                });
        }

        contactForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const name =
                    document.getElementById(
                        "contactName"
                    ).value.trim();

                const phone =
                    document.getElementById(
                        "contactPhone"
                    ).value.trim();

                const contact = {

                    name: name,

                    phone: phone
                };

                // SAVE LOCALLY
                let contacts =
                    getContacts();

                contacts.push(contact);

                saveContacts(
                    contacts
                );

                // SEND TO BACKEND
                try {

                    const response =
                        await fetch(
                            `${API_URL}/contacts`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        contact
                                    )
                            }
                        );

                    const data =
                        await response.json();

                    console.log(
                        "Backend Contact Response:",
                        data
                    );

                } catch (error) {

                    console.error(
                        "Contact backend error:",
                        error
                    );
                }

                const emptyMessage =
                    contactList.querySelector(
                        ".empty-contact"
                    );

                if (emptyMessage) {

                    emptyMessage.remove();
                }

                const card =
                    createContactCard(
                        contact
                    );

                contactList.prepend(card);

                contactForm.reset();

                updateDashboardCounts();

                alert(
                    "Emergency contact added successfully."
                );
            }
        );
    }

    // ==========================================
    // EMERGENCY NOTIFICATION
    // ==========================================

    function showEmergencyNotification() {

        const oldNotification =
            document.getElementById(
                "resqnetAlertNotification"
            );

        if (oldNotification) {

            oldNotification.remove();
        }

        const notification =
            document.createElement("div");

        notification.id =
            "resqnetAlertNotification";

        notification.innerHTML = `

            <div class="resqnet-notification-icon">
                ✓
            </div>

            <div class="resqnet-notification-content">

                <strong>
                    Emergency Alert Created
                </strong>

                <p>
                    Your alert has been recorded in the
                    ResQNet system.
                </p>

                <small>
                    Backend connection active.
                </small>

            </div>

            <button
                class="resqnet-notification-close"
                aria-label="Close notification"
            >
                ×
            </button>
        `;

        notification.style.position = "fixed";
        notification.style.top = "25px";
        notification.style.right = "25px";
        notification.style.width = "390px";
        notification.style.maxWidth =
            "calc(100vw - 40px)";
        notification.style.background =
            "#ffffff";
        notification.style.border =
            "1px solid #d1fae5";
        notification.style.borderLeft =
            "5px solid #16a34a";
        notification.style.borderRadius =
            "14px";
        notification.style.padding =
            "18px";
        notification.style.display =
            "flex";
        notification.style.alignItems =
            "flex-start";
        notification.style.gap =
            "13px";
        notification.style.boxShadow =
            "0 15px 40px rgba(0,0,0,0.16)";
        notification.style.zIndex =
            "99999";
        notification.style.fontFamily =
            "Arial, Helvetica, sans-serif";

        const icon =
            notification.querySelector(
                ".resqnet-notification-icon"
            );

        icon.style.width = "38px";
        icon.style.height = "38px";
        icon.style.flexShrink = "0";
        icon.style.borderRadius = "50%";
        icon.style.background =
            "#dcfce7";
        icon.style.color =
            "#16a34a";
        icon.style.display =
            "flex";
        icon.style.alignItems =
            "center";
        icon.style.justifyContent =
            "center";
        icon.style.fontWeight =
            "bold";
        icon.style.fontSize =
            "18px";

        const content =
            notification.querySelector(
                ".resqnet-notification-content"
            );

        content.style.flex = "1";

        const title =
            content.querySelector(
                "strong"
            );

        title.style.display =
            "block";
        title.style.color =
            "#172033";
        title.style.fontSize =
            "15px";
        title.style.marginBottom =
            "5px";

        const message =
            content.querySelector(
                "p"
            );

        message.style.margin =
            "0 0 5px";
        message.style.color =
            "#667085";
        message.style.fontSize =
            "12px";
        message.style.lineHeight =
            "1.5";

        const note =
            content.querySelector(
                "small"
            );

        note.style.color =
            "#98a2b3";
        note.style.fontSize =
            "10px";

        const closeButton =
            notification.querySelector(
                ".resqnet-notification-close"
            );

        closeButton.style.border =
            "none";
        closeButton.style.background =
            "transparent";
        closeButton.style.color =
            "#98a2b3";
        closeButton.style.fontSize =
            "22px";
        closeButton.style.cursor =
            "pointer";
        closeButton.style.lineHeight =
            "1";

        closeButton.addEventListener(
            "click",
            function () {

                notification.remove();
            }
        );

        document.body.appendChild(
            notification
        );

        setTimeout(function () {

            if (notification) {

                notification.remove();
            }

        }, 5000);
    }

    // ==========================================
    // EMERGENCY ALERT
    // ==========================================

    const emergencyAlertButton =
        document.getElementById(
            "emergencyAlertButton"
        );

    if (emergencyAlertButton) {

        emergencyAlertButton.addEventListener(
            "click",
            async function () {

                const now =
                    new Date();

                const alertDate =
                    now.toISOString()
                        .split("T")[0];

                const alertTime =
                    now.toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );

                const emergencyIncident = {

                    type:
                        "Emergency Alert",

                    location:
                        "Location not provided",

                    date:
                        alertDate,

                    description:
                        "Emergency alert created from ResQNet at " +
                        alertTime,

                    alertTime:
                        alertTime
                };

                // SAVE LOCALLY
                let incidents =
                    getIncidents();

                incidents.push(
                    emergencyIncident
                );

                saveIncidents(
                    incidents
                );

                // SEND ALERT TO BACKEND
                try {

                    const response =
                        await fetch(
                            `${API_URL}/emergency-alert`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        emergencyIncident
                                    )
                            }
                        );

                    const data =
                        await response.json();

                    console.log(
                        "Backend Emergency Response:",
                        data
                    );

                } catch (error) {

                    console.error(
                        "Emergency backend error:",
                        error
                    );
                }

                updateDashboardCounts();

                showEmergencyNotification();
            }
        );
    }

    // ==========================================
    // STORAGE UPDATE
    // ==========================================

    window.addEventListener(
        "storage",
        function () {

            updateDashboardCounts();
        }
    );

});