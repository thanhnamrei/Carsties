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

    public static IEnumerable<Client> Clients(IConfiguration config) =>
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
            },
            new() 
            {
                ClientId = "nextApp",
                ClientName = "nextApp",
                ClientSecrets =  { new Secret("secret".Sha256())},
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
                RequirePkce = false,
                 AllowedScopes =  {"openid","profile", "auctionApp"},
                RedirectUris= {config["ClientApp"] + "/api/auth/callback/id-server"},
                AlwaysIncludeUserClaimsInIdToken = true
            }
        };
}
