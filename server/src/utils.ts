import fs from 'fs'
import path from 'path'
import os from 'os'

export const createTempFileFromBase64 = (base64Data: string, fileName: string): string => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir()))
  const filePath = path.join(directory, fileName)
  const arr = base64Data.split(',')

  fs.writeFileSync(filePath, arr[1], 'base64')

  return filePath
}