using System.ComponentModel.DataAnnotations;

namespace RazorWeb.Models
{
    public class Order
    {
        public int Prime { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Img { get; set; }

        public decimal Gia { get; set; }

        [StringLength(10)]
        public string Kich { get; set; }

        [StringLength(50)]
        public string Mau { get; set; }

        public int SoLuong { get; set; }

        public decimal Tong { get; set; }

        public decimal GiaNhap { get; set; }
    }
}
