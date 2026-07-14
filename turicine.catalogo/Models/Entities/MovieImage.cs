using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Turicine.Catalogo.Models.Entities;

// Association: an image belongs to a movie's hero carousel, at a given order.
[Index(nameof(MovieId), nameof(ImageId), IsUnique = true)]
public class MovieImage
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid MovieId { get; set; }

    public Movie? Movie { get; set; }

    [Required]
    public Guid ImageId { get; set; }

    public Image? Image { get; set; }

    public int CarouselOrder { get; set; }
}
