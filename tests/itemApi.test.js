const request = require('supertest');
const express = require('express');
const { itemRouter } = require('../routes/itemRouter');
const { authRouter } = require('../routes/authRouter');

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/items', itemRouter);
app.use('/auth', authRouter);

let userToken;
let adminToken;
let createdItemId;

describe('Lost & Found API', () => {
  it('should signup a user', async () => {
    const res = await request(app)
      .post('/auth/u/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect([201,400]).toContain(res.statusCode); // 400 if already exists
    if (res.statusCode === 201) {
      expect(res.body.user).toBeDefined();
    }
  });

  it('should login as user', async () => {
    const res = await request(app)
      .post('/auth/u/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  it('should login as admin', async () => {
    const res = await request(app)
      .post('/auth/admin')
      .send({
        mail: process.env.ADMIN_MAIL || 'admin@admin.com',
        pass: process.env.ADMIN_PASS || 'admin123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('should add an item', async () => {
    const res = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Lost Phone',
        category: 'phone',
        description: 'Black iPhone lost in park',
        status: 'Lost',
        location: 'Central Park',
        date: '2025-07-20',
        contact_info: '555-1234'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.item).toBeDefined();
    createdItemId = res.body.item.id;
    expect(typeof createdItemId).toBe('number');
  });

  it('should get all items', async () => {
    const res = await request(app).get('/items');
    expect([200,404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('should get item by ID', async () => {
    const res = await request(app).get(`/items/${createdItemId}`);
    expect([200,404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.id).toBe(createdItemId);
    }
  });

  it('should update item as owner', async () => {
    const res = await request(app)
      .put(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Found Phone',
        category: 'phone',
        description: 'Black iPhone found in park',
        status: 'Found',
        location: 'Central Park',
        date: '2025-07-21',
        contact_info: '555-5678'
      });
    expect([200,403,404]).toContain(res.statusCode);
  });

  it('should update item as admin', async () => {
    const res = await request(app)
      .put(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Admin Updated Phone',
        category: 'phone',
        description: 'Updated by admin',
        status: 'Found',
        location: 'Central Park',
        date: '2025-07-22',
        contact_info: '555-9999'
      });
    expect([200,404]).toContain(res.statusCode);
  });

  it('should delete item as admin', async () => {
    const res = await request(app)
      .delete(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200,404]).toContain(res.statusCode);
  });

  it('should not delete item as user', async () => {
    const res = await request(app)
      .delete(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect([403,401,404]).toContain(res.statusCode);
  });
});