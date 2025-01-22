# Flowchart Manager Backend

Flowchart Management Backend is a RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. 
It enables users to perform comprehensive CRUD (Create, Read, Update, Delete) operations on flowcharts represented as directed graphs. 
Each flowchart comprises customizable nodes and edges, allowing for dynamic graph structures. 
Key features include graph validation to ensure data integrity, retrieval of outgoing edges for specific nodes, and querying of all nodes connected directly or indirectly to a given node. 
The API is thoroughly documented with **Swagger UI** for easy exploration and testing, and it incorporates robust unit tests using **Jest** and **Supertest** to ensure reliability and performance.

## Features

- **Create Flowchart:** Add new flowcharts with user-defined numerical identifiers, nodes, and edges.
- **Fetch Flowchart:** Retrieve detailed information of a flowchart by its unique numerical ID.
- **Update Flowchart:** Modify existing flowcharts by adding or removing nodes and edges.
- **Delete Flowchart:** Remove flowcharts from the database using their unique numerical ID.
- **Graph Validation:** Ensure flowcharts maintain valid graph structures without cycles or orphaned nodes.
- **Outgoing Edges Retrieval:** Fetch all outgoing edges for a specified node within a flowchart.
- **Connected Nodes Query:** Identify all nodes connected directly or indirectly to a specific node.
- **API Documentation:** Interactive and comprehensive API docs available via Swagger UI.
- **Unit Testing:** Comprehensive tests implemented with Jest and Supertest for ensuring API reliability.

## Technologies Used

- **Node.js & Express.js:** Server-side runtime and web framework for building scalable APIs.
- **MongoDB & Mongoose:** NoSQL database and ODM for efficient data modeling and interaction.
- **Swagger UI:** Tool for creating interactive API documentation.
- **Jest & Supertest:** Testing frameworks for writing and executing unit and integration tests.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)
- **MongoDB** (local instance or access to MongoDB Atlas)
- **Git** (optional, for version control)

### Steps

1. **Clone the Repository**

   git clone https://github.com/Sundar1709/flowchart-manager-backend.git
   
   cd flowchart-management-backend

3. **Install Dependencies**

   npm install

4. **Running the Server**

   npm run dev

5. **Running Tests**

   npm test

6. **Access Swagger UI**

   http://localhost:3000/api-docs

   
