import express,{ 
    type Application, 
    type Request,
    type Response
}  from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app: Application = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {

    res.status(200).json({
        message: 'Success',
        author: 'Hosain'
    })

    // res.send('Hello World!')
})

export default app