﻿using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace SearchService;

[ApiController]
[Route("api/search")]
public class SearchController:ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems(string searchTerm) 
    {
        var query = DB.Find<Item>();
        query.Sort(x => x.Ascending(a => a.Make));

        var result = await query.ExecuteAsync();
        
        if(!string.IsNullOrEmpty(searchTerm))
        {
            query.Match(Search.Full,searchTerm).SortByTextScore();
        }

       return result;
    } 
}
