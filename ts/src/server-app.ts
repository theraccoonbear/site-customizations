import express, { Request, Response } from 'express';
import cbfs from 'fs';
import path from 'path';

const fs = cbfs.promises;

const app = express();
const port = process.env.PORT || 3000;
const baseDirectory = process.env.BASE_DIRECTORY || path.join(__dirname, 'files');
const uncleanRgx = /[^A-Z0-9_-]/i;
const includeRgx = /^\/\/\s+@include\s+(([A-Z0-9_-]+\.)+js)/gim;

console.info(`BASE_DIRECTORY="${baseDirectory}"`);

// Helper function to check file existence
const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
};

const expandFile = async (fileData: string): Promise<string> => {
  if (includeRgx.test(fileData)) {
    includeRgx.lastIndex = 0;
    const match = includeRgx.exec(fileData);
    if (match) {
      const embeddedFile = match[1];
      const embedPath = path.join(baseDirectory, embeddedFile);
      if (await fileExists(embedPath)) {
        console.log(`Expanding to include ${embeddedFile}`);
        const embed = await getFile(embedPath);
        return expandFile(fileData.replace(includeRgx, embed));
      } else {
        console.error(`Invalid embed path: ${embedPath}`);
      }
    } else {
      console.error(`Invalid embed!?`)
    }
  }
  return fileData;
};

const getFile = async (filePath: string): Promise<string> => {
  const exists = await fileExists(filePath);
  if (!exists) { throw new Error(`File not found: "${filePath}"`); }
  console.log(`Reading ${filePath}`);
  const data = await fs.readFile(filePath, { encoding: 'utf-8' });
  return expandFile(data);
};

// Route to serve files based on URL pattern
app.get('/:domain.:tld.:ext(js|css)', (req: Request, res: Response) => {
  (async () => {
    const { domain, tld, ext } = req.params;
    const [ prependFile, appendFile ] = [null, null];

    // Construct the filename from the URL parameters
    const filename = `${domain}.${tld}.${ext}`;
    console.log(`Request for ${filename}`);
    if (uncleanRgx.test([domain,tld,ext].join(''))) {
      return res.status(404).json({ error: `Bad Request`  });
    }

    const requestedFilePath = path.join(baseDirectory, filename);

    console.log(`Handling request for ${filename}`);

    // Check if the requested file exists
    if (!fileExists(requestedFilePath)) {
      console.error(`Request for ${filename} is 404`);
      return res.status(404).json({ error: `File not found: ${requestedFilePath}` });
    }

    const resp: string[] = [];
  
    // Read the requested file content
    resp.push(await getFile(requestedFilePath));

    
    // Optionally prepend content from another file
    if (prependFile && typeof prependFile === 'string') {
      const prependFilePath = path.join(baseDirectory, prependFile);
      if (await fileExists(prependFilePath)) {
        resp.unshift(await getFile(prependFilePath));
      }
    }

    // Optionally append content from another file
    if (appendFile && typeof appendFile === 'string') {
      const appendFilePath = path.join(baseDirectory, appendFile);
      if (await fileExists(appendFilePath)) {
        resp.push(await getFile(appendFilePath));
      }
    }

    // Set appropriate content type based on file extension
    const contentType = ext === 'js' ? 'application/javascript' : 'text/css';
    res.setHeader('Content-Type', contentType);

    // Send the file content as the response
    res.send(resp.join("\n"));
  })().catch((error) => {
    console.error('Error in async route handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});