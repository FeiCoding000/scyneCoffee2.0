# Scyne Coffee Ordering System - Resume Highlights

## Project Overview

Built and iteratively improved a production-ready coffee ordering system for Scyne, supporting visitor ordering, saved profile ordering, live order queues, and admin workflows.

## Resume Bullet Points

- Developed and maintained a React + TypeScript + Firebase coffee ordering system with menu browsing, cart-based ordering, profile-based ordering, and admin order management.
- Collaborated directly with internal users to gather requirements, validate workflows, and translate feedback into features such as profile-based ordering and real-time order status tracking.
- Implemented real-time active order tracking with Firebase Firestore subscriptions, enabling baristas to monitor live queue updates.
- Designed and built a profile-based one-click ordering flow, allowing users to save preferred drink configurations and quickly place repeat orders.
- Reduced perceived profile loading time under unstable Wi-Fi from several seconds or longer to near-instant rendering by using cached local data first and synchronizing Firestore updates in the background.
- Added visible profile sync states including loading, up-to-date, and fallback-to-cached-data indicators to improve user confidence and reliability.
- Refined the homepage and menu page UI with responsive layouts, glassmorphism-style cards, brand-colored actions, and improved visual centering.
- Enhanced the order confirmation flow with a reusable confirmation modal, countdown progress indicator, and automatic navigation back to the homepage.
- Standardized form submission styling across the application to improve visual consistency and user experience.
- Improved recent order status visualization by replacing static status icons with an animated hourglass indicator for active orders.
- Configured Vite and React Router deployment settings to support migration from GitHub Pages subpath hosting to a custom root-domain deployment.
- Encapsulated Firestore operations in service-layer functions and used TypeScript schemas to improve data consistency and maintainability.
- Continuously validated production readiness with successful TypeScript and Vite production builds during feature iterations.

## Technologies Used

- React
- TypeScript
- Vite
- Material UI
- Firebase Authentication
- Firebase Firestore
- React Router
- localStorage caching
