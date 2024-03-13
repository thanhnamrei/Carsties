using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        System.Console.WriteLine("Consumming: " + context.Message.Model);

        var item = _mapper.Map<Item>(context.Message);
        await DB.Update<Item>()
            .MatchID(context.Message.Id)
            .ModifyWith(item)
            .ExecuteAsync();
        await item.SaveAsync();
    }
}
