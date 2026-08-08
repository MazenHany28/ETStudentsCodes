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
5. [Frontend Implementation Details](#frontend-implementation-details)
   - [HTML Structure (`index.html`)](#html-structure-indexhtml)
   - [Styling & Responsive Layout (`style.css`)](#styling--responsive-layout-stylecss)
   - [Dynamic Logic & Validation (`script.js`)](#dynamic-logic--validation-scriptjs)
6. [Backend API Implementation (`Code.gs`)](#backend-api-implementation-codegs)
7. [Validation & Sanitization Logic](#validation--sanitization-logic)
8. [Deployment & Hosting](#deployment--hosting)

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

## Frontend Implementation Details

### HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ET in Maths - Find Your Code</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="images/icon.png">
</head>
<body>
<div class="card">
  <div class="lang-toggle" onclick="toggleLang()" id="langToggle"><span id="langText">العربية</span></div>

  <div class="brand">
    <div class="logo">∑</div>
    <h2 id="title">ET in Maths</h2>
  </div>
  
  <p class="subtitle" id="subtitle">Enter phone numbers to retrieve your code</p>

  <div class="form-container">
    <input type="tel" id="phone" placeholder="Student Phone">
    <input type="tel" id="parentPhone" placeholder="Parent Phone">

    <button id="submitBtn" onclick="getCode()">
      <span id="btnText">Get Code</span>
      <div id="loader" class="spinner" style="display: none;"></div>
    </button>
  </div>

  <div id="result" class="result"></div>
</div>
<script src="script.js"></script>
</body>
</html>
```

---

### Styling & Responsive Layout (`style.css`)

```css
:root {
  --primary: #4e73df;
  --secondary: #224abe;
  --bg-dark: #0f172a;
  --glass: rgba(255, 255, 255, 0.95);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-dark);
  background-image: 
    linear-gradient(rgba(78, 115, 223, 0.15) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(78, 115, 223, 0.15) 1.5px, transparent 1.5px);
  background-size: 40px 40px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.card {
  background: var(--glass);
  backdrop-filter: blur(10px);
  padding: 40px;
  width: 90%;
  max-width: 380px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand {
  margin-bottom: 20px;
}

.logo {
  background: var(--primary);
  color: white;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(78, 115, 223, 0.4);
}

h2 {
  color: #1e293b;
  margin: 0;
  font-size: 1.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

input {
  width: 100%;
  margin-bottom: 15px;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s;
  background: white;
}

input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 4px rgba(78, 115, 223, 0.1);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

button:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.lang-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: var(--primary);
}

[dir="rtl"] .lang-toggle {
  right: auto;
  left: 20px;
}

.result {
  margin-top: 20px;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: none;
  width: 100%;
}

.result.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.result.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
```

---

### Dynamic Logic & Validation (`script.js`)

```javascript
let isArabic = false;
const API_URL = "***";

function toggleLang() {
  isArabic = !isArabic;
  document.documentElement.lang = isArabic ? "ar" : "en";
  document.body.dir = isArabic ? "rtl" : "ltr";

  // Dynamic UI Translation
  document.getElementById("langText").innerText = isArabic ? "English" : "العربية";
  document.getElementById("title").innerText = "ET in Maths";
  document.getElementById("subtitle").innerText = isArabic 
    ? "أدخل الأرقام للحصول على الكود" 
    : "Enter phone numbers to retrieve your code";
  document.getElementById("btnText").innerText = isArabic ? "عرض الكود" : "Get Code";
  document.getElementById("phone").placeholder = isArabic ? "رقم هاتف الطالب" : "Student Phone";
  document.getElementById("parentPhone").placeholder = isArabic ? "رقم هاتف ولي الأمر" : "Parent Phone";
}

function validatePhoneNumber(number, isStudent) {
  const fieldName = isArabic 
    ? (isStudent ? "رقم هاتف الطالب" : "رقم هاتف ولي الأمر")
    : (isStudent ? "Student phone" : "Parent phone");

  if (!number) {
    return isArabic 
      ? `يرجى إدخال ${fieldName}` 
      : `Please enter ${fieldName.toLowerCase()}`;
  }
  
  if (!/^\d+$/.test(number)) {
    return isArabic 
      ? `${fieldName} يجب أن يحتوي على أرقام فقط` 
      : `${fieldName} must contain numbers only`;
  }
  
  if (number.length !== 11) {
    return isArabic 
      ? `${fieldName} يجب أن يتكون من 11 رقمًا بالضبط (الحالي: ${number.length})` 
      : `${fieldName} must be exactly 11 digits (current length: ${number.length})`;
  }

  return null;
}

function getCode() {
  const phoneInput = document.getElementById("phone");
  const parentPhoneInput = document.getElementById("parentPhone");

  // Strip all whitespace characters (spaces, tabs, newlines)
  const phone = phoneInput.value.replace(/\s+/g, "");
  const parentPhone = parentPhoneInput.value.replace(/\s+/g, "");

  // Reflect cleaned values back to the UI
  phoneInput.value = phone;
  parentPhoneInput.value = parentPhone;

  // Validate Student Phone Number
  const studentError = validatePhoneNumber(phone, true);
  if (studentError) {
    showResult(studentError, false);
    return;
  }

  // Validate Parent Phone Number
  const parentError = validatePhoneNumber(parentPhone, false);
  if (parentError) {
    showResult(parentError, false);
    return;
  }

  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");

  // Activate Loading UX
  btn.disabled = true;
  btnText.innerText = isArabic ? "جاري التحميل..." : "Loading...";
  loader.style.display = "inline-block";

  fetch(`${API_URL}?phone=${encodeURIComponent(phone)}&parentPhone=${encodeURIComponent(parentPhone)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showResult(
          isArabic 
            ? "🎉 أهلا " + data.studentname + "، الكود الخاص بك هو: " + data.code
            : "🎉 Hi " + data.studentname + ", your code is: " + data.code,
          true
        );
      } else {
        showResult(
          isArabic ? "البيانات غير صحيحة" : "Data not found",
          false
        );
      }
    })
    .catch(() => {
      showResult(
        isArabic ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong",
        false
      );
    })
    .finally(() => {
      btn.disabled = false;
      btnText.innerText = isArabic ? "عرض الكود" : "Get Code";
      loader.style.display = "none";
    });
}

function showResult(message, success) {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.className = "result " + (success ? "success" : "error");
  resultDiv.innerText = message;
}
```

---

## Backend API Implementation (`Code.gs`)

```javascript
/**
 * Handles HTTP GET Requests to query the active Google Sheet database.
 * Expects 'phone' and 'parentPhone' query parameters.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var phone = e.parameter.phone;
  var parentPhone = e.parameter.parentPhone;

  var values = sheet.getDataRange().getValues();

  // Iterate starting from row index 1 to skip header row
  for (var i = 1; i < values.length; i++) {
    var studentPhone = values[i][1].toString().trim();
    var studentParentPhone = values[i][2].toString().trim();

    if (studentPhone === phone && studentParentPhone === parentPhone) {
      var code = values[i][3];
      var studentname = values[i][0].toString().trim();
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          code: code, 
          studentname: studentname 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: false }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Health check endpoint for HTTP POST.
 */
function doPost(e) {
  return ContentService.createTextOutput("Service is running");
}
```

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
