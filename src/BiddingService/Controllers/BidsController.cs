﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService;

[ApiController]
[Route("api/[controller]")]
public class BidsController: ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Bid>> PlaceBid(string auctionId, int amount) 
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);

        if(auction is null)
        {
            return NotFound();
        }

        if(auction.Seller == User.Identity.Name)
        {
            return BadRequest("You cannot bid on your own auction");
        }

        var bid = new Bid 
        {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity.Name
        };

        if(auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }

        var highBid = await DB.Find<Bid>()
            .Match(x => x.AuctionId == auctionId)
            .Sort(x => x.Descending(x => x.Amount))
            .ExecuteFirstAsync();

        if(highBid is not null && amount > highBid.Amount || highBid is null) 
        {
            bid.BidStatus = amount > auction.RevervePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
        }

        if(highBid is not null && amount <= highBid.Amount) 
        {
            bid.BidStatus = BidStatus.TooLow;
        }

        await DB.SaveAsync(bid);

        return Ok(bid);
    } 

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<Bid>>> GetBidsForAuction(string auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(x => x.AuctionId == auctionId)
            .Sort(b => b.Descending(a => a.BidTime))
            .ExecuteAsync();

        return bids;
    }
}