const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Seller = require('../models/seller');

describe("Customers API", () => {
    let jwtToken;
    beforeAll(() => {
        const SECRET_KEY = 'a56d1f7c0c817387a072692731ea60df7c3a6c19d82ddac228a9a4461f8c5a72';
        jwtToken = jwt.sign({}, SECRET_KEY,);
    });
    describe("GET /", () => {
        it("Sould return an HTML document", () => {
            return request(app).get("/").set('Authorization', jwtToken).then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));

            });
        });
    });

    describe("GET /sellers", () => {
        it("Sould return all sellers", () => {
            const sellers = [
                new Seller({"name": "Pablo", "valoration": 4.9, "orders": 23, "reviews": 3}),
                new Seller({"name": "JuanMa", "valoration": 4.4, "orders": 323, "reviews": 33}),
            ];

            dbFind = jest.spyOn(Seller, "find");
            dbFind.mockImplementation(async () => Promise.resolve(sellers));

            return request(app).get("/api/v1/sellers").set('Authorization', jwtToken).then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();

            });
        });
    });

    describe("POST /sellers", () => {
        const customer = {"name": "Pablo", "valoration": 4.9, "orders": 23, "reviews": 3};
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Seller.prototype, "save");
        });

        it("Sould add a new Customer", () => {
            dbSave.mockImplementation(async() => Promise.resolve(true));

            return request(app).post("/api/v1/sellers").then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();

            });
        });

        it("Sould return 500 error if there is a problem with the connection.", () => {
            dbSave.mockImplementation(async() => Promise.reject("Connection failed."));

            return request(app).post("/api/v1/sellers").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();

            });
        });
    });
});