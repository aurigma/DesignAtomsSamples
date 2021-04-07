using Aurigma.DesignAtoms.Canvas;
using Aurigma.DesignAtoms.Canvas.ItemHandlers;
using Aurigma.DesignAtoms.Common;
using Aurigma.DesignAtoms.Configuration;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Model.Items;
using Aurigma.DesignAtoms.Samples.Code.Models;
using Aurigma.DesignAtoms.Serialization;
using Aurigma.DesignAtoms.Storage.FileCache;
using Aurigma.GraphicsMill;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class BackgroundController : ApiController
    {
        private readonly ProductJsonConverter _productJsonConverter;
        private readonly IFileCache _fileCache;
        private readonly IConfiguration _configuration;
        private readonly ImageLoader _imageLoader;
        private readonly ItemHandlerFactory _itemHandlerFactory;

        public BackgroundController(ProductJsonConverter productJsonConverter, IFileCache fileCache, IConfiguration configuration, ImageLoader imageLoader)
        {
            _productJsonConverter = productJsonConverter;
            _fileCache = fileCache;
            _configuration = configuration;
            _imageLoader = imageLoader;
            _itemHandlerFactory = new ItemHandlerFactory(_configuration, _fileCache, null, _imageLoader, null, null);
        }

        [HttpPost]
        public HttpResponseMessage Color([FromBody] ColorRequestData data)
        {
            var product = data.Product;
            var color = ColorUtils.ParseWebColor(data.Color);

            var bgItem = product.Surfaces.First().BgContainer.Items[0] as PlaceholderItem;
            bgItem.FillColor = color;
            bgItem.Content = new ImageItem();

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }

        [HttpPost]
        public HttpResponseMessage Picture([FromBody] PictureRequestData data)
        {
            var product = data.Product;
            var surface = product.Surfaces.First();

            var filePath = System.Web.Hosting.HostingEnvironment.MapPath(data.PicturePath);
            var newSource = new ImageItem.ImageSource(new FileInfo(filePath), 0);
            var newContent = new ImageItem(newSource, null, surface.Width, surface.Height);
            var imageItemHandler = _itemHandlerFactory.CreateItemHandler(newContent) as ImageItemHandler;

            var bgItem = surface.BgContainer.Items[0] as PlaceholderItem;
            bgItem.Content = newContent;
            bgItem.FillColor = new RgbColor();
            imageItemHandler?.UpdateRectangle(false, bgItem.ContentResizeMode, bgItem, newContent.SourceRectangle.Width, newContent.SourceRectangle.Height);

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }

        [HttpPost]
        public HttpResponseMessage DeletePicture([FromBody] Product product)
        {
            var surface = product.Surfaces.First();

            if (surface.BgContainer.Items[0] is PlaceholderItem bgItem && bgItem.Content != null)
            {
                bgItem.Content = new ImageItem();
                bgItem.FillColor = new RgbColor();
            }

            var productJson = JsonConvert.SerializeObject(product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }
    }
}