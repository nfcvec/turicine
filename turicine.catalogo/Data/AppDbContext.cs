using Microsoft.EntityFrameworkCore;
using Turicine.Catalogo.Models.Entities;

namespace Turicine.Catalogo.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Image> Images => Set<Image>();

    public DbSet<Movie> Movies => Set<Movie>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Venue> Venues => Set<Venue>();

    public DbSet<MovieImage> MovieImages => Set<MovieImage>();

    public DbSet<Lead> Leads => Set<Lead>();

    public DbSet<Sponsor> Sponsors => Set<Sponsor>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Movie carousel association: deleting a movie removes its links; deleting the
        // asset is blocked by FK (services delete links first, then the asset).
        modelBuilder.Entity<MovieImage>(entity =>
        {
            entity.HasOne(mi => mi.Movie)
                .WithMany(m => m.MovieImages)
                .HasForeignKey(mi => mi.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(mi => mi.Image)
                .WithMany()
                .HasForeignKey(mi => mi.ImageId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Each movie belongs to exactly one category; a category cannot be deleted
        // while movies reference it (the service returns 409 before EF hits the FK).
        modelBuilder.Entity<Movie>()
            .HasOne(m => m.Category)
            .WithMany(c => c.Movies)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Venue logo: optional single image; clearing the logo/deleting the venue is
        // handled in the service (which also removes the asset).
        modelBuilder.Entity<Venue>()
            .HasOne(v => v.Logo)
            .WithMany()
            .HasForeignKey(v => v.LogoImageId)
            .OnDelete(DeleteBehavior.Restrict);

        // Sponsor logo: mandatory single image; the service deletes the asset after
        // unlinking (FK Restrict prevents deleting an image still in use).
        modelBuilder.Entity<Sponsor>()
            .HasOne(s => s.Logo)
            .WithMany()
            .HasForeignKey(s => s.LogoImageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
