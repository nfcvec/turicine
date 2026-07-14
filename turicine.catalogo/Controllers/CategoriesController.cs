using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Turicine.Catalogo.Models.ReadModels;
using Turicine.Catalogo.Services;

namespace Turicine.Catalogo.Controllers;

public sealed class CategoriesController(ICategoryService categoryService) : ODataController
{
    [EnableQuery(MaxTop = 500, PageSize = 200)]
    public IQueryable<CategoryReadModel> Get() => categoryService.Query();

    [EnableQuery]
    public SingleResult<CategoryReadModel> Get(Guid key) =>
        SingleResult.Create(categoryService.Query().Where(category => category.Id == key));
}
