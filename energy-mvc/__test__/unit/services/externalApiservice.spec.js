const axios = require('axios');
const { fetchExternalMeterData, fetchExternalCO2Data, fetchFutureCO2Data, fetchExternalMeterInfo } = require('../../../services/externalAPIService');

describe('fetchExternalMeterData', () => {
  const api_key = 'mockApiKey';
  const mpan = 'mockMpan';
  const serial = 'mockSerial';
  const postcode = 'mockpostcode'
  const account = 'mockAccountId';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch External Meter Data successfully', async () => {
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        results: {'electricity':200},
      },
    });

    const response = await fetchExternalMeterData(api_key, mpan, serial);

    expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://api.octopus.energy/v1/electricity-meter-points'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      );



    expect(response.data.results).toEqual({'electricity':200});
    expect(getSpy).toHaveBeenCalledTimes(1);
  });

  it('should fetch External CO2 data Successfully',async () => {
    const CO2Spy = jest.spyOn(axios, 'get').mockResolvedValue({data: {data: {"intensity": 120}}})

    const response = await fetchExternalCO2Data(postcode)
    expect(CO2Spy).toHaveBeenCalledWith(expect.stringContaining('https://api.carbonintensity.org.uk/regional/intensity'));
    expect(response.data.data.intensity).toBe(120);
    expect(CO2Spy).toHaveBeenCalledTimes(1)
  })

 
    it('should fetch External Meter Info successfully', async () => {
        const getSpy = jest.spyOn(axios, 'get').mockResolvedValue({
          data: {
            account: {
              id: account,
              name: 'Mock Account',
            },
          },
        });
    
        const response = await fetchExternalMeterInfo(api_key, account);
    
        expect(getSpy).toHaveBeenCalledWith(
          `https://api.octopus.energy/v1/accounts/${account}`,
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: expect.stringContaining('Basic'),
            }),
          })
        );
    
        expect(response.data.account.id).toBe(account);
        expect(response.data.account.name).toBe('Mock Account');
        expect(getSpy).toHaveBeenCalledTimes(1);
    });

    it('should fetch future CO2 data successfully', async () => {
        const CO2Spy = jest.spyOn(axios, 'get').mockResolvedValue({
          data: {
            data: {
              intensity: 150,
            },
          },
        });
    
        const response = await fetchFutureCO2Data(postcode);
    
        expect(CO2Spy).toHaveBeenCalledWith(
          expect.stringContaining('https://api.carbonintensity.org.uk/regional/intensity')
        );
    
        expect(response.data.data.intensity).toBe(150);
    
        expect(CO2Spy).toHaveBeenCalledTimes(1);
    });


});

