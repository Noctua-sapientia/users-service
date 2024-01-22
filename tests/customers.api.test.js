const app = require('../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

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

    describe("GET /customers", () => {
        it("Sould return all contacts", () => {
            const customers = [
                new Customer({"name": "Pablo", "surnames": "Santos", "address": "Paradores, 43"}),
                new Customer({"name": "Juan", "surnames": "Sojo", "address": "América, 22"}),
            ];

            dbFind = jest.spyOn(Customer, "find");
            dbFind.mockImplementation(async () => Promise.resolve(customers));

            return request(app).get("/api/v1/customers").set('Authorization', jwtToken).then((response) => {
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