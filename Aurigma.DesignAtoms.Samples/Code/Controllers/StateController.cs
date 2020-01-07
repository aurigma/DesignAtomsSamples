using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.Http;
using Aurigma.DesignAtoms.Convert;
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
        private readonly ITemplateParser _templateParser;

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
            ITemplateParser templateParser,
            ProductHandler productHandler)
        {
            _stateFileSerializer = stateFileSerializer;
            _productJsonConverter = productJsonConverter;
            _productHandler = productHandler;
            _templateParser = templateParser;

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
            SerializeState(new State(data.Product), id);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        private void SerializeState(State state, string id)
        {
            using (var stateStream = File.OpenWrite(GetStatePath(id)))
            {
                _stateFileSerializer.Serialize(state, stateStream);
            }
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

        [HttpPost]
        [Route("api/states/import")]
        public async Task<IHttpActionResult> Import()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest("You are supposed to upload a file.");
            }

            var uploadFolder = HostingEnvironment.MapPath($"~/App_Data/Uploads/{System.Guid.NewGuid()}");
            Directory.CreateDirectory(uploadFolder);
            var streamProvider = new MultipartFormDataStreamProvider(uploadFolder);
            var result = await Request.Content.ReadAsMultipartAsync(streamProvider);
            var states = result
                            .FileData
                            .Select(fd => _templateParser.FromFile(fd.LocalFileName)) // get Product instances
                            .Select(prod => new State(prod)); // get State instances

            var stateIds = new List<string>();
            foreach(var state in states)
            {
                var stateId = System.Guid.NewGuid().ToString();
                SerializeState(state, stateId);
                stateIds.Add(stateId);

            }
            await Task.Run(()=> Directory.Delete(uploadFolder, true));

            return Ok(stateIds);
        }

        private string GetStatePath(string id)
        {
            return Path.Combine(_statesFolderPath, $"{id}.st");
        }
    }
}
