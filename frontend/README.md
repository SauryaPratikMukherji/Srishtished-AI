# Shristified AI Dashboard

Hey Lovable! I’m building a frontend prototype for our Smart India Hackathon 2026 project. This is only for our college internal presentation/demo in front of judges, NOT the final deployed product.

Please build this like a college student’s polished working prototype, not like an over-engineered enterprise SaaS application. Use mock/static data wherever needed. It does not need to connect to a real backend, database, authentication system, GIS API, satellite API, or AI model right now. The main goal is to make the frontend look realistic, professional, and smooth for a live presentation.

I will attach:

Our project logo

A landing page reference image

A dashboard screenshot/reference

Please actually use these references. Do not ignore them. Match their overall layout, spacing, visual hierarchy, and style where appropriate.

PROJECT INFORMATION

Project Name: Shristified AI

Team Name: Aqua Nexus

Tagline:
"Fusing Ground Truth with Satellite Intelligence"

SIH 2026 Problem Statement:
Problem Statement ID: 26015 — Application of geospatial techniques for watershed development

What the project does

Shristified AI is a watershed development monitoring system for a government/Department of Rural Development type use case.

Field inspectors visit watershed structures such as:

Check Dams

Farm Ponds

Contour Trenches

Percolation Tanks

Recharge Wells

Inspectors can upload geo-tagged photographs from the field. The system conceptually cross-checks:

Ground photo location

GPS coordinates

AI-based photo/structure analysis

Satellite-derived NDVI/NDWI information

The purpose is to identify whether the claimed watershed structure actually exists at the reported location and whether the ground evidence matches the satellite/environmental information.

The system helps identify:

Verified projects

Projects needing manual review

Spatial discrepancies

Potentially mismatched/fake project reports

Again, this is currently only a frontend prototype, so simulate these processes with realistic mock data.

IMPORTANT DESIGN DIRECTION

The website should look like an official Indian government monitoring portal, NOT a typical startup SaaS dashboard.

Avoid:

Excessive gradients

Glassmorphism

Neon colors

Overly futuristic UI

Excessive animations

Generic AI startup styling

Huge unnecessary illustrations

Complicated 3D elements

Instead use:

Deep navy blue

Government-style blue

Forest/leaf green

Amber/yellow

Red for critical alerts

White/off-white backgrounds

Clean typography

Rounded but professional cards

Subtle borders

Very light shadows

Clear tables

Professional data visualization

Good spacing and hierarchy

Suggested colors

Primary navy:

#0B2E4F

Secondary navy:

#14315C

Verified green:

Use a professional forest/leaf green.

Needs Review:

Amber/yellow.

Flagged:

Red.

Background:

White/off-white.

The logo contains an Ashoka emblem + leaf + river/water visual, so make the color palette visually compatible with the logo.

Use the logo in the sidebar/header and on the landing page.

GENERAL APPLICATION STRUCTURE

Create a clean reusable frontend structure with:

Shared layout

Shared sidebar

Shared top header

Reusable cards

Reusable status badges

Reusable tables

Reusable buttons

Reusable modal/dialog components

Consistent spacing

Consistent typography

Mock data stored in an organized way

Client-side routing

Make it easy to extend later.

The main application should have a persistent left sidebar on authenticated/dashboard pages.

PAGE 1 — LANDING PAGE

Create a public landing page before login.

Use the attached landing page reference image for the general layout and visual feel.

Include:

Hero section

Project logo

Shristified AI

"Fusing Ground Truth with Satellite Intelligence"

Short description:

"AI-powered watershed monitoring that combines geo-tagged field evidence with satellite intelligence to validate development projects."

Primary button:

Login

Secondary visual/content area can show a simplified representation of:

Ground inspection

GPS/geospatial data

Satellite monitoring

AI validation

Keep it professional and not overly complicated.

Include a small section explaining the concept:

Ground Truth + Satellite Intelligence = Smarter Watershed Monitoring

At the bottom include:

SIH 2026 | Team Aqua Nexus | Problem Statement 26015

The landing page should feel like the front page of an official government technology platform.

PAGE 2 — LOGIN PAGE

Create a clean professional login screen.

Title:

Shristified AI

Subtitle:

Watershed Development Monitoring System

Have two role tabs:

District Admin

Field Inspector

Fields:

Username / Email

Password

Buttons:

Login

Also provide convenient demo buttons:

Demo Admin

Demo Inspector

Since this is only a prototype, clicking login should work with any input and route the user to the dashboard.

No real authentication is required.

Make the login screen visually consistent with the landing page.

PAGE 3 — MAIN DASHBOARD

This is the most important page.

Follow the attached dashboard screenshot closely for the overall structure and layout.

Use the same navy/green government theme.

Create a left sidebar containing:

Dashboard

Map & GIS

Watersheds

Field Audits

Photo Upload

AI Analysis

Satellite Monitoring

Validation

Reports

Audit Logs

Analytics / Impact

Settings

Some pages can initially be placeholders if needed, but the pages requested below should actually work.

At the top:

Good morning, Inspector

or

