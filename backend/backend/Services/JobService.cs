using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class JobService
    {
        private readonly AppDbContext _context;

        public JobService(AppDbContext context)
        {
            _context = context;
        }

        public List<Job> GetAllJobs()
        {
            return _context.Jobs.ToList();
        }

        public Job CreateJob(Job job)
        {
            _context.Jobs.Add(job);
            _context.SaveChanges();
            return job;
        }
    }
}