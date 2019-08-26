using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Aurigma.DesignAtoms.Canvas;
using Aurigma.DesignAtoms.Canvas.ItemHandlers;
using Aurigma.DesignAtoms.Configuration;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Model.Items;
using Aurigma.DesignAtoms.Serialization;
using Aurigma.DesignAtoms.Storage.FileCache;
using Newtonsoft.Json;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class MockupController : ApiController
    {
        private readonly ProductJsonConverter _productJsonConverter;
        private readonly IFileCache _fileCache;
        private readonly IConfiguration _configuration;
        private readonly ImageLoader _imageLoader;
        private readonly ItemHandlerFactory _itemHandlerFactory;
        

        public MockupController(ProductJsonConverter productJsonConverter, IFileCache fileCache, IConfiguration configuration, ImageLoader imageLoader)
        {
            _productJsonConverter = productJsonConverter;
            _fileCache = fileCache;
            _configuration = configuration;
            _imageLoader = imageLoader;
            _itemHandlerFactory = new ItemHandlerFactory(_configuration, _fileCache, null, _imageLoader, null, null);
        }

        public class ColorRequestData
        {
            public Product Product;
            public string Color;
        }

        public class PictureRequestData
        {
            public Product Product;
            public string PictureUrl;
        }
        
        [HttpPost]
        public HttpResponseMessage Mockup([FromBody] PictureRequestData data)
        {
            var product = data.Product;
            var surface = product.Surfaces.First();
            var mockupContainer = surface.Mockup.UnderContainers[0];
            var mockupUrl = data.PictureUrl;
            var filepath = System.Web.Hosting.HostingEnvironment.MapPath(mockupUrl);

            var newSource = new ImageItem.ImageSource(new FileInfo(filepath), 0);

            if (mockupContainer.Items.Count > 0)
                ((ImageItem)mockupContainer.Items[0]).Source = newSource;
            else
                mockupContainer.Items.Add(new ImageItem(newSource));

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }

        [HttpPost]
        public HttpResponseMessage DeleteMockup([FromBody] Product product)
        {
            var surface = product.Surfaces.First();
            var mockup = surface.Mockup;
            mockup?.UnderContainers[0].Items.RemoveAt(0);

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }
    }
}