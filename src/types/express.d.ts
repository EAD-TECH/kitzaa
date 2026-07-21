

import { Model, PopulateOptions } from "mongoose";
import type { UserDocument } from "./user.types.ts";

declare global {
  namespace Express {
    interface Response {
      getModelList<T>(
        model: Model<T>,
        customFilter?: object,
        populate?: string | PopulateOptions | (string | PopulateOptions)[] | null
      ): Promise<any[]>;

      getModelListDetails<T>(
        model: Model<T>,
        customFilter?: object
      ): Promise<{
        count: number;
        filter: object;
        search: object;
        page: number;
        skip: number;
        limit: number;
        sort: object;
        pages:
          | false
          | {
              previous: number | false;
              current: number;
              next: number | false;
              total: number;
            };
      }>;
    }
  }
}


declare global {
    namespace Express {
        interface Request {
            user: UserDocument
        }
    }
}

export {};