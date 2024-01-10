using MassTransit;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x => {
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search",false));

    x.UsingRabbitMq((context, cfg) => {
        cfg.ConfigureEndpoints(context);
    });
});
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

try
{
    await DbInitializer.InitDb(app);
}
catch (System.Exception ex)
{
    System.Console.WriteLine(ex);
}

app.Run();
