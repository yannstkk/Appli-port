const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get('/scrapeS/:shipId', async (req, res) => {
    const { shipId } = req.params;
    const url = `https://www.portdebejaia.dz/phpcodes/navire_e.php?ship=${shipId}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const shipData = {};

        $('.list-group-item').each((index, element) => {
            const label = $(element).text().split(':')[0].trim();
            const value = $(element).find('.label').text().trim();
            shipData[label] = value;
        });

        res.json({ shipData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data from the website' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
