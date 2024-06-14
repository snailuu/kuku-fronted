import {defineStore} from "pinia";
import {store} from "@/store";
import {router} from "@/router";

interface TabsViewState {
    /** 标签页 */
    tabsList: any[];
}

// 不需要出现在标签页中的路由
export const blackList = ['404'] as const;

export const useTabsStore = defineStore({
    id: 'tabs',
    state: (): TabsViewState => ({
        tabsList: [],
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                key: "tabsList",
                paths: ['tabsList']
            },
        ]
    },
    getters: {
        getTabsList: (state) => {
            console.log(state.tabsList);
            return state.tabsList.filter((item:any) => {
                return item.meta?.isShow;
            }).sort((a:{meta:{sort:number}},b:{meta:{sort:number}})=>{
                return (a.meta.sort||0)-(b.meta.sort||0);
            });
        },
        /** 当前activity tab */
        getCurrentTab: (state) => {
            const currentRoute = router.currentRoute.value!;
            return state.tabsList.find((item:any) => {
                return item.meta?.isShow && item.fullPath === currentRoute.fullPath;
            });
        },
    },
    actions: {
        /** 初始化标签页 */
        initTabs(routes: any) {
            this.tabsList = routes;
        },
        /** 添加标签页 */
        addTabs(route: any): boolean {
            if (blackList.includes(route.name)) return false;
            const isExists = this.tabsList.some((item:any) => item.fullPath == route.fullPath);
            if (!isExists) {
                this.tabsList.push(route);
            }
            return true;
        },
        /** 关闭当前页 */
        closeTab(name: string) {
            const index = this.tabsList.findIndex((item:any) => item.name == name);
            const isDelCurrentTab = Object.is(this.getCurrentTab, this.tabsList[index]);
            this.tabsList.splice(index, 1);
            // 如果关闭的tab就是当前激活的tab，则重定向页面
            if (isDelCurrentTab) {
                const currentRoute = this.tabsList[Math.max(0, this.tabsList.length - 1)];
                router.push(currentRoute.fullPath);
            }
        },
        /** 关闭左侧 */
        closeLeftTabs(route: any) {
            const Home=this.tabsList.find((item:any) => item.meta.isHome);
            const index = this.tabsList.findIndex((item:any) => item.name == route.name);
            if(index!=0){
                this.tabsList.splice(0, index)
                Home&&this.tabsList.unshift(Home)
            }
        },
        /** 关闭右侧 */
        closeRightTabs(route: any) {
            const index = this.tabsList.findIndex((item:any) => item.name == route.name);
            this.tabsList.splice(index + 1)
        },
        /** 关闭其他 */
        closeOtherTabs(route: any) {
            const Home=this.tabsList.find((item:any) => item.meta.isHome);
            const index = this.tabsList.findIndex((item:any) => item.name == route.name);
            if (index !== -1) {
                this.tabsList = this.tabsList.splice(index, 1);
                if(index!=0){
                    this.tabsList.unshift(Home)
                }
            }
        },
        /** 关闭全部 */
        closeAllTabs() {
            const Home=this.tabsList.find((item:any) => item.meta.isHome);
            this.tabsList = [Home];
        },
    }
});

export function useTabsStoreHook() {
    return useTabsStore(store);
}
