# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application for English reading comprehension training. The app guides users through a 7-step training process to improve their English understanding skills, with features like timed reading exercises, progress tracking, and different training paths based on user performance.

## Code Architecture

- **Main App Component**: `src/App.tsx` manages the overall application state and renders different training steps
- **Progress Management**: `src/hooks/useProgress.ts` handles user progress with localStorage persistence
- **Timer System**: `src/hooks/useTimer.ts` provides countdown timer functionality for exercises
- **Training Steps**: Each step (1-7) is implemented as a separate component in `src/components/steps/`
- **Data**: Training sentences are stored in `src/data/sentences.ts` with different sets for different training paths
- **Types**: TypeScript interfaces are defined in `src/types/index.ts`

## Common Development Tasks

### Running the Application
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint to check for code issues

### Project Structure
- `src/App.tsx` - Main application component that orchestrates the training steps
- `src/hooks/` - Custom React hooks for progress tracking and timer functionality
- `src/components/steps/` - Individual training step components (Step1.tsx through Step7.tsx)
- `src/data/sentences.ts` - Training content with sentences for different paths
- `src/types/index.ts` - TypeScript type definitions