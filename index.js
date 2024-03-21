const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.port || 3004;

// Middleware pour gérer les en-têtes CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(express.json());

// Route pour le scraping des navires sur la page principale
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

// Route pour le scraping des données d'un navire spécifique en fonction de son ID
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
