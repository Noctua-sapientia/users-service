const app = require('../app');
const request = require('supertest');
const Customer = require('../models/customer');

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

    describe("GET /customers", () => {
        it("Sould return all contacts", () => {
            const customers = [
                new Customer({"name": "Pablo", "surnames": "Santos", "address": "Paradores, 43"}),
                new Customer({"name": "Juan", "surnames": "Sojo", "address": "América, 22"}),
            ];

            dbFind = jest.spyOn(Customer, "find");
            dbFind.mockImplementation(async () => Promise.resolve(customers));

            return request(app).get("/api/v1/customers").then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();

            });
        });
    });

    describe("POST /customers", () => {
        const customer = {"name": "Pablo", "surnames": "Santos", "address": "Paradores, 43"};
        var dbSave;

        beforeEach(() => {
            dbSave = jest.spyOn(Customer.prototype, "save");
        });

        it("Sould add a new Customer", () => {
            dbSave.mockImplementation(async() => Promise.resolve(true));

            return request(app).post("/api/v1/customers").then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();

            });
        });

        it("Sould return 500 error if there is a problem with the connection.", () => {
            dbSave.mockImplementation(async() => Promise.reject("Connection failed."));

            return request(app).post("/api/v1/customers").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();

            });
        });
    });
});