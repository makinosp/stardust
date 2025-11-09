import { useState, useEffect } from 'react';
import { AuthState, GitHubRepo } from './types';
import { GitHubAPI, getGitHubAuthURL } from './github-api';
import './App.css';

export function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
  });
  const [starredRepos, setStarredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const storedToken = localStorage.getItem('github_access_token');
    if (storedToken) {
      loadUserData(storedToken);
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would exchange the code for an access token
      // via your backend server. For demo purposes, we'll use a token from localStorage
      // or prompt the user to enter it.
      
      // Clear the code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      alert('Please enter your GitHub Personal Access Token in the prompt that follows.');
      const token = prompt('Enter your GitHub Personal Access Token (with read:user scope):');
      
      if (token) {
        await loadUserData(token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const api = new GitHubAPI(token);
      const user = await api.getCurrentUser();
      const repos = await api.getStarredRepos();
      
      localStorage.setItem('github_access_token', token);
      
      setAuthState({
        isAuthenticated: true,
        user,
        accessToken: token,
      });
      setStarredRepos(repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
      localStorage.removeItem('github_access_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // For simplicity, we'll use Personal Access Token flow
    const token = prompt('Enter your GitHub Personal Access Token (with read:user scope):\n\nYou can create one at: https://github.com/settings/tokens');
    
    if (token) {
      loadUserData(token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('github_access_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
    });
    setStarredRepos([]);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>⭐ Stardust</h1>
          <p>View your GitHub starred repositories</p>
          <button className="login-button" onClick={handleLogin}>
            Login with GitHub Token
          </button>
          <p className="help-text">
            Create a Personal Access Token at{' '}
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
              GitHub Settings
            </a>
            {' '}with <code>read:user</code> scope
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⭐ Stardust</h1>
        {authState.user && (
          <div className="user-info">
            <img src={authState.user.avatar_url} alt={authState.user.login} className="avatar" />
            <span>{authState.user.name || authState.user.login}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        )}
      </header>
      
      {error && <div className="error">{error}</div>}
      
      <main className="main-content">
        <h2>Your Starred Repositories ({starredRepos.length})</h2>
        <div className="repos-grid">
          {starredRepos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <div className="repo-header">
                <img src={repo.owner.avatar_url} alt={repo.owner.login} className="repo-avatar" />
                <div className="repo-info">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name">
                    {repo.full_name}
                  </a>
                  {repo.description && <p className="repo-description">{repo.description}</p>}
                </div>
              </div>
              <div className="repo-meta">
                {repo.language && <span className="language">{repo.language}</span>}
                <span className="stars">⭐ {repo.stargazers_count}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
