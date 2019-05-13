using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
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

        public class RequestData
        {
            public Product Product;
        }

        public StateController(IStateFileSerializer stateFileSerializer, ProductJsonConverter productJsonConverter)
        {
            _stateFileSerializer = stateFileSerializer;
            _productJsonConverter = productJsonConverter;

            _statesFolderPath = System.Web.Hosting.HostingEnvironment.MapPath(_statesFolder);
            
            if (!Directory.Exists(_statesFolderPath))
                Directory.CreateDirectory(_statesFolderPath);
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

        private string GetStatePath(string id)
        {
            return Path.Combine(_statesFolderPath, $"{id}.st");
        }
    }
}
