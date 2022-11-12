using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using RazorWeb.Models;
namespace RazorWeb.Controllers
{
    public class CartsController : Controller
    {
        private readonly Lipstick2Context _db;
        private readonly IEventsModels _eventsModels;
        private static int M;
        public CartsController(Lipstick2Context db, IEventsModels eventsModels)
        {
            _db = db;
            _eventsModels = eventsModels;
        }
        public JsonResult AddCart(string cartTemp)
        {
            var jsoncart = new JavaScriptSerializer().Deserialize<List<Cart>>(cartTemp);

            foreach (var item in jsoncart)
            {
                int a = Convert.ToInt32(item.Colour);
                int b = Convert.ToInt32(item.Size);
                var fmau = _db.MauSacs.Where(x => x.Id == a).FirstOrDefault();
                var fkich = _db.KichCos.Where(x => x.Id == b).FirstOrDefault();
                var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == item.Id && x.KichCoSp == fkich.KichCoSp && x.MauSacSp == fmau.MauSacSp && x.SoLuong > 0).FirstOrDefault();
                return Json(
                new
                {
                    status = true,
                    Prime = find.Id,
                    Img = find.Images,
                    Gia = find.Gia,
                    Ten = find.Ten,
                    Mau = find.MauSacSp,
                    Kich = find.KichCoSp,
                    SoLuong = find.SoLuong,
                });
            }

            return Json(new { status = false });
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult RemakeRender(string cartTemp)
        {
            List<Cart> a = new List<Cart>();
            var jsoncart = new JavaScriptSerializer().Deserialize<List<Cart>>(cartTemp);
            foreach (var item in jsoncart)
            {
                var find = _db.ChiTietSanPhams.Find(item.Prime);
                if (find.SoLuong == 0)
                {
                    item.TrangThai = false;

                }
                else
                {
                    item.TrangThai = true;
                }
                a.Add(item);
            }
            return Json(new { status = true, list = a });
        }
        public JsonResult ChangePrice(string id, string sl)
        {
            int ID = Convert.ToInt32(id);
            int SL = Convert.ToInt32(sl);
            var find = _db.ChiTietSanPhams.Where(x => x.Id == ID).FirstOrDefault();
            if (find != null)
            {
                if (find.SoLuong < SL)
                {
                    return Json(
                      new
                      {
                          status = false,
                          max = find.SoLuong,
                      });
                }

            }
            return Json(new { status = true });
        }
    }
}
