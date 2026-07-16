# Scyne Coffee Ordering System - Resume Highlights

## Project Overview

Built and iteratively improved a production-ready coffee ordering system for Scyne, supporting visitor ordering, saved profile ordering, live order queues, and admin workflows.

## Resume Bullet Points

- Developed and maintained a React + TypeScript + Firebase coffee ordering system with menu browsing, cart-based ordering, profile-based ordering, and admin order management.
- Collaborated directly with internal users to gather requirements, validate workflows, and translate feedback into features such as profile-based ordering and real-time order status tracking.
- Implemented real-time active order tracking with Firebase Firestore subscriptions, enabling baristas to monitor live queue updates and manage pending orders more efficiently.
- Designed and built a profile-based one-click ordering flow, allowing users to save preferred drink configurations and quickly place repeat orders.
- Reduced perceived profile loading time under unstable Wi-Fi from several seconds or longer to near-instant rendering by using cached local data first and synchronizing Firestore updates in the background.
- Added resilient fallback behavior for cached profile data, allowing users to continue ordering when the latest server data cannot be loaded due to poor network conditions.
- Encapsulated Firestore operations in service-layer functions and used TypeScript schemas to improve data consistency, validation, and long-term maintainability.

## Technologies Used

- React
- TypeScript
- Vite
- Material UI
- Firebase Authentication
- Firebase Firestore
- React Router
- localStorage caching
