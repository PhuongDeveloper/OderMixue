// Quản lý giỏ hàng bằng LocalStorage
let gioHang = JSON.parse(localStorage.getItem('gioHangMixue')) || [];

function luuGioHang() {
    localStorage.setItem('gioHangMixue', JSON.stringify(gioHang));
}

function layThongTinSanPham(tenSanPham) {
    const products = document.querySelectorAll('.itemsanpham');
    for (let p of products) {
        const nameNode = p.querySelector('.tensanpham');
        if (nameNode && nameNode.innerText.trim() === tenSanPham) {
            const priceText = p.querySelector('.giatien').innerText.replace(/\D/g, ''); 
            const imgSrc = p.querySelector('.anhsanpham').getAttribute('src');
            return {
                name: tenSanPham,
                price: parseInt(priceText),
                image: imgSrc
            };
        }
    }
    return { name: tenSanPham, price: 0, image: 'hinhanh/logo.png' }; // Fallback
}

function themVaoGio(tenSanPham) {
    const sp = layThongTinSanPham(tenSanPham);
    
    const existItem = gioHang.find(item => item.name === tenSanPham);
    if (existItem) {
        existItem.quantity += 1;
    } else {
        gioHang.push({
            ...sp,
            quantity: 1
        });
    }
    
    luuGioHang();
    alert(` Đã thêm "${tenSanPham}" vào giỏ hàng thành công!`);
}

