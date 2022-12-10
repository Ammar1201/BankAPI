import express from 'express';
import { indexRouter } from './routes/index.router.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', indexRouter);
app.get('/', (req, res) => res.redirect('/api/users'));

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});