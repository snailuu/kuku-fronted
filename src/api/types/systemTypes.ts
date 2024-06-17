export interface LoginParamsType {
    username: string;
    password: string;
}

export type LoginResult = {
    /** token */
    token: string;
};

/** 获取当前登录用户信息返回数据类型*/
export type LoginUserInfoResult = {
    userId:string
    nickname:string,
    roleIds:string,
    roleCode:string,
    roleName:string,
    username:string
    phone:string
    email:string
    createTime:string,
    admin:boolean
    loginTime: string,
    systemType: string,
    // 用户权限数组
    permissions:[]
};
