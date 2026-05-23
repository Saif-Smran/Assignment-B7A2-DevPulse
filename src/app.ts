import express,{ 
    type Application, 
    type Request,
    type Response
}  from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { sendResponce } from './utility/semdResponce'
import { authRoute } from './modules/auth/auth.route'
import globalErrorHandeling from './middleware/globalErrorHandeling'

const app: Application = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))
app.use(globalErrorHandeling)
app.use(cookieParser())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {

   sendResponce(res, 200, 'Welcome to the Issue Tracker API', null)

    // res.send('Hello World!')
})

app.use('/api/auth', authRoute)


export default app