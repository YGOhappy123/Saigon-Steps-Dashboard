const ERROR_MESSAGES = {
    // Authentication related
    INVALID_CREDENTIALS: 'Thông tin xác thực không hợp lệ.',
    USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại.',
    INCORRECT_PASSWORD: 'Mật khẩu không chính xác.',
    INCORRECT_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    GOOGLE_AUTH_FAILED: 'Xác thực bằng tài khoản Google thất bại.',
    NO_CREDENTIALS: 'Không có thông tin xác thực.',
    NO_PERMISSION: 'Bạn không có quyền thực hiện hành động này.',

    // Security related
    RATE_LIMIT_EXCEEDED: 'Vượt quá giới hạn truy cập cho phép. Vui lòng thử lại sau.',
    BOT_ACCESS_DENIED: 'Truy cập từ bot bị từ chối.',

    // Users related
    EMAIL_EXISTED: 'Email đã tồn tại.',
    USER_NOT_FOUND: 'Người dùng không tồn tại.',
    ROLE_NOT_FOUND: 'Không tìm thấy vai trò.',
    ROLE_EXISTED: 'Tên vai trò đã tồn tại.',
    ROLE_BEING_USED: 'Vai trò đang được sử dụng.',
    ROLE_IS_IMMUTABLE: 'Vai trò này không thể cập nhật.',
    INVALID_ROLE_SELECTED: 'Không thể chọn vai trò này.',
    ADDRESS_EXISTED: 'Địa chỉ đã tồn tại.',
    ADDRESS_NOT_FOUND: 'Không tìm thấy địa chỉ.',
    CANNOT_DELETE_DEFAULT_ADDRESS: 'Không thể xóa địa chỉ mặc định.',

    // Services related
    UPLOAD_IMAGE_FAILED: 'Tải ảnh lên thất bại.',
    DELETE_IMAGE_FAILED: 'Xóa ảnh thất bại.',

    // Application related
    DATA_VALIDATION_FAILED: 'Dữ liệu không hợp lệ.',
    BLOCKED_BY_CORS_POLICY: 'Bị chặn bởi chính sách bảo mật truy cập CORS.',
    INTERNAL_SERVER_ERROR: 'Lỗi không xác định từ phía server. Vui lòng thử lại sau.',

    // Categories related
    CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục.',
    CATEGORY_EXISTED: 'Tên danh mục đã được sử dụng.',
    CATEGORY_BEING_USED: 'Danh mục đang được sử dụng, tạm thời không thể xóa.',

    // Brands related
    BRAND_NOT_FOUND: 'Không tìm thấy thương hiệu.',
    BRAND_EXISTED: 'Tên thương hiệu đã được sử dụng.',
    BRAND_BEING_USED: 'Thương hiệu đang được sử dụng, tạm thời không thể xóa.',

    // Products related
    PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm.',
    PRODUCT_EXISTED: 'Tên sản phẩm hoặc chuỗi slug đã được sử dụng.',
    PRODUCT_ITEM_NOT_FOUND: 'Không tìm thấy chi tiết sản phẩm.',
    PRODUCT_BEING_USED: 'Sản phẩm đang được sử dụng, tạm thời không thể xóa.',

    // Orders and carts related
    QUANTITY_EXCEED_CURRENT_STOCK: 'Số lượng vượt quá tồn kho hiện tại.',
    STOCK_NOT_ENOUGH_FOR_ORDER: 'Tồn kho không đủ đáp ứng đơn hàng.',
    CART_NOT_FOUND: 'Không tìm thấy giỏ hàng.',
    CART_ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm trong giỏ hàng.',
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng.',
    INVALID_STATUS_SELECTED: 'Không thể chuyển đổi sang trạng thái này.',

    // Order statuses related
    ORDER_STATUS_NOT_FOUND: 'Không tìm thấy trạng thái đơn hàng.',
    CANNOT_RESERVE_AND_RELEASE_STOCK_SIMULTANEOUSLY: 'Không thể vừa tạm trữ vừa mở khóa tồn kho.',
    CANNOT_DECREASE_AND_INCREASE_STOCK_SIMULTANEOUSLY: 'Không thể vừa giảm vừa tăng tồn kho.',
    CANNOT_MARK_AS_DELIVERED_AND_REFUNDED_SIMULTANEOUSLY:
        'Không thể vừa đánh dấu đã giao hàng vừa đánh dấu hoàn hàng - trả tiền.',
    ORDER_STATUS_EXISTED: 'Trạng thái đơn hàng đã tồn tại.',
    ORDER_STATUS_BEING_USED: 'Trạng thái đơn hàng đang được sử dụng.',
    CANNOT_DELETE_DEFAULT_ORDER_STATUS: 'Không thể xóa trạng thái đơn hàng mặc định.',
    TRANSITION_EXISTED: 'Hướng chuyển trạng thái đã tồn tại.',
    TRANSITION_NOT_FOUND: 'Không tìm thấy hướng chuyển trạng thái.',

    // Promotions and coupons related
    PROMOTION_NOT_FOUND: 'Không tìm thấy chương trình khuyến mãi.',
    PROMOTION_EXISTED: 'Tên chương trình khuyến mãi đã được sử dụng.',
    COUPON_EXISTED: 'Mã code của phiếu giảm giá đã được sử dụng.',
    COUPON_NOT_FOUND: 'Không tìm thấy phiếu giảm giá.',
    COUPON_NO_LONGER_AVAILABLE: 'Phiếu giảm giá không còn hiệu lực.',
    COUPON_REACH_MAX_USAGE: 'Phiếu giảm giá đã đạt giới hạn sử dụng.',
    YOU_HAVE_USED_COUPON: 'Bạn đã sử dụng phiếu giảm giá này rồi.',

    // Conversations and messages related
    SEND_MESSAGE_SUCCESSFULLY: 'Gửi tin nhắn thành công.'
}

