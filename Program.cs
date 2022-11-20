using AdminWeb.Services;
using Data.Models;
using RazorWeb.Models;
using RazorWeb.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/*builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("https://localhost:7142/")
                                .AllowAnyHeader()
                                .AllowAnyOrigin()
                                .AllowAnyMethod();
        });
});*/
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IAPISanPham, APISanPham>();
builder.Services.AddHttpClient();
builder.Services.AddControllersWithViews();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddTransient<IAPILoaiSanPham, APILoaiSanPham>();
builder.Services.AddTransient<IAPIChiTietSanPham, APIChiTietSanPham>();
builder.Services.AddTransient<IAPISKichCo, APISKichCo>();
builder.Services.AddTransient<IAPIMauSac, APIMauSac>();
builder.Services.AddTransient<IAPITinTuc, APITinTuc>();
builder.Services.AddTransient<IAPIHoaDons, APIHoaDon>();
builder.Services.AddTransient<IAPISanPham, APISanPham>();
builder.Services.AddTransient<IEventsModels, EventsModels>();
/*builder.Services.Services();
*/

/*builder.Services.AddDbContext<Lipstick2Context>();*/
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
/*app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});*/
app.Run();
