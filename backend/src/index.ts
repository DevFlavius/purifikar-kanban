import express, { Request, Response } from 'express';
import cors from 'cors';      // <-- novo

const app = express();
app.use(cors());              // <-- habilita CORS
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API online! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⚡ Backend na porta ${PORT}`));
