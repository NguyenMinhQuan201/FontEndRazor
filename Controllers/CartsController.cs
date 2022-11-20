using AdminWeb.Services;
using Data.Common;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using RazorWeb.Models;
namespace RazorWeb.Controllers
{
    public class CartsController : Controller
    {
        private readonly IEventsModels _eventsModels;
        private static int M;
        private readonly IAPIMauSac _iAPIMauSac;
        private readonly IAPISKichCo _aPISKichCo;
        private readonly IAPIChiTietSanPham _aPIChiTietSanPham;
        public CartsController(IAPIMauSac iAPIMauSac, IEventsModels eventsModels, IAPISKichCo aPISKichCo, IAPIChiTietSanPham aPIChiTietSanPham)
        {
            _eventsModels = eventsModels;
            _aPIChiTietSanPham = aPIChiTietSanPham;
            _aPISKichCo = aPISKichCo;
            _iAPIMauSac=iAPIMauSac;
        }
        public async Task<JsonResult> AddCart(string cartTemp)
        {
            var jsoncart = new JavaScriptSerializer().Deserialize<List<Cart>>(cartTemp);

            foreach (var item in jsoncart)
            {
                int a = Convert.ToInt32(item.Colour);
                int b = Convert.ToInt32(item.Size);
                var fmau = await _iAPIMauSac.GetById(a);
                var fkich = await _aPISKichCo.GetByIdLoaiKichCo(b);
                var rq = new CombineConditionChiTietSanPham()
                {
                    IDSanPham = item.Id,
                    KichCoSP = fkich.data.KichCoSP,
                    MauSacSP = fmau.data.MauSacSP,
                };
                var find =/* _db.ChiTietSanPhams.Where(x => x.IdsanPham == item.Id && x.KichCoSp == fkich.KichCoSP && x.MauSacSp == fmau.MauSacSP && x.SoLuong > 0).FirstOrDefault();*/
                    await _aPIChiTietSanPham.GetChiTietSanPhamByConditionID_MS_KC_SL(rq);
                return Json(
                new
                {
                    status = true,
                    Prime = find.data.Id,
                    Img = find.data.Images,
                    Gia = find.data.Gia,
                    Ten = find.data.Ten,
                    Mau = find.data.MauSacSp,
                    Kich = find.data.KichCoSp,
                    SoLuong = find.data.SoLuong,
                });
            }

            return Json(new { status = false });
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task<JsonResult> RemakeRender(string cartTemp)
        {
            List<Cart> a = new List<Cart>();
            var jsoncart = new JavaScriptSerializer().Deserialize<List<Cart>>(cartTemp);
            foreach (var item in jsoncart)
            {
                var find =await _aPIChiTietSanPham.GetByIdChiTietSanPham(item.Prime);
                if (find.data.SoLuong == 0)
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
        public async Task<JsonResult> ChangePrice(string id, string sl)
        {
            int ID = Convert.ToInt32(id);
            int SL = Convert.ToInt32(sl);
            var find = await _aPIChiTietSanPham.GetByIdChiTietSanPham(ID);
            if (find != null)
            {
                if (find.data.SoLuong < SL)
                {
                    return Json(
                      new
                      {
                          status = false,
                          max = find.data.SoLuong,
                      });
                }

            }
            return Json(new { status = true });
        }
    }
}
