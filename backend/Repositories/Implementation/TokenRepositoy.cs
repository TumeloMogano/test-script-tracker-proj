public interface ITokenService
{
    void InvalidateToken(string token);
}

public class TokenService : ITokenService
{
    private readonly List<string> _blacklistedTokens = new List<string>();

    public void InvalidateToken(string token)
    {
        _blacklistedTokens.Add(token);
    }

    public bool IsTokenValid(string token)
    {
        return !_blacklistedTokens.Contains(token);
    }
}
