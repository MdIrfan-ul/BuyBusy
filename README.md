# Buy Busy

___

## Overview

buybusy is a web application for the customers of an e-commerce business.This project uses React for the frontend, Firebase for the database, and Firebase Authentication for user authentication.

___

## Live

Live Link:- <a href="" target=_blank>Buy Busy</a>

___

## Features:

- User Authentication with Firebase
- CRUD operations on product data using Firestore
- Responsive design
- Display product listings
- Add products to cart
- Checkout process

## Technologies Used

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=git,html,css,js,react,firebase" />
  </a>
</p>
- **Frontend**: React, CSS Modules, Toastify, Spinner-Material, React Router
- **Backend**: Firebase Cloud Firestore, Firebase Authentication

___

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MdIrfan-ul/BuyBusy.git
   ```
2. Navigate to the project directory:

    ```bash
    cd buybusy
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a .env file in the root directory and add your Firebase configuration:
    ```bash
    REACT_APP_API_KEY="your-api-key"
    REACT_APP_AUTH_DOMAIN="your-auth-domain"
    REACT_APP_PROJECT_ID="your-project-id"
    REACT_APP_STORAGE_BUCKET="your-storage-bucket"
    REACT_APP_MESSAGE_SENDER_ID="your-message-sender-id"
    REACT_APP_APP_ID="your-app-id"
    ```
___

## Running the Application

1. Start the development server
 ```bash
 npm start
 ```
2. Open http://localhost:3000 to view it in the browser.

___

## Firebase Configuration
- Create a Firebase project in the Firebase Console.
- Add a web app to your Firebase project.
- Copy the Firebase configuration and add it to your `.env` file.

## Firebase Authentication
- Enable Email/Password authentication in the Firebase Console under Authentication > Sign-in method.
- Use the  `AuthContext` and `useAuth` hook to manage user authentication in your application.
___

Developed with ❤️ by [Mohamed Irfanullah M]

___