const SUCCESS_MESSAGES = {
    // Authentication related
    SIGN_IN_SUCCESSFULLY: 'Đăng nhập thành công.',
    SIGN_UP_SUCCESSFULLY: 'Đăng ký thành công.',
    REFRESH_TOKEN_SUCCESSFULLY: 'Làm mới token thành công.',
    DEACTIVATE_ACCOUNT_SUCCESSFULLY: 'Hủy kích hoạt tài khoản thành công.',
    RESET_PASSWORD_EMAIL_SENT: 'Email đặt lại mật khẩu đã được gửi.',
    GOOGLE_AUTH_SUCCESSFULLY: 'Xác thực bằng tài khoản Google thành công.',
    RESET_PASSWORD_SUCCESSFULLY: 'Đặt lại mật khẩu thành công.',
    VERIFY_PERMISSION_SUCCESSFULLY: 'Xác thực quyền thành công.',

    // Users related
    CHANGE_PASSWORD_SUCCESSFULLY: 'Thay đổi mật khẩu thành công.',
    UPDATE_USER_SUCCESSFULLY: 'Cập nhật người dùng thành công.',
    CREATE_STAFF_SUCCESSFULLY: 'Tạo nhân viên thành công.',
    CREATE_ROLE_SUCCESSFULLY: 'Tạo vai trò thành công.',
    UPDATE_ROLE_SUCCESSFULLY: 'Cập nhật vai trò thành công.',
    DELETE_ROLE_SUCCESSFULLY: 'Xóa vai trò thành công.',
    DEACTIVATE_CUSTOMER_SUCCESSFULLY: 'Khóa tài khoản khách hàng thành công.',
    ADD_ADDRESS_SUCCESSFULLY: 'Thêm địa chỉ thành công.',
    UPDATE_ADDRESS_SUCCESSFULLY: 'Cập nhật địa chỉ thành công.',
    DELETE_ADDRESS_SUCCESSFULLY: 'Xóa địa chỉ thành công.',

    // Services related
    UPLOAD_IMAGE_SUCCESSFULLY: 'Tải ảnh lên thành công.',
    DELETE_IMAGE_SUCCESSFULLY: 'Xóa ảnh thành công.',

    // Categories related
    CREATE_CATEGORY_SUCCESSFULLY: 'Tạo danh mục thành công.',
    UPDATE_CATEGORY_SUCCESSFULLY: 'Cập nhật danh mục thành công.',
    DELETE_CATEGORY_SUCCESSFULLY: 'Xóa danh mục thành công.',

    // Brands related
    CREATE_BRAND_SUCCESSFULLY: 'Tạo thương hiệu thành công.',
    UPDATE_BRAND_SUCCESSFULLY: 'Cập nhật thương hiệu thành công.',
    DELETE_BRAND_SUCCESSFULLY: 'Xóa thương hiệu thành công.',

    // Products related
    CREATE_PRODUCT_SUCCESSFULLY: 'Tạo sản phẩm thành công.',
    UPDATE_PRODUCT_SUCCESSFULLY: 'Cập nhật sản phẩm thành công.',
    DELETE_PRODUCT_SUCCESSFULLY: 'Xóa sản phẩm thành công.',

    // Orders and carts related
    ADD_TO_CART_SUCCESSFULLY: 'Thêm vào giỏ hàng thành công.',
    UPDATE_CART_SUCCESSFULLY: 'Cập nhật giỏ hàng thành công.',
    RESET_CART_SUCCESSFULLY: 'Đặt lại giỏ hàng thành công.',
    PLACE_ORDER_SUCCESSFULLY: 'Đặt hàng thành công.',
    UPDATE_ORDER_SUCCESSFULLY: 'Cập nhật đơn hàng thành công.',

    // Order statuses related
    CREATE_ORDER_STATUS_SUCCESSFULLY: 'Tạo trạng thái đơn hàng thành công.',
    UPDATE_ORDER_STATUS_SUCCESSFULLY: 'Cập nhật trạng thái đơn hàng thành công.',
    DELETE_ORDER_STATUS_SUCCESSFULLY: 'Xóa trạng thái đơn hàng thành công.',
    CREATE_TRANSITION_SUCCESSFULLY: 'Tạo hướng chuyển đổi trạng thái thành công.',
    DELETE_TRANSITION_SUCCESSFULLY: 'Xóa hướng chuyển đổi trạng thái thành công.',

    // Promotions and coupons related
    CREATE_PROMOTION_SUCCESSFULLY: 'Tạo chương trình khuyến mãi thành công.',
    UPDATE_PROMOTION_SUCCESSFULLY: 'Cập nhật chương trình khuyến mãi thành công.',
    DISABLE_PROMOTION_SUCCESSFULLY: 'Kết thúc chương trình khuyến mãi thành công.',
    CREATE_COUPON_SUCCESSFULLY: 'Thêm phiếu giảm giá thành công.',
    UPDATE_COUPON_SUCCESSFULLY: 'Cập nhật phiếu giảm giá thành công.',
    DISABLE_COUPON_SUCCESSFULLY: 'Khóa phiếu giảm giá thành công.',

    // Inventories related
    UPDATE_INVENTORY_SUCCESSFULLY: 'Cập nhật sản phẩm tồn kho thành công.',
    TRACK_IMPORT_SUCCESSFULLY: 'Ghi nhận đơn nhập hàng thành công.',

    // Reports related
    REPORT_DAMAGE_SUCCESSFULLY: 'Báo cáo thiệt hại thành công.',

    // Conversations and messages related
    CONVERSATION_NOT_FOUND: 'Không tìm thấy cuộc trò chuyện.'
}

export const RES_MESSAGE_MAPPING = {
    ...ERROR_MESSAGES,
    ...SUCCESS_MESSAGES
}

export const getMappedMessage = (originalMessage: string) => {
    return RES_MESSAGE_MAPPING[originalMessage as keyof typeof RES_MESSAGE_MAPPING] ?? originalMessage
}
