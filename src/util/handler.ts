import Status from '@/enum/status';
import Method from '@/enum/method';

export class Request {
  public method: Method;
  public headers: { [key: string]: string };
  public body: { [key: string]: any };
  public params: { [key: string]: string | number };

  /**
   * Implement a method instead of using this!
   * This is only public for testing purposes.
   */
  public req: any;

  constructor(req: any) {
    this.method = req.method;
    this.headers = req.headers;

    this.body = req.body;
    this.params = req.params;
  }

  getHeader(key: string): string | undefined {
    return this.headers[key.toLowerCase()];
  }

  getParam(key: string): string | number | undefined {
    return this.params[key.toLowerCase()];
  }
}

export class Response<T> {
  /**
   * Implement a method instead of using this!
   * This is only public for testing purposes.
   */
  public res: any;

  private req: any;

  constructor(res: any, req: any) {
    this.res = res;
    this.req = req;
  }

  public header(key: string, value: string) {
    this.res.setHeader(key, value);
  }

  public allow(methods: Method[]): boolean {
    this.res.setHeader('Allow', methods.join(', '));

    if (!methods.includes(this.req.method)) {
      this.error(
        Status.METHOD_NOT_ALLOWED,
        `Method not allowed, only \`${methods.join('`, `')}\` allowed.`
      );

      return false;
    }

    return true;
  }

  public status(code: Status) {
    return {
      json: (data?: T) => {
        this.res.status(code).json(data);
      },
      send: (data?: T) => {
        this.res.type('txt').status(code).send(data);
      }
    };
  }

  public error(code: Status, message: string) {
    return this.res.status(code).json({
      error: code,
      message
    });
  }
}
