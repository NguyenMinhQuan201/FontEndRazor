using Data.Models;

namespace RazorWeb.Models
{
    public interface IEventsModels
    {
        public List<MauSac> ListAll(int id);
        public List<KichCo> ListAllSize(int id);
    }
    public class EventsModels : IEventsModels
    {
        private readonly Lipstick2Context _db;
        public EventsModels(Lipstick2Context db)
        {
            _db = db;
        }
        public List<MauSac> ListAll(int id)
        {
            List<MauSac> a = new List<MauSac>();
            var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == id).ToList();
            var result = _db.MauSacs.ToList();
            foreach (var item in find)
            {
                foreach (var item2 in result)
                {
                    if (a.Contains(item2))
                    {
                        int i = 0;
                    }
                    else
                    {
                        if (item.MauSacSp == item2.MauSacSp)
                        {
                            a.Add(item2);
                        }
                    }
                }
            }

            return a;
        }
        public List<KichCo> ListAllSize(int id)
        {
            List<KichCo> a = new List<KichCo>();
            var find = _db.ChiTietSanPhams.Where(x => x.IdsanPham == id).ToList();
            var result = _db.KichCos.ToList();
            foreach (var item in find)
            {
                foreach (var item2 in result)
                {
                    if (a.Contains(item2))
                    {
                        int i = 0;
                    }
                    else
                    {
                        if (item.KichCoSp == item2.KichCoSp)
                        {
                            a.Add(item2);
                        }
                    }
                }
            }

            return a;
        }
    }
}
