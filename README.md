# ET in Maths - Student Code Retrieval System

An interactive, bilingual (Arabic / English) web application integrated with a Google Sheets backend via Google Apps Script. This tool enables students and parents to securely retrieve custom access codes using validated student and parent phone numbers.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Project Architecture](#project-architecture)
3. [File Structure](#file-structure)
4. [Step-by-Step Reconstruction Guide](#step-by-step-reconstruction-guide)
   - [Step 1: Set Up Google Sheets Database](#step-1-set-up-google-sheets-database)
   - [Step 2: Deploy Google Apps Script API](#step-2-deploy-google-apps-script-api)
   - [Step 3: Build the Frontend Web Application](#step-3-build-the-frontend-web-application)
5. [Validation & Sanitization Logic](#validation--sanitization-logic)
6. [Deployment & Hosting](#deployment--hosting)

---

## System Overview

The **ET in Maths - Student Code Retrieval System** addresses the requirement of delivering individual access codes to enrolled students. The system ensures data privacy by requiring two matching credentials: the **Student Phone Number** and the **Parent Phone Number**.

### Key Features
- **Bilingual Interface**: Seamless instant toggle between Arabic (RTL) and English (LTR).
- **Glassmorphism UI**: Modern aesthetic with a custom mathematical grid background pattern.
- **Robust Input Sanitization**: Automatically discards leading, trailing, and embedded spaces from inputs (e.g., converting `010 24 25 0768` to `01024250768`).
- **Comprehensive Validation**: Provides specific, translated error messages for missing fields, non-numeric characters, and invalid lengths (must be 11 digits).
- **Serverless Backend**: Uses Google Sheets as a database and Google Apps Script as a REST API endpoint.

---

## Project Architecture

```
+------------------------+             HTTPS GET Request             +--------------------------+
|  Frontend Application  | ----------------------------------------> | Google Apps Script WebApp |
| (HTML5 / CSS3 / ES6+)  | <---------------------------------------- | (doGet Execution Engine) |
+------------------------+             JSON Response                 +--------------------------+
                                                                                  |
                                                                         Container-Bound Link
                                                                                  v
                                                                     +--------------------------+
                                                                     |   Google Sheets Database |
                                                                     |  (Student Name | Phone | |
                                                                     |   Parent Phone | Code)   |
                                                                     +--------------------------+
```

---

## File Structure

```
et-in-maths-code-retriever/
│
├── index.html       # Main HTML markup and UI structure
├── style.css        # Glassmorphic styles, responsive grid, animations, and RTL rules
├── script.js        # Client-side validation, i18n dynamic toggle, and fetch requests
└── Code.gs          # Container-bound Google Apps Script backend code
```

---

## Step-by-Step Reconstruction Guide

### Step 1: Set Up Google Sheets Database

1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Title the spreadsheet: **ET in Maths - Student Database**.
3. Set up the first sheet (Sheet1) with the following headers in Row 1:

| Column | Header Name | Description | Example |
| :---: | :--- | :--- | :--- |
| **A** | `Student Name` | Full student name | `example 1` |
| **B** | `Phone` | Student 11-digit phone number | `01061231399` |
| **C** | `Parent Phone` | Parent 11-digit phone number | `01091761230` |
| **D** | `Code` | Assigned student access code | `23292` |

> **Note:** Ensure phone numbers in columns B and C are formatted as **Plain Text** in Google Sheets (`Format > Number > Plain text`) to preserve leading zeros (`010...`).

---

### Step 2: Deploy Google Apps Script API

1. In the Google Sheet, navigate to **Extensions > Apps Script**.
2. Rename the project to **ET-in-Maths-API**.
3. Replace the content of `Code.gs` with the backend script provided in the [Backend API Implementation](#backend-api-implementation-codegs) section below.
4. Click **Save** (disk icon).
5. Deploy as a Web App:
   - Click **Deploy > New deployment**.
   - Click the gear icon (**Select type**) and choose **Web app**.
   - Set **Description**: `Initial V1 Deployment`.
   - Set **Execute as**: `Me (your-email@gmail.com)`.
   - Set **Who has access**: `Anyone`.
   - Click **Deploy**.
   - Authorize access when prompted by Google.
   - Copy the generated **Web App URL** (e.g., `https://script.google.com/macros/s/.../exec`).

---

### Step 3: Build the Frontend Web Application

Create a local folder on your computer named `et-in-maths-code-retriever` and place the three frontend files (`index.html`, `style.css`, and `script.js`) inside it.


---

## Validation & Sanitization Logic

The application implements a multi-stage validation workflow before dispatching any network request:

1. **Whitespace Elimination**: `replace(/\s+/g, "")` removes spaces located before, inside, or after inputs (e.g., `010 24 25 0768` -> `01024250768`).
2. **Presence Check**: Verifies that both fields contain non-empty values.
3. **Numeric Format**: Uses regex (`/^\d+$/`) to reject alphabetic, special, or symbol characters.
4. **Digit Count**: Checks that the string consists of exactly 11 characters. If invalid, the exact current digit length is displayed in the error feedback.
5. **Dynamic Feedback**: Error responses are generated in English or Arabic depending on the active locale context.

---

## Deployment & Hosting 

Because this application relies on static client assets, it can be hosted on platforms such as **GitHub Pages**, **Vercel**, or **Netlify**:

1. Initialize a git repository and push the files:
   ```bash
   git init
   git add .
   git commit -m "Deploy ET in Maths Code Retriever"
   ```
2. Enable GitHub Pages under Repository Settings > Pages > Source (`main` branch / root folder).
