async function getStats(req, res) {
    try {
        const userId = req.body.registration_id;
        const currentUser = await User.getOneById(userId);

        //To decide how to give info to python microservice

        const response = await axios.post('http://pottery-python:3001/generate-visualisation', data)

        res.status(200).json({ "html": response.data.visualisation_html })
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

module.exports = {
    getStats,
}