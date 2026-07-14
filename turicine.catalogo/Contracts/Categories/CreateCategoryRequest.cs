using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Categories;

public sealed record CreateCategoryRequest(
    [Required]
    [MaxLength(120)]
    string Name);
