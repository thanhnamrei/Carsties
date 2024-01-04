﻿using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controller;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext context;
    private readonly IMapper mapper;

    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions() {
        var auctions = await context.Auctions.Include(x => x.Item)
            .OrderBy(x => x.Item.Model)
            .ToListAsync();

        return mapper.Map<List<AuctionDto>>(auctions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id) {
        var auction = await context.Auctions.Include(x => x.Item)
            .OrderBy(x => x.Item.Make)
            .FirstOrDefaultAsync(x => x.Id == id);

        if(auction is null) return NotFound();

        return mapper.Map<AuctionDto>(auction);
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto) {
        var auction = mapper.Map<Auction>(auctionDto);

        //TODO
        auction.Seller = "test";

        context.Auctions.Add(auction);

        var result = await context.SaveChangesAsync() > 0;
        if(!result) return BadRequest("Could not save changes to the DB");

        return CreatedAtAction(nameof(GetAuctionById), new {auction.Id}, mapper.Map<AuctionDto>(auction));
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<AuctionDto>> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto) {
        var auction = await context.Auctions.Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        if(auction is null) return NotFound();

        //TODO
        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;

        var result = await context.SaveChangesAsync() > 0;
        if(result) return Ok();

        return BadRequest("Problem saving changes");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<AuctionDto>> DeleteAuction(Guid id) {
        var auction = await context.Auctions.FindAsync(id);

        if(auction is null) return NotFound();

        //TODO
        context.Auctions.Remove(auction);

        var result = await context.SaveChangesAsync() > 0;
        if(result) return Ok();

        return BadRequest("Problem saving changes");
    }


    
}