Good morning, Admin

depending on the selected demo role.

Subtitle:

Monitor watershed projects, field audits and geospatial validation from one place.

Dashboard statistics

Create four prominent cards:

Total Projects

125

Verified

98

Green styling.

Needs Review

17

Amber styling.

Flagged

10

Red styling.

Use appropriate icons but keep them professional.

DASHBOARD MAP SECTION

Create a large section titled:

Watershed Monitoring Map

It should visually resemble a GIS/map interface.

Since there is no real GIS integration, create a convincing mock map interface.

Show several watershed locations using markers:

Green marker:

Verified

Amber marker:

Needs Review

Red marker:

Flagged / Spatial Discrepancy

When a marker is selected, show a small information popup containing:

Project ID

Village

District

Structure Type

Status

Last Audit Date

Example:

Project ID: WS-ANTP-001
Village: Rampur
District: Anantapur
Structure: Check Dam
Status: Verified

The map should look like a monitoring/GIS interface rather than an empty placeholder.

RECENT AUDITS

Next to the map, create a Recent Audits panel.

Each audit should contain:

Small thumbnail

Audit code

Structure type

Date

Status

Example audit codes:

AUD-ANTP-001

AUD-MP-002

AUD-OD-003

Statuses:

Verified

Needs Review

Spatial Discrepancy

Use appropriate green/amber/red badges.

PAGE 4 — WATERSHEDS / PROJECTS

Create a functional Watersheds page accessible from the sidebar.

Display a professional table/list of watershed projects.

Columns:

Project Code

Village

District

State

Structure Type

Status

Last Audit

Action

Add realistic mock projects.

Example:

WS-ANTP-001

WS-MP-002

WS-OD-003

Statuses should use the same colors throughout the application.

Add search/filter controls such as:

Search project

State

District

Status

Structure type

When a project is clicked, open a detailed view or modal.

Project details should show:

Project code

Village

District

State

Structure type

Structure count

NDVI value

NDWI value

Last audit

Inspector

Current status

Include a clear status section.

PAGE 5 — FIELD AUDIT / PHOTO UPLOAD

Create a Field Audit / Photo Upload page.

This simulates a field inspector submitting a new site inspection.

Form fields:

Select Watershed / Project

Dropdown with mock projects.

Select Structure Type

Options:

Check Dam Concrete

Check Dam Earthen

Farm Pond

Recharge Well

Percolation Tank

Contour Trench

Upload Photo

Create a professional drag-and-drop/upload area.

It does not need to actually send the file to a server.

After selecting an image, show a preview.

Geo-tag information

Show simulated automatically captured information:

Latitude:

14.6812

Longitude:

77.6004

Azimuth / Compass Direction:

128° SE

Make these look like information captured from a field device.

Allow the user to click:

Submit Field Audit

PROCESSING ANIMATION

After clicking Submit Field Audit, show a small smooth processing sequence.

Do NOT make it excessively animated.

Display steps such as:

✓ Extracting photo location

✓ Comparing with satellite data

✓ Running structure detection

✓ Structure Detected — 92% Confidence

✓ Cross-validation complete

Then transition to the verification result.

This should be a simulated frontend process using mock data.

PAGE 6 — VERIFICATION RESULT

After a field audit is submitted, show a professional verification result.

This can either be a dedicated page or a large modal.

Show one of these outcomes:

VERIFIED

Large green check.

Text:

Ground photo location matches satellite NDVI vegetation signature.

or

NEEDS REVIEW

Amber warning.

Text:

Evidence is partially consistent. Manual verification is recommended.

or

FLAGGED — SPATIAL DISCREPANCY

Red warning.

Text:

Location mismatch detected between the submitted ground photograph and the expected project location.

Show supporting information:

GPS coordinates

Expected coordinates

Distance difference

NDVI

NDWI

AI confidence

Structure detected

Example:

AI Structure Detection: 92%

Spatial Match: 96%

NDVI: 0.62

NDWI: 0.31

Buttons:

View on Map

View Project Details

Make the result visually impressive enough for a live judge demonstration.

PAGE 7 — AUDIT LOGS

Create an Audit Logs page.

Use a clean professional table.

Columns:

Audit Code

Watershed

Inspector Name

Structure Type

Date

GPS Status

AI Confidence

Status

View

Use mock data.

Statuses:

Verified

Needs Review

Spatial Discrepancy

Allow the user to click View and see audit details in a modal.

PAGE 8 — ANALYTICS / IMPACT

Create an Analytics / Impact page.

This page should visually demonstrate the value of Shristified AI.

Create several cards/charts.

Geo-Photo Utilization

Show:

92% Passive Auditing

8% Active Spatial Analytics

Use a professional donut/pie or horizontal visualization.

Traditional Process vs Shristified AI

Create a comparison table.

MetricTraditional ProcessShristified AICycle Time45 DaysUnder 15 MinutesAccuracyVariable88% Spatially ValidatedCostHigh90% Lower

Make the Shristified AI column visually prominent.

Resource Allocation

Show a chart for:

Targeted Restoration — 50%

