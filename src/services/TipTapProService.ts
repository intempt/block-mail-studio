
export interface TipTapProConfig {
  appId: string;
  jwtSecret: string;
  jwtToken: string;
}

export class TipTapProService {
  private static config: TipTapProConfig = {
    appId: 'ok0nxde9',
    jwtSecret: 'gBvEtKvCecICFL6INuyG0ENoyhbccAIhyqP1aaYScXDBxhjpqvyZwWdwjQaPi8Uh',
    jwtToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDgwNjA5OTAsIm5iZiI6MTc0ODA2MDk5MCwiZXhwIjoxNzQ4MTQ3MzkwLCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJjMDkzOGQ0Yy02Mzk0LTQ4ZDgtYWZkYy1lNmYwNmZlNjc5MmQifQ.dLyS2ToGlVP16WRKlz5eCKY_baNJIpyezwgjJRIBAis'
  };

  static getAppId(): string {
    return this.config.appId;
  }

  static getJWTToken(): string {
    return this.config.jwtToken;
  }

  static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = this.getJWTToken();
    
    return fetch(`https://api.tiptap.dev${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}
