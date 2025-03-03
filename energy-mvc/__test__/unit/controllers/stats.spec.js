const statsController = require('../../../controllers/stats')
const {Stats} = require('../../../models/User')


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

  describe('getStats', () => {
    it('should return html with a status code 200', async () => {
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
  
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockJson).toHaveBeenCalledWith({ error: 'data and salt arguments required' })
    })
  })
})