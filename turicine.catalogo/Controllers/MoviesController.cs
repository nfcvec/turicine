using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

public sealed class MoviesController(IMovieService movieService) : ODataController
{
    [EnableQuery(MaxTop = 200, PageSize = 100)]
    public IQueryable<MovieReadModel> Get() => movieService.Query();

    [EnableQuery]
    public SingleResult<MovieReadModel> Get(Guid key) =>
        SingleResult.Create(movieService.Query().Where(movie => movie.Id == key));
}
