const User = require('../../../models/User')
const db = require('../../../database/connect')

describe('User Model', () => {
    beforeEach(() => jest.clearAllMocks())
  
    afterAll(() => jest.resetAllMocks())

    describe("Create" , () => {
        it("resolves correctly when username and password submitted", async () => {
            //Arrange
            //name, password, username, email, postcode, region
            const body = {
                "name": "John",
                "username": "test",
                "password": "testing",
                "email": "j@doe.co",
                "region": "London"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{registration_id: 1}]})

            //Act
            const response = await User.create(body)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('registration_id')
            expect(response.username).toBe(body.username)
            expect(response.registration_id).toBe(1)
            expect(db.query).toHaveBeenCalledWith("INSERT INTO registration_info (name, password, username, email, postcode, region) VALUES ($1, $2, $3, $4, $5, $6) RETURNING registration_id;", 
                [body.name, body.password, body.username, body.email, body.postcode, body.region]);
        });
        it("throws error if password or username missing", async () => {
            //Arrange
            const body1 = {
                "username": "Test",
            }
            const body2 = {
                "password": "testing",
            }
            //Act & Assert
            await expect(User.create(body1)).rejects.toThrow("Ensure username and password are both provided");
            await expect(User.create(body2)).rejects.toThrow("Ensure username and password are both provided");
        });
    })

    describe("getOneById", () => {
        it("resolves correctly when id submitted", async () => {
            //Arrange
            const body = {
                "registration_id": 1,
                "username": "Test"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{username: body.username, registration_id: body.registration_id}]})

            //Act
            const response = await User.getOneById(body.registration_id)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('registration_id')
            expect(response.username).toBe(body.username)
            expect(response.registration_id).toBe(body.registration_id)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM registration_info WHERE registration_id = $1", [body.registration_id]);
        });
        it("throws error if return from db is empty", async () => {
            //Arrange
            const id = 999
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: []})
            //Act & Assert
            await expect(User.getOneById(id)).rejects.toThrow("Unable to locate user.");
        });
    })
    describe("getOneByUsername", () => {
        it("resolves correctly when name submitted", async () => {
            //Arrange
            const body = {
                "registration_id": 1,
                "username": "Test"
            }
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: [{username: body.username, registration_id: body.registration_id}]})

            //Act
            const response = await User.getOneByUsername(body.username)

            //Assert
            expect(response).toHaveProperty('username')
            expect(response).toHaveProperty('registration_id')
            expect(response.username).toBe(body.username)
            expect(response.registration_id).toBe(body.registration_id)
            expect(db.query).toHaveBeenCalledWith("SELECT registration_id, username, password FROM registration_info WHERE username = $1", [body.username]);
        });
        it("throws error if return from db is empty", async () => {
            //Arrange
            const name = "Not a user"
            jest.spyOn(db, "query").mockResolvedValueOnce({ rows: []})
            //Act & Assert
            await expect(User.getOneById(name)).rejects.toThrow("Unable to locate user.");
        });
    })
})