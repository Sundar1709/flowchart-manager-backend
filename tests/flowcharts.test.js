// tests/flowcharts.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Flowchart = require('../models/Flowchart');

beforeAll(async () => {
  const mongoURI = 'mongodb://localhost:27017/flowchartdb_test'; // Use a separate test DB
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Flowchart API', () => {
  let flowchartId;

  it('should create a new flowchart', async () => {
    const res = await request(app)
      .post('/api/flowcharts')
      .send({
        name: 'Test Flowchart',
        nodes: [{ id: '1', label: 'Start' }, { id: '2', label: 'End' }],
        edges: [{ source: '1', target: '2' }],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    flowchartId = res.body._id;
  });

  it('should fetch the created flowchart', async () => {
    const res = await request(app).get(`/api/flowcharts/${flowchartId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test Flowchart');
  });

  it('should update the flowchart', async () => {
    const res = await request(app)
      .put(`/api/flowcharts/${flowchartId}`)
      .send({
        name: 'Updated Flowchart',
        nodes: [
          { id: '1', label: 'Start' },
          { id: '2', label: 'Middle' },
          { id: '3', label: 'End' },
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
        ],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Flowchart');
    expect(res.body.nodes.length).toBe(3);
  });

  it('should fetch outgoing edges for node "2"', async () => {
    const res = await request(app).get(`/api/flowcharts/${flowchartId}/edges/2/outgoing`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('target', '3');
  });

  it('should fetch connected nodes from node "1"', async () => {
    const res = await request(app).get(`/api/flowcharts/${flowchartId}/connected/1`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.connectedNodes).toContain('2');
    expect(res.body.connectedNodes).toContain('3');
  });

  it('should delete the flowchart', async () => {
    const res = await request(app).delete(`/api/flowcharts/${flowchartId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Flowchart deleted');
  });
});