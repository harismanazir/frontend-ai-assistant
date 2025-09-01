import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              👧🏼 Jarvis – Your Personal AI Assistant
            </h1>
          </div>

          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              data-testid="theme-toggle"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform duration-200 ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
              }`}>
                {/* Light mode icon */}
                <svg className={`h-3 w-3 text-primary-foreground absolute top-0.5 left-0.5 transition-opacity duration-200 ${
                  theme === 'dark' ? 'opacity-0' : 'opacity-100'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                </svg>
                {/* Dark mode icon */}
                <svg className={`h-3 w-3 text-primary-foreground absolute top-0.5 left-0.5 transition-opacity duration-200 ${
                  theme === 'dark' ? 'opacity-100' : 'opacity-0'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
