# Project Name

Mini Project by Deni Setiya

## Description

This project is an IoT system that allows users to wirelessly control lights via the web. Using NodeMCU ESP8266 as the IoT device, this system integrates with a Node.js API and React.js frontend to enable users to turn lights on/off, schedule lighting, and monitor light power consumption.

## Key Features

- Remote control of lights via a web interface.
- Scheduling of lights to set timing and duration of lighting.
- Monitoring of light power consumption for energy efficiency.

## Technologies Used

- **NodeMCU ESP8266**: Controls hardware devices and communicates with the server.
- **Node.js**: Runs the API for communication between hardware and frontend.
- **React.js**: Builds a responsive and interactive user interface.
- **PostgreSQL**: Stores scheduling data and power consumption logs.
- **Prisma**: Manages ORM for easier access and manipulation of the database.

## Flow Diagram

![Flow Diagram](link to flow diagram)

## Installation

1. Clone this repository: `git clone https://github.com/denisetiya/iot-smart-lamp.git`
2. Navigate to the project directory: `cd iot-smart-lamp`
3. Install dependencies: `npm install`
4. Set up required environment variables in the `.env` file.

## Usage

1. Start the Node.js server: `npm start`
2. Access the web interface through a browser at `http://localhost:3000`
3. Log in using a valid account.
4. Begin controlling lights, setting schedules, and monitoring power consumption.

## Contribution

Contributions are always welcomed. To get started:

1. Fork this repository.
2. Create a new feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request.

## License

MIT
