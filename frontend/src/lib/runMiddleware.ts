import { NextRequest } from "next/server";

export function runMiddleware(
  req: NextRequest,
  fn: (req: NextRequest, next: (result?: any) => void) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}