function datNgay(tenSanPham) {
    const xacNhan = confirm(`Bạn có muốn đưa "${tenSanPham}" vào giỏ và thanh toán ngay không?`);
    if (xacNhan) {
        themVaoGio(tenSanPham);
        window.location.href = 'donhang.html'; // Chuyển sang trang giỏ hàng
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

function initCarousel() {
    const listfeedback = document.querySelector('.listfeedback');

    if (!listfeedback) {
        console.log('Khong tim thay carousel feedback');
        return;
    }

    const cacItemGoc = listfeedback.querySelectorAll('.itemfeedback');
    const soLuongItem = cacItemGoc.length;

    for (let i = 0; i < soLuongItem; i++) {
        const itemSaoChep = cacItemGoc[i].cloneNode(true);
        listfeedback.appendChild(itemSaoChep);
    }
}

// Logic lọc & tìm kiếm sản phẩm ở thẻ Thực Đơn
function locSanPham() {
    const tuKhoa = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const danhMuc = document.getElementById('categorySelect')?.value || 'all';
    const cacSanPham = document.querySelectorAll('.itemsanpham');

    cacSanPham.forEach(item => {
        const tenSanPham = item.querySelector('.tensanpham').innerText.toLowerCase();
        const loaiSanPham = item.getAttribute('data-category');

        const phuHopTuKhoa = tenSanPham.includes(tuKhoa);
        const phuHopDanhMuc = (danhMuc === 'all') || (loaiSanPham === danhMuc);

        if (phuHopTuKhoa && phuHopDanhMuc) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function kiemTraManHinh() {
    const carousel = document.querySelector('.carouselfeedback');

    if (!carousel) return;

    const kichThuocManHinh = window.innerWidth;

    if (kichThuocManHinh < 768) {
        carousel.style.animationDuration = '30s';
    } else {
        carousel.style.animationDuration = '20s';
    }
}

window.addEventListener('load', () => {
    kiemTraManHinh();
    if(document.getElementById('bangGioHangBody')) {
        hienThiGioHang();
    }
});
window.addEventListener('resize', kiemTraManHinh);

const API_URL = "https://script.google.com/macros/s/AKfycbwcm2aOhyRYMWQj0P6vkVwSdYIYJbNPuEu8UjqsWX8GnkAkeMqMTviRn1zKpCVwG65Z/exec";

// ==========================================
// RENDER GIỎ HÀNG
// ==========================================
function hienThiGioHang() {
    const tbody = document.getElementById('bangGioHangBody');
    const tongTienEl = document.getElementById('tongTienHienThi');
    if (!tbody || !tongTienEl) return;

    tbody.innerHTML = '';
    let tongTien = 0;

    if (gioHang.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Giỏ hàng của bạn đang trống!</td></tr>';
        tongTienEl.innerText = '0 VNĐ';
        return;
    }

    gioHang.forEach((item, index) => {
        const thanhTien = item.price * item.quantity;
        tongTien += thanhTien;
        
        tbody.innerHTML += `
            <tr>
                <td class="cot-sanpham">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='hinhanh/logo.png'">
                    <span>${item.name}</span>
                </td>
                <td>${item.price.toLocaleString('vi-VN')}đ</td>
                <td><input type="number" value="${item.quantity}" min="1" class="input-soluong" onchange="capNhatSoLuong(${index}, this.value)"></td>
                <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
                <td><button class="btn-xoa" onclick="xoaKhoiGio(${index})">X</button></td>
            </tr>
        `;
    });

    tongTienEl.innerText = tongTien.toLocaleString('vi-VN') + ' VNĐ';
}

function capNhatSoLuong(index, value) {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1) {
        gioHang[index].quantity = newQuantity;
        luuGioHang();
        hienThiGioHang();
    }
}

function xoaKhoiGio(index) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ?')) {
        gioHang.splice(index, 1);
        luuGioHang();
        hienThiGioHang();
    }
}

// ==========================================
// MODAL & GỬI ĐƠN HÀNG LÊN GOOGLE SHEETS
// ==========================================
function moModalThanhToan() {
    if (gioHang.length === 0) {
        alert('Giỏ hàng trống, vui lòng chọn món trước!');
        return;
    }
    document.getElementById('modalThanhToan').style.display = 'flex';
}

function dongModalThanhToan() {
    document.getElementById('modalThanhToan').style.display = 'none';
}

async function guiDonHang(event) {
    event.preventDefault();
    if (gioHang.length === 0) return;

    const btn = document.getElementById('btnXacNhanDatHang');
    btn.disabled = true;
    btn.innerText = 'Đang xử lý...';

    const hoten = document.getElementById('hotenDatHang').value;
    const sdt = document.getElementById('sdtDatHang').value;
    const diachi = document.getElementById('diachiDatHang').value;
    
    let chiTietDon = gioHang.map(item => `${item.quantity}x ${item.name}`).join(', ');
    let tongTien = gioHang.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const data = {
        action: 'dat_hang',
        TenKhachHang: hoten,
        SoDienThoai: sdt,
        DiaChiGiaoHang: diachi,
        ChiTietDon: chiTietDon,
        TongTien: tongTien
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            alert(`Đặt hàng thành công! Mã đơn của bạn là: ${result.maDon}`);
            gioHang = []; 
            luuGioHang();
            dongModalThanhToan();
            hienThiGioHang();
            document.getElementById('formDatHang').reset();
        } else {
            alert('Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        alert('Lỗi kết nối. Vui lòng thử lại sau!');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Xác nhận đặt hàng';
    }
}

// ==========================================
// GỬI LIÊN HỆ LÊN GOOGLE SHEETS
// ==========================================
async function guiLienHe(event) {
    event.preventDefault();

    const btn = document.getElementById('btnGuiLienHe');
    if (!btn) return;
    
    btn.disabled = true;
    btn.innerText = 'Đang gửi...';

    const hoten = document.getElementById('ten').value;
    const email = document.getElementById('email').value;
    const noidung = document.getElementById('tinnhan').value;

    const data = {
        action: 'lien_he',
        HoTen: hoten,
        Email: email,
        NoiDung: noidung
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            alert('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
            document.getElementById('formLienHe').reset();
        } else {
            alert('Có lỗi xảy ra: ' + result.message);
        }
    } catch (error) {
        alert('Lỗi kết nối. Vui lòng thử lại sau!');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Gửi Liên Hệ';
    }
}

// ==========================================
// TÍNH NĂNG LẤY VỊ TRÍ HIỆN TẠI (GEOLOCATION)
// ==========================================
function layViTriHienTai() {
    const btn = document.getElementById('btnDinhVi');
    const diaChiInput = document.getElementById('diachiDatHang');
    
    if (!navigator.geolocation) {
        alert('Trình duyệt của bạn không hỗ trợ định vị.');
        return;
    }

    btn.innerText = '⏳ Đang định vị...';
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Gọi API Nominatim để dịch tọa độ sang địa chỉ (tiếng Việt)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`);
                const data = await response.json();
                
                if (data && data.display_name) {
                    diaChiInput.value = data.display_name;
                    btn.innerText = '✅ Đã lấy vị trí';
                    btn.style.backgroundColor = '#2ecc71';
                } else {
                    alert('Lấy tọa độ thành công nhưng không dịch được ra địa chỉ.');
                    btn.innerText = '📍 Vị trí hiện tại';
                }
            } catch (error) {
                console.error(error);
                alert('Lỗi kết nối khi lấy địa chỉ.');
                btn.innerText = '📍 Vị trí hiện tại';
            } finally {
                btn.disabled = false;
                // Khôi phục trạng thái nút sau 3 giây
                setTimeout(() => {
                    btn.innerText = '📍 Vị trí hiện tại';
                    btn.style.backgroundColor = '#e74c3c';
                }, 3000);
            }
        },
        (error) => {
            console.error(error);
            alert('Lỗi: Vui lòng cho phép quyền truy cập vị trí trong trình duyệt.');
            btn.innerText = '📍 Vị trí hiện tại';
            btn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}
