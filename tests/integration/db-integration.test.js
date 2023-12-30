const Customer = require('../../models/customer');
const dbConnect = require('../../db');

jest.setTimeout(30000);

describe('Customers DB connection', () => {
    beforeAll((done) => {
        if(dbConnect.readyState == 1){
            done();
        }else{
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async() => {
        await Customer.deleteMany({});
    });

    it('writes a customer in the DB', async() => {
        const customer = new Customer({"id": 1,"name": "Pablo", "surnames": "Santos", "address": "Paradores, 43"});
        await customer.save();

        customers = await Customer.find();
        expect(customers).toBeArrayOfSize(1);
    });
    
    afterAll(async () => {
        if(dbConnect.readyState == 1){
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});