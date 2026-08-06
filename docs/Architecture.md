# ADR.md

# Architecture Decision Record

**Project:** PathPilot -- Interactive Pathfinding Visualizer

## ADR-001 --- Framework

**Decision:** React + Vite

Reason: - Component-based UI - Fast development - Modern ecosystem

## ADR-002 --- Styling

**Decision:** Tailwind CSS

Reason: - Rapid UI development - Easy dark mode - Consistent design
system

## ADR-003 --- No Backend

Reason: - Focus is DSA visualization. - Backend adds unnecessary
complexity.

## ADR-004 --- Algorithm Isolation

Algorithms: - Do not know React. - Do not update DOM. - Do not animate.

Input:

``` js
grid
startNode
endNode
```

Output:

``` js
{
  visitedNodes,
  shortestPath,
  statistics
}
```

## ADR-005 --- Animation Engine

Animation is a dedicated module that receives algorithm output and
updates the UI.

## ADR-006 --- Grid Manager

Responsible for: - Creating grid - Updating walls - Moving nodes -
Resetting state

## ADR-007 --- State Management

React state only.

No Redux or Zustand.

State: - grid - selectedAlgorithm - statistics - theme - speed -
isAnimating

## ADR-008 --- Algorithms

Version 1: - BFS - DFS - A\*

Dijkstra postponed until weighted cells exist.

## ADR-009 --- Maze Generation

Recursive Backtracking chosen for educational value and quality.

## ADR-010 --- Folder Structure

``` text
components/
algorithms/
core/
maze/
utils/
hooks/
constants/
```

## ADR-011 --- Coding Principles

-   Single Responsibility Principle
-   Separation of Concerns
-   Pure algorithm functions
-   ES Modules
-   Functional React components

## ADR-012 --- Definition of Done

-   Clean architecture
-   Smooth animations
-   Modular code
-   Deployable application
-   Interview-ready implementation
