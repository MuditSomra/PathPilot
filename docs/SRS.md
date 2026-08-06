Software Requirements Specification (SRS)

Project Name: PathPilot – Interactive Pathfinding Visualizer

Version: 1.0

Author: Mudit Somra

Technology Stack: React + Vite + Tailwind CSS + JavaScript

1. Introduction
1.1 Purpose

PathPilot is an interactive web application designed to visualize and compare popular pathfinding algorithms. The application allows users to create custom obstacle layouts, generate random mazes, and observe algorithm execution through smooth animations while comparing their efficiency.

The primary objective is educational while demonstrating strong frontend engineering and DSA implementation.

1.2 Objectives

The application must:

Visualize pathfinding algorithms.
Animate algorithm execution.
Allow user interaction.
Compare algorithm performance.
Demonstrate clean software architecture.
Be suitable for portfolio and interviews.
1.3 Scope

Desktop-first web application.

No authentication.

No backend.

No database.

No external APIs.

Everything runs locally.

2. Functional Requirements
FR-1 Interactive Grid

The application shall display a configurable rectangular grid.

Default

Rows = 25

Columns = 45

Every cell must support:

Empty
Wall
Start
End
Visited
Path
FR-2 Draw Walls

Users shall be able to

Click and drag

to draw walls.

Walls cannot overwrite

Start

or

End

FR-3 Remove Walls

Users shall erase walls using

Right Click + Drag

(or another intuitive mechanism if browser behavior becomes problematic).

FR-4 Move Nodes

Users shall drag

Start Node

and

End Node

to different positions.

FR-5 Algorithm Selection

Supported algorithms:

Breadth First Search
Depth First Search
A*

Algorithms shall be selectable from a dropdown.

Only one algorithm runs at a time.

FR-6 Visualization

When Visualize is clicked:

Application shall

Disable editing

Run algorithm

Animate visited nodes

Animate shortest path

Display statistics

FR-7 Statistics

After execution display

Algorithm

Visited Nodes

Shortest Path Length

Execution Time

Path Found / Not Found

FR-8 Generate Maze

Application shall generate a maze using

Recursive Backtracking.

FR-9 Theme

Application supports

Light

Dark

Theme preference stored using Local Storage.

FR-10 Reset

Reset Grid

clears everything.

Clear Path

keeps walls

removes only

Visited

Path

Statistics

3. Non Functional Requirements

Performance

Visualization should remain smooth.

Target

60 FPS

Maintainability

Every module has one responsibility.

Readability

Use meaningful names.

Small functions.

Consistent formatting.

Scalability

Future algorithms

Dijkstra

Greedy Best First

Bidirectional BFS

should be easy to add.

Responsiveness

Desktop-first.

Support screens above

1280px

Should remain usable on tablets.

Accessibility

Buttons have labels.

Keyboard navigation where practical.

Sufficient color contrast.

4. Technology Stack

Frontend

React

Vite

TailwindCSS

JavaScript

Deployment

Vercel

Version Control

Git

GitHub

5. Project Structure
PathPilot/

README.md

LICENSE

package.json

vite.config.js

src/

components/

Header/

Toolbar/

Grid/

Cell/

Statistics/

ThemeToggle/

algorithms/

bfs.js

dfs.js

astar.js

maze/

recursiveBacktracking.js

core/

GridManager.js

AnimationManager.js

renderer.js

utils/

Queue.js

PriorityQueue.js

hooks/

useTheme.js

constants/

colors.js

App.jsx

main.jsx

public/

docs/

SRS.md

Architecture.md

assets/

screenshots/
6. Component Responsibilities
App

Owns application state.

Coordinates components.

Toolbar

Buttons

Dropdown

Speed

Theme

Grid

Displays cells.

Delegates clicks.

Cell

Only renders one square.

No business logic.

Statistics

Displays metrics.

ThemeToggle

Changes theme.

Stores preference.

7. Architecture

The project follows

Presentation Layer

↓

Business Logic

↓

Algorithms

↓

Utilities

React Components

↓

Grid Manager

↓

Algorithms

↓

Animation Engine

↓

Renderer

Algorithms NEVER know React exists.

This is mandatory.

8. Data Model

Every grid cell

{
    row: Number,
    col: Number,

    type:
        "empty"
        "wall"
        "start"
        "end",

    visited: false,

    parent: null,

    weight: 1,

    distance: Infinity
}

Grid

grid[row][column]

2D array.

9. Algorithm Interfaces

Every algorithm must implement

run(grid, startNode, endNode)

Returns

{
    visitedNodes,

    shortestPath,

    statistics
}

Never manipulate UI.

Never call React.

10. Animation

Animation module receives

Visited Nodes

Shortest Path

Animation Speed

It updates UI.

Algorithms do not animate.

11. Theme

Store

theme = dark

or

theme = light

using Local Storage.

12. State Management

React state includes:

grid

selectedAlgorithm

animationSpeed

theme

statistics

isAnimating

No Redux.

No Zustand.

13. Error Handling

Prevent visualization if

Start missing

End missing

Already animating

No valid path

Show toast or status message.

14. Coding Standards
ES6 modules
Functional React components
Custom hooks where appropriate
Avoid duplicated logic
Keep functions under ~40 lines when practical
Single Responsibility Principle
Use descriptive variable names
Prefer composition over large monolithic components
15. Git Commit Strategy
Initial project setup

Configure Tailwind

Create application layout

Implement grid

Add wall drawing

Implement BFS

Build animation engine

Implement DFS

Implement A*

Implement recursive maze generation

Add statistics panel

Implement theme toggle

Improve responsiveness

Write README

Deploy to Vercel
16. Future Enhancements (Not in v1)
Dijkstra's Algorithm
Greedy Best-First Search
Bidirectional BFS
Weighted cells
Save/load custom mazes
Algorithm comparison mode
Keyboard shortcuts
Export maze configuration
Mobile-first redesign
17. Success Criteria

The project is considered complete when:

Users can draw and erase walls.
Start and end nodes are draggable.
BFS, DFS, and A* execute with animations.
Recursive backtracking maze generation works.
Statistics are displayed after each run.
Theme preference persists across refreshes.
The application is deployed and publicly accessible.
The codebase is modular, documented, and easy to explain in an interview.