using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Turicine.Catalogo.Models.Entities;

[Index(nameof(Name), IsUnique = true)]
public class Category
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    public ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
