using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PagedList;
using RazorWeb.Models;
using System.Collections;
using System.Net;

namespace RazorWeb.Controllers
{
    public class EventsController : Controller
    {
        private readonly Lipstick2Context _db;
        private readonly IEventsModels _eventsModels;
        private static int M;
        public EventsController(Lipstick2Context db, IEventsModels eventsModels)
        {
            _db = db;
            _eventsModels = eventsModels;
        }

        // GET: Events
        public async Task<ActionResult> Index(int? page, int? id)
        {
            IEnumerable list = await _db.LoaiSanPhams.ToListAsync();
            ViewBag.data = new SelectList(_db.LoaiSanPhams, "IdloaiSanPham", "Ten");
            ViewBag.data2 = new SelectList(_db.LoaiSanPhams.ToList());
            if (page == null) page = 1;
            int pageSize = 1;
            int pageNumber = (page ?? 1);
            if (id != null)
            {
                var result = await _db.SanPhams.Where(x => x.IdloaiSanPham == id).ToListAsync();
                return View((result.ToPagedList(pageNumber, pageSize)));
            }
            else
            {
                var result = await _db.SanPhams.ToListAsync();
                return View((result.ToPagedList(pageNumber, pageSize)));
            }
        }
        public async Task<ActionResult> Details(int? id)
        {

            if (id == null)
            {
                return Redirect("Index");
            }
            else
            {
                int Id = id.Value;
                M = id.Value;
                ViewBag.MauSacSP = new SelectList(_eventsModels.ListAll(Id), "Id", "MauSacSp", 1);
                ViewBag.KichCoSP = new SelectList(_eventsModels.ListAllSize(Id), "Id", "KichCoSp", 1);

            }
            ChiTietSanPham chiTietSanPham = await _db.ChiTietSanPhams.Where(x => x.IdsanPham == id).FirstOrDefaultAsync();
            if (chiTietSanPham == null)
            {
                return Redirect("Index");
            }
            return View(chiTietSanPham);
        }

        public JsonResult onCheck(int id, int mau, int kich)
        {
            var fmau = _db.MauSacs.Find(mau);
            var fkich = _db.KichCos.Find(kich);
            var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == id && x.KichCoSp == fkich.KichCoSp && x.MauSacSp == fmau.MauSacSp && x.SoLuong > 0).FirstOrDefault();
            if (find == null)
            {
                return Json(new { status = false });
            }
            return Json(new { status = true });
        }
        public JsonResult onCheck2(int id, int mau, int kich)
        {
            var fmau = _db.MauSacs.Find(mau);
            var fkich = _db.KichCos.Find(kich);
            var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == id && x.KichCoSp == fkich.KichCoSp && x.MauSacSp == fmau.MauSacSp && x.SoLuong > 0).FirstOrDefault();
            if (find == null)
            {
                return Json(new { status = false });
            }
            return Json(new { status = true });
        }
        public JsonResult checkbysize(int kich)
        {
            List<MauSac> arr = new List<MauSac>();
            var fkich = _db.KichCos.Find(kich);
            var find = _db.ChiTietSanPhams.Where(x => x.KichCoSp == fkich.KichCoSp).Select(x => x.MauSacSp).ToList();
            foreach (var item in find)
            {
                var findmau = _db.MauSacs.Where(x => x.MauSacSp == item).FirstOrDefault();
                var ha = new MauSac { Id = findmau.Id, MauSacSp = item };
                arr.Add(ha);
            }
            if (find == null)
            {
                return Json(new { status = false });
            }
            return Json(new
            {
                status = true,
                Arr = arr
            });
        }
        public JsonResult KiemTra(int id, int mau, int kich)
        {
            var fmau = _db.MauSacs.Find(mau);
            var fkich = _db.KichCos.Find(kich);
            var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == id && x.KichCoSp == fkich.KichCoSp && x.MauSacSp == fmau.MauSacSp && x.SoLuong > 0).FirstOrDefault();
            if (find == null)
            {
                return Json(new { status = false });
            }
            return Json(new
            {
                status = true,
            });
        }
        public async Task<IActionResult> MoreToYou(int? page)
        {
            if (page == null) page = 1;
            int pageSize = 4;
            int pageNumber = (page ?? 1);
            var find = _db.SanPhams.Where(x => x.IdsanPham == M).FirstOrDefault();
            var result = await _db.SanPhams.Where(x => x.IdloaiSanPham == find.IdloaiSanPham).ToListAsync();
            return PartialView((result.ToPagedList(pageNumber, pageSize)));
        }
    }
}
