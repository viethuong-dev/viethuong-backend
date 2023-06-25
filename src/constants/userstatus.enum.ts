export enum USER_STATUS {
    ACTIVATED = 'activated',
    DEACTIVATED = 'deactivated',
}

export const UserStatusInfo = [
    {
        key: USER_STATUS.ACTIVATED,
        description: 'Activated',
    },
    {
        key: USER_STATUS.DEACTIVATED,
        description: 'Deactivated',
    },
];
