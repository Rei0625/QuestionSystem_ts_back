import axios, { AxiosInstance } from "axios";

export interface WikiSearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

export class MediaWikiApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://ja.wikipedia.org/w/api.php",
      timeout: 5000,
      headers: {
        "User-Agent":
          "MyWikiApp/1.0 (https://localhost:3000.com; dev@example.com)",
      },
      params: {
        format: "json",
        origin: "*",
      },
    });
  }

  async search(keyword: string): Promise<WikiSearchResult[]> {
    const response = await this.client.get("", {
      params: {
        action: "query",
        list: "search",
        srsearch: keyword,
        srlimit: 1,
      },
    });
    return response.data.query.search;
  }
}
export default new MediaWikiApiService();
