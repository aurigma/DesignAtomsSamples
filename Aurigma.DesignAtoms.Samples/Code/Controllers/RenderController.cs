using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using Aurigma.DesignAtoms.Configuration.RenderingConfig;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Rendering;
using Aurigma.GraphicsMill.Codecs;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class RenderController : ApiController
    {
        private readonly IProductRenderer _productRenderer;


        public class RequestData
        {
            public Product Product;
        }

        public RenderController(IProductRenderer productRenderer)
        {
            _productRenderer = productRenderer;
        }

        public HttpResponseMessage Post([FromBody] RequestData data, string format)
        {
            var config = RenderingConfig.GetDefault();

            var filename = "result.pdf";

            if (format.Equals("jpeg", StringComparison.InvariantCultureIgnoreCase) ||
                format.Equals("jpg", StringComparison.InvariantCultureIgnoreCase))
            {
                config.DefaultHiResOutputRendering.FileFormat = FileFormat.Jpeg;
                filename = "result.jpeg";
            }


            var memoryStream = new MemoryStream();
            _productRenderer.RenderHiRes(memoryStream, data.Product, config);

            memoryStream.Position = 0;

            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(memoryStream)
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(filename));
            response.Headers.CacheControl = new CacheControlHeaderValue
            {
                Public = true,
                MaxAge = TimeSpan.FromHours(12)
            };
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = filename
            };

            return response;
        }
    }
}
