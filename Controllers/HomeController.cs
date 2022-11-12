using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RazorWeb.Models;
using System.Diagnostics;

namespace RazorWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConfiguration _configuration;
        private readonly Lipstick2Context _db;
        public HomeController(Lipstick2Context db )
        {
            _db = db;
        }
        public async Task<ActionResult> Index()
        {
            return View();
        }
        public async Task<ActionResult> ProductsHot(/*int? page*/)
        {
            /*if (page == null) page = 1;
            int pageSize = 4;
            int pageNumber = (page ?? 1);*/

            /*var find = db.SanPhams.Where(x => x.Mota == M).FirstOrDefault();
            var lst = db.SanPhams.Where(x => x.Mota == find.Mota).ToList();*/
            var lst = await _db.SanPhams.ToListAsync();
            return PartialView("ProductsHot",lst);
        }
        public async Task<ActionResult> News()
        {
            var lst = await _db.TinTucs.OrderByDescending(x => x.CreatedDate).Take(3).ToListAsync();
            return PartialView("News",lst);
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}