Preventive Repair — 30%

Automated Audits — 20%

A pie/donut or bar chart is fine.

Keep the chart clean and readable.

RISK MITIGATION

Add a section titled:

Risk Mitigation

Create four compact cards/rows:

Cloud Cover Obstruction

Risk:

Satellite imagery may be affected by cloud cover.

Mitigation:

Use alternate imagery/time windows and combine satellite evidence with ground observations.

Field GPS Offsets

Risk:

GPS readings can have positional errors.

Mitigation:

Use spatial tolerance thresholds and cross-check against project coordinates.

Low-Quality Uploads

Risk:

Poor-quality photographs can reduce AI detection confidence.

Mitigation:

Use image-quality checks and request another field capture when confidence is low.

GPS Location Spoofing

Risk:

Incorrect or spoofed location metadata may be submitted.

Mitigation:

Cross-validate GPS metadata against satellite/environmental evidence and project boundaries.

MAP & GIS PAGE

Since this appears in the sidebar, create a basic functional Map & GIS page.

Use a larger mock GIS interface than the dashboard.

Include:

Project markers

Legend

Search project

Status filters

Selected project popup

Basic layer controls such as:

Project Locations

Verified

Needs Review

Flagged

Satellite/Vegetation layer

This can remain a frontend simulation.

Do NOT spend time integrating a real map API.

AI ANALYSIS PAGE

Create an AI Analysis page showing mock analysis results.

Include:

Uploaded image preview

Detected structure

AI confidence

Detection status

GPS coordinates

NDVI

NDWI

Spatial match percentage

Example:

Structure: Check Dam

Detection Confidence: 92%

Spatial Match: 96%

NDVI: 0.62

NDWI: 0.31

Status:

Verified

Include a simple visual confidence indicator.

SATELLITE MONITORING PAGE

Create a Satellite Monitoring page.

Show project information alongside simulated satellite indicators.

Cards:

NDVI

NDWI

Vegetation Health

Water Presence

Last Satellite Observation

Add a simple mock time-series chart for NDVI/NDWI.

Make it look like a monitoring dashboard, not a generic analytics page.

VALIDATION PAGE

Create a Validation page.

Show a validation workflow:

Ground Evidence

↓

GPS Validation

↓

AI Structure Detection

↓

Satellite Cross-Check

↓

Final Verification

Use mock projects with statuses.

Allow a project to be selected and show its validation information.

REPORTS PAGE

Create a basic Reports page.

Show summary cards:

Total Projects

Verified

Needs Review

Flagged

Add a table of generated/mock reports.

Buttons can include:

View Report

Download Report

For the prototype, the download button does not need to generate a real backend report. It can simply show a small demo notification/toast.

SETTINGS PAGE

Create a simple Settings page.

Include sections such as:

Profile

Name

Role

District

Notification Preferences

Audit alerts

Validation alerts

Flagged project alerts

System Preferences

Map display

Data refresh interval

Keep this page simple.

NAVIGATION

Make sure all sidebar items route correctly.

The following should be real accessible pages:

Dashboard

Map & GIS

Watersheds

Field Audits

Photo Upload

AI Analysis

Satellite Monitoring

Validation

Reports

Audit Logs

Analytics / Impact

Settings

You can make Field Audits and Photo Upload point to the same audit workflow if that keeps the prototype simpler.

Make sure there are no dead buttons or broken routes.

MOCK DATA

Use realistic Indian locations and watershed project information.

Examples of states/districts can include:

Andhra Pradesh

Telangana

Odisha

Madhya Pradesh

Rajasthan

Maharashtra

Use realistic-looking village and district names.

Do not use real sensitive personal information.

Use fictional inspector names.

RESPONSIVENESS

The main presentation target is a laptop/desktop screen.

Prioritize making the desktop version polished.

Still make the layout reasonably responsive for smaller screens.

ANIMATION

Keep animations minimal and smooth.

Good:

Page transitions

Hover effects

Loading indicators

Processing steps

Modal transitions

Chart animations

Avoid:

Excessive motion

Large animated backgrounds

Heavy effects

Anything that could lag during a live presentation

MOST IMPORTANT REQUIREMENTS

Use the attached logo.

Follow the attached landing-page reference.

Follow the attached dashboard screenshot closely.

Keep the exact same visual language across every page.

Use the navy + green government portal theme consistently.

Make the application look like a real government monitoring prototype.

Use mock/static data instead of spending time on backend integration.

Make navigation actually work.

Keep components reusable and organized.

Make the dashboard and verification workflow especially polished because these are the screens I will demonstrate to judges.

Do not over-engineer the project.

Do not add unnecessary features that aren't relevant to the watershed monitoring use case.

Do not change the project concept.

Do not replace the government-style design with a generic AI SaaS design.

Keep the UI professional, clean, believable, and presentation-ready.

Remember: this is a college SIH 2026 presentation prototype. Prioritize visual quality, working navigation, realistic mock interactions, and a smooth demo experience over backend complexity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a2dc818e-18ab-438b-a042-54bfc5427055).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
