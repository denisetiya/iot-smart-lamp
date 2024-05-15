import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import bcrypt from 'bcrypt';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
  res.send('<h3 style="text-align: center;">welcome to the api</h3>');
})


app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
