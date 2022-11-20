using AdminWeb.Services;
using Data.Common;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PagedList;
using RazorWeb.Models;
using RazorWeb.Services;
using System.Collections;
using System.Net;

namespace RazorWeb.Controllers
{
    public class EventsController : Controller
    {
        private readonly IEventsModels _eventsModels;
        private readonly IAPISanPham _aPISanPham;
        private readonly IAPITinTuc _aPITinTuc;
        private readonly IAPIChiTietSanPham _apiChiTietSanPham;
        private readonly IAPIMauSac _aPIMauSac;
        private readonly IAPISKichCo _aPISKichCo;
        private readonly IAPILoaiSanPham _aPILoaiSanPham;
        private static int M;
        public EventsController(IEventsModels eventsModels, IAPILoaiSanPham aPILoaiSanPham, IAPISanPham aPISanPham, IAPIChiTietSanPham aPIChiTietSanPham, IAPIMauSac aPIMauSac, IAPISKichCo aPISKichCo)
        {
            _eventsModels = eventsModels;
            _aPILoaiSanPham = aPILoaiSanPham;
            _aPISanPham = aPISanPham;
            _apiChiTietSanPham = aPIChiTietSanPham;
            _aPIMauSac = aPIMauSac;
            _aPISKichCo = aPISKichCo;
        }

        // GET: Events
        public async Task<ActionResult> Index(int? page, int? id)
        {
            var list = await _aPILoaiSanPham.GetLoaiSanPhamPagings();
            ViewBag.data = new SelectList(list.data, "IDLoaiSanPham", "Ten");
            ViewBag.data2 = new SelectList(list.data.ToList());
            if (page == null) page = 1;
            int pageSize = 1;
            int pageNumber = (page ?? 1);
            if (id != null)
            {
                var result = await _aPISanPham.GetSanPhamPagingsByIdLoaiSanPham(id.Value);
                return View((result.data.ToPagedList(pageNumber, pageSize)));
            }
            else
            {
                var result = await _aPISanPham.GetSanPhamPagings();
                return View((result.data.ToPagedList(pageNumber, pageSize)));
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
                var selectMaus = await _eventsModels.ListAllColor(Id);
                var selectKichs = await _eventsModels.ListAllSize(Id);
                ViewBag.MauSacSP = new SelectList(selectMaus, "ID", "MauSacSP", 1);
                ViewBag.KichCoSP = new SelectList(selectKichs, "ID", "KichCoSP", 1);

            }
            var chiTietSanPham = await _apiChiTietSanPham.GetByIdSanPham(id.Value);
            if (chiTietSanPham == null)
            {
                return Redirect("Index");
            }
            return View(chiTietSanPham.data[0]);
        }

        public async Task<JsonResult> onCheck(int id, int mau, int kich)
        {
            var fmau = await _aPIMauSac.GetById(mau);
            var fkich = await _aPISKichCo.GetByIdLoaiKichCo(kich);
            var rq = new CombineConditionChiTietSanPham()
            {
                IDSanPham = id,
                KichCoSP = fkich.data.KichCoSP,
                MauSacSP = fmau.data.MauSacSP,
            };
            var find = await _apiChiTietSanPham.GetChiTietSanPhamByConditionID_MS_KC_SL(rq);
            if (find.data == null)
            {
                return Json(new { status = false });
            }
            return Json(new { status = true });
        }
        public async Task<JsonResult> onCheck2(int id, int mau, int kich)
        {
            var fmau = await _aPIMauSac.GetById(mau);
            var fkich = await _aPISKichCo.GetByIdLoaiKichCo(kich);
            var rq = new CombineConditionChiTietSanPham()
            {
                IDSanPham = id,
                KichCoSP = fkich.data.KichCoSP,
                MauSacSP = fmau.data.MauSacSP,
            };
            var find = await _apiChiTietSanPham.GetChiTietSanPhamByConditionID_MS_KC_SL(rq);
            if (find.data == null)
            {
                return Json(new { status = false });
            }
            return Json(new { status = true });
        }
        public async Task<JsonResult> checkbysize(int kich)
        {
            List<MauSac> arr = new List<MauSac>();
            var fkich = await _aPISKichCo.GetByIdLoaiKichCo(kich);
            var rq = new MauSacByKichCo()
            {
                KichCoSP = fkich.data.KichCoSP
            };
            var find =await _apiChiTietSanPham.getMauSacByKichCo(rq);
            foreach (var item in find.data)
            {
                var findmau = /*_db.MauSacs.Where(x => x.MauSacSP == item.).FirstOrDefault();*/ await _aPIMauSac.GetColorbyname(item.MauSacSp);
                var ha = new MauSac { ID = findmau.data.ID, MauSacSP = item.MauSacSp };
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
        public async Task<JsonResult> KiemTra(int id, int mau, int kich)
        {
            var fmau = await _aPIMauSac.GetById(mau);
            var fkich = await _aPISKichCo.GetByIdLoaiKichCo(kich);
            var rq = new CombineConditionChiTietSanPham()
            {
                IDSanPham = id,
                KichCoSP = fkich.data.KichCoSP,
                MauSacSP = fmau.data.MauSacSP,
            };
            var find = await _apiChiTietSanPham.GetChiTietSanPhamByConditionID_MS_KC_SL(rq);
            if (find.data == null)
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
            var find = await _aPISanPham.GetByIdSanPham(M);
            var result = await /*_db.SanPhams.Where(x => x.IDLoaiSanPham == find.data.IDLoaiSanPham).ToListAsync();*/ _aPISanPham.GetSanPhamPagingsByIdLoaiSanPham(find.data.IDLoaiSanPham.Value);
            return PartialView((result.data.ToPagedList(pageNumber, pageSize)));
        }
    }
}
