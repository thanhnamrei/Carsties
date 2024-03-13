using BiddingService;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using MongoDB.Entities;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddMassTransit(x => {

    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("bids",false));

    x.UsingRabbitMq((context, cfg) => {
        cfg.Host(builder.Configuration["RabbitMq:Host"],"/", host => 
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username","guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Username","guest"));
        });
        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        opt.Authority = builder.Configuration["IdentityServiceUrl"];
        opt.RequireHttpsMetadata = false; // run http
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.NameClaimType = "username";

    });


builder.Services.AddControllers();

var app = builder.Build();


app.UseAuthorization();

app.MapControllers();

await DB.InitAsync("BidDb", MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("MongoDbConnection")));

app.Run();
