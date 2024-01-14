using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("auctionApp","Allow all"),
        };

    public static IEnumerable<Client> Clients =>
        new Client[]
        {
            new() 
            {
                ClientId = "postman",
                ClientName = "Postman",
                AllowedScopes =  {"openid","profile", "auctionApp"},
                RedirectUris= {"https://www.getpostman/oauth2/callback"},
                ClientSecrets =  { new Secret("NotASecret".Sha256())},
                AllowedGrantTypes = { GrantType.ResourceOwnerPassword}
            }
        };
}
