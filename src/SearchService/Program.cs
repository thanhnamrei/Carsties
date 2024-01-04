using MongoDB.Driver;
using MongoDB.Entities;
using SearchService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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
