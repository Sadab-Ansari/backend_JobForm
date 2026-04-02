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

        public Job? GetJobById(int id)
        {
            return _context.Jobs.Find(id);
        }

        public Job? UpdateJob(int id, Job updated)
        {
            var job = _context.Jobs.Find(id);
            if (job == null) return null;

            // update fields
            job.Name = updated.Name;
            job.Email = updated.Email;
            job.Phone = updated.Phone;
            job.Designation = updated.Designation;
            job.State = updated.State;
            job.District = updated.District;
            job.Address = updated.Address;
            job.Skills = updated.Skills;
            job.Password = updated.Password;

            _context.SaveChanges();
            return job;
        }

        public bool DeleteJob(int id)
        {
            var job = _context.Jobs.Find(id);
            if (job == null) return false;
            _context.Jobs.Remove(job);
            _context.SaveChanges();
            return true;
        }
    }
}