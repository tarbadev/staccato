import { Request, Response } from 'express'

export const homeGet = async (req: Request, res: Response) => {
    const bundles = [
        { name: 'Bundle 1' },
        { name: 'Bundle 2' },
        { name: 'Bundle 3' },
    ]
    res.json(bundles)
}