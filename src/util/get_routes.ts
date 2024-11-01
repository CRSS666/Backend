import fs from 'fs';
import path from 'path';

export default async function getRoutes(rDir: string): Promise<string[]> {
  const routes: string[] = [];

  const exploreRoutes = async (dir: string) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (fs.lstatSync(path.join(dir, file)).isDirectory())
        await exploreRoutes(path.join(dir, file));
      else {
        if (file.endsWith('.ts')) {
          routes.push(path.join(dir, file));
        }
      }
    }
  };

  await exploreRoutes(rDir);

  return routes;
}
