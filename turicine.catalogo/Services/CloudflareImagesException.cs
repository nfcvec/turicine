using System.Net;

namespace Turicine.Catalogo.Services;

public sealed class CloudflareImagesException(
    string message,
    HttpStatusCode statusCode,
    Exception? innerException = null) : Exception(message, innerException)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
}
