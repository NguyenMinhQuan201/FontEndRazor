using System.ComponentModel.DataAnnotations;

namespace RazorWeb.Models
{
    public class ThongTin
    {
        [StringLength(50)]
        public string address { get; set; }

        [StringLength(50)]
        public string email { get; set; }
        [StringLength(50)]
        public int phone { get; set; }
    }
}
