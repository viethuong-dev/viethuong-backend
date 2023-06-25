export enum Role {
    ADMIN = 'admin',
    CONTENT_STAFF = 'content_staff',
    ORDER_STAFF = 'order_staff',
}

export const RoleInfo = [
    {
        key: Role.ADMIN,
        description: 'Quản trị viên',
    },
    {
        key: Role.CONTENT_STAFF,
        description: 'Nhân viên nội dung',
    },
    {
        key: Role.ORDER_STAFF,
        description: 'Nhân viên xử lý đơn',
    },
];
