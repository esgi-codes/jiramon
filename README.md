# JiraMon - A WorkAdventure Hackathon Project

JiraMon transforms the way teams interact with Jira tickets. Set in a dynamic, game-like environment developed during the ESGI hackathon, this project brings an engaging twist to ticket management. Wander a virtual map to collect, view, and manage Jira tickets as if you were on a pokemon journey, making project management an interactive and enjoyable experience.

## 🎮 Demo

[JiraMon Demo](https://vimeo.com/931157663?share=copy)

## 🌟 Features

- **Ticket Discovery**: Explore the map to find Jira tickets scattered around.
- **Interactive Tickets**: Pick up tickets, throw them into trashcans, or inspect their details closely.
- **Live Updates**: Tickets on the map and in your inventory update in real-time with Jira.
- **Rarity Levels**: Discover tickets of different rarities across the map, each with unique visuals.
- **Inventory Management**: Keep track of your tickets with a user-friendly inventory system.
- **Collaborative Gameplay**: Work with your team in a shared environment to manage and delegate tasks efficiently.

## 🚀 Getting Started

### Prerequisites

- WorkAdventure account
- Access to a Jira project

### Setup

1. Clone the repository to your local machine.
2. Install necessary dependencies by running `npm install`.
3. Configure the `.env` file with your Jira API keys and WorkAdventure settings on the server.
4. Start your adventure with `npm run dev`.

## 📝 How to Play

Navigate the virtual world of WorkAdventure to find and interact with Jira tickets:

- **Move Around**: Use arrow keys to explore the map.
- **Collect Tickets**: Walk over a ticket to add it to your inventory.
- **View Ticket Details**: Click on a ticket in your inventory to see its details.
- **Manage Tickets**: Use trashcans around the map to manage your ticket load.
- **Collaborate**: Coordinate with team members in the game to prioritize and assign tickets.

## 🛠 Development

### Technologies Used

- TypeScript for the game logic.
- Axios for API communication with Jira.

### Project Structure

- `src/`: Contains the TypeScript source code.
  - `map.ts`: Manages the game map and ticket spawning.
  - `inventory.ts`: Handles inventory operations.
  - `jiraClient.ts`: Communicates with the Jira API.
  - `utils.ts`: Utility functions for the game.

# Building and Running

## Requirements

Node.js version >=17

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run dev
```

## Test production map

You can test the optimized map as it will be in production:

```sh
npm run build
npm run prod
```

## Licenses

This project contains multiple licenses as follows:

- [Code license](./LICENSE.code) _(all files except those for other licenses)_
- [Map license](./LICENSE.map) _(`map.tmj` and the map visual as well)_
- [Assets license](./LICENSE.assets) _(the files inside the `src/assets/` folder)_

### About third party assets

If you add third party assets in your map, do not forget to:

1. Credit the author and license with the "tilesetCopyright" property present in the properties of each tilesets in the `map.tmj` file
2. Add the license text in LICENSE.assets
