const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');
const authRoute = require('./router/auth'); // Ensure this path is correct
const app = require('./index'); // Adjust this path if needed

jest.mock('./router/auth');

describe('index.js', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3019, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should serve static files from the dist folder', async () => {
        const res = await request(app).get('/some-file-that-exists-in-dist-folder');
        expect(res.status).toBe(200);
        // Add more assertions if needed
    });

    it('should handle API requests to /api/v1/auth', async () => {
        authRoute.mockImplementation((req, res) => {
            res.status(200).send({ message: 'Auth route works' });
        });

        const res = await request(app).get('/api/v1/auth');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Auth route works' });
    });

    it('should handle requests to non-existent routes by serving index.html', async () => {
        const res = await request(app).get('/non-existent-route');
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('text/html');
    });

    it('should use CORS', async () => {
        const res = await request(app).get('/some-endpoint');
        expect(res.header['access-control-allow-origin']).toBe('*');
    });

    it('should parse JSON and URL-encoded bodies', async () => {
        const jsonRes = await request(app)
            .post('/api/v1/auth')
            .send({ key: 'value' })
            .set('Content-Type', 'application/json');

        expect(jsonRes.status).toBe(200);
        // Add more assertions to validate the parsed body

        const urlencodedRes = await request(app)
            .post('/api/v1/auth')
            .send('key=value')
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(urlencodedRes.status).toBe(200);
        // Add more assertions to validate the parsed body
    });
});
