import { Fruit } from "repositories/fruits-repository";
import { FruitInput } from "services/fruits-service";
import supertest from "supertest";
import app from "../src/index";

describe("fruits", () => {
    
    it("get all fruits but there is none", async () => {
        const result = await supertest(app).get("/fruits");
        const { status } = result;

        expect(status).toBe(200);

        const fruits = result.body as Fruit[];
        expect(fruits).toHaveLength(0);
    })

    it("insert a fruit", async () => {
        const body:FruitInput = {
            name: "Apple",
            price: 5000
        }

        const result = await supertest(app).post("/fruits").send(body);
        const { status } = result;
        expect(status).toBe(201);
    });


    it("get a fruit", async () => {
        const result = await supertest(app).get("/fruits/1");
        const { status } = result;

        expect(status).toBe(200);

        const body = result.body as Fruit;

        expect(body).toEqual({
            id: 1,
            name: "Apple",
            price: 5000
        })
    });

    it("get all fruits", async () => {
        const result = await supertest(app).get("/fruits");
        const { status } = result;

        expect(status).toBe(200);

        const fruits = result.body as Fruit[];
        expect(fruits).toHaveLength(1);
        expect(fruits).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number)
            })

        ]));
    })

    it("tries to get a fruit that does not exist", async () => {
        const result = await supertest(app).get("/fruits/102382733");
        const { status } = result;

        expect(status).toBe(404);
    })

    it("tries to insert a fruit with missing data", async () => {
        type IncompleteFruit = Omit<FruitInput, "price">
        
        const body:IncompleteFruit = {
            name: "Banana",
        } //missing on purpose

        const result = await supertest(app).post("/fruits").send(body);
        const { status } = result;
        expect(status).toBe(422);
    })

    it("tries to insert a fruit that is already registered", async () => {
        const body: FruitInput = {
            name: "Apple",
            price: 2000
        }

        const result = await supertest(app).post("/fruits").send(body);
        const { status } = result;
        expect(status).toBe(409);
    })
  });