import {defineStore} from "pinia";
import {store} from "@/store";
import {LoginParamsType, LoginUserInfoResult, RegisterParamsType} from "@/api/types/systemTypes";
import {loginApi, logoutApi, getLoginUserInfoApi, registerApi} from '@/api/system'
import {ElMessage} from "element-plus";
import {removeToken, setToken} from "@/utils/auth";
import {computeDate, formatGreet} from "@/utils";
import {router} from "@/router";
import {useTabsStore} from "@/store/modules/tabs";

interface userType {
    userinfo: LoginUserInfoResult,
    menuList: Array<RouteConfigsTable>
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): userType => ({
        userinfo: {
            userId: "",
            username: "",
            nickname: "",
            phone: "",
            email: "",
            admin: false,
            roleIds: "",
            roleCode: "",
            roleName: "",
            loginTime: "",
            systemType: "",
            createTime: "",
            permissions: []
        },
        menuList: []
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                key: "userinfo",
                paths: ['userinfo']
            },
        ]
    },
    getters: {
        userid: (state) => state.userinfo.userId,
        isAdmin: (state) => state.userinfo.admin,
    },
    actions: {
        /**
         * @description:登录
         * */
        async login(data: LoginParamsType) {
            return new Promise((resolve) => {
                loginApi(data).then((res) => {
                    if (res) {
                        setToken({
                            token: res.token,
                            expires: computeDate(3, 3)
                        });
                        this.getLoginUserInfo().then((userRes: any) => {
                            ElMessage.success(`${formatGreet(new Date())}，${userRes.nickname}`);
                            resolve(res);
                        });
                    }
                })
            })
        },
        /**
         * @description:注册
         */
        async register(data: RegisterParamsType) {
            return new Promise((resolve) => {
                registerApi(data).then((res) => {
                    if (res) {
                        ElMessage.success(`注册成功`);
                        resolve(res);
                    }
                })
            })
        },
        /**
         * @description:获取登录用户信息
         * */
        async getLoginUserInfo() {
            return new Promise((resolve) => {
                getLoginUserInfoApi().then((res) => {
                    this.userinfo = res;
                    resolve(res);
                })
            })
        },

        // 清除登录修改信息
        async clear() {
            removeToken();
            this.$reset();
            useTabsStore().$reset();
            localStorage.removeItem('userinfo');
            localStorage.removeItem('tabsList');
        },

        /**
         * @description:退出登录
         * */
        async logout() {
            logoutApi().then(() => {
                this.clear();
                router.push("/login");
            })
        },

        /**
         * @description:设置菜单路由
         * */
        setMenu(data: Array<RouteConfigsTable>) {
            this.menuList = data;
        },
    }
});

export function useUserStoreHook() {
    return useUserStore(store);
}
