# Lead Automation - Webhook Tester

A powerful, browser-based tool for configuring, testing, and debugging webhook integrations for lead generation and job scraping. This application provides a visual interface to build a JSON payload, send it to a specified endpoint, and inspect the response in detail.

## Key Features

-   **Dynamic Payload Creation**: Easily build complex JSON payloads with multiple job scraping entries.
-   **Configuration Management**: Save and load different sets of payload entries and webhook URLs to streamline your testing workflow.
-   **Live Webhook Testing**: Send `POST` requests directly from your browser to your webhook endpoint.
-   **Detailed Response Inspector**: View the full webhook response, including status code, status text, headers, and body. The response UI is collapsible to maintain a clean interface.
-   **Client-Side Persistence**: All your saved configurations and URLs are stored locally in your browser's `localStorage` for convenience.
-   **Modern Tech Stack**: Built with React 19, TypeScript, and Tailwind CSS, running entirely in the browser without a build step.

## How to Use

1.  **Configure Payload**: On the main screen, fill in the details for one or more job entries. You can add up to 5 entries, remove them, or copy data from the previous entry to speed up configuration.
2.  **Save Configuration (Optional)**: Use the "Saved Configurations" section to save the current set of entries under a specific name. You can load or delete these sets later.
3.  **Proceed to Test**: Once your payload is ready, click the "Proceed to Test" button. The application performs a quick validation to ensure all required fields are filled.
4.  **Enter Webhook URL**: On the testing screen, input the webhook URL you want to test. You can also save and load frequently used URLs from the dropdown.
5.  **Review Payload**: A read-only view of the generated JSON payload is displayed for your final review.
6.  **Send Request**: Click "Test Webhook". A confirmation modal will appear, summarizing the number of requests and the destination URL. Confirm to send the `POST` request.
7.  **Inspect Response**: The webhook's response will appear at the bottom of the screen. The success status is shown by default. Click "Expand Details" to view the full headers and response body.

## Payload Schema

The application sends a `POST` request to your endpoint with the header `Content-Type: application/json`.

The request body is an **array of job entry objects**. Each object has the following structure:

```json
[
  {
    "jobRole": "string",
    "location": "string",
    "experienceLevel": "string",
    "dateRange": "string",
    "linkedinUrl": "string"
  }
]
```

### Example Payload

```json
[
  {
    "jobRole": "Software Engineer",
    "location": "San Francisco, CA",
    "experienceLevel": "mid_senior",
    "dateRange": "week",
    "linkedinUrl": "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=San%20Francisco%2C%20CA"
  },
  {
    "jobRole": "Technician",
    "location": "Austin, TX",
    "experienceLevel": "entry_level",
    "dateRange": "day",
    "linkedinUrl": "https://www.linkedin.com/jobs/search/?keywords=Technician&location=Austin%2C%20TX"
  }
]
```

## Technical Overview

This application is built using **React 19** and **TypeScript**.

It operates without a traditional build pipeline (like Webpack or Vite). Instead, it leverages modern browser features:
-   **ES Modules**: Code is organized into modules and loaded directly by the browser.
-   **Import Maps**: The `index.html` file contains an `importmap` to resolve module specifiers (e.g., `react`, `react-toastify`) to full CDN URLs (`esm.sh`).
-   **CDN-Hosted Dependencies**: All libraries, including React and Tailwind CSS, are loaded from a Content Delivery Network.

This approach results in a simple, fast, and dependency-free development setup.

## Running Locally

No installation or build process is required.

1.  Clone or download the repository.
2.  Serve the project's root directory using a simple local web server.

For example, if you have Python installed, you can run:

```bash
# For Python 3
python -m http.server
```

Then, open `http://localhost:8000` (or the port specified by your server) in your web browser.
