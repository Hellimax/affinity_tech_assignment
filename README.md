# Project Setup Guide

This project consists of a Python API backend and a React frontend (affinityUI). Follow the steps below to set up and run the project locally.

## Project Structure

```
project-root/
├── affinityUI/          # React frontend application
├── api/                 # Python backend API
│   ├── requirements.txt # Python dependencies
│   └── app.py          # Main API server file
├── images/             # Image assets directory
├── .gitignore          # Git ignore file
├── .sample_env         # Environment variables template
└── README.md           # This file
```

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.7+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download Git](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Set Up Environment Variables

1. Create a `.env` file from the sample template:
   ```bash
   cp .sample_env .env
   ```

2. Open the `.env` file and add your Pinecone API credentials:
   ```env
   PINECONE_API_KEY=your_pinecone_api_key_here
   # Add other environment variables as needed
   ```

### 3. Set Up Firebase Service Account

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Navigate to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Rename the file to `firebase-service-account.json` (or your preferred name)
7. Move the JSON file to the `api/` folder

**Important**: Make sure to add your Firebase service account JSON file to `.gitignore` to keep your credentials secure.

### 4. Set Up Python API Backend

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 5. Set Up React Frontend

1. Navigate to the React application directory:
   ```bash
   cd ../affinityUI
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

### 6. Set Up Images Directory

Ensure that the `images/` folder exists in the project root and contains all necessary image assets for your application.

```bash
# Create images directory if it doesn't exist
mkdir -p images
```

## Running the Application

### Step 1: Start the API Server

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Activate your virtual environment (if using one):
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Start the API server:
   ```bash
   python app.py
   ```

The API server should now be running (typically on `http://localhost:5000` or the port specified in your app.py).

### Step 2: Start the React Application

1. Open a new terminal window/tab
2. Navigate to the React application directory:
   ```bash
   cd affinityUI
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The React application should now be running (typically on `http://localhost:3000` or `http://localhost:5173` for Vite).


To Create the vector database and Firebase database, checkout out api/ExploreData.ipynb file




