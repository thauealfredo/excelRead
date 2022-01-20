import { Request, Response, Router } from 'express';
import multer from 'multer';
import fs from 'fs'

const storage = multer.diskStorage({});
const multerConfig = multer({ storage })
const router = Router();

import { Readable } from 'stream'
import readLine from 'readline'
import xlsx from 'xlsx'

router.post(
    "/api/upload-excel",
    multerConfig.single("file"),
    async (req: Request, res: Response) => {
        let buffer = req.file?.buffer
        const path = req.file?.path || ""
        const workBook = xlsx.readFile(path);
        let products = [];

        //convert xlsx to csv
        xlsx.writeFile(workBook, `${__dirname}/aux.csv`, { sheet: workBook.SheetNames[0], bookType: "csv" });
        buffer = fs.readFileSync(`${__dirname}/aux.csv`)
        fs.unlink(`${__dirname}/aux.csv`, () => { })

        const readableFile = new Readable();
        readableFile.push(buffer)
        readableFile.push(null)

        const productsLine = readLine.createInterface({
            input: readableFile
        })


        for await (let line of productsLine) {
            let lineSplit = line.split(',')
            products.push({
                ID: lineSplit[0],
                name: lineSplit[1],
                value: lineSplit[2],
                qtd: lineSplit[3]
            })
        }

        return res.status(200).json(products)
    }
)


export { router }