using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly JobService _jobService;

        public JobController(JobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        public IActionResult GetJobs()
        {
            return Ok(_jobService.GetAllJobs());
        }

        [HttpPost]
        public IActionResult CreateJob([FromBody] Job job)
        {
            return Ok(_jobService.CreateJob(job));
        }
    }
}