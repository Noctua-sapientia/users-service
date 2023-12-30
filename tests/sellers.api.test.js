const app = require('../app');
const request = require('supertest');
const Seller = require('../models/seller');

describe("Customers API", () => {
    describe("GET /", () => {
        it("Sould return an HTML document", () => {
            return request(app).get("/").then((response) => {
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

            return request(app).get("/api/v1/sellers").then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();

            });
        });
    });

    describe("POST /customers", () => {
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