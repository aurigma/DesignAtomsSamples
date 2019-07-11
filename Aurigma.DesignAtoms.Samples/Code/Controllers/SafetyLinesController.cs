using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Serialization;
using Aurigma.GraphicsMill;
using Newtonsoft.Json;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class SafetyLinesController : ApiController
    {
        private readonly ProductJsonConverter _productJsonConverter;

        public SafetyLinesController(ProductJsonConverter productJsonConverter)
        {
            _productJsonConverter = productJsonConverter;
        }

        [HttpPut]
        [Route("api/safetyLines")]
        public HttpResponseMessage ChangeSafetyLine([FromBody] RequestData data)
        {
            var safetyLines = data.Product.Surfaces.First().PrintAreas.First().SafetyLines;
            var safetyLineRequest = data.SafetyLineData;

            safetyLines.Clear();

            var margin = new Margin(
                safetyLineRequest.MarginLeft, 
                safetyLineRequest.MarginTop, 
                safetyLineRequest.MarginRight,
                safetyLineRequest.MarginBottom);

            safetyLines.Add(new SafetyLine
            {
                Margin = margin,
                PdfBox = safetyLineRequest.PdfBox,
                AltColor = RgbColor.Green
            });

            var productJson = JsonConvert.SerializeObject(data.Product, _productJsonConverter);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(productJson, Encoding.UTF8, "application/json")
            };
        }

        public class RequestData
        {
            public Product Product;
            public SafetyLineData SafetyLineData;
        }
        
        public class SafetyLineData
        {
            public float MarginLeft;
            public float MarginTop;
            public float MarginRight;
            public float MarginBottom;

            public PdfBox PdfBox;
        }
    }
}