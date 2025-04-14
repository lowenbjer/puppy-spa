# Puppy Spa Waiting List App

A modern web application for managing a waiting list for a puppy grooming spa. Built with Next.js, React, and TypeScript.

This project is a programming exercise based on the challenge described here:
[Puppy Spa Waiting List App 2025](https://along-hq.notion.site/Puppy-Spa-Waiting-List-App-2025-267ba9624bc349a2bb60e0562850aef3)

## Features

- Add puppies to the waiting list with their details
- View the current waiting list
- Remove puppies from the list when their appointment is complete
- Data persists in local storage

## System Design & Architecture

### Overview
The application follows a modern web architecture with a clear separation of concerns:

- **Frontend**: Next.js with React for a responsive, interactive UI
- **Database**: Postgres for persistent storage
- **State Management**: React Hooks for local state and context for shared state

### Design Decisions
- **Next.js**: Used as required by the exercise specifications
- **TypeScript**: Ensures type safety across the codebase, reducing runtime errors
- **Postgres**: Selected for relational data storage with robust ACID compliance

### Implemented User Stories
- User can view the waiting list of puppies by date
- User can add a new puppy to the waiting list with various details
- User can mark a puppy's grooming as complete
- User can search for specific puppies in the system
- User can move puppies up and down in the waiting list
- Data persists between sessions

## Best Practices Implemented
- **Component Architecture**: Reusable, single-responsibility components
- **Custom Hooks**: Extraction of complex logic into reusable hooks
- **TypeScript Interfaces**: Strong typing for all data structures
- **Error Handling**: Comprehensive error states and user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimization**: Memoization and debounced search
- **Code Organization**: Clear project structure and module separation

## Tech Stack

- **Framework**: Next.js 15.3
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Storage**: Postgres
- **Deployment**: Vercel

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/lowenbjer/puppy-spa.git
cd puppy-spa
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and components
  - `/components` - Reusable UI components
  - `/hooks` - Custom React hooks
- `/public` - Static assets

## Deployment

The application is deployed on Vercel and can be accessed at:
[Puppy Spa App](https://puppy-spa-lowenbjer.vercel.app) 

The deployment process is automated with GitHub integration, with a simple push to the main branch:

```bash
npm run build
```

## License

MIT

---

This project was created as a solution to the Puppy Spa Waiting List programming exercise.
