import { GitHubUser, GitHubRepo } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetch(endpoint: string): Promise<any> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<GitHubUser> {
    return this.fetch('/user');
  }

  async getStarredRepos(): Promise<GitHubRepo[]> {
    return this.fetch('/user/starred');
  }
}

// GitHub OAuth configuration
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
export const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/callback`;

export function getGitHubAuthURL(): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'read:user',
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
