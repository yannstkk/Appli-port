const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let scanResults = [];

app.post('/results', (req, res) => {
    try {
        const { data } = req.body;

        if (data && Array.isArray(data)) {
            scanResults = data;

            console.log("Résultats mis à jour :", scanResults);
            res.status(200).json({ message: "Résultats mis à jour avec succès." });
        } else {
            res.status(400).json({ error: "Format de données invalide" });
        }
    } catch (error) {
        console.error("Erreur lors de la réception des résultats :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.get('/scan-results', (req, res) => {
    res.json(scanResults);
});



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
