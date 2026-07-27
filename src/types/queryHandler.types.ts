
export interface QueryHandlerQuery {

    filter?: Record<string, unknown>;

    search?: Record<string, string | { $regex: any; $options: string }>;

    sort?: Record<string, 1 | -1>;

    page?: string;

    limit?: string;

    skip?: string;

}