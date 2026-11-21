namespace CharaChhavani.Infrastructure.Common;

public static class EnvLoader
{
    private static readonly Dictionary<string, string> _envVars = new(StringComparer.OrdinalIgnoreCase);
    private static bool _isLoaded;

    public static void Load(string? explicitPath = null)
    {
        if (_isLoaded && string.IsNullOrEmpty(explicitPath))
            return;

        if (!string.IsNullOrEmpty(explicitPath) && File.Exists(explicitPath))
        {
            ParseFile(explicitPath);
            _isLoaded = true;
            return;
        }

        // Walk up from CurrentDirectory and BaseDirectory to locate .env or backend/.env
        var startDirs = new[] { Directory.GetCurrentDirectory(), AppDomain.CurrentDomain.BaseDirectory };

        foreach (var startDir in startDirs)
        {
            var dir = new DirectoryInfo(startDir);
            while (dir != null && dir.Exists)
            {
                var backendEnv = Path.Combine(dir.FullName, "backend", ".env");
                if (File.Exists(backendEnv))
                {
                    ParseFile(backendEnv);
                    _isLoaded = true;
                    return;
                }

                var rootEnv = Path.Combine(dir.FullName, ".env");
                if (File.Exists(rootEnv))
                {
                    ParseFile(rootEnv);
                    _isLoaded = true;
                    return;
                }

                dir = dir.Parent;
            }
        }
    }

    private static void ParseFile(string filePath)
    {
        foreach (var rawLine in File.ReadAllLines(filePath))
        {
            var line = rawLine.Trim();
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
                continue;

            var equalsIndex = line.IndexOf('=');
            if (equalsIndex <= 0)
                continue;

            var key = line[..equalsIndex].Trim();
            var val = line[(equalsIndex + 1)..].Trim();

            // Strip surrounding double or single quotes
            if (val.Length >= 2 && ((val.StartsWith('"') && val.EndsWith('"')) || (val.StartsWith('\'') && val.EndsWith('\''))))
            {
                val = val[1..^1];
            }

            _envVars[key] = val;
        }
    }

    public static string? Get(string key)
    {
        if (!_isLoaded)
        {
            Load();
        }

        if (_envVars.TryGetValue(key, out var val))
            return val;

        // Never fallback to Windows OS USERNAME if looking for database USERNAME.
        // Fallback only to container/server-specific DB_USERNAME or MYSQL_USER variables.
        if (key.Equals("USERNAME", StringComparison.OrdinalIgnoreCase))
        {
            return Environment.GetEnvironmentVariable("DB_USERNAME")
                ?? Environment.GetEnvironmentVariable("DB_USER")
                ?? Environment.GetEnvironmentVariable("MYSQL_USER");
        }

        return Environment.GetEnvironmentVariable(key);
    }
}
