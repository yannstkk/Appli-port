const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.port || 3002;

app.use(express.json());

app.get('/scrapeS3', async (req, res) => {
    const url = 'https://www.portdebejaia.dz/situation-des-navires/#';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const navires = [];

        $('#nav-quai tbody tr').each((index, element) => {
            const poste = $(element).find('td').eq(0).text().trim();
            const navireLink = $(element).find('td').eq(1).find('a').attr('href');
            const IMO = navireLink ? navireLink.match(/ship=(\d+)/)[1] : null;
            navires.push({ poste, IMO });
        });

        res.json({ navires });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data from the website' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});