import axios from 'axios';
import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.use(cors());
const port = process.env.PORT;

app.get("/availableCountries", async (req, res) => {
    try {
        const response = await axios.get(process.env.DATENAGERURL + "/AvailableCountries");
        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unexpected error occurred" })
    }

});

app.get("/countryInfoByCode/:code", async (req, res) => {
    try {
        const { code } = req.params

        const infoResponse = await axios.get(process.env.DATENAGERURL + `/CountryInfo/${code}`);
        const { borders, commonName } = infoResponse.data
        
        const flagResponse = await axios.post(process.env.COUNTRIESNOWURL + "/flag/images", { iso2: code });
        const { flag } = flagResponse.data.data

        try {
            const popResponse = await axios.post(process.env.COUNTRIESNOWURL + "/population", { country: commonName });
            const populationCounts  = popResponse.data.data.populationCounts
            res.json({ code, commonName, borders, populationCounts, flag })
        } catch (error) {
            res.json({ code, commonName, borders, flag })
        }
        
        

        

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unexpected error occurred" })
    }

});


app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});


app.listen(port, () => { console.log(`Server is listening at http://localhost:${port}`) })