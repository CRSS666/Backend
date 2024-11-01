import Method from '@/enum/method';
import Status from '@/enum/status';

import { Request, Response } from '@/util/handler';

interface Version {
  version: {
    name: string;
    code: number;
  };
  path: string;
  deprecated: boolean;
}

interface IndexResponse {
  latest: number;
  versions: Version[];
}

export default function handler(req: Request, res: Response<IndexResponse>) {
  if (!res.allow([Method.GET])) return;

  const versions: Version[] = [
    {
      version: {
        name: 'v1.0.0-dev',
        code: 1
      },
      path: '/v1',
      deprecated: false
    }
  ];

  return res.status(Status.OK).json({
    latest: versions.length - 1,
    versions
  });
}
