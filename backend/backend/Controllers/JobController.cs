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

        [HttpGet("{id}")]
        public IActionResult GetJob(int id)
        {
            var job = _jobService.GetJobById(id);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost]
        public IActionResult CreateJob([FromBody] Job job)
        {
            return Ok(_jobService.CreateJob(job));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJob(int id, [FromBody] Job updated)
        {
            var job = _jobService.UpdateJob(id, updated);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJob(int id)
        {
            var deleted = _jobService.DeleteJob(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}