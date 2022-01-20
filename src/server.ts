import express from 'express'
import { router } from './routes/routes'

const app = express();
app.use(router)


app.listen(4000, () => console.log(`Server running at 4000`))