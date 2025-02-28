const userController = require('../../../controllers/users')
const {User} = require('../../../models/User')
const jwt = require('jsonwebtoken');

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };


describe('Users controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe('register', () => {
    it('should return user with a status code 201', async () => {
      const testUser = {username: "Test", password: "testing", registration_id: 1}
      const req = {body: {username: testUser.username, password: testUser.password}}
      jest.spyOn(User, 'create').mockResolvedValue(new User(testUser))

      await userController.register(req, mockRes)
      
      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(testUser)
    })

    it('should return an error upon failure when no password submitted', async () => {
        const testUser = {username: "Test", login_id: 1}
        const req = {body: {username: testUser.username, password: testUser.password}}

        await userController.register(req, mockRes)
  
        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: 'data and salt arguments required' })
    })
  })

  describe('login', () => {
    it('should return user with a status code 200', async () => {
      const testUser = {username: "Test", password: "$2b$10$WoP3NXT3j2iSJfCB3iSWguqddO3FUffoilTDYrZhnclYEDeBVqoKG", login_id: 1}
      const req = {body: {username: testUser.username, password: "testing"}}
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(new User(testUser))
      jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mocked-token'); // Simulate token generation with a mocked token
    });
      
      await userController.login(req, mockRes)
      
      expect(User.getOneByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({success: true, token: 'mocked-token'})
    }),
    it('should return status 401 if token fails', async () => {
      const testUser = {username: "Test", password: "$2b$10$WoP3NXT3j2iSJfCB3iSWguqddO3FUffoilTDYrZhnclYEDeBVqoKG", login_id: 1}
      const req = {body: {username: testUser.username, password: "testing"}}
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(new User(testUser))
      jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback("Error",); // Simulate token generation fail
    });
      
      await userController.login(req, mockRes)
      
      expect(User.getOneByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith({error: 'Error in token generation'})
    }),
    it('should return status 401 if incorrect credentials', async () => {
      const testUser = {username: "Test", password: "$2b$10$WoP3NXT3j2iSJfCB3iSWguqddO3FUffoilTDYrZhnclYEDeBVqoKG", login_id: 1}
      const req = {body: {username: testUser.username, password: "wrong password"}}
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(new User(testUser))
      
      await userController.login(req, mockRes)
      
      expect(User.getOneByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(401)
      expect(mockJson).toHaveBeenCalledWith({error: "User could not be authenticated"})
    })
  })

  describe('profile', () => {
    it('should return user with a status code 200', async () => {
      const req = {body: {username: "Test", registration_id: 1}}
      const testUser = {username: "Test", registration_id: 1}
      jest.spyOn(User, "getOneById").mockResolvedValue(new User(testUser))
            
      await userController.profile(req, mockRes)
      
      expect(User.getOneById).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({"email": undefined, "name": undefined, "password": undefined, "postcode": undefined, "region": undefined, "registration_id": 1, "username": "Test"})
    }),
    it('should return status 404 if incorrect credentials', async () => {
      const req = {body: {username: "Test", registration_id: 9999}}
      jest.spyOn(User, "getOneById").mockRejectedValue(new Error("Unable to locate user."))
      
      await userController.profile(req, mockRes)
      
      expect(User.getOneById).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({error: "Unable to locate user."})
    })
  })
})