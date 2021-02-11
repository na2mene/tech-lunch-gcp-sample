import express from 'express';
import { HealthCheckController, RentalSearchController } from './controllers';

const app: express.Application = express();
const port = '3000';

app.use(express.json());
app.use('/health', HealthCheckController);
app.use('/v1/rental/search', RentalSearchController);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => { // eslint-disable-line
  console.error(err);
  res.status(500).send().end();
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
