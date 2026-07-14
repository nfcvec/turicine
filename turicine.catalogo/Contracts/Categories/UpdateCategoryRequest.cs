using System.ComponentModel.DataAnnotations;

namespace Turicine.Catalogo.Contracts.Categories;

public sealed record UpdateCategoryRequest(
    [Required]
    [MaxLength(120)]
    string Name);
