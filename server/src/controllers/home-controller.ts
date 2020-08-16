import { Request, Response } from 'express'

export const homeGet = async (req: Request, res: Response) => {
    const bundles = [
        { id: 1, name: 'Bundle 1' },
        { id: 2, name: 'Bundle 2' },
        { id: 3, name: 'Bundle 3' },
    ]
    res.json(bundles)
}