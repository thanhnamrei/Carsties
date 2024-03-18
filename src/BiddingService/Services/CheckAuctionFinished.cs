

using Contracts;
using MassTransit;
using MassTransit.Testing;
using MongoDB.Entities;

namespace BiddingService;

public class CheckAuctionFinished : BackgroundService
{
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _serviceProvider;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider serviceProvider)
        {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
       _logger.LogInformation("Staring check for finished auctions");

       stoppingToken.Register(() => _logger.LogInformation("==> Auction check is stopping"));

       while(!stoppingToken.IsCancellationRequested) 
       {
            await CheckAuctions(stoppingToken);
            await Task.Delay(5000, stoppingToken);
       }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        var auctions = await DB.Find<Auction>()
                            .Match(x => x.AuctionEnd <= DateTime.UtcNow)
                            .Match(x => !x.Finished)
                            .ExecuteAsync(stoppingToken);
        if(auctions.Count == 0) return;

        _logger.LogInformation("===> Found {count} auctions that have completed", auctions.Count);

         using var scope = _serviceProvider.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();


        foreach (var auction in auctions)
        {
            auction.Finished = true;
            await auction.SaveAsync(null,stoppingToken);

            var winningBid = await DB.Find<Bid>()
                .Match(x => x.AuctionId == auction.ID)
                .Match(x => x.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Descending(s => s.Amount))
                .ExecuteFirstAsync(stoppingToken);
            
            await endpoint.Publish(new AuctionFinished {
                ItemSold = winningBid is not null,
                AuctionId = auction.ID,
                Amount = winningBid?.Amount,
                Winner = winningBid?.Bidder,
                Seller = auction.Seller,
            },stoppingToken);

        }
    }
}
