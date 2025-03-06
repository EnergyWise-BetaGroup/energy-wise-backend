const { getStats, getDonut, getGauge, getTable } = require("../../../controllers/stats");
const { User } = require("../../../models/User");
const axios = require("axios");
const { fetchExternalMeterData, fetchExternalCO2Data, fetchFutureCO2Data } = require("../../../services/externalAPIService");

jest.mock("axios");
jest.mock("../../../models/User");
jest.mock("../../../services/externalAPIService");

describe("Stats Controller", () => {
    let req, res;

    beforeEach(() => {
        req = { body: { registration_id: "testUser" } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    test("getStats - should return visualisation HTML", async () => {
        User.getOneById.mockResolvedValue({
            api_key: "test_api_key",
            meter_mpan: "test_mpan",
            meter_serial: "test_serial",
            postcode: "test_postcode"
        });

        fetchExternalMeterData.mockResolvedValue({
            data: { results: [{ consumption: 10, interval_start: "2025-03-01T00:00:00Z", interval_end: "2025-03-01T00:30:00Z" }] }
        });

        fetchExternalCO2Data.mockResolvedValue({
            data: { data: { data: [{ intensity: { forecast: 50 }, from: "2025-03-01T00:00:00Z", to: "2025-03-01T00:30:00Z" }] } }
        });

        axios.post.mockResolvedValue({ data: { visualisation_html: "<div>Chart</div>" } });

        await getStats(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ html: "<div>Chart</div>" });
    });

    test("getDonut - should return pie chart HTML", async () => {
        User.getOneById.mockResolvedValue({ postcode: "test_postcode" });
        axios.get.mockResolvedValue({ data: { data: [{ data: [{ generationmix: [{ fuel: "wind", perc: 30 }] }] }] } });
        axios.post.mockResolvedValue({ data: { visualisation_html: "<div>Pie Chart</div>" } });

        await getDonut(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ html: "<div>Pie Chart</div>" });
    });

    test("getGauge - should return gauge chart data", async () => {
        User.getOneById.mockResolvedValue({
            api_key: "test_api_key",
            meter_mpan: "test_mpan",
            meter_serial: "test_serial",
            postcode: "test_postcode"
        });

        fetchExternalMeterData.mockResolvedValue({
            data: { results: [{ consumption: 10, interval_start: "2025-03-01T00:00:00Z", interval_end: "2025-03-01T00:30:00Z" }] }
        });

        fetchExternalCO2Data.mockResolvedValue({
            data: { data: { data: [{ intensity: { forecast: 50 }, from: "2025-03-01T00:00:00Z", to: "2025-03-01T00:30:00Z" }] } }
        });

        axios.post.mockResolvedValue({ data: { gaugeData: "someGaugeData" } });

        await getGauge(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ gaugeData: "someGaugeData" });
    });

    test("getTable - should return table HTML", async () => {
        User.getOneById.mockResolvedValue({ postcode: "test_postcode" });
        fetchFutureCO2Data.mockResolvedValue({
            data: { data: { data: [{ from: "2025-03-01T00:00:00Z", intensity: { forecast: 60 } }] } }
        });
        axios.post.mockResolvedValue({ data: { visualisation_html: "<div>Table</div>" } });

        await getTable(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ html: "<div>Table</div>" });
    });
});
