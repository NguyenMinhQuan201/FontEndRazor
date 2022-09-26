
class CartController {

    constructor() {
        this.renderCartsContent();
        this.allPrice();
        this.renderOrderDetailContent();

        $(".product__color__select label, .shop__sidebar__size label").on('click', function () {
            $(".product__color__select label, .shop__sidebar__size label ").removeClass('active');
            $(this).addClass('active');
        });
        $(".product__details__option__size label").on('click', function () {
            console.log("tren");
            $(".product__details__option__size label").removeClass('active');
            $(this).addClass('active');
            var rows = $('.product__details__option__size label.active').data('id');
            console.log("xong");
        });
        $(".product__details__option__size2 label").on('click', function () {
            console.log("duoi");
            $(".product__details__option__size2 label").removeClass('active');
            $(this).addClass('active');
            
            console.log("xong");
        });
        $('.size').on('click', function () {
            var click = $(this);
            var size = click.data('id');
            console.log(size);
            $.ajax({
                url: "/Events/checkbysize",
                data: {kich: size },
                dataType: "json",
                type: "POST",
                success: function (response) {
                    if (response.status == true) {
                        var rows = "<span>Color:</span>";
                        for (var i = 0; i < response.Arr.length; i++){
                            console.log(response.Arr[i].ID);
                            console.log(response.Arr[i].MauSacSP);
                            rows += `
                                                <label for="${response.Arr[i].MauSacSP}" class="colour" data-id="${response.Arr[i].ID}"">
                                                    ${response.Arr[i].MauSacSP}
                                                    <input name="mau" type="radio" id="${response.Arr[i].ID}">
                                                </label>
                                        
                                    `
                        }
                        $('#ngu').html(rows);
                        $(".product__details__option__size2 label").on('click', function () {
                            console.log("duoi");
                            $(".product__details__option__size2 label").removeClass('active');
                            $(this).addClass('active');
                            var size = $('.product__details__option__size label.active').data('id');
                            var colour = $('.product__details__option__size2 label.active').data('id');
                            console.log(size);
                            console.log(colour);
                            var Id = $('.button_add_to_cart_new').data('id');
                            $.ajax({
                                url: "/Events/KiemTra",
                                data: { id: Id, mau: colour, kich: size },
                                dataType: "json",
                                type: "POST",
                                success: function (response) {
                                    if (response.status == false) {
                                        $('.button_add_to_cart_new').attr("disabled", true);
                                        $('.primary-btn').html("Đã hết hàng")
                                    }
                                    else {
                                        $('.button_add_to_cart_new').attr("disabled", false);
                                        $('.primary-btn').html("ADD TO CART")
                                    }
                                }
                            })
                        });
                    }
                }
            })
        });
        $('.button_abc').on('click', function () {
            console.log("ok");
            var click = $(this);
            var Id = click.data('id');
            var size = $('.product__details__option__size label.active').data('id');
            var colour = $('.product__details__option__size2 label.active').data('id');
            console.log(size);
            console.log(colour);
            if (size == null || colour == null) {
                alert("Hình như bạn quên chọn size hoặc màu !");
            }
        });
        $('#icolour').on('change', function () {
            console.log("heheheheh");
            var size = $('#isize').val();
            var colour = $('#icolour').val();
            var Id = $('.button_add_to_cart_new').data('id');
            $.ajax({
                url: "/Events/onCheck",
                data: {
                    id: Id,
                    mau: colour,
                    kich: size
                },
                dataType: "json",
                type: "POST",
                success: function (response) {
                    if (response.status == false) {
                        $('.button_add_to_cart_new').attr("disabled", true);
                        $('.primary-btn').html("Đã hết hàng")
                    }
                    else {
                        $('.button_add_to_cart_new').attr("disabled", false);
                        $('.primary-btn').html("ADD TO CART")

                    }
                }
            })
        });
        $('#isize').on('change', function () {
            console.log("heheheheh");
            var size = $('#isize').val();
            var colour = $('#icolour').val();
            var Id = $('.button_add_to_cart_new').data('id');
            $.ajax({
                url: "/Events/onCheck2",
                data: { id: Id, mau: colour, kich: size },
                dataType: "json",
                type: "POST",
                success: function (response) {
                    if (response.status == false) {
                        $('.button_add_to_cart_new').attr("disabled", true);
                        $('.primary-btn').html("Đã hết hàng")
                    }
                    else {
                        $('.button_add_to_cart_new').attr("disabled", false);
                        $('.primary-btn').html("ADD TO CART")
                    }
                }
            })
        });
        $('.change-price').on('change', function () {
            var click = $(this);
            var Quanity= click.val();
            var Id = click.data('id');
            $.ajax({
                url: "/Carts/changePrice",
                data: { id: Id, sl: Quanity },
                dataType: "json",
                type: "POST",
                success: function (response) {
                    if (response.status == true) {
                        let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
                        if (Carts.length > 0) {
                            for (var i = 0; i < Carts.length; i++) {
                                if (Id == Carts[i].Prime) {
                                    Carts[i].SoLuong = Number(Quanity);
                                    Carts[i].Tong = Carts[i].SoLuong * Carts[i].Gia
                                    $(`#total-price-${Id}`).html(Carts[i].Tong);
                                    localStorage.setItem('Carts', JSON.stringify(Carts));
                                }
                            }
                            var tongtien = 0;
                            for (var i = 0; i < Carts.length; i++) {
                                if (Carts[i].TrangThai == true) {
                                    tongtien = tongtien + Carts[i].Tong;
                                }
                            }
                            localStorage.setItem('TT', tongtien)
                            localStorage.setItem('Carts', JSON.stringify(Carts));
                            let TT = localStorage.getItem('TT')
                            $('.total-checkout').html(tongtien)
                            localStorage.setItem('Carts', JSON.stringify(Carts));
                            var row = "";
                            $(`.mess_${Id}`).html(row);
                        }
                    }
                    else {
                        var row = " San pham ko the vuot qua " + response.max;
                        if (response.max == 0) {
                            console.log("ok");
                            row = "da het hang";
                            let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
                            if (Carts.length > 0) {
                                for (var i = 0; i < Carts.length; i++) {
                                    if (Id == Carts[i].Prime) {
                                        Carts[i].TrangThai = false;
                                        Carts[i].SoLuong = 1;
                                        Carts[i].Tong = Carts[i].SoLuong * Carts[i].Gia
                                        $(`#total-price-${Id}`).html(Carts[i].Tong);
                                        localStorage.setItem('Carts', JSON.stringify(Carts));
                                        console.log("ok");
                                    }
                                }
                                var tongtien = 0;
                                for (var i = 0; i < Carts.length; i++) {
                                    if (Carts[i].TrangThai == true) {
                                        tongtien = tongtien + Carts[i].Tong;
                                    }
                                }
                                localStorage.setItem('TT', tongtien)
                                localStorage.setItem('Carts', JSON.stringify(Carts));
                                let TT = localStorage.getItem('TT')
                                $('.total-checkout').html(tongtien)
                                localStorage.setItem('Carts', JSON.stringify(Carts));
                                $(`.mess_${Id}`).html(row);
                            }
                            
                        }
                        $(`.mess_${Id}`).html(row);
                    }
                }
            })
        });
        $('.button_add_to_cart_new').on('click', function () {
            console.log("ok");
            let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
            var click = $(this);
            var Id = click.data('id');
            var size = $('.product__details__option__size label.active').data('id');
            var colour = $('.product__details__option__size2 label.active').data('id');
            if (size == null || colour == null) {
                alert("Hình như bạn quên chọn size hoặc màu !");
            }
            else {
                let Temp = [];
                Temp.push({
                    Id: Id,
                    Colour: colour,
                    Size: size,
                });
                $.ajax({
                    url: "/Carts/AddCart",
                    data: { cartTemp: JSON.stringify(Temp) },
                    dataType: "json",
                    type: "POST",
                    success: function (response) {
                        if (response.status == true) {
                            var a = 0;
                            let b = String(1);
                            if (Carts.length > 0) {
                                for (var i = 0; i < Carts.length; i++) {
                                    if (Carts[i].Prime == response.Prime) {
                                        if (Carts[i].SoLuong < response.SoLuong) {
                                            Carts[i].SoLuong = Carts[i].SoLuong + 1;
                                            Carts[i].Tong = Carts[i].Tong + Carts[i].Gia;
                                        }
                                        a = 1;
                                    }
                                }
                                if (a == 0) {
                                    Carts.push({
                                        Prime: response.Prime,
                                        SoLuong: 1,
                                        Img: response.Img,
                                        Gia: response.Gia,
                                        Name: response.Ten,
                                        Mau: response.Mau,
                                        Kich: response.Kich,
                                        Tong: 0 + response.Gia,
                                        TrangThai:true,
                                    });
                                }
                            }
                            else {
                                Carts.push({
                                    Prime: response.Prime,
                                    SoLuong: 1,
                                    Img: response.Img,
                                    Gia: response.Gia,
                                    Name: response.Ten,
                                    Mau: response.Mau,
                                    Kich: response.Kich,
                                    Tong: 0 + response.Gia,
                                    TrangThai: true,
                                });
                            }
                        }
                        localStorage.setItem('Carts', JSON.stringify(Carts));
                        var tongtien = 0;
                        for (var i = 0; i < Carts.length; i++) {
                            tongtien = tongtien + Carts[i].Tong;
                        }
                        localStorage.setItem('TT', tongtien)

                        let TT = localStorage.getItem('TT')
                        $('.total-checkout').html(TT);
                        window.location.href = "/Carts";
                    }
                })
            }
            
            
        });
        $('#paypal').off('click').on('click', function () {
            var AddRess = $('#DC').val();
            var Phone = $('#SDT').val();
            var Email = $('#Gmail').val();
            if (localStorage) {
                var cartsDataAsJson = localStorage.getItem("Carts")
                if (cartsDataAsJson) {
                    /**
                     * @type{ {
                     *  Size: string;
                     *  Colour: string;
                     *  Img: string;
                     *  
                     * }[]}
                    * */
                    var Carts = [];
                    var carts = JSON.parse(cartsDataAsJson);
                    var rows = "";
                    for (var i = 0; i < carts.length; i++) {
                        var cart = carts[i];
                        Carts.push(cart);
                    }
                }
                let Order = [];
                Order.push({
                    address: AddRess,
                    phone: Phone,
                    email: Email,
                });
                localStorage.setItem('Order', JSON.stringify(Order));
                $.ajax({
                    url: "/Carts/PaymentWithPaypal",
                    data: { cartTemp: JSON.stringify(Carts), addRess: AddRess, phone: Phone},
                    dataType: "json",
                    type: "POST",
                    success: function (response) {
                        if (response.status == true && response.url=="") {
                            window.location.href = "/Home/Index";
                        }
                        if (response.status == true ) {
                            var link = response.url;
                            
                            /*alert("XONG!");*/
                            /*window.location.href = "";*/
                            location.href = link
                            /*window.location.href = "/Carts";*/
                        }
                        
                        else {
                            window.location.href = "/Carts";
                        }
                    }
                })
            }
        });
        /*$('.make-order').off('click').on('click', function () {
            if (localStorage) {
                var TT = localStorage.getItem('TT')
                if (TT > 0) {
                    window.location.href = "/Order/Index";
                }
                else {
                    alert("Gio hang dang ko co gi ! ");
                }
            }
        });*/
        $('#make_order').off('click').on('click', function () {
            var AddRess = $('#DC').val();
            var Phone = $('#SDT').val();
            var Email = $('#Gmail').val();
            var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            if (AddRess == "") {
                alert("Nhap lai dia chi !");
            }
            else if (Phone == "") {
                if (vnf_regex.test(Phone) == false) {
                    alert('Số điện thoại của bạn không đúng định dạng!');
                }
            }
            else if (Email == "") {
                alert("Nhap lai so Email !");
            }
            else {
                if (localStorage) {
                    var cartsDataAsJson = localStorage.getItem("Carts")
                    if (cartsDataAsJson) {
                        /**
                         * @type{ {
                         *  Size: string;
                         *  Colour: string;
                         *  Img: string;
                         *  
                         * }[]}
                        * */
                        var Carts = [];
                        var carts = JSON.parse(cartsDataAsJson);
                        var rows = "";
                        for (var i = 0; i < carts.length; i++) {
                            var cart = carts[i];
                            Carts.push(cart);
                        }
                    }
                    $.ajax({
                        url: "/Order/MakeOrder",
                        data: { cartUser: JSON.stringify(Carts), addRess: AddRess, phone: Phone },
                        dataType: "json",
                        type: "POST",
                        success: function (response) {
                            if (response.status == true) {
                                Carts = [];
                                localStorage.setItem('Carts', JSON.stringify(Carts));
                                localStorage.setItem('TT', 0);
                                alert("XONG!");
                                window.location.href = "/Events/Index";
                            }
                        }
                    })
                }
            }
        });
        $('.cart__close').off('click').on('click', function () {
            var tongtien = 0;
            var rows = "";
            var click = $(this);
            var Id = click.data('id');
            let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
            if (Carts.length > 0) {
                for (var i = 0; i < Carts.length; i++) {
                    if (Id == Carts[i].Prime) {
                        var tmp = Carts[i]
                        Carts[i] = Carts[0]
                        Carts[0] = tmp
                        Carts.splice(0, 1);
                        localStorage.setItem('Carts', JSON.stringify(Carts));
                        if (localStorage) {
                            var cartsDataAsJson = localStorage.getItem("Carts")
                            if (cartsDataAsJson) {
                                /**
                                 * @type{ {
                                 *  Size: string;
                                 *  Colour: string;
                                 *  Img: string;
                                 *  
                                 * }[]}
                                 * */
                                var carts = JSON.parse(cartsDataAsJson);

                                for (var i = 0; i < carts.length; i++) {

                                    var cart = carts[i];
                                    tongtien = tongtien + cart.Tong;
                                    rows += `<tr>
                                <td class="product__cart__item">
                                    <div class="product__cart__item__pic">
                                        <img src="/Content/img/${cart.Img}" alt="">
                                    </div>
                                    <div class="product__cart__item__text">
                                        <h6>${cart.Name}</h6>
                                        <h5>€${cart.Gia}</h5>
                                        Size: ${cart.Kich}
                                         <br>
                                        Color: ${cart.Mau}
                                        <br>
                                    </div>
                                </td>
                                <td class="quantity__item">
                                    <div class="quantity">
                                        <div class="pro-qty-2">
                                            <input class="change-price" data-id="${cart.Prime}" value="${cart.SoLuong}" type="number" min="1" max="10">
                                        </div>
                                    </div>
                                </td>
                                <td class="cart__price" id="total-price-${cart.Prime}">$ ${cart.Tong}</td>
                                <td class="cart__close" data-id="${cart.Prime}"><i class="fa fa-close"></i></td>
                            </tr>
                                        `
                                }
                                $('.js__cart-content').html(rows);
                                localStorage.setItem('TT', tongtien);
                                $('.total-checkout').html(tongtien);
                            }
                        }
                    }
                }
            }
            if (Carts.length == 0) {
                $('.total-checkout').html("0");
            }
            if (Carts.length>0) {
                new CartController()
            }
        });
        $('#checkout').off('click').on('click', function () {
            console.log("ok");
            if (localStorage) {
                var cartsDataAsJson = localStorage.getItem("Carts")
                var TT = localStorage.getItem('TT')
                var carts = JSON.parse(cartsDataAsJson);
                var rows = "";
                for (var i = 0; i < carts.length; i++) {
                    var cart = carts[i];
                    if (cart.TrangThai == true) {
                        rows += `
                        <li>${cart.SoLuong} - ${cart.Name} <span>$ ${cart.Gia}</span></li>
                    `
                    }
                }
                $('.checkout__total__products').html(rows);
                console.log("okokok");
                if (TT > 0) {
                    window.location.href = "/Order/Index";
                    
                }
                else {
                    alert("Gio hang dang ko co gi ! ");
                }
            }
        });
    }
    allPrice() {
        var TT = localStorage.getItem('TT')
        $('.all-money').html(TT);
        $('.total-checkout').html(TT);
    }
    renderOrderDetailContent() {
        if (localStorage) {
            var TT = localStorage.getItem('TT')
            $('.tongphu').html(TT);
            $('.tongchinh').html(TT);
            var cartsDataAsJson = localStorage.getItem("Carts")
            var carts = JSON.parse(cartsDataAsJson);
            if (cartsDataAsJson) {
                var rows = "";
                for (var i = 0; i < carts.length; i++) {
                    var cart = carts[i];
                    if (cart.TrangThai==true) {
                        rows += `
                        <li>${cart.SoLuong}   <span>$ ${cart.Gia}</span> <span style="margin-right: 18%">${cart.Name}</span></li>
                    `
                    }
                }
                $('.checkout__total__products').html(rows);
            }
        }
    }
    renderCartsContent() {
        if (localStorage) {
            var cartsDataAsJson = localStorage.getItem("Carts")
            if (cartsDataAsJson) {
                /**
                 * @type{ {
                 *  Size: string;
                 *  Colour: string;
                 *  Img: string;
                 *  
                 * }[]}
                * */
               
                var carts = JSON.parse(cartsDataAsJson);
                console.log(carts);
                $.ajax({
                    url: "/Carts/RemakeRender",
                    data: { cartTemp: JSON.stringify(carts) },
                    dataType: "json",
                    type: "POST",
                    success: function (response) {
                        if (response.status == true) {
                            console.log(response.list);
                            carts = response.list;
                            var rows = "";
                            var tongtien = 0;
                            for (var i = 0; i < carts.length; i++) {
                                var cart = carts[i];
                                if (cart.TrangThai == false) {
                                    rows += 
                                        `
                        <tr>
                                <td class="product__cart__item">
                                    <div class="product__cart__item__pic">
                                        <img style="height: 110px;width: 90px; " src="/Content/img/${cart.Img}" alt="">
                                    </div>
                                    <div class="product__cart__item__text">
                                        <h6>${cart.Name}</h6>
                                        <h5>€${cart.Gia}</h5>
                                        Size: ${cart.Kich}
                                         -
                                        Color: ${cart.Mau}
                                        <br>
                                         <h5 class="mess_${cart.Prime}" style="color:red">da het hang</h5>
                                    </div>
                                </td>
                                <td class="quantity__item">
                                    <div class="quantity">
                                        <div class="QUANTITY">
                                                <input class="change-price" id="key_${cart.Prime}" data-id="${cart.Prime}" value="${cart.SoLuong}" type="number" min="1" max="10">
                                        </div>
                                    </div>
                                </td>
                                <td class="cart__price" id="total-price-${cart.Prime}">$ ${cart.Tong}</td>
                                <td class="cart__close" data-id="${cart.Prime}"><i class="fa fa-close"></i></td>
                            </tr>
                    `
                                }
                                else {
                                    tongtien = tongtien + cart.Tong;
                                    rows += `
                        <tr>
                                <td class="product__cart__item">
                                    <div class="product__cart__item__pic">
                                        <img style="height: 110px;width: 90px; " src="/Content/img/${cart.Img}" alt="">
                                    </div>
                                    <div class="product__cart__item__text">
                                        <h6>${cart.Name}</h6>
                                        <h5>€${cart.Gia}</h5>
                                        Size: ${cart.Kich}
                                         -
                                        Color: ${cart.Mau}
                                        <br>
                                         <h5 class="mess_${cart.Prime}" style="color:red"></h5>
                                    </div>
                                </td>
                                <td class="quantity__item">
                                    <div class="quantity">
                                        <div class="QUANTITY">
                                                <input class="change-price" data-id="${cart.Prime}" value="${cart.SoLuong}" type="number" min="1" max="10">
                                        </div>
                                    </div>
                                </td>
                                <td class="cart__price" id="total-price-${cart.Prime}">$ ${cart.Tong}</td>
                                <td class="cart__close" data-id="${cart.Prime}"><i class="fa fa-close"></i></td>
                            </tr>
                    `
                                }
                            }
                            localStorage.setItem('TT', tongtien);
                            $('.total-checkout').html(tongtien);
                            $('.js__cart-content').html(rows);
                            $('.change-price').on('change', function () {
                                var click = $(this);
                                var Quanity = click.val();
                                var Id = click.data('id');
                                $.ajax({
                                    url: "/Carts/changePrice",
                                    data: { id: Id, sl: Quanity },
                                    dataType: "json",
                                    type: "POST",
                                    success: function (response) {
                                        if (response.status == true) {
                                            let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
                                            if (Carts.length > 0) {
                                                for (var i = 0; i < Carts.length; i++) {
                                                    if (Id == Carts[i].Prime) {
                                                        Carts[i].SoLuong = Number(Quanity);
                                                        Carts[i].Tong = Carts[i].SoLuong * Carts[i].Gia
                                                        $(`#total-price-${Id}`).html(Carts[i].Tong);
                                                        localStorage.setItem('Carts', JSON.stringify(Carts));
                                                    }
                                                }
                                                var tongtien = 0;
                                                for (var i = 0; i < Carts.length; i++) {
                                                    if (Carts[i].TrangThai == true) {
                                                        tongtien = tongtien + Carts[i].Tong;
                                                    }
                                                }
                                                localStorage.setItem('TT', tongtien)
                                                localStorage.setItem('Carts', JSON.stringify(Carts));
                                                let TT = localStorage.getItem('TT')
                                                $('.total-checkout').html(tongtien)
                                                localStorage.setItem('Carts', JSON.stringify(Carts));
                                                var row = "";
                                                $(`.mess_${Id}`).html(row);
                                            }
                                        }
                                        else {
                                            var row = " San pham ko the vuot qua " + response.max;
                                            if (response.max == 0) {
                                                console.log("ok");
                                                row = "da het hang";
                                                let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
                                                if (Carts.length > 0) {
                                                    for (var i = 0; i < Carts.length; i++) {
                                                        if (Id == Carts[i].Prime) {
                                                            Carts[i].TrangThai = false;
                                                            Carts[i].SoLuong = 1;
                                                            Carts[i].Tong = Carts[i].SoLuong * Carts[i].Gia
                                                            $(`#total-price-${Id}`).html(Carts[i].Tong);
                                                            localStorage.setItem('Carts', JSON.stringify(Carts));
                                                            console.log("ok");
                                                        }
                                                    }
                                                    var tongtien = 0;
                                                    for (var i = 0; i < Carts.length; i++) {
                                                        if (Carts[i].TrangThai == true) {
                                                            tongtien = tongtien + Carts[i].Tong;
                                                        }
                                                    }
                                                    localStorage.setItem('TT', tongtien)
                                                    localStorage.setItem('Carts', JSON.stringify(Carts));
                                                    let TT = localStorage.getItem('TT')
                                                    $('.total-checkout').html(tongtien)
                                                    localStorage.setItem('Carts', JSON.stringify(Carts));
                                                    $(`.mess_${Id}`).html(row);
                                                }

                                            }
                                            $(`.mess_${Id}`).html(row);
                                        }
                                    }
                                })
                            });
                            $('.cart__close').off('click').on('click', function () {
                                var tongtien = 0;
                                var rows = "";
                                var click = $(this);
                                var Id = click.data('id');
                                let Carts = localStorage.getItem('Carts') ? JSON.parse(localStorage.getItem('Carts')) : [];
                                if (Carts.length > 0) {
                                    for (var i = 0; i < Carts.length; i++) {
                                        if (Id == Carts[i].Prime) {
                                            var tmp = Carts[i]
                                            Carts[i] = Carts[0]
                                            Carts[0] = tmp
                                            Carts.splice(0, 1);
                                            localStorage.setItem('Carts', JSON.stringify(Carts));
                                            if (localStorage) {
                                                var cartsDataAsJson = localStorage.getItem("Carts")
                                                if (cartsDataAsJson) {
                                                    /**
                                                     * @type{ {
                                                     *  Size: string;
                                                     *  Colour: string;
                                                     *  Img: string;
                                                     *  
                                                     * }[]}
                                                     * */
                                                    var carts = JSON.parse(cartsDataAsJson);

                                                    for (var i = 0; i < carts.length; i++) {

                                                        var cart = carts[i];
                                                        tongtien = tongtien + cart.Tong;
                                                        rows += `<tr>
                                <td class="product__cart__item">
                                    <div class="product__cart__item__pic">
                                        <img src="/Content/img/${cart.Img}" alt="">
                                    </div>
                                    <div class="product__cart__item__text">
                                        <h6>${cart.Name}</h6>
                                        <h5>€${cart.Gia}</h5>
                                        Size: ${cart.Kich}
                                         <br>
                                        Color: ${cart.Mau}
                                        <br>
                                    </div>
                                </td>
                                <td class="quantity__item">
                                    <div class="quantity">
                                        <div class="pro-qty-2">
                                            <input class="change-price" data-id="${cart.Prime}" value="${cart.SoLuong}" type="number" min="1" max="10">
                                        </div>
                                    </div>
                                </td>
                                <td class="cart__price" id="total-price-${cart.Prime}">$ ${cart.Tong}</td>
                                <td class="cart__close" data-id="${cart.Prime}"><i class="fa fa-close"></i></td>
                            </tr>
                                        `
                                                    }
                                                    $('.js__cart-content').html(rows);
                                                    localStorage.setItem('TT', tongtien);
                                                    $('.total-checkout').html(tongtien);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (Carts.length == 0) {
                                    $('.total-checkout').html("0");
                                }
                                if (Carts.length > 0) {
                                    new CartController()
                                }
                            });
                        }
                    }
                })
            }
        }
        
    }
}
new CartController();
