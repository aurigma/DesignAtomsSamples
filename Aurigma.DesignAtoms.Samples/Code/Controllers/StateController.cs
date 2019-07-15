using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Hosting;
using System.Web.Http;
using Aurigma.DesignAtoms.Model;
using Aurigma.DesignAtoms.Serialization;
using Newtonsoft.Json;

namespace Aurigma.DesignAtoms.Samples.Code.Controllers
{
    public class StateController : ApiController
    {
        private const string _statesFolder = "~/App_Data/states";

        private readonly string _statesFolderPath;

        private readonly IStateFileSerializer _stateFileSerializer;
        private readonly ProductJsonConverter _productJsonConverter;
        private readonly ProductHandler _productHandler;

        public class RequestData
        {
            public Product Product;
        }
        
        static StateController()
        {
            Directory.CreateDirectory(HostingEnvironment.MapPath(_statesFolder));

            var states = new[]
            {
                HostingEnvironment.MapPath("~/samples/state-fonts/state-fonts.st")
            };

            foreach (var state in states)
            {
                var destFileName = Path.Combine(HostingEnvironment.MapPath(_statesFolder), Path.GetFileName(state));
                File.Copy(state, destFileName, true);
            }
        }

        public StateController(
            IStateFileSerializer stateFileSerializer, 
            ProductJsonConverter productJsonConverter, 
            ProductHandler productHandler)
        {
            _stateFileSerializer = stateFileSerializer;
            _productJsonConverter = productJsonConverter;
            _productHandler = productHandler;

            _statesFolderPath = HostingEnvironment.MapPath(_statesFolder);
            
            if (!Directory.Exists(_statesFolderPath))
                Directory.CreateDirectory(_statesFolderPath);
        }

        [HttpGet]
        public HttpResponseMessage AllStates()
        {
            var states = Directory
                .EnumerateFiles(HostingEnvironment.MapPath(_statesFolder))
                .Select(Path.GetFileNameWithoutExtension);
            
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(states), Encoding.UTF8, "application/json")
            };
        }

        [HttpPost]
        public HttpResponseMessage Serialize([FromBody] RequestData data, string id)
        {
            var state = new State(data.Product);

            using (var stateStream = File.OpenWrite(GetStatePath(id)))
            {
                _stateFileSerializer.Serialize(state, stateStream);
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        public HttpResponseMessage Deserialize(string id)
        {
            using (var stateStream = File.OpenRead(GetStatePath(id)))
            {
                var state = _stateFileSerializer.Deserialize(stateStream);

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(state.Product, _productJsonConverter), Encoding.UTF8, "application/json")
                };
            }
        }

        [HttpGet]
        [Route("api/states/{id}/fonts")]
        public HttpResponseMessage GetFonts(string id)
        {
            using (var stream = File.OpenRead(GetStatePath(id)))
            {
                var state = _stateFileSerializer.Deserialize(stream);
                var fonts = _productHandler.GetProductFonts(state.Product).ToArray();

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(fonts), Encoding.UTF8, "application/json")
                };
            }
        }

        private string GetStatePath(string id)
        {
            return Path.Combine(_statesFolderPath, $"{id}.st");
        }
    }
}
