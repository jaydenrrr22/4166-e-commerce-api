import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(morgan('tiny'));

const specs = YAML.load("./docs/openapi.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('api/products', productRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    console.log(err.stack);
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
