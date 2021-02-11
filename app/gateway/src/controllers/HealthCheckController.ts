import { Router, Request, Response } from 'express';

const HealthCheckController: Router = Router();
HealthCheckController.get('/', (req: Request, res: Response) => {
  console.log(`[${req.path}]: 呼ばれました。`);

  const appState = {
    message: 'Application is running',
    success: true,
  };

  res.status(200).send({
    app: appState,
  });
});

export {
  HealthCheckController,
};
