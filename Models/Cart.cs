using System.ComponentModel.DataAnnotations;

namespace RazorWeb.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int Prime { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Img { get; set; }

        public decimal Gia { get; set; }

        public bool TrangThai { get; set; }

        public int Size { get; set; }

        public int Colour { get; set; }

        public int SoLuong { get; set; }
        public string Mau { get; set; }
        public string Kich { get; set; }

        public decimal Tong { get; set; }
        public decimal GiaNhap { get; set; }
    }
